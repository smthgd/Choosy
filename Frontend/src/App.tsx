import { useState } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import MovieList from './components/MovieList/MovieList';
import './App.css';

const App: React.FC = () => {
    const [roomCode, setRoomCode] = useState<string>('');
    const [movies, setMovies] = useState<any[]>([]); // Замените any на конкретный тип, если у вас есть интерфейс для фильмов

    const createRoom = async () => {
        const response = await fetch('/api/room/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const newRoomCode = await response.text();
        setRoomCode(newRoomCode);
    };

    const joinRoom = async () => {
        const response = await fetch(`/api/room/join/${roomCode}`, {
            method: 'POST',
        });
        if (response.ok) {
            await getMovies(roomCode);
        } else {
            alert('Room not found');
        }
    };

    const getMovies = async (roomCode: string) => {
        const response = await fetch(`/api/room/${roomCode}/movies`);
        if (response.ok) {
            const moviesData = await response.json();
            setMovies(moviesData);
        } else {
            alert('Failed to load movies');
        }
    };

    return (
        <>
            <div>
                <h1>Movie Swipe App</h1>
                <CreateRoom onCreate={createRoom} />
                <JoinRoom roomCode={roomCode} onJoin={joinRoom} onChange={(e) => setRoomCode(e.target.value)} />
                <MovieList movies={movies} />
            </div>
        </>
    );
}

export default App;
