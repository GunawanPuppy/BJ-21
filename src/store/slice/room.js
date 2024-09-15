import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase-config';
import { addDoc, collection, getDocs, serverTimestamp, query, where } from 'firebase/firestore';

// Function to get random cards
const getRandomCards = async (count) => {
  const cardSnapshot = await getDocs(collection(db, 'cards'));
  const cardIds = cardSnapshot.docs.map(doc => doc.id);
  return Array.from({ length: count }, () => cardIds[Math.floor(Math.random() * cardIds.length)]);
};

// Async thunk for creating a room
export const createRoom = createAsyncThunk(
  'room/createRoom',
  async ({ points, userPoints }, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return rejectWithValue('User not authenticated');
      }

      if (userPoints < points) {
        return rejectWithValue('Insufficient points');
      }

      const gamesQuery = query(
        collection(db, 'rooms'),
        where('players', 'array-contains', user.email)
      );
      const querySnapshot = await getDocs(gamesQuery);

      if (!querySnapshot.empty) {
        return rejectWithValue('User already in an existing room');
      }

      const playerId = user.email.replace('@', '_').replace('.', '_');

      const initialCards = await getRandomCards(2);
      if (!initialCards || initialCards.length !== 2) {
        return rejectWithValue('Failed to get initial cards');
      }

      const roomData = {
        createdAt: serverTimestamp(),
        createdBy: user.email,
        playerCount: 1,
        playerOrder: [playerId],
        players: {
          [playerId]: {
            email: user.email,
            displayName: user.displayName || 'Anonymous', // Ensure a default value
            status: '',
            joinedAt: serverTimestamp(),
            takenCards: initialCards,
          },
        },
        points: points,
        totalPoints: 0,
        availableCards: [],
        takenCards: initialCards,
      };

      const roomRef = await addDoc(collection(db, 'rooms'), roomData);

      return roomRef.id;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllRooms = createAsyncThunk(
  'room/fetchAllRooms',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const rooms = querySnapshot.docs.map(doc => {
        const data = doc.data();

        if (data.createdAt) {
          data.createdAt = data.createdAt.toDate().toISOString(); 
        }
        Object.keys(data.players).forEach(player => {
          if (data.players[player].joinedAt) {
            data.players[player].joinedAt = data.players[player].joinedAt.toDate().toISOString(); 
          }
        });

        return { id: doc.id, ...data };
      });

      return rooms;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    roomId: null,
    roomList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.roomId = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.roomList = action.payload;
      })
      .addCase(fetchAllRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roomSlice.reducer;