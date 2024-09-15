import React from 'react';

export default function Card({ idCard }) {
  return (
    <div style={{ flex: '0 0 calc(100% / 6)', padding: '8px', boxSizing: 'border-box' }}>
      <div
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          backgroundColor: 'white',
          transition: 'transform 0.3s',
        }}
        className="hover:scale-105 transform"
      >
        <img
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          src={idCard.imageUrl || 'https://via.placeholder.com/150'}
          alt="Card Image"
        />
        {/* {idCard.id} */}
      </div>
    </div>
  );
}
