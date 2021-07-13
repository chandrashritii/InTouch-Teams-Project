import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../configs/functional';
import USerAvatar from '../../Profile/UserAvatar';

const ProfileinModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, close, open } = useModalState();
  const shortName = profile.name.split(' ')[0];
  const { name, avatar, createdAt } = profile;
  const memberSince = new Date(createdAt).toLocaleDateString();

  return (
    <>
      <Button onClick={open} {...btnProps}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{shortName} profile</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <USerAvatar
            src={avatar}
            name={name}
            className="widthtwo heighttwo bigsize font-huge"
          />
          <h4 className="mt-2">{name}</h4>
          <p>Member since {memberSince}</p>
        </Modal.Body>

        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileinModal;
