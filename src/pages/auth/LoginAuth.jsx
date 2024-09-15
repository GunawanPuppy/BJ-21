import React, { useState } from 'react';
import imageUrl from '../../assets/bg-login.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { fetchLogin, signInWithGithub, signInWithGoogle } from '../../store/slice/login';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchLogin(formData)).then((action) => {
      if (fetchLogin.fulfilled.match(action)) {
        navigate('/');
      }
    });
  };

  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle()).then((action) => {
      if (signInWithGoogle.fulfilled.match(action)) {
        navigate('/');
      }
    });
  };

  const handleGithubSignIn = () => {
    dispatch(signInWithGithub()).then((action) => {
      if (signInWithGithub.fulfilled.match(action)) {
        navigate('/');
      }
    });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-gray-600 border-2 border-white border-opacity-30 text-white rounded-xl p-8 max-w-sm w-full">

        <h1 className="text-3xl text-center mb-8">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative w-full h-12 mb-8">
            <input
              type="text"
              name="email"
              placeholder="Email"
              required
              className="w-full h-full bg-transparent outline-none rounded-full border-2 border-white border-opacity-20 text-white text-lg p-4 pl-5 pr-10 placeholder-white"
              onChange={handleChange}
            />
          </div>
          <div className="relative w-full h-12 mb-8">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full h-full bg-transparent outline-none rounded-full border-2 border-white border-opacity-20 text-white text-lg p-4 pl-5 pr-10 placeholder-white"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="accent-white mr-2" />
              Remember Me
            </label>
            <a href="#" className="hover:underline">Forgot Password</a>
          </div>
          <button type="submit" className="w-full h-12 bg-white text-gray-800 rounded-full shadow-md hover:bg-gray-100 transition duration-200">
            Login
          </button>
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition duration-300 shadow-md text-sm"
            >
              <FaGoogle />
              <span>Login with Google</span>
            </button>
            <button
              type="button"
              onClick={handleGithubSignIn}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full transition duration-300 shadow-md text-sm"
            >
              <FaGithub />
              <span>Login with GitHub</span>
            </button>
          </div>
          <div className="text-center text-sm mt-4">
            <p>
              Don't have an account? <Link to={'/auth/register'} className="font-semibold text-white hover:underline">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;