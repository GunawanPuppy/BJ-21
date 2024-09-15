import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../firebase-config";
import {
    doc, onSnapshot, updateDoc, getDoc, serverTimestamp, deleteDoc,
} from "firebase/firestore";
import TableImage from "../../assets/Table.png";
import HandImage from "../../assets/Hand.png";

export default function Game() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [error, setError] = useState(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [timer, setTimer] = useState(10);
    const [turns, setTurns] = useState(0);
    const [cards, setCards] = useState({});
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [handAnimation, setHandAnimation] = useState({ active: false, playerId: null });
    const [winnerMessage, setWinnerMessage] = useState("");

    useEffect(() => {
        const roomRef = doc(db, "rooms", roomId);

        const unsubscribe = onSnapshot(
            roomRef,
            (roomSnap) => {
                if (roomSnap.exists()) {
                    const data = roomSnap.data();
                    setRoomData({ id: roomSnap.id, ...data });
                    if (data.currentPlayerIndex !== undefined) {
                        setCurrentPlayerIndex(data.currentPlayerIndex);
                    } else {
                        setCurrentPlayerIndex(0);
                    }

                    if (data.turnStartTime) {
                        const elapsedTime = Math.floor(
                            (Date.now() - data.turnStartTime.toMillis()) / 1000
                        );
                        setTimer(10 - elapsedTime);
                    } else {
                        setTimer(10);
                    }
                } else {
                    setError("Room not found");
                    navigate("/lobby");
                }
            },
            (error) => {
                console.error("Error fetching room data:", error.message);
                setError(error.message);
            }
        );

        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        if (countdown > 0) {
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            return () => clearInterval(countdownInterval);
        } else {
            startGame();
        }
    }, [countdown]);

    useEffect(() => {
        if (roomData && gameStarted) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        changeTurn();
                        return 10;
                    } else {
                        return prevTimer - 1;
                    }
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [roomData, currentPlayerIndex, gameStarted]);

    useEffect(() => {
        if (gameStarted) {
            const timeout = setTimeout(() => {
                determineWinner();
            }, 30000);

            return () => clearTimeout(timeout);
        }
    }, [gameStarted]);

    const determineWinner = async () => {
        const playerScores = await Promise.all(
            roomData.playerOrder.map(async (playerId) => {
                const playerCards = roomData.players[playerId].takenCards;
                const cardValues = await Promise.all(
                    playerCards.map(async (cardId) => {
                        const cardRef = doc(db, "cards", cardId);
                        const cardSnap = await getDoc(cardRef);
                        return parseInt(cardSnap.data().value, 10);
                    })
                );
                const totalScore = cardValues.reduce((acc, value) => acc + value, 0);
                return { playerId, totalScore };
            })
        );

        console.log(playerScores, "<-- playerScores");

        const winner = playerScores.reduce((bestPlayer, player) => {
            if (player.totalScore === 21) {
                return player;
            }
            if (
                (bestPlayer.totalScore !== 21 && player.totalScore < 21 && player.totalScore > bestPlayer.totalScore) ||
                (bestPlayer.totalScore > 21 && player.totalScore < 21)
            ) {
                return player;
            }
            return bestPlayer;
        }, { playerId: null, totalScore: 0 });

        if (winner.playerId && winner.totalScore <= 21 && winner.totalScore > 16) {
            setWinnerMessage(`Game berakhir. Pemenangnya adalah ${roomData.players[winner.playerId].displayName} dengan skor ${winner.totalScore}`);
        } else {
            setWinnerMessage(`Game berakhir. Tidak ada pemenang.`);
        }

        setTimeout(() => {
            deleteRoom();
        }, 2000);
    };

    const checkForWinner = async () => {
        const playerScores = await Promise.all(
            roomData.playerOrder.map(async (playerId) => {
                const playerCards = roomData.players[playerId].takenCards;
                const cardValues = await Promise.all(
                    playerCards.map(async (cardId) => {
                        const cardRef = doc(db, "cards", cardId);
                        const cardSnap = await getDoc(cardRef);
                        return parseInt(cardSnap.data().value, 10);
                    })
                );
                const totalScore = cardValues.reduce((acc, value) => acc + value, 0);
                return { playerId, totalScore };
            })
        );

        const winner = playerScores.find(player => player.totalScore === 21);

        if (winner) {
            setWinnerMessage(`Game berakhir. Pemenangnya adalah ${roomData.players[winner.playerId].displayName} dengan skor 21`);
            setTimeout(() => {
                deleteRoom();
            }, 2000);
            return true;
        }
        return false;
    };

    const changeTurn = async () => {
        if (await checkForWinner()) {
            return;
        }

        const nextPlayerIndex =
            (currentPlayerIndex + 1) % roomData.playerOrder.length;
        const newTurns = turns + 1;

        setCurrentPlayerIndex(nextPlayerIndex);
        setTimer(10);
        setTurns(newTurns);

        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
            currentPlayerIndex: nextPlayerIndex,
            turnStartTime: serverTimestamp(),
        });
    };

    const takeCard = async (cardId) => {
        const user = auth.currentUser;
        const currentPlayerId = roomData.playerOrder[currentPlayerIndex];
        if (
            user &&
            user.email.replace("@", "_").replace(".", "_") === currentPlayerId
        ) {
            const cardRef = doc(db, "cards", cardId);
            const cardSnap = await getDoc(cardRef);

            if (!cardSnap.exists()) {
                throw new Error("Card not found");
            }

            const newPlayerCards = [
                ...(roomData.players[currentPlayerId]?.takenCards || []),
                cardId,
            ];

            const roomRef = doc(db, "rooms", roomId);
            await updateDoc(roomRef, {
                availableCards: roomData.availableCards.filter((id) => id !== cardId),
                takenCards: [...roomData.takenCards, cardId],
                [`players.${currentPlayerId}.takenCards`]: newPlayerCards,
            });

            setCards((prevCards) => ({
                ...prevCards,
                [cardId]: cardSnap.data(),
            }));

            setHandAnimation({ active: true, playerId: currentPlayerId });
            setTimeout(() => {
                setHandAnimation({ active: false, playerId: null });
            }, 2000);

            setTimeout(changeTurn, 2000);
        } else {
            alert("Not your turn!");
        }
    };

    useEffect(() => {
        if (roomData) {
            roomData.availableCards.forEach(async (cardId) => {
                const cardRef = doc(db, "cards", cardId);
                const cardSnap = await getDoc(cardRef);
                setCards((prevCards) => ({
                    ...prevCards,
                    [cardId]: cardSnap.data(),
                }));
            });
        }
    }, [roomData]);

    const startGame = async () => {
        setGameStarted(true);
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
            currentPlayerIndex: 0,
            turnStartTime: serverTimestamp(),
        });
    };

    const deleteRoom = async () => {
        const roomRef = doc(db, "rooms", roomId);
        await deleteDoc(roomRef);
        navigate("/lobby");
    };

    const endGame = async () => {
        setGameStarted(false);
        await deleteRoom();
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!roomData) {
        return <div>Loading...</div>;
    }

    const players = roomData.playerOrder;
    const currentPlayer = players[currentPlayerIndex];
    const user = auth.currentUser;
    const userId = user ? user.email.replace("@", "_").replace(".", "_") : null;

    const totalCards = 52;
    const cardsInPlayersHands = players.reduce((acc, playerId) => {
        return acc + (roomData.players[playerId]?.takenCards?.length || 0);
    }, 0);
    const remainingCards = totalCards - cardsInPlayersHands;

    const getPlayerPosition = (playerId) => {
        const index = players.indexOf(playerId);
        switch (index) {
            case 0:
                return { top: "10px", left: "50%", transform: "translateX(-50%)" };
            case 1:
                return { bottom: "10px", left: "50%", transform: "translateX(-50%)" };
            case 2:
                return { top: "50%", left: "10px", transform: "translateY(-50%)" };
            case 3:
                return { top: "50%", right: "10px", transform: "translateY(-50%)" };
            default:
                return { top: "10px", left: "50%", transform: "translateX(-50%)" };
        }
    };

    const getHandTransform = (playerId) => {
        const index = players.indexOf(playerId);
        switch (index) {
            case 0:
                return "translate(-50%, -90%)";
            case 1:
                return "translate(-50%, 90%)";
            case 2:
                return "translate(-200%, -50%)";
            case 3:
                return "translate(200%, -50%)";
            default:
                return "translate(0, 0)";
        }
    };

    const handAnimationStyle = handAnimation.active
        ? {
            transition: "transform 2s",
            transform: getHandTransform(handAnimation.playerId),
        }
        : {
            transition: "transform 2s",
            transform: "translate(0, 0)",
        };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                position: "relative",
                height: "100vh",
                backgroundColor: "black",
                backgroundImage: "linear-gradient(to bottom, black, black)",
            }}
        >
            <img
                src={TableImage}
                alt="Poker Table"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 0,
                    width: "80%",
                    height: "auto",
                }}
            />
            <img
                src={HandImage}
                alt="Hand"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100px",
                    height: "auto",
                    zIndex: 1,
                    ...handAnimationStyle,
                }}
            />
            <button
                onClick={endGame}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 1,
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                keluar
            </button>
            {players.map((playerId, index) => (
                <div
                    key={playerId}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "absolute",
                        ...getPlayerPosition(playerId),
                        textAlign: "center",
                        zIndex: 1,
                        color: "white",
                    }}
                >
                    <div>
                        <h2>{roomData.players[playerId]?.displayName}</h2>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                            }}
                        >
                            {roomData.players[playerId]?.takenCards?.map((cardId) => (
                                <img
                                    key={cardId}
                                    src={cards[cardId]?.imageUrl}
                                    alt={cardId}
                                    style={{ width: "50px", margin: "5px" }}
                                />
                            ))}
                        </div>
                        {currentPlayerIndex === index && <p>(Current Turn)</p>}
                        {userId === playerId && (
                            <div>
                                <button
                                    onClick={() => takeCard(roomData.availableCards[0])}
                                    style={{
                                        backgroundColor: "green",
                                        color: "white",
                                        border: "none",
                                        padding: "10px",
                                        margin: "5px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Draw Card
                                </button>
                                <button
                                    onClick={changeTurn}
                                    style={{
                                        backgroundColor: "blue",
                                        color: "white",
                                        border: "none",
                                        padding: "10px",
                                        margin: "5px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    End Turn
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <div
                style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    textAlign: "center",
                    zIndex: 1,
                    color: "white",
                }}
            >
                <h2>Timer: {timer}s</h2>
            </div>
            {countdown > 0 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "50px",
                        left: "10px",
                        textAlign: "center",
                        zIndex: 1,
                        color: "white",
                    }}
                >
                    <h2>Game starts in: {countdown}s</h2>
                </div>
            )}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                    textAlign: "center",
                    color: "white",
                }}
            >
                <h2>Deck: {remainingCards} cards</h2>
            </div>
            {winnerMessage && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                        textAlign: "center",
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: "20px",
                        borderRadius: "10px",
                        animation: "fadeIn 1s",
                    }}
                >
                    <h2>{winnerMessage}</h2>
                </div>
            )}
        </div>
    );
}