import React from 'react';
import { useParams } from 'react-router';
import { Icon, InputGroup } from 'rsuite';
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { Alert } from 'rsuite';

const VideoBtn = () => {
const { chatId, messageId } = useParams();

return (
  <Tooltip
  title="Start a Video Call with your room members"
  placement="top"
  >
    <Button
          onClick={(e) => {
          e.preventDefault();
          window.open(`/${chatId}`, '_blank' );
          Alert.info('Videocall has started. Let others know', 60000);
          }} 
          style= {{borderRadius: "0px", size: "3em",padding: "1px 1px", backgroundColor:"white"}}
        > <Icon icon="video-camera" style={{color:"blue"}} />
    </Button>
    </Tooltip>

  );
};


export default VideoBtn;