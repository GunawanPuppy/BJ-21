import React, { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';
import { db } from '../firebase-config';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

const VoiceChat = ({ roomId }) => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const localAudio = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      localAudio.current.srcObject = stream;

      const peer = new Peer();

      peer.on('open', async (id) => {
        const callsRef = collection(db, 'calls');
        const callDoc = await addDoc(callsRef, { roomId, peerId: id });
        const offerCandidates = collection(callDoc, 'offerCandidates');
        const answerCandidates = collection(callDoc, 'answerCandidates');

        peer.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            const audio = document.createElement('audio');
            audio.srcObject = remoteStream;
            audio.autoplay = true;
            audio.playsInline = true;
            document.body.appendChild(audio);
          });
        });

        onSnapshot(offerCandidates, (snapshot) => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const data = change.doc.data();
              const call = peer.call(data.peerId, stream);
              call.on('stream', (remoteStream) => {
                const audio = document.createElement('audio');
                audio.srcObject = remoteStream;
                audio.autoplay = true;
                audio.playsInline = true;
                document.body.appendChild(audio);
              });
            }
          });
        });

        onSnapshot(answerCandidates, (snapshot) => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const data = change.doc.data();
              peer.signal(data);
            }
          });
        });
      });

      peersRef.current.push(peer);
      setPeers([...peersRef.current]);
    };

    init();
  }, [roomId]);

  return (
    <div>
      <audio ref={localAudio} autoPlay muted />
      {peers.map(peer => (
        <audio key={peer.peerId} srcObject={peer.stream} autoPlay />
      ))}
    </div>
  );
};

export default VoiceChat;
