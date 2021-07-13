import React, { memo } from 'react';
import { useParams } from 'react-router';
import { Icon, InputGroup } from 'rsuite';
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { Alert } from 'rsuite';
import "../../../styles/main.scss";
import AnimatedButton from './AnimatedButton';

const VideoCallButton = () => {
const { chatId, messageId } = useParams();
const updates = {};
//   create last updates message,create messages in our database, get new unique key without creating the actual document
updates[`/messages/${messageId}`] = `https://videochat-teams.herokuapp.com/?room=room_${chatId}`;
updates[`/rooms/${chatId}/lastMessage`] = (
  `https://videochat-teams.herokuapp.com/?room=room_${chatId}`
)



  return (
    <>
<Tooltip
  title="Start a Video Call with your room members"
  placement="bottom"
  >
       <AnimatedButton style={{marginBottom: '-62px'}}  onClick={(e) => {
       e.preventDefault();
            window.open(`/${chatId}`, '_blank' );
            Alert.info('Videocall has started. Let others know', 60000);
            }} style={{marginRight: '16px', marginBottom: '-60px'}}>
             <a class="btn btn--svg js-animated-button">
                 <span class="btn--svg__label">VIDEO CALL</span>
                 <svg class="btn--svg__circle" width="190" x="0px" y="0px" viewBox="0 0 60 60" enable-background="new 0 0 60 60">
                 <circle class="js-discover-circle" fill="#2b4a69" opacity="0.7" cx="30" cy="30" r="28.7"></circle>
                 </svg>
                 <svg class="btn--svg__border" x="0px" y="0px" preserveaspectratio="none" viewBox="2 29.3 56.9 13.4" enable-background="new 2 29.3 56.9 13.4" width="190">
                 <g class="btn--svg__border--left js-discover-left-border" id="Calque_2">
                     <path fill="none" stroke="#464EB8" stroke-width="0.5" stroke-miterlimit="1" d="M30.4,41.9H9c0,0-6.2-0.3-6.2-5.9S9,30.1,9,30.1h21.4"></path>
                 </g>
                 <g class="btn--svg__border--right js-discover-right-border" id="Calque_3">
                     <path fill="none" stroke=" #464EB8" stroke-width="0.5" stroke-miterlimit="1" d="M30.4,41.9h21.5c0,0,6.1-0.4,6.1-5.9s-6-5.9-6-5.9H30.4"></path>
                 </g>
                 </svg>
                  </a>
          </AnimatedButton>

    </Tooltip>
     </>
  );
 }

 export default memo(VideoCallButton);
