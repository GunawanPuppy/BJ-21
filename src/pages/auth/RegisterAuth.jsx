import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister } from '../../store/slice/register';
import imageUrl from '../../assets/bg-login.jpg';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const registrationError = useSelector(state => state.register?.error);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(fetchRegister({ name, email, password }))
            .then(() => {
                navigate('/auth/login');
            })
            .catch((error) => {
                console.error('Registration error:', error);
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
            <div className="bg-gray-800 border-2 border-white border-opacity-30 text-white rounded-xl p-8 max-w-sm w-full">
                <h1 className="text-3xl text-center mb-8">Register</h1>
                {registrationError && <p className="text-red-500 text-center mb-4">{registrationError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="relative w-full h-12 mb-8">
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-full bg-transparent border-2px outline-none rounded-full border-2 border-white border-opacity-20 text-white text-lg p-4 pl-5 pr-10 placeholder-white"
                        />
                        <i className="bx bxs-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
                    </div>
                    <div className="relative w-full h-12 mb-8">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-full bg-transparent border-2px outline-none rounded-full border-2 border-white border-opacity-20 text-white text-lg p-4 pl-5 pr-10 placeholder-white"
                        />
                        <i className="bx bxs-mail-send absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
                    </div>
                    <div className="relative w-full h-12 mb-8">
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-full bg-transparent border-2px outline-none rounded-full border-2 border-white border-opacity-20 text-white text-lg p-4 pl-5 pr-10 placeholder-white"
                        />
                        <i className="bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
                    </div>

                    <button type="submit" className="w-full h-12 bg-white hover:bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-100 transition duration-200">
                        Register
                    </button>
                    <div className="text-center text-sm mt-4">
                        <p>
                            Already have an account? <a href="/auth/login" className="font-semibold text-white hover:underline">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;