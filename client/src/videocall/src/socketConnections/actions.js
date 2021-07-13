import helpers from './helpers.js';

export const ChatEvent = () => {
    //When the chat icon is clicked, chat is toggled and adds 
    document.querySelector( '#chattoggle' ).addEventListener( 'click', ( e ) => {
        let chatElem = document.querySelector( '#chatarea' );
        let mainSecElem = document.querySelector( '#master' );

        if ( chatElem.classList.contains( 'openchat' ) ) {
            chatElem.setAttribute( 'hidden', true );
            chatElem.classList.remove( 'openchat' );
        }

        else {
            chatElem.attributes.removeNamedItem( 'hidden' );
            chatElem.classList.add( 'openchat' );
        }

        setTimeout( () => {
            if ( document.querySelector( '#chatarea' ).classList.contains( 'openchat' ) ) {
                helpers.toggleChatNotificationBadge();
            }
        }, 300 );
    } );


    //Enable picture-in-picture for local user
    document.getElementById( 'localuser' ).addEventListener( 'click', () => {
        if ( !document.pictureInPictureElement ) {
            document.getElementById( 'localuser' ).requestPictureInPicture()
                .catch( error => {
                    console.error( error );
                } );
        }

        else {
            document.exitPictureInPicture()
                .catch( error => {
                    // If Video fails to leave Picture-in-Picture mode.
                    console.error( error );
                } );
        }
    } );


    document.addEventListener( 'click', ( e ) => {
        if ( e.target && e.target.classList.contains( 'expand-remote-video' ) ) {
            helpers.maximiseStream( e );
        }

        else if ( e.target && e.target.classList.contains( 'mute-remote-mic' ) ) {
            helpers.singleStreamToggleMute( e );
        }
    } );


    document.getElementById( 'closerecording' ).addEventListener( 'click', () => {
        helpers.toggleModal( 'recording-modal', false );
    } );
}
