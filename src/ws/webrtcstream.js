const stream = ( socket ) => {
    socket.on( 'subscribe', ( data ) => {
        //subscribe/join a room
        socket.join( data.room );
        socket.join( data.socketIdentity );

        //Inform other members in the room of new user's arrival
        if ( socket.adapter.rooms[data.room].length > 1 ) {
            socket.to( data.room ).emit( 'new user', { socketIdentity: data.socketIdentity } );
        }

        console.log( socket.rooms );
    } );


    socket.on( 'newuser', ( data ) => {
        socket.to( data.to ).emit( 'newuser', { sender: data.sender } );
    } );


    socket.on( 'dataOffer', ( data ) => {
        socket.to( data.to ).emit( 'dataOffer', { description: data.description, sender: data.sender } );
    } );


    socket.on( 'icecandidates', ( data ) => {
        socket.to( data.to ).emit( 'icecandidates', { candidate: data.candidate, sender: data.sender } );
    } );


    socket.on( 'securechat', ( data ) => {
        socket.to( data.room ).emit( 'securechat', { sender: data.sender, msg: data.msg } );
    } );
};

module.exports = stream;
