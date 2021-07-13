const generateRandomString = () => {
    return Math.random().toString( 16 ).slice( 2 ).substring( 0, 8);
}
export const createRoom = () => {
    let roomName = generateRandomString();
    let yourName = 'Anonymous';
    //save the user's name in sessionStorage
    sessionStorage.setItem( 'username', yourName );

    //create room link
    let roomLink = `${ window.location.origin }/${ roomName.trim().replace( ' ', '_' ) }_${ generateRandomString() }`;

    return roomLink;
};
