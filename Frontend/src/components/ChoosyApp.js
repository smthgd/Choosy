import React, { useState } from 'react';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import MovieList from './MovieList';

const MovieSwipeApp = () => {
    const [roomCode, setRoomCode] = useState('');
    const [movies, setMovies] = useState([]);

    const createRoom = async () => {
        const response = await fetch('/api/room/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const newRoomCode = await response.text();
        setRoomCode(newRoomCode);
    };

    const joinRoom = async () => {
        const response = await fetch(`/api/room/join/${roomCode}`, {
            method: 'POST'
        });
        if (response.ok) {
            await getMovies(roomCode);
        } else {
            alert('Room not found');
        }
    };

    const getMovies = async (roomCode) => {
        const response = await fetch(`/api/room/${roomCode}/movies`);
        if (response.ok) {
            const moviesData = await response.json();
            setMovies(moviesData);
        } else {
            alert('Failed to load movies');
        }
    };

    return (
        <div>
            <h1>Movie Swipe App</h1>
            <CreateRoom onCreate={createRoom} />
            <JoinRoom roomCode={roomCode} onJoin={joinRoom} onChange={(e) => setRoomCode(e.target.value)} />
            <MovieList movies={movies} />
        </div>
    );
};

export default MovieSwipeApp;
