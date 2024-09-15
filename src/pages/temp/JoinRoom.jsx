import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { joinGame } from '../../store/slice/game';

const JoinRoom = () => {
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    dispatch(joinGame(roomId));
    // Redirect atau navigasi ke halaman game setelah berhasil bergabung ke room
  };

  return (
    <div>
      <h2>Join Room</h2>
      <label>
        Room ID:
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </label>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;