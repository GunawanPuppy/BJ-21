import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, storage } from '../../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const cardData = createAsyncThunk(
    'cards/cardData',
    async ({ id, value, image }, { rejectWithValue }) => {
        try {
            const storageRef = ref(storage, `images/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => reject(error),
                    () => resolve()
                );
            });

            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const cardRef = collection(db, 'cards');
            const docRef = await addDoc(cardRef, {
                id,
                value,
                imageUrl: downloadURL,
                createdAt: serverTimestamp(),
            });

            return { id: docRef.id, value, imageUrl: downloadURL };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const cardSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(cardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cardData.fulfilled, (state, action) => {
                state.loading = false;
                state.cards.push(action.payload);
            })
            .addCase(cardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cardSlice.reducer;