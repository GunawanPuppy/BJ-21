import React, { useState } from 'react';
import imageUrl from '../assets/bg-login.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { cardData } from '../store/slice/addCard';

function AddForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        imageUrl: '',
        value: ''
    });

    const [image, setImage] = useState(null)

    const handleChange = (ele) => {
        setFormData({
            ...formData,
            [ele.target.name]: ele.target.value
        })
    }

    const handleImage = (ele) => {
        if (ele.target.files[0]) {
            setImage(ele.target.files[0])
        }
    }

    const handleSubmit = (ele) => {
        ele.preventDefault()
        console.log('masuk')
        const { id, value } = formData
        dispatch(cardData({ id, value, image })).then((action) => {
            if (cardData.fulfilled.match(action)) {
                // navigate('/add')
                console.log('berhasil ');
            }
        })
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'cgitenter',
            }}
        >
            <div className="bg-gray-200 bg-opacity-75 p-10 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Card</h2>
                <form id="addForm" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="id" className="block text-gray-900 mb-2">ID</label>
                        <input type="number" id="id" name="id" required className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            onChange={handleChange}
                        />

                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageUrl" className="block text-gray-900 mb-2">Image URL</label>
                        <input type="file" id="imageUrl" name="imageUrl" required className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-gray-500"
                            onChange={handleImage}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="value" className="block text-gray-900 mb-2">Value</label>
                        <input type="number" id="value" name="value" required className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 focus:outline-none">Add Item</button>
                </form>
            </div>
        </div>
    );
}

export default AddForm;
