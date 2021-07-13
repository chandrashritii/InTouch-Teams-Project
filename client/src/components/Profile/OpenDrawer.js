import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import Profile from '.';
import { auth, database } from '../../configs/firebase';
import { useModalState, useMediaQuery } from '../../configs/functional';
import { Offline } from '../../context/profile.context';
import "../../styles/main.scss";

const OpenDrawer = () => {
  const { isOpen, close, open } = useModalState(); // toggle dashboard
  const isMobile = useMediaQuery('(max-width: 992px)');

  const onSignOut = useCallback(() => {
    database
      .ref(`status/${auth.currentUser.uid}`)
      .set(Offline)
      .then(() => {
        auth.signOut(); // firebase sign out
        Alert.info('Signed out', 4000);
        close();
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  }, [close]);

  return (
    <>
      <button className = "block" style={{paddingTop:'8px', paddingBottom:'9.5px'}} onClick={open}>
        PROFILE
      </button>
      {/* modal toggler */}
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Profile onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default OpenDrawer;
