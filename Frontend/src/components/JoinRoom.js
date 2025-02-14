import React from 'react';

const JoinRoom = ({ roomCode, onJoin, onChange }) => {
    return (
        <div>
            <input
                type="text"
                value={roomCode}
                onChange={onChange}
                placeholder="Enter room code"
            />
            <button onClick={onJoin}>Join Room</button>
        </div>
    );
};

export default JoinRoom;
