import React, { createContext, useState, useEffect, useContext } from 'react';
import { database } from '../configs/firebase';
import { ArrayId } from '../configs/helpers';

const RoomsContext = createContext();

export const UserRooms = ({ children }) => {
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const roomListRef = database.ref('rooms');
    roomListRef.on('value', snap => {
      const data = ArrayId(snap.val());
      setRooms(data);
    });

    return () => {
      roomListRef.off();
    };
  }, []);

  return (
    <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
  );
};

// helper hook
export const useRooms = () => useContext(RoomsContext);
