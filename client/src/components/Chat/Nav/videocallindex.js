import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/userroom.context';
import { useMediaQuery } from '../../../configs/functional';

import "../../../styles/main.scss";

const VideoChatTop = () => {
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
                ? 'displayinline-block p-0 mr-2 text-blue link-unstyled'
                : 'display1'
            }
          />
        </h4>

     <h5 className="text-center" style={{fontSize:"25px", textAlign:"center", marginRight:"43%"}}>
        CHAT
        </h5>
      </div>
      <div className="displayflex justify-content-between align-items-center shiftup">
      </div>
    </div>
  );
};

export default memo(VideoChatTop);
