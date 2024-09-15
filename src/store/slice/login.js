import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth, db, githubProvider, googleProvider } from '../../firebase-config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async (data, { rejectWithValue }) => {
    try {
      const { email, password } = data
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.access_token = userCredential.accessToken;
      return userCredential.user.email;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await checkAndAddUser(user);
      localStorage.access_token = user.accessToken;
      return user.email;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGithub = createAsyncThunk(
  'auth/signInWithGithub',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      await checkAndAddUser(user);
      console.log(user, "<-- user github");
      const token = result.accessToken;
      localStorage.setItem('access_token', token);
      return user.email;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const checkAndAddUser = async (user) => {
  const userRef = collection(db, 'users');
  const q = query(userRef, where('email', '==', user.email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(userRef, {
      name: user.displayName || '',
      email: user.email,
      photoURL: user.photoURL || '',
      points: 0,
      status: '',
      createdAt: serverTimestamp(),
    });
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signInWithGithub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGithub.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInWithGithub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;