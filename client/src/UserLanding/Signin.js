import React, { useState, useRef, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth, database } from '../configs/firebase';
import { Alert, Col, Container, Grid, Icon, Panel, Row } from 'rsuite';
import "../styles/main.scss";
import { useHistory } from 'react-router-dom';
import { useProfile } from '../context/profile.context';
import GLOBE from 'vanta/dist/vanta.globe.min'; 
// Using Animated background from Vanta
import teams from "../assets/teams.svg";

const SignIn = () => {
  const { profile } = useProfile();
  let {push} = useHistory();
  const signInWithProvider = async provider => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
      //  Add new users to the realtime firebase database with name and timestamp
      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }
      Alert.success('Signed in', 4000);
 
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

//Firebase Google Signin
  const onGoogleSignIn = () => {
    signInWithProvider(new firebase.auth.GoogleAuthProvider());
    if (profile) {push("/");}
  };

  //Animated Background
  const MyComponent = (props) => {
    const [vantaEffect, setVantaEffect] = useState(0)
    const myRef = useRef(null)
    useEffect(() => {
      if (!vantaEffect) {
        setVantaEffect(GLOBE({
          el: myRef.current,
          color: '#2b4a69',
          color2: '#0xa6a3a3',
          size: 0.9
        }))
      }
      return () => {
        if (vantaEffect) vantaEffect.destroy()
      }
    }, [vantaEffect])
    return <div ref={myRef}>
      
    <Container>
        <Grid className="mt-page">
          <Row>
            {/* center mdOffset={6}  */}
            <Col xs={24} md={12} mdOffset={2}>
              <Panel>
                <div className="text-align">
                  Stay <br /> InTouch <br /> with <img src={teams} style={{width: '100px', height: '100px', display: 'inline-block'}}/>
                </div>
                <div className="mt-3">
                  {/* Entry for Aunthenticated User */}
               <button className="block-edit" style={{width:"45%"}} onClick={onGoogleSignIn}>
                    <Icon icon="google" /> Sign up for InTouch
                  </button>
                  {/* Entry to Guest Mode */}
                  <button className="block-edit" style={{width:"45%"}} onClick={(e) => {
                    e.preventDefault();
                    window.open(`/videocall`, "_self");
                    }}>
                    Start VideoCall as a Guest
                  </button>
                </div>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Container>
    </div>
  }  
  
  return (
 
    <MyComponent />
 
  );
};

export default SignIn;

