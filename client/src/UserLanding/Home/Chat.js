import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import GroupMessages from '../../components/Chat/ChatArea';
import ChatNav from '../../components/Chat/Nav';
import ChatFooter from '../../components/Chat/Footer';
import { useRooms } from '../../context/rooms.context';
import { CurrentRoomProvider } from '../../context/userroom.context';
import { Array } from '../../configs/helpers';
import { auth } from '../../configs/firebase';
import { useProfile } from '../../context/profile.context';
import {
  useHistory
} from "react-router-dom";

//Chat Component for Dashboard

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();
  const { profile, isLoading } = useProfile();
  let {push} = useHistory();

  if (!rooms) {
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }

  /*Error Cases; 
  Case 1: User is not authenticated 
  Case 2: Room ID doesn't exist
  */

  const currentRoom = rooms.find(room => room.id === chatId);

  if (!profile) {
    return <h5 className="mt-page">
      Chat is not available in Guest mode <br />Login to access all features <br />
     <button className="block-nav-2" variant="danger" onClick={() => push("/signin")} style={{width: "68%",marginTop:"15px",marginRight: "30px"}}> Authenticate </button>
    </h5>;
  }

  
  if (!currentRoom) {
    return <h5 className="text-right mt-page">
     Join a room to chat
    </h5>;
  }

  const { name, description } = currentRoom;

  const admins = Array(currentRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);

 
  const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,
  };

    // Room Data is stored and passed on to Room State

  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chatnav">
        <ChatNav />
      </div>
  
    <div className="chatarea bg">
        <GroupMessages />
      </div>
      <div className="chatfooter bg">
        <ChatFooter />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
