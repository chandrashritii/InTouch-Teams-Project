import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database, storage } from '../../../configs/firebase';
import { groupBy, ArrayId } from '../../../configs/helpers';
import ChatMessages from './ChatMessages';

//Setting Page Size holder to 13 and sending a call to the database
const PAGE_SIZE = 13;
const messagesRef = database.ref('/messages');

function ScrollBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;
  return percentage > threshold;
}

const GroupMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;

      messagesRef.off();
      // listen for changes in messages
      messagesRef
        .orderByChild('roomId')
        .equalTo(chatId) // from params
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = ArrayId(snap.val());

          setMessages(data);

          if (ScrollBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });
      setLimit(prev => prev + PAGE_SIZE);
    },
    [chatId]
  );

  //Load More Function - Adjusts the chat window height and fires a callback to retrieve message history

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 200);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;
    loadMessages();
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 200);

    return () => {
      messagesRef.off('value'); 
    };
  }, [loadMessages]);

  // LastMessage is a property which basically stores the user's last message. 
  //On deletion, the message is removed from the database and the LastMessage prop. 
  //Post that, the second last message is pushed to the Last Message prop .

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm('Are you sure you want to delete this message?')) {
        return;
      }
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};

      updates[`/messages/${msgId}`] = null; // delete original message
      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2], 
          msgId: messages[messages.length - 2].id, 
        };
      }
      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted');
      } catch (err) {
        return Alert.error(err.message, 4000);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (err) {
          Alert.error(err.message, 4000);
        }
      }
    },
    [chatId, messages]
  );

  
//Admin Feature. Allows a user to handover admin privelege to another user, 
//thereafter which they share admin privileges

const handleAdmin = useCallback(
  async uid => {
    const adminsRef = database.ref(`/rooms/${chatId}/admins`);

    let alertMsg;

    await adminsRef.transaction(admins => {
      if (admins) {
        if (admins[uid]) {
          admins[uid] = null;
          alertMsg = 'Admin permission removed';
        } else {
          admins[uid] = true;
          alertMsg = 'Admin permission granted';
        }
      }

      return admins;
    });

    Alert.info(alertMsg, 4000);
  },
  [chatId]
);

//Like Function. When a user hearts a message, the function first checks whether the message exists
// The count of likes is then appended by 1 and the number of likes is displayed on hover 


const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    let alertMsg;

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Like added';
        }
      }

      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, []);

  // Grouping Messages by Date

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );

    let items = [];

    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => (
        <ChatMessages
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
    });

    return items;
  };
  return (
    <ul ref={selfRef} className="indexlist scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <button onClick={onLoadMore} className="widget">
            Load More
          </button>
        </li>
      )}
      {isChatEmpty && <div style={{marginLeft: '40%', marginTop: '20%', fontSize: '16px'}}><li>Start a conversation</li></div>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};



export default GroupMessages;
