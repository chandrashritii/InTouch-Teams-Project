 import h from './helpers.js';
 import io from 'socket.io-client';

         var pc = [];
 
         let socket = io( `/stream` );
         
         var myStream = '';
         var socketIdentity = '';
         var screen = '';
         var recordedStream = [];
         var mediaRecorder = '';
 
     export const loadRtc = (meetingId) => {
         const room = meetingId;
         let commElem = document.getElementsByClassName( 'room-comm' );
         const username = sessionStorage.getItem( 'username' );
         for ( let i = 0; i < commElem.length; i++ ) {
             commElem[i].attributes.removeNamedItem( 'hidden' );
         }
         //Get user video by default
         getAndSetUserStream();
 
 
         socket.on( 'connect', () => {
             //set socketId
             socketIdentity = socket.io.engine.id;
 
 
             socket.emit( 'subscribe', {
                 room: room,
                 socketIdentity: socketIdentity
             } );
 
 
             socket.on( 'new user', ( data ) => {
                 socket.emit( 'newuser', { to: data.socketIdentity, sender: socketIdentity } );
                 pc.push( data.socketIdentity );
                 init( true, data.socketIdentity );
             } );
 
 
             socket.on( 'newuser', ( data ) => {
                 pc.push( data.sender );
                 init( false, data.sender );
             } );
 
 
             socket.on( 'icecandidates', async ( data ) => {
                 return data.candidate ? await pc[data.sender].addIceCandidate( new RTCIceCandidate( data.candidate ) ) : '';
             } );
 
 
             socket.on( 'dataOffer', async ( data ) => {
                 if ( data.description.type === 'offer' ) {
                     const session = data.description ? await pc[data.sender].setRemoteDescription( new RTCSessionDescription( data.description ) ) : '';
 
                     h.getUserFullMedia().then( async ( stream ) => {
                         if ( !document.getElementById( 'localuser' ).srcObject ) {
                             h.setLocalStream( stream );
                         }
 
                         //save my stream
                         myStream = stream;
 
                         stream.getTracks().forEach( ( track ) => {
                             pc[data.sender].addTrack( track, stream );
                         } );
 
                         let answer = await pc[data.sender].createAnswer();
 
                         await pc[data.sender].setLocalDescription( answer );
 
                         socket.emit( 'dataOffer', { description: pc[data.sender].localDescription, to: data.sender, sender: socketIdentity } );
                     } ).catch( ( e ) => {
                         console.error( e );
                     } );
                 }
 
                 else if ( data.description.type === 'answer' ) {
                     await pc[data.sender].setRemoteDescription( new RTCSessionDescription( data.description ) );
                 }
             } );
 
 
             socket.on( 'securechat', ( data ) => {
                 h.addChat( data, 'remote' );
             } );
         } );
 
 
         function getAndSetUserStream() {
             h.getUserFullMedia().then( ( stream ) => {
                 //save my stream
                 myStream = stream;
 
                 h.setLocalStream( stream );
             } ).catch( ( e ) => {
                 console.error( `stream error: ${ e }` );
             } );
         }
 
 
         function sendMsg( msg ) {
             let data = {
                 room: room,
                 msg: msg,
                 sender: username
             };
 
             //emit chat message
             socket.emit( 'securechat', data );
 
 
             //add localchat
             h.addChat( data, 'localuser' );
         }
 
 
 
         function init( createOffer, partnerName ) {
             pc[partnerName] = new RTCPeerConnection( h.getIceServer() );
 
             if ( screen && screen.getTracks().length ) {
                 screen.getTracks().forEach( ( track ) => {
                     pc[partnerName].addTrack( track, screen );//should trigger negotiationneeded event
                 } );
             }
 
             else if ( myStream ) {
                 myStream.getTracks().forEach( ( track ) => {
                     pc[partnerName].addTrack( track, myStream );//should trigger negotiationneeded event
                 } );
             }
 
             else {
                 h.getUserFullMedia().then( ( stream ) => {
                     //save my stream
                     myStream = stream;
 
                     stream.getTracks().forEach( ( track ) => {
                         pc[partnerName].addTrack( track, stream );//should trigger negotiationneeded event
                     } );
 
                     h.setLocalStream( stream );
                 } ).catch( ( e ) => {
                     console.error( `stream error: ${ e }` );
                 } );
             }
 
 
 
             //create offer
             if ( createOffer ) {
                 pc[partnerName].onnegotiationneeded = async () => {
                     let offer = await pc[partnerName].createOffer();
 
                     await pc[partnerName].setLocalDescription( offer );
 
                     socket.emit( 'dataOffer', { description: pc[partnerName].localDescription, to: partnerName, sender: socketIdentity } );
                 };
             }
 
 
 
             //send ice candidate to partnerNames
             pc[partnerName].onicecandidate = ( { candidate } ) => {
                 socket.emit( 'icecandidates', { candidate: candidate, to: partnerName, sender: socketIdentity } );
             };
 
 
 
             //add client videos
             pc[partnerName].ontrack = ( e ) => {
                 let str = e.streams[0];
                 if ( document.getElementById( `${ partnerName }-video` ) ) {
                     document.getElementById( `${ partnerName }-video` ).srcObject = str;
                 }
 
                 else {
                     //video element
                     let newVid = document.createElement( 'video' );
                     newVid.id = `${ partnerName }-video`;
                     newVid.srcObject = str;
                     newVid.autoplay = true;
                     newVid.className = 'remote-video';
 
                     //video controls elements - Mute remote video
                     let controlDiv = document.createElement( 'div' );
                     controlDiv.className = 'remote-video-controls';
                     controlDiv.innerHTML = 
                     `<i class="fa fa-microphone text-app pr-3 mute-remote-mic" title="Mute"></i>`;
                      let cardDiv = document.createElement( 'div' );
                     cardDiv.className = 'card card-sm';
                     cardDiv.id = partnerName;
                     cardDiv.appendChild( newVid );
                     cardDiv.appendChild( controlDiv );
 
                     //Append Card div to the client videos
                     document.getElementById( 'videos' ).appendChild( cardDiv );
 
                     h.adjustVideoElemSize();
                 }
             };
 
 
            //Edge Cases
             pc[partnerName].onconnectionstatechange = ( d ) => {
                 switch ( pc[partnerName].iceConnectionState ) {
                     case 'disconnected':
                     case 'failed':
                         h.closeVideo( partnerName );
                         break;
 
                     case 'closed':
                         h.closeVideo( partnerName );
                         break;
                 }
             };
 
 
 
             pc[partnerName].onsignalingstatechange = ( d ) => {
                 switch ( pc[partnerName].signalingState ) {
                     case 'closed':
                         console.log( "Signalling state has 'exited'" );
                         h.closeVideo( partnerName );
                         break;
                 }
             };
         }
 
 
         //Share Screen
 
         function shareScreen() {
             h.shareScreen().then( ( stream ) => {
                 h.toggleShareIcons( true );
 
                 h.toggleVideoBtnDisabled( true );
 
                 //save my screen stream
                 screen = stream;
 
                 //share the new stream with all users
                 broadcastNewTracks( stream, 'video', false );
 
                 //Switch off screen sharing
                 //Adding a Listener for stream ended
                 screen.getVideoTracks()[0].addEventListener( 'ended', () => {
                     stopSharingScreen();
                 } );
             } ).catch( ( e ) => {
                 console.error( e );
             } );
         }
 
         //End Screen Share
 
         function stopSharingScreen() {
             h.toggleVideoBtnDisabled( false );
 
             return new Promise( ( res, rej ) => {
                const track = screen.getTracks().length ? screen.getTracks().forEach( track => track.stop() ) : '';
 
                 res();
             } ).then( () => {
                 h.toggleShareIcons( false );
                 broadcastNewTracks( myStream, 'video' );
             } ).catch( ( e ) => {
                 console.error( e );
             } );
         }
 
 
        // Add new tracks from remote users
         function broadcastNewTracks( stream, type, mirrorMode = true ) {
             h.setLocalStream( stream, mirrorMode );
 
             let track = type == 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];
 
             for ( let p in pc ) {
                 let pName = pc[p];
 
                 if ( typeof pc[pName] == 'object' ) {
                     h.replaceTrack( track, pc[pName] );
                 }
             }
         }
 
         // Toggle Recording Icons is used when Recording starts
         function toggleRecordingIcons( isRecording ) {
             let e = document.getElementById( 'record' );
 
             if ( isRecording ) {
                 e.setAttribute( 'title', 'Stop recording' );
                 e.children[0].classList.add( 'text-danger' );
                 e.children[0].classList.remove( 'text-app' );
             }
 
             else {
                 e.setAttribute( 'title', 'Record' );
                 e.children[0].classList.add( 'text-app' );
                 e.children[0].classList.remove( 'text-danger' );
             }
         }
 
 
         //Chat textarea
         document.getElementById( 'chat-input' ).addEventListener( 'keypress', ( e ) => {
             if ( e.which === 13 && ( e.target.value.trim() ) ) {
                 e.preventDefault();
 
                 sendMsg( e.target.value );
 
                 setTimeout( () => {
                     e.target.value = '';
                 }, 50 );
             }
         } );
 
 
         //Toggle Video
         document.getElementById( 'toggle-video' ).addEventListener( 'click', ( e ) => {
             e.preventDefault();
 
             let elem = document.getElementById( 'toggle-video' );
 
             if ( myStream.getVideoTracks()[0].enabled ) {
                 e.target.classList.remove( 'fa-video' );
                 e.target.classList.add( 'fa-video-slash' );
                 elem.setAttribute( 'title', 'Show Video' );
 
                 myStream.getVideoTracks()[0].enabled = false;
             }
 
             else {
                 e.target.classList.remove( 'fa-video-slash' );
                 e.target.classList.add( 'fa-video' );
                 elem.setAttribute( 'title', 'Hide Video' );
 
                 myStream.getVideoTracks()[0].enabled = true;
             }
 
             broadcastNewTracks( myStream, 'video' );
         } );
 
 
         //Toggle Audio
         document.getElementById( 'toggle-mute' ).addEventListener( 'click', ( e ) => {
             e.preventDefault();
 
             let elem = document.getElementById( 'toggle-mute' );
 
             if ( myStream.getAudioTracks()[0].enabled ) {
                 e.target.classList.remove( 'fa-microphone-alt' );
                 e.target.classList.add( 'fa-microphone-alt-slash' );
                 elem.setAttribute( 'title', 'Unmute' );
 
                 myStream.getAudioTracks()[0].enabled = false;
             }
 
             else {
                 e.target.classList.remove( 'fa-microphone-alt-slash' );
                 e.target.classList.add( 'fa-microphone-alt' );
                 elem.setAttribute( 'title', 'Mute' );
 
                 myStream.getAudioTracks()[0].enabled = true;
             }
 
             broadcastNewTracks( myStream, 'audio' );
         } );
 
 
         //Add a click event listener on Share screen button click
         document.getElementById( 'share-screen' ).addEventListener( 'click', ( e ) => {
             e.preventDefault();
 
             if ( screen && screen.getVideoTracks().length && screen.getVideoTracks()[0].readyState != 'ended' ) {
                 stopSharingScreen();
             }
 
             else {
                 shareScreen();
             }
         } );
 };
 
 
  //When record button is clicked, user is asked what they want to record - Their video or the screen.
 export const record = ( type = 'screen' ) => {
     if ( !mediaRecorder || mediaRecorder.state == 'inactive' ) {
         if(type === 'screen') { 
             return recordScreen();
         } else {
             return recordVideo(); 
         }
     }
 
     else if ( mediaRecorder.state == 'paused' ) {
         mediaRecorder.resume();
     }
 
     else if ( mediaRecorder.state == 'recording' ) {
         mediaRecorder.stop();
     }
 }
 
 function startRecording( stream ) {
     const username = sessionStorage.getItem( 'username' );
     mediaRecorder = new MediaRecorder( stream, {
         mimeType: 'video/webm;codecs=vp9'
     } );
 
     mediaRecorder.start( 1000 );
 
     mediaRecorder.ondataavailable = function ( e ) {
         recordedStream.push( e.data );
     };
 
     mediaRecorder.onstop = function () {
 
         h.saveRecordedStream( recordedStream, username );
 
         setTimeout( () => {
             recordedStream = [];
         }, 3000 );
     };
 
     mediaRecorder.onerror = function ( e ) {
         console.error( e );
     };
 }
 
 
 // Case 1 : Record screen
 const recordScreen = () => {
 
     if ( screen && screen.getVideoTracks().length ) {
         startRecording( screen );
         return true;
     }
 
     else {
         return h.shareScreen().then( ( screenStream ) => {
             startRecording( screenStream );
             return true;
         } ).catch( () => { 
//Error Handling 
             return false;
         } );
     }
 }
 
 
 //Case 2 : Record local video
 const recordVideo = () => {
 
     if ( myStream && myStream.getTracks().length ) {
         startRecording( myStream );
         return true;
     }
 
     else {
         h.getUserFullMedia().then( ( videoStream ) => {
             startRecording( videoStream );
             return true;
         } ).catch( () => { return false; } );
     }
 }
 