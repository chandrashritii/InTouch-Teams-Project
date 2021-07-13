import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, database, messaging } from '../configs/firebase';
import firebase from 'firebase/app';


const ProfileContext = createContext();

export const Offline = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const Online = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};


export const UserProfile = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusDatabaseRef;
    let tokenRefreshUnsub;

    const authUnsub = auth.onAuthStateChanged(async authObj => {
      if (authObj) {
        userStatusDatabaseRef = database.ref(`/status/${authObj.uid}`);
        console.log(authObj.uid);
        userRef = database.ref(`/profiles/${authObj.uid}`);
        console.log(authObj);

        userRef.on('value', snap => {
          console.log('snap', snap);
          const { name, createdAt, avatar } = snap.val();

          const data = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });

        database.ref('.info/connected').on('value', function (snapshot) {
          if (!!snapshot.val() === false) {
            return;
          }

          userStatusDatabaseRef
            .onDisconnect()
            .set(Offline)
            .then(function () {
              userStatusDatabaseRef.set(Online);
            });
        });

        if (messaging) {
   
          tokenRefreshUnsub = messaging.onTokenRefresh(async () => {
            try {
              const currentToken = await messaging.getToken();
              if (currentToken) {
                await database
                  .set(authObj.uid);
              }
            } catch (err) {
            }
          });
        }
      } else {
        if (userRef) {
          // unsubscribe
          userRef.off();
        }
        if (userStatusDatabaseRef) {
          userStatusDatabaseRef.off();
        }
        if (tokenRefreshUnsub) {
          tokenRefreshUnsub();
        }

        database.ref('.info/connected').off();
        setProfile(null);
        setIsLoading(false);
      }
    });

    // cleanup subscription onAuthStateChanged
    return () => {
      authUnsub();

      if (userRef) {
        userRef.off();
      }
      if (userStatusDatabaseRef) {
        userStatusDatabaseRef.off();
      }
      if (tokenRefreshUnsub) {
        tokenRefreshUnsub();
      }

      database.ref('.info/connected').off();
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// call with useProfile function
export const useProfile = () => useContext(ProfileContext);
