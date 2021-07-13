import React, { useRef, useState, useEffect } from 'react';
import { Divider } from 'rsuite';
import CreateRoom from './RoomCreationButton';
import OpenDrawer from '../../components/Profile/OpenDrawer';
import RoomIndex from '../../components/GroupChats/RoomIndex';

const Navbar = () => {
  const topNavbarRef = useRef();
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (topNavbarRef.current) {
      setHeight(topNavbarRef.current.scrollHeight);
    }
  }, [topNavbarRef]);

  return (
    <div className="heighthundred pt-2 bg-2">
      {/* get the height of components */}
      <div ref={topNavbarRef} >
        <div class="row" >
        <div class="column">
        <OpenDrawer />
        </div>
        <div class="column">
        <CreateRoom />
        </div>
        </div>
        <Divider><div className="jointhefun">Join the Fun</div></Divider>
      </div>
      {/* Chat room list*/}
      <RoomIndex aboveElementHeight={height} />
    </div>
  );
};

export default Navbar;
