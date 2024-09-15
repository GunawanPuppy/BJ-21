import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllRooms, createRoom } from "../store/slice/room";
import BJ from "../assets/BlackJack.jpg";
import Poker from "../assets/Poker.jpg"
import { joinRoom } from "../store/slice/join";
import { useUser } from "../contexts/User";

export default function Lobby() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomList } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, []);

  const handleJoinRoom = async (roomId) => {
    try {
      await dispatch(joinRoom({ roomId, points: 10, userPoints: 20  }));
      navigate(`/game/${roomId}/lobby`);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };



  const handleCreateRoom = async () => {
    const result = await dispatch(createRoom({ points: 10, userPoints: 200 }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate(`/game/${result.payload}/lobby`);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-center items-center">
          <h1 className="text-3xl font-bold">ALI CASINO</h1>
        </div>
      </header>

      <main className="bg-gray-100 py-10">
        <div className="container mx-auto">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Game Categories</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold">Capsa Banting</h3>
                <p className="text-xl font-semibold">Coming Soon!!</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold">Poker</h3>
                <p className="text-xl font-semibold">Coming Soon!!</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold">Blackjack</h3>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold">Remi</h3>
                <p className="text-xl font-semibold">Coming Soon!!</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Join a Room</h2>
            <div className="grid grid-cols-3 gap-4">
              {roomList.map((room) => (
                <div
                  key={room.id}
                  className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold">
                    {room.players[room.playerOrder[0]].displayName || `Room ${room.id}`}
                  </h3>
                  <p className="text-gray-600">
                    Players: {room.playerCount} / 4
                  </p>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={room.playerCount >= 4}
                  >
                    {room.playerCount >= 4 ? "Room Full" : "Join Room"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Featured Games</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src="https://via.placeholder.com/300"
                  alt="Game 1"
                  className="w-full h-90 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Game Title 1</h3>
                  <p className="text-gray-600">
                    Exciting slot game with big rewards.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={Poker}
                  alt="Game 2"
                  className="w-full h-90 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Poker </h3>
                  <p className="text-gray-600">
                    Test your skills in this poker game.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={BJ}
                  alt="Game 3"
                  className="w-full h-90 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Black Jack</h3>
                  <p className="text-gray-600">
                    Experience the thrill of blackjack.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 ALI CASINO. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
