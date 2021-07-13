import React, { useCallback, useState } from 'react';
import { ReactMic } from 'react-mic';
import { useParams } from 'react-router';
import { Alert, Icon, InputGroup } from 'rsuite';
import { storage } from '../../../configs/firebase';
import Tooltip from "@material-ui/core/Tooltip";


const SendAudioButton = ({ afterUpload }) => {
  const { chatId } = useParams();

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onClick = useCallback(() => {
    setIsRecording(p => !p);
  }, []);

  const onUpload = useCallback(
    async data => {
      setIsUploading(true);
      try {
        const snapshot = await storage
          .ref(`/chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
        const file = {
          contentType: snapshot.metadata.contentType,
          name: snapshot.metadata.name,
          url: await snapshot.ref.getDownloadURL(),
        };

        setIsUploading(false);
        afterUpload([file]);
      } catch (error) {
        setIsUploading(false);
        Alert.error(error.message);
      }
    },
    [afterUpload, chatId]
  );

  return (
    <Tooltip
    title="Record Audio"
    placement="top"
    >
    <InputGroup.Button
      onClick={onClick}
      disabled={isUploading}
      className={isRecording ? 'blink' : ''}
      style= {{backgroundColor:"white"}}
    >
      <Icon icon="microphone" />

      <ReactMic
        record={isRecording}
        className="display1"
        onStop={onUpload}
        mimeType="audio/mp3"
      />
    </InputGroup.Button>
    </Tooltip>
  );
};

export default SendAudioButton;
