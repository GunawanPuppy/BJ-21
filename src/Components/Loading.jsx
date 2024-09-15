import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, onSnapshot, query, where, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useUser } from '../contexts/User';

export default function LoadingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [ready, setReady] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const currentUserEmail = user?.email;

  const fetchUserDetails = async (email) => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });
    return userData;
  };

  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomId);

    const unsubscribe = onSnapshot(roomRef, async (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.data();
        const playersWithDetails = await Promise.all(
          Object.entries(roomData.players).map(async ([key, player]) => {
            const userDetails = await fetchUserDetails(player.email);
            return { ...player, photoURL: userDetails ? userDetails.photoURL : null };
          })
        );

        const players = playersWithDetails.reduce((acc, player) => {
          const key = `${player.email.replace('@', '_').replace('.', '_')}`;
          acc[key] = player;
          return acc;
        }, {});

        setRoomData({ ...roomData, players });
        setReady(roomData.ready || []);
        setLoading(false);

        if (roomData.ready && roomData.ready.length === Object.keys(roomData.players).length) {
          navigate(`/game/${roomId}`);
        }
      } else {
        setError('Room not found');
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching room: ", error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

  const handleExit = async () => {
    const roomRef = doc(db, 'rooms', roomId);
    if (Object.keys(roomData.players).length === 1) {
      await deleteDoc(roomRef);
    } else {
      const updatedPlayers = { ...roomData.players };
      delete updatedPlayers[currentUserEmail.replace('@', '_').replace('.', '_')];
      await updateDoc(roomRef, { players: updatedPlayers, playerCount: roomData.playerCount - 1 });
    }
    navigate('/lobby');
  };

  const handleStartGame = async () => {
    const roomRef = doc(db, 'rooms', roomId);
    const updatedReady = roomData.ready ? [...roomData.ready, currentUserEmail] : [currentUserEmail];

    await updateDoc(roomRef, { ready: updatedReady });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Waiting for players...</h1>
      <div style={styles.cardContainer}>
        {roomData.players && Object.values(roomData.players).map((player, index) => (
          <div key={index} style={styles.card}>
            <img src={player.photoURL || 'default-avatar.png'} alt={player.displayName} style={styles.image} />
            <p style={styles.playerName}>{player.displayName}</p>
            <p>{ready.includes(player.email) ? 'Ready' : 'Not Ready'}</p>
          </div>
        ))}
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={handleExit} style={styles.button}>
          Exit to Lobby
        </button>
        <button onClick={handleStartGame} style={styles.buttonstart}>
          Start Game
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
    width: '150px',
  },
  image: {
    borderRadius: '50%',
    width: '100px',
    height: '100px',
  },
  playerName: {
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#e3342f',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonstart: {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#cc1f1a',
  },
};