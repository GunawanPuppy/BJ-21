import { createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const registerSlice = createSlice({
    name: 'register',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        registerPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { registerPending, registerSuccess, registerFailure } = registerSlice.actions;

export const fetchRegister = ({ name, email, password }) => async (dispatch) => {
    dispatch(registerPending());
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name,
            photoURL: null,
        });

        const userRef = collection(db, 'users');
        await addDoc(userRef, {
            name: user.displayName,
            email: user.email,
            point: 0,
            imageUrl: user.photoURL,
            status: '',
            createdAt: serverTimestamp(),
        });

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        };

        dispatch(registerSuccess(userData));
        return Promise.resolve();
    } catch (error) {
        console.error('Firebase Authentication Error:', error.message);
        dispatch(registerFailure(error.message));
        return Promise.reject(error);
    }
};

export default registerSlice.reducer;