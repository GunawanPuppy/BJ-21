import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase-config';
import { getDocs, collection } from 'firebase/firestore';

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      const cards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return cards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState: {
    cards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cardsSlice.reducer;