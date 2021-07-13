import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModalState } from '../../../configs/functional';
import { storage } from '../../../configs/firebase';
import Tooltip from "@material-ui/core/Tooltip";


const MAX_FILE_SIZE = 1000 * 1024 * 5; // 5 mg in bytes

const SendFile = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModalState();

  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleChange = fileArr => {
    const filtered = fileArr
      .filter(el => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);
    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map(file => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + file.name)
          .put(file.blobFile, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
      });
      const uploadSnapshots = await Promise.all(uploadPromises);

      const shapePromises = uploadSnapshots.map(async snapshot => {
        return {
          contentType: snapshot.metadata.contentType,
          name: snapshot.metadata.name,
          url: await snapshot.ref.getDownloadURL(),
        };
      });
      const files = await Promise.all(shapePromises);

      await afterUpload(files);
      setIsLoading(false);
      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <>
    <Tooltip
    title="Send Files"
    placement="top"
    >
      <InputGroup.Button onClick={open} style= {{backgroundColor:"white"}} >
        <Icon icon="attachment" />
      </InputGroup.Button>
      </Tooltip>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={handleChange}
            multiple
            listType="picture-text"
            className="weighthundred"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            {' '}
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small>* Files must be less than 5 mb.</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendFile;
