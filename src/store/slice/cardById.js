import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

// Async thunk to fetch card by ID
const getCardById = createAsyncThunk('cards/getCardById', async (cardId, { rejectWithValue }) => {
    try {
        const cardRef = doc(db, 'cards', cardId);
        const cardSnap = await getDoc(cardRef);
        if (cardSnap.exists()) {
            return cardSnap.data();
        } else {
            throw new Error("Card not found");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

const cardByIdSlice = createSlice({
    name: "cardById",
    initialState: {
        card: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCardById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCardById.fulfilled, (state, action) => {
                state.loading = false;
                state.card = action.payload;
            })
            .addCase(getCardById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { actions, reducer } = cardByIdSlice;
export { getCardById };