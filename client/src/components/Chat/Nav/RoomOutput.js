import React, { memo } from 'react';
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/userroom.context';
import { useModalState } from '../../../configs/functional';
import { Icon } from 'rsuite';
import Tooltip from "@material-ui/core/Tooltip";


const RoomOutput = () => {
  const { isOpen, open, close } = useModalState();
  const description = useCurrentRoom(v => v.description);
  const name = useCurrentRoom(v => v.name);

  return (
    <>
     <Tooltip
      title="Room Information"
      placement="top"
      >
      <button 
      style= {{borderRadius: "0px", size: "3em",padding: "5px 3px", paddingLeft: "16px", paddingRight:"6px", backgroundColor:"white"}}
      onClick={open}
      style={{color: "black", backgroundColor: "white"}}>
       <Icon icon="info-circle" />
      </button>
      </Tooltip>  
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-1">Description</h5>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close} className="block-room">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(RoomOutput);
