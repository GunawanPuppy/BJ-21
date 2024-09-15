// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Table from '../assets/Table.png';
// import Lucu from '../assets/Lucu.jpg';
// import Hand from '../assets/Hand.png';
// import Tantan from '../assets/Tantan.png';
// import Alice from '../assets/Alice.png';
// import './Game.css'; // Import the CSS file
// import { useDispatch, useSelector } from 'react-redux';
// import { getRoom } from '../store/slice/roomById';

// export default function Game() {
//     const { roomId } = useParams();
//     const navigate = useNavigate();
//     const [handPosition, setHandPosition] = useState({ x: '10px', y: 'calc(100% - 70px)' });
//     const [isDealing, setIsDealing] = useState(false);

//     const handleOut = () => {
//         navigate('/lobby');
//     };

//     const handleDrawCard = (playerId, playerStyle) => {
//         // Logic for drawing a card
//         console.log(`Player ${playerId} draws a card`);

//         const playerElement = document.querySelector(`.${playerStyle}`);
//         const playerRect = playerElement.getBoundingClientRect();
//         const handElement = document.getElementById('hand');
//         const handRect = handElement.getBoundingClientRect();

//         const newX = playerRect.left + playerRect.width / 2 - handRect.width / 2;
//         const newY = playerRect.top + playerRect.height / 2 - handRect.height / 2;

//         setHandPosition({ x: `${newX}px`, y: `${newY}px` });

//         setIsDealing(true);
//         setTimeout(() => {
//             setHandPosition({ x: '10px', y: 'calc(100% - 70px)' });
//             setTimeout(() => {
//                 setIsDealing(false);
//             }, 1000);
//         }, 1000);
//     };

//     const handleEndTurn = (playerId) => {
//         console.log(`Player ${playerId} ends their turn`);
//     };

//     const dispatch = useDispatch()
//     const { data, loading, error } = useSelector(state => state.roomById)
//     console.log(data, "<-- data");
//     console.log(roomId, "<-- roomId");
//     useEffect(() => {
//         dispatch(getRoom(roomId))
//     }, [])
//     // const players = [
//     //     { id: 1, name: 'Alice', imageUrl: Alice, style: 'player-top' },
//     //     { id: 2, name: 'Bob', imageUrl: Lucu, style: 'player-left' },
//     //     { id: 3, name: 'Charlie', imageUrl: Tantan, style: 'player-right' },
//     //     { id: 4, name: 'David', imageUrl: 'https://via.placeholder.com/30', style: 'player-bottom' },
//     // ];

//     return (
//         <div className="game-container">
//             <button
//                 onClick={handleOut}
//                 className="exit-button"
//             >
//                 Keluar Room
//             </button>
//             <div className="blackjack-table">
//                 <img
//                     src={Table}
//                     alt="Professional Gambling Table"
//                     className="table-image"
//                 />
//                 <div
//                     id="hand"
//                     className={`hand ${isDealing ? 'animate-deal' : ''}`}
//                     style={{ left: handPosition.x, top: handPosition.y }}
//                 >
//                     <img src={Hand} alt="Hand" className="hand-image" />
//                 </div>
//                 {data.map(player => (
//                     // <div key={player.id} className={player.style}>
//                     <div key={player.id}>
//                         <div className="player-container">
//                             <div className="player-image-container">
//                                 <img src={player.imageUrl} alt={player.name} className="player-image" />
//                             </div>
//                             {player.name}
//                             <button
//                                 onClick={() => handleDrawCard(player.id, player.style)}
//                                 className="player-button"
//                             >
//                                 Draw Card
//                             </button>
//                             <button
//                                 onClick={() => handleEndTurn(player.id)}
//                                 className="player-button"
//                             >
//                                 End Turn
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
