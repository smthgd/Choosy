import React from 'react';
import './Join.css';

interface CreateRoomProps {
    setRoomCode: (code: string) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ setRoomCode }) => {
    const createRoom = async () => {
        const response = await fetch('http://localhost:5104/api/room/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const newRoomCode = await response.text();
        setRoomCode(newRoomCode); // Устанавливаем новый код комнаты
    };

    return (
        <button className="button" onClick={createRoom}>Create Room</button>
    );
};

export default CreateRoom;