import React, { memo, useEffect } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../context/userroom.context';
import { useMediaQuery, useModalState } from '../../../configs/functional';
import { database } from '../../../configs/firebase';
import EditNow from '../../common/EditComponent';
import { Icon, InputGroup } from 'rsuite';

const EditRoom = () => {
  
  const { open, close, isOpen } = useModalState();
  const { chatId, roomsRef } = useParams();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const name = useCurrentRoom(v => v.name);
  const description = useCurrentRoom(v => v.description);

  const updateData = (key, value) => {
    database
      .ref(`/rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('Successfully updated', 4000);
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  };

  const onNameSave = newName => {
    updateData('name', newName);
  };

  const onDescriptionSave = newDescription => {
    updateData('description', newDescription);
  };


  return (
    <>
      <button className="block-edit" style={{zIndex:"3", marginLeft:"10px", padding: '12.5px 8px', fontSize: '15px'}} onClick={open}>
        <Icon icon="cogs"/> EDIT ROOM
      </button>
      <Drawer full={isMobile} show={isOpen} onHide={close} 
            placement="right" style={{width:"300px"}}>
        <Drawer.Header>
          <Drawer.Title>Room Details</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditNow
            initialValue={name}
            onSave={onNameSave}
            label={<h5 className="mb-2">Name</h5>}
            emptyMsg="Name can not be empty"
          />
          {/* text area input */}
          <EditNow
            componentClass="textarea"
            row={5}
            initialValue={description}
            onSave={onDescriptionSave}
            emptyMsg="Description can not be empty"
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button block onClick={close}></Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
};

export default memo(EditRoom);
