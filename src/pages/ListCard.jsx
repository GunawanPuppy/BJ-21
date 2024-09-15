import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../store/slice/card';
import Card from '../Components/Cards';

export default function Setting() {
  const dispatch = useDispatch();
  const { cards } = useSelector((state) => state.card);

  useEffect(() => {
    dispatch(fetchCards());
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', overflowX: 'auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cards.map((card) => (
          <Card key={card.id} idCard={card} />
        ))}
      </div>
    </div>
  );
}
