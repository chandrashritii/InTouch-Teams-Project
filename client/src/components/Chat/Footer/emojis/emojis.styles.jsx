import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

export const EmojisContainer = styled.div`
overflow-y: auto;
margin-left: 25px;
position: relative;
width: 300px;
`;


export const EmojiPickerContainer = styled(EmojiPicker)`
position: top;
`;