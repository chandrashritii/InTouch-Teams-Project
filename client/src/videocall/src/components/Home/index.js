import * as React from "react";
import { useState, useRef, useEffect } from 'react';
import {createRoom} from "../../services/CreateRoom";
import Button from 'react-bootstrap/Button';
import "../../../../styles/main.scss";
import $ from 'jquery'; 
import NET from 'vanta/dist/vanta.net.min';
import { Alert } from 'rsuite';


const Homevideo = () => {
    const [roomLink, setRoomLink] = React.useState("");
    const makeRoom = (e) => {
        e.preventDefault();
        const room = createRoom();
        setRoomLink(room);
    }
    
  const Background = (props) => {
    const [vantaEffect, setVantaEffect] = useState(0)
    const myRef = useRef(null)
    useEffect(() => {
      if (!vantaEffect) {
        setVantaEffect(NET({
          el: myRef.current,
          color: '#2b4a69',
          color2: '#0xa6a3a3'
        }))
      }
      return () => {
        if (vantaEffect) vantaEffect.destroy()
      }
    }, [vantaEffect])


    function copyToClipboard(element) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val($(element).text()).select();
      document.execCommand("copy");
      $temp.remove();
      
    }
    return <div ref={myRef}>
        
              <Button 
              className="block" 
              style={{width: '20%', padding: "8px 8px", marginTop: "20%", marginLeft: "39%"}} 
              onClick={makeRoom} >
                Create New Room
            </Button>
            { roomLink && Alert.success('Room has been created. Join in!', 60000) && <div className="mt-2">
                <a href={roomLink}>
                <button className="block" style={{width: '20%', padding: "8px 8px", marginTop: "1%", marginLeft: "39%"}}>
                Join Room
                </button>
                </a> 
                <a>
                <p id="p1" hidden>{roomLink}</p>
                <button className="block" onClick={copyToClipboard('#p1')} style={{width: '20%', padding: "8px 8px", marginTop: "1%", marginLeft: "39%"}}>
                Share Room Link
                </button>
                </a>
            </div>}
        
    </div>
  }  
  
  return (
 
    <Background />
 
  );
};
    

export default Homevideo;