import React from 'react';
import PropTypes from 'prop-types';
import { EmojiPickerContainer, EmojisContainer } from './emojis.styles';


const Emojis = ({ pickEmoji }) => {
    return (
        <EmojisContainer>
            {
                <EmojiPickerContainer onEmojiClick={pickEmoji} />
                
            }
        </EmojisContainer>

    );
};

Emojis.propTypes = {
    pickEmoji: PropTypes.func
};

export default Emojis;