import React from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { database } from '../../configs/firebase';
import { useProfile } from '../../context/profile.context';
import EditNow from '../common/EditComponent';
import ProfileLink from './ProfileLinking';
import ReactAvatar from './ReactAvatar';
import { Updates } from '../../configs/helpers';

const Profile = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = async newData => {

    try {
      //   await userNicknameRef.set(newData);
      const updates = await Updates(
        profile.uid,
        'name',
        newData,
        database
      );
      await database.ref().update(updates);
      Alert.success('Nickname has been updated', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  return (
    <>
    
      <Drawer.Body>
        <h3>Hey, {profile.name}</h3>

        <ProfileLink className="y-m"/>

        <Divider />

        <EditNow
          name="nickname"
          className="w-e"
          initialValue={profile.name}
          onSave={onSave}
          label={<h5 className="mb-2">Nickname</h5>}
        />
        <ReactAvatar />
      </Drawer.Body>

      <Drawer.Footer>
        <Button className="block-edit" style={{width: "30%", marginRight:"35%"}} onClick={onSignOut}>
          Sign Out
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Profile;
