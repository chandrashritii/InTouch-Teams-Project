import React from 'react';
import "./actions.css";
import Tooltip from "@material-ui/core/Tooltip";


export default function VideoNavButtons(props) {
  return (
    <nav className="col-4 col-md-4 col-xs-12 offset-md-5 fixed-bottom rounded-0 stream-actions" style={{zIndex: 999}}>
            <div className="pull-right room-comm navalign" hidden>
            <Tooltip
                title="Toggle Video"
                placement="bottom"
                 >
                <button className="block-nav-2 btn-no-effect mr-3 mb-4" id='toggle-video' title="Hide Video">
                    <i className="fa fa-video fa-1x text-app"></i>
                </button>
            </Tooltip>
            <Tooltip
                title="Toggle Audio"
                placement="bottom"
                 >
                <button className="block-nav-2 btn-no-effect mr-3 mb-4" id='toggle-mute' title="Mute">
                    <i className="fa fa-microphone-alt fa-1x text-app"></i>
                </button>
            </Tooltip>  
            <Tooltip
                title="Share Screen"
                placement="bottom"
                 >
                <button className="block-nav-2 btn-no-effect mr-3 mb-4" id='share-screen' title="Share screen">
                    <i className="fa fa-desktop fa-1x text-app"></i>
                </button>
            </Tooltip>  
            <Tooltip
                title="Chat"
                placement="bottom"
                 >
                <button style={{width: '25%'}} className="block-nav-2 col-md-9 text-app pull-right btn-no-effect mr-3 mb-4" id='chattoggle'>
                    <i className="fa fa-comment fa-1x"></i> <span className="badge badge-danger very-small font-weight-lighter" id='new-chat-notification' hidden>New</span>
                </button>
                </Tooltip>
            </div>
        </nav>
  );
}
