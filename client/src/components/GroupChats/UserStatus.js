import React from 'react';
import { Badge, Tooltip, Whisper } from 'rsuite';
import { usePresence } from '../../configs/functional';

const getColor = presence => {
  if (!presence) {
    return 'gray';
  }
  switch (presence.state) {
    case 'online':
      return '#66FF00';
    case 'offline':
      return '#FF033E';
    default:
      return 'gray';
  }
};

const getText = presence => {
  if (!presence) {
    return 'Unknown state';
  }
  return presence.state === 'online'
    ? 'Online'
    : `Last online ${new Date(presence.last_changed).toLocaleDateString()} `;
};

const UserStatus = ({ uid }) => {
  const presence = usePresence(uid);
  return (
    <Whisper
      placement="top"
      trigger="hover"
      speaker={<Tooltip>{getText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getColor(presence) }}
      />
    </Whisper>
  );
};

export default UserStatus;
