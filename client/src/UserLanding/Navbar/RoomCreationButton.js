import React, { useState, useCallback, useRef } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import firebase from 'firebase/app';
import { useModalState } from '../../configs/functional';
import { database, auth } from '../../configs/firebase';
import Tooltip from "@material-ui/core/Tooltip";

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('Chat name is required'),
  description: StringType().isRequired('Description is required'),
});

const INITIAL_FORM = {
  name: '',
  description: '',
};

const CreateRoom = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) return;
    setIsLoading(true);

    // save obj to database
    const newRoomData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admins: {
        [auth.currentUser.uid]: true,
      }
    };
    try {
      await database.ref('rooms').push(newRoomData); // push new value
      Alert.info(`${formValue.name} has been created`, 4000);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close(); //close modal window
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-1">
        <Tooltip
        title="Create new room"
        placement="top"
        >
      <button className = "block-right" style={{padding: '9px 7px'}} onClick={open}>
        <Icon icon="plus" />
      </button>
      </Tooltip>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New Chatroom</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Room name</ControlLabel>
              {/* input */}
              <FormControl name="name" placeholder="Enter chat room name" />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter room description"
              />
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className = "block"
            onClick={onSubmit}
            disabled={isLoading}
            style={{backgroundColor:"#2b4a69",color:"white"}}
          >
            Create new chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoom;
