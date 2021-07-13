
//Template Localhost Boolean Expression to ensure safe local deployment
export const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);


export const Array = snapVal => {
  return snapVal ? Object.keys(snapVal) : [];
};

export function ArrayId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map(roomId => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}

// User Updates whenever profile is changed
export const Updates = async (userId, keyToUpdate, value, db) => {
  const updates = {};
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;
  const getMsgs = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');
  const getRooms = db
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');
  const [msgSnap, rSnap] = await Promise.all([getMsgs, getRooms]);

  msgSnap.forEach(msgSnap => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });

  rSnap.forEach(roomSnap => {
    updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });
  return updates;
};

export function groupBy(array, groupingKeyFunc) {
  return array.reduce((result, item) => {
    const groupingKey = groupingKeyFunc(item);

    if (!result[groupingKey]) {
      result[groupingKey] = [];
    }
    result[groupingKey].push(item);

    return result;
  }, {});
}

export function Nameget(name) {
  const splitName = name.toUpperCase().split(' '); // array of words
  if (splitName.length > 1) {
    // get the initials of two words, first word first letter and second word first letter
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}
