import React from 'react';

interface CreateRoomProps {
    onCreate: () => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreate }) => {
    return (
        <button onClick={onCreate}>Create Room</button>
    );
};

export default CreateRoom;
