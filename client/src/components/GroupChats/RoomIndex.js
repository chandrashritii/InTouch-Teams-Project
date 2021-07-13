import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader, Nav, Divider } from 'rsuite';
import { useRooms } from '../../context/rooms.context';
import RoomIndexData from './RoomIndexData';

const RoomIndex = ({ aboveElementHeight }) => {
  const rooms = useRooms();
  const location = useLocation();

  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll scroll"
      style={{
        background: "#172855",
        height: `calc(100% - ${aboveElementHeight}px)`,
        marginLeft: "7px",
        marginRight: '5px'
      }}
      activeKey={location.pathname}
    >
      {/* rooms might be null until component mounts */}
      {!rooms && (
        <Loader center vertical content="Loading" speed="slow" size="md" />
      )}
      {rooms &&
        rooms.length > 0 &&
        rooms.map(room => (
          <Nav.Item
            key={room.id}
            componentClass={Link}
            to={`/chat/${room.id}`}
            eventKey={`/chat/${room.id}`}
            
          > 
            <RoomIndexData room={room} className="text-hover" style={{margin: "0px"}}/> 
            <br />
            <hr className="bg-4"></hr>
          </Nav.Item>
        ))}
    </Nav>
  );
};

export default RoomIndex;
