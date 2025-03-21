import React from 'react';
import './Join.css';

interface JoinRoomProps {
    roomCode: string;
    setRoomCode: (code: string) => void;
    userId: string | null;
    CreateRoomComponent: React.FC<{ setRoomCode: (code: string) => void }>;
    setCurrentMovie: (movie: any[]) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ roomCode, setRoomCode, userId, CreateRoomComponent, setCurrentMovie }) => {
    const joinRoom = async () => {
        if (!roomCode) {
            alert('Please enter a room code');
            return;
        }
        
        const response = await fetch(`http://localhost:5104/api/room/join/${roomCode}`, {
            method: 'POST',
        });
        if (response.ok) {
            console.log('Successfully joined room:', roomCode);
            await getMovies(roomCode);
            if (userId) {
                await getNextMovie(roomCode, userId);
            } else {
                alert('User ID is not available');
            }
        } else {
            alert('Room not found');
        }
    };

    const getMovies = async (code: string) => {
        const response = await fetch(`http://localhost:5104/api/room/${code}/movies`);
        if (response.ok) {
            const moviesData = await response.json();
            console.log('Movies loaded:', moviesData);
            if (moviesData.length > 0) {
                setCurrentMovie(moviesData[0]); // Устанавливаем первый фильм как текущий
            }
        } else {
            alert('Failed to load movies');
        }
    };

    const getNextMovie = async (code: string, userId: string) => {
        const response = await fetch(`http://localhost:5104/api/room/${code}/next-movie?userId=${userId}`);
        if (response.ok) {
            const movieData = await response.json();
            // Здесь можно передать movieData в родительский компонент или сохранить в локальном состоянии
        } else {
            alert('No more movies available');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="input"
            />
            <div className="join-container">
                <button className="button" onClick={joinRoom}>Join Room</button>
                <CreateRoomComponent setRoomCode={setRoomCode} /> {/* Используем переданный компонент */}
            </div>
        </div>
    );
};

export default JoinRoom;