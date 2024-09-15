import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame } from '../../store/slice/game';

const CreateRoom = () => {
  const dispatch = useDispatch();
  const [points, setPoints] = useState('');

  const handleCreateRoom = () => {
    dispatch(createGame(points));
    // Redirect atau navigasi ke halaman game setelah berhasil membuat room
  };

  return (
    <div>
      <h2>Create Room</h2>
      <label>
        Points:
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </label>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateRoom;