import React from 'react';

const CreateRoom = ({ onCreate }) => {
    return (
        <button onClick={onCreate}>Create Room</button>
    );
};

export default CreateRoom;
