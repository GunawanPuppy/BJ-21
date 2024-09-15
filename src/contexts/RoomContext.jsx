import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomContext = createContext();

export const useRoom = () => {
  return useContext(RoomContext);
};

export const RoomProvider = ({ children }) => {
  const { roomId } = useParams();
  const [currentRoomId, setCurrentRoomId] = useState(roomId);

  return (
    <RoomContext.Provider value={{ currentRoomId, setCurrentRoomId }}>
      {children}
    </RoomContext.Provider>
  );
};