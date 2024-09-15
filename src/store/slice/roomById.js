import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

export const getRoom = createAsyncThunk(
  'room/getRoom',
  async (roomId, { rejectWithValue }) => {
    try {
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        return rejectWithValue('Room not found');
      }

      return { id: roomSnap.id, ...roomSnap.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getRoomSlice = createSlice({
  name: 'getRoom',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getRoomSlice.reducer;