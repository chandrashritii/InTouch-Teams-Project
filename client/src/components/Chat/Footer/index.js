import React, { useCallback, useState, useEffect, createRef } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import SendFile from './SendFile';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../configs/firebase';
import SendAudioButton from './SendAudioButton';
import Emojis from './emojis/emojis.component';
import "../../../styles/main.scss";
import RoomOutput from '../Nav/RoomOutput';

function assembleMessage(profile, chatId) {

  return {
  roomId: chatId,
  author: {
    name: profile.name,
    uid: profile.uid,
    createdAt: profile.createdAt,
    ...(profile.avatar ? { avatar: profile.avatar } : {}),
  },
  createdAt: firebase.database.ServerValue.TIMESTAMP,
  likeCount: 0,
};
}

const Footer = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { profile } = useProfile();
  const { chatId } = useParams();

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }
    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;

    const updates = {};
    //   create last updates message,create messages in our database, get new unique key without creating the actual document
    const messageId = database.ref('messages').push().key;
    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);
    try {
      await database.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message);
    }
  };

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async files => {
      setIsLoading(true);

      const updates = {};

      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId);
        msgData.file = file;
        const messageId = database.ref('messages').push().key;
        updates[`/messages/${messageId}`] = msgData;
      });

      const lastMsgId = Object.keys(updates).pop();

      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        Alert.error(err.message);
      }
    },
    [chatId, profile]
  );

  const inputRef = createRef();
  const [showEmojis, setShowEmojis] = useState();
  const [cursorPosition, setCursorPosition] = useState();

  const pickEmoji = (e, {emoji}) => {
   const ref = inputRef.current;
   const start = input.substring(0, ref.selectionStart);
   const end = input.substring(ref.selectionStart);
   const msg = start + emoji;
   setInput(msg);
   setCursorPosition(start.length+emoji.length); 
  }; 

  const handleShowEmojis = () => {
      setShowEmojis(!showEmojis);
  };

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);


    return (
    <div>
      <InputGroup style={{border:"0px"}} className="input-width">
        <RoomOutput />
        <SendAudioButton afterUpload={afterUpload} />
        <SendFile afterUpload={afterUpload} />
        {
        <div className={`emoji-list ${!showEmojis && 'hidden'}`}>
          <Emojis pickEmoji={pickEmoji} />
        </div>
        }
        <div id="mytext">
        <button className="emoji-icon" onClick = {handleShowEmojis}> <Icon icon="smile-o" style={{color: "black"}}/></button>
        </div>
        <Input
          placeholder="Get creative"
          value={input}
          ref={inputRef}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          style={{color:"black"}}
        />
        <InputGroup.Button
          color="blue"
          backgroundColor="#2b4a69"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};


export default Footer;

