import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serverTimestamp } from "firebase/firestore";
import { doc, getDoc, getDocs, updateDoc, collection, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase-config";

// Fungsi untuk mendapatkan kartu acak
const getRandomCards = async (count) => {
    const cardSnapshot = await getDocs(collection(db, 'cards'));
    const cardIds = cardSnapshot.docs.map(doc => doc.id);
    return Array.from({ length: count }, () => cardIds[Math.floor(Math.random() * cardIds.length)]);
};

export const joinRoom = createAsyncThunk(
    'room/joinRoom',
    async ({ roomId, points, userPoints }, { rejectWithValue }) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }

            const roomRef = doc(db, 'rooms', roomId);
            const roomSnapshot = await getDoc(roomRef);

            if (!roomSnapshot.exists()) {
                throw new Error('Room not found');
            }

            const roomData = roomSnapshot.data();
            if (roomData.playerCount >= 4) {
                throw new Error('Room is full');
            }
            
            if (roomData.playerCount >= 4) {
                throw new Error('Room is full');
            }

            if (userPoints < points) {
                throw new Error('Point anda tidak cukup. Yuk isi ulang!');
            }

            const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
            const userSnapshot = await getDocs(userQuery);

            if (userSnapshot.empty) {
                throw new Error('User not found');
            }

            const userDoc = userSnapshot.docs[0];
            const userRef = doc(db, 'users', userDoc.id);

            // Update user points
            await updateDoc(userRef, {
                points: userPoints - points,
            });

            // Create a unique player ID
            const playerId = user.email.replace('@', '_').replace('.', '_');

            // Get two random cards for the new player
            const initialCards = await getRandomCards(2);

            const cardSnapshot = await getDocs(collection(db, 'cards'));
            const cardIds = cardSnapshot.docs.map(doc => doc.id);
            
            // Update room data
            const updatedAvailableCards = Array.from(new Set([...roomData.availableCards, ...cardIds]));

            const updatedPlayerOrder = roomData.playerOrder.concat(playerId);

            await updateDoc(roomRef, {
                playerCount: roomData.playerCount + 1,
                playerOrder: updatedPlayerOrder,
                [`players.${playerId}`]: {
                    email: user.email,
                    displayName: user.displayName,
                    status: '',
                    joinedAt: serverTimestamp(),
                    takenCards: initialCards,
                },
                availableCards: updatedAvailableCards,
                takenCards: initialCards,
            });

            return roomId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const joinSlice = createSlice({
    name: 'join',
    initialState: {
        room: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(joinRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(joinRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.room = action.payload;
            })
            .addCase(joinRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default joinSlice.reducer;