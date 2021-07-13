import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import USerAvatar from '../../Profile/UserAvatar';
import UserStatus from '../../GroupChats/UserStatus';
import ProfileinModal from './ProfileinModal';
import { useCurrentRoom } from '../../../context/userroom.context';
import { auth } from '../../../configs/firebase';
import { useHover, useMediaQuery } from '../../../configs/functional';
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite';
import { Input, Modal } from 'rsuite';
import { useModalState } from '../../../configs/functional';

const ConditonalBadge = ({ condition, children }) => {
  return condition ? <Badge content={condition}>{children}</Badge> : children;
};

const ImageOpeninModal = ({ src, fileName }) => {
  const { isOpen, open, close } = useModalState();
  return (
    <>
      <Input
        type="image"
        alt="file"
        src={src}
        onClick={open}
        className="mwhundred mhhundred"
        style={{width: 'auto'}}
      />
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <img src={src} height="100%" width="100%" alt="file" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a href={src} target="_blank" rel="noopener noreferrer">
            Download from Source
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const IconFix = ({
  isVisible,
  iconName,
  tooltip,
  onClick,
  badgeContent,
  ...props
}) => {
  return (
    <div
      className="ml-2"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <ConditonalBadge condition={badgeContent}>
        <Whisper
          placement="top"
          delay={0}
          delayHide={0}
          delayShow={0}
          trigger="hover"
          speaker={<Tooltip>{tooltip}</Tooltip>}
        >
          <IconButton
            {...props}
            onClick={onClick}
            circle
            size="xs"
            icon={<Icon icon={iconName} />}
          />
        </Whisper>
      </ConditonalBadge>
    </div>
  );
};


const renderFileMessage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="heighttwenty">
        <ImageOpeninModal src={file.url} fileName={file.name} />
      </div>
    );
  }

  if (file.contentType.includes('audio')) {
    return (
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your browser does not support audio
      </audio>
    );
  }
  return <a href={file.url}>Download {file.name}</a>;
};

const ChatMessages = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, file, likes, hearts, likeCount, heartCount } = message;

  const [selfRef, isHovered] = useHover();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  const canShowIcons = isMobile || isHovered;

  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
      <div className="displayflex align-items-center font-bolder mb-1">
        <UserStatus uid={author.uid} />
        <USerAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileinModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-white"
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin
                ? 'Remove admin permission'
                : 'Give admin permission'}
            </Button>
          )}
        </ProfileinModal>

        <TimeAgo
          datetime={createdAt}
          className="font-normal text-grey-40 ml-2"
        />
        {/* Message Reactions*/}
        <IconFix
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Heart this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
        {/* Delete feature is author specific. Users can only delete their own messages */}
        {isAuthor && (
          <IconFix
            isVisible={canShowIcons}
            iconName="close"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id, file)} 
          />
        )}
      </div>
      <div>
        {text && <span className="break">{text}</span>}{' '}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default memo(ChatMessages);
