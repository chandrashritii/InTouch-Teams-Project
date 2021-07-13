import React, { useState } from "react";

// Recording Buttons
const RecordingView =  () => (<div className="custom-modal" id='recording-modal' style={{display: 'none'}}>
            <div className="custom-modal-content">
                <div className="row text-center">
                    <div className="col-md-6 mb-2">
                        <span className="record-option" id='record-video'>Record video</span>
                    </div>
                    <div className="col-md-6 mb-2">
                        <span className="record-option" id='record-screen'>Record screen</span>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-12 text-center">
                        <button className="btn btn-outline-danger" id='closerecording'>Close</button>
                    </div>
                </div>
            </div>
        </div>);

export default RecordingView;