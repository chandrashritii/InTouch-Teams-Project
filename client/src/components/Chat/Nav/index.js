import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/userroom.context';
import { useMediaQuery } from '../../../configs/functional';
import EditRoom from './EditRoom';
import VideoCallButton from './VideoCallButton';
import teams from '../../../assets/teams.svg';

import "../../../styles/main.scss";

const Nav = () => {
  const name = useCurrentRoom(v => v.name);
  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const isMobile = useMediaQuery('(max-width: 992px)');

  return (
    <div>
      <div className="displayflex justify-content-end align-items-center">
        <h4 className="text-disappear-2 displayflex align-items-center">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? 'displayinline p-0 mr-2 text-blue link-unstyled'
                : 'display1'
            }
          />
        </h4>
        
        <VideoCallButton />

      </div>
      <div className="displayflex justify-content-between align-items-center shiftup">
        <img alt="Teams" src={teams} style={{width: '50px', height: '50px', alignItems: 'center', marginBottom: '0px'}}/>

      <ButtonToolbar className="cover bg" style={{marginLeft: '6px'}}>
          {/* only show the edit button if the user is Admin */}
          {isAdmin && <EditRoom />}
        </ButtonToolbar>
      </div>
    </div>
  );
};

export default memo(Nav);