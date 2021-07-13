import React from 'react';
import TimeAgo from 'timeago-react';
import USerAvatar from '../Profile/UserAvatar';

const RoomIndexData = ({ room }) => {
  const { createdAt, name, lastMessage } = room;
  return (
    <div>
      <div className="displayflex justify-content-between align-items-center">
       <h5 className="text-disappear">{name}</h5>
        <TimeAgo
          datetime={
            lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)
          }
          className="font-normal text-white-45"
        />
      </div>
      <div className="displayflex align-items-center text-white-70">
        {lastMessage ? (
          <>
            <div className="displayflex align-items-center">
              <USerAvatar
                src={lastMessage.author.avatar}
                name={lastMessage.author.name}
                size="sm"
              />
            </div>
            <div className="text-disappear-2 ml-2">
              <div className="italic">{lastMessage.author.name}</div>
              {/* show the message or file for the last message */}
              <span>{lastMessage.text || lastMessage.file.name}</span>
            </div>
          </>
        ) : (
          <span className="text-white-45">No messages yet</span>
        )}
      </div>
    </div>
  );
};

export default RoomIndexData;
