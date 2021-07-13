import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import GroupMessages from '../../components/Chat/ChatArea';
import VideoChatTop from '../../components/Chat/Nav/videocallindex';
import ChatFooter from '../../components/Chat/Footer';
import { useRooms } from '../../context/rooms.context';
import { CurrentRoomProvider } from '../../context/userroom.context';
import { Array } from '../../configs/helpers';
import { auth } from '../../configs/firebase';
import { useProfile } from '../../context/profile.context';
import {
  useHistory
} from "react-router-dom";


//Separate chat component rendered during Videocall to avoid any cross referencing in the UI

const VideoCallChat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();
  const { profile, isLoading } = useProfile();
  let {push} = useHistory();

  /*Extra Error Cases; 
  Case 1: No rooms exist (Database gets corrupted or deleted) 
  Case 2: Room ID doesn't exist
  Case 3: User is not authenticated
  */
 
  if (!rooms) {
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }

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
        <VideoChatTop />
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

export default VideoCallChat;
