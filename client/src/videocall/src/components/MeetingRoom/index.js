import * as React from "react";
import { useEffect, useState } from "react";
import { Route, Switch } from 'react-router';
import { Col, Grid, Row } from 'rsuite';
import { UserRooms } from '../../../../context/rooms.context';
import VideoCallChat from '../../../../UserLanding/Home/VideoCallChat';
import Header from "../VideoNav";
import { ChatEvent } from "../../socketConnections/actions"
import { loadRtc, record } from "../../socketConnections/rtcConnections";
import VideoNavButtons from "../VideoNavButtons";
import RecordingView from "./Recording";
import "../../App.css";
import $ from 'jquery'; 
import {
    useParams,
    useHistory
  } from "react-router-dom";
import "../../../../styles/main.scss";
import { useProfile } from '../../../../context/profile.context';

//Create Meeting Room
const MeetingRoom = () => {
    const { profile } = useProfile();
    const { roomLink } = React.useState("");
    const {meetingId, chatId} = useParams();
    const [isRecording, setIsRecording] = useState(false);
    let {push} = useHistory();

    useEffect(() => {
        ChatEvent();
        loadRtc(meetingId);
    }, [meetingId]);

// Recording Button Toggle. WebRTC Recording logic is imported from rtcConnections

    const startRecording = async (type) => {
            const isStarted = await record(type);
            console.log(isStarted)
            setIsRecording(isStarted);
    }

    const stopRecording = () => {
            record();
            setIsRecording(false);
    }

//Copy to Clipboard function
    
    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove(); 
      }

// If user is authenticated and joining in a group videocall, chat history will persist and the room 
// members will be able to continue their conversation 

    if (profile) {
        return (
        <>
            <RecordingView />
            <Header>
            <VideoNavButtons />
            <p id="p2" hidden> https://intouch-videocall.herokuapp.com/{chatId}</p>
            <div>
                {!isRecording && <button className="block" variant="outline-info" onClick={() => startRecording('media')} style={{width:"10%",marginRight: 10, marginTop: 5}}>Record Video</button>}{'  '}
                {!isRecording &&<button className="block" variant="outline-info" onClick={() => startRecording('screen')} style={{width:"10%",marginRight: 10, marginTop: 5}}>Record Screen</button>}{'   '}
                {isRecording && <button className="block" variant="outline-danger" onClick={() => stopRecording()} style={{width:"18%", marginRight: 10, marginTop: 5}}>Stop Recording</button>}{'   '}
                <button className="block" onClick={copyToClipboard('#p2')} style={{width:"10%", marginRight: 10, marginTop: 5}}>
                Share Link
                </button>{'  '}
                <button className="block" variant="danger" onClick={() => push("/signin")} style={{width:"10%", marginRight: 10, marginTop: 5}}>Leave Session</button>{'  '}
                {!profile && <button className="block" variant="danger" onClick={() => push("/")} style={{width:"19%", marginRight: 10, marginTop: 5, padding: '5px 5px'}}>Sign up for InTouch-Teams</button>}{'  '}
                </div>
            </Header>

            <div className="container-fluid">
                <div className="row">
                </div>

                <div className="row">
                    <div className="col-md-12 main" id='master'>
                    <video className="local-video mirror-mode" id='localuser' volume='0' autoPlay muted></video>
                    <div className="row mt-2 mb-2" id='videos' style={{marginRight: '300px'}}></div>
                    </div>
                    <div className="col-md-3 chat-col d-print-none mb-2 bg-app-secondary" id='chatarea' hidden>              
                    <UserRooms>
                    <Grid fluid className="heighthundred">
                        <Row className="heighthundred">
                        <Switch>
                            <Route exact path="/:chatId">
                            <Col xs={24} md={24} className="heighthundred">
                                <VideoCallChat />
                            </Col>
                            </Route>
                        </Switch>
                        </Row>
                    </Grid>
                    </UserRooms> 
                    </div>
                </div>
            </div>
        </> ); 

  //In Guest Mode, chat history will not persist. 
  //Chat will be anonymous and will vanish as soon as the videocall ends

        } return ( 
           <>
            <RecordingView />
            <Header>
            <VideoNavButtons />
            <p id="p1" hidden> https://intouch-videocall.herokuapp.com/{chatId}</p>
                <div>
                {!isRecording && <button className="block" variant="outline-info" onClick={() => startRecording('media')} style={{width:"10%",marginRight: 10, marginTop: 5}}>Record Video</button>}{'  '}
                {!isRecording &&<button className="block" variant="outline-info" onClick={() => startRecording('screen')} style={{width:"10%",marginRight: 10, marginTop: 5}}>Record Screen</button>}{'   '}
                {isRecording && <button className="block" variant="outline-danger" onClick={() => stopRecording()} style={{width:"18%", marginRight: 10, marginTop: 5}}>Stop Recording</button>}{'   '}
                <button className="block" onClick={copyToClipboard('#p1')} style={{width:"10%", marginRight: 10, marginTop: 5}}>
                Share Link
                </button>{'  '}
                <button className="block" variant="danger" onClick={() => push("/signin")} style={{width:"10%", marginRight: 10, marginTop: 5}}>Leave Session</button>{'  '}
                {!profile && <button className="block" variant="danger" onClick={() => push("/")} style={{width:"19%", marginRight: 10, marginTop: 5, padding: '5px 5px'}}>Sign up for InTouch-Teams</button>}{'  '}
                </div>
            </Header>

            <div className="container-fluid">
                <div className="row">
                </div>

                <div className="row">
                    <div className="col-md-12 main" id='master'>
                    <video className="local-video mirror-mode" id='localuser' volume='0' autoPlay muted></video>
                    <div className="row mt-2 mb-2" id='videos' style={{marginRight: '300px'}}></div>
                    </div>
                    <div className="col-md-3 chat-col d-print-none mb-2 bg-app-secondary"  style={{backgroundColor: '#2b4a69'}} id='chatarea'  hidden>   
                    <div className="row" style={{width: '300px',textAlign: 'center', fontSize: '19px' }}>
                            <div className="col-12 text-center h2 mb-3" style={{ marginLeft: '25px'}}>CHAT</div>
                        </div>

                        <div id='chat-messages'></div>

                        <div className="row">
                            <textarea id='chat-input' style={{color: 'black', maxWidth: 'auto'}} className="form-control rounded-0 chat-box border-info" rows='3' placeholder="Get creative"></textarea>
                        </div> 
                    </div>
                </div>
            </div>
        </> 
        );
}

export default MeetingRoom;