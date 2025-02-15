import React from 'react';

interface JoinRoomProps {
    roomCode: string;
    onJoin: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ roomCode, onJoin, onChange }) => {
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
