import { useState, useEffect  } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import MovieList from './components/MovieList/MovieList';
import MovieCard from './components/MovieCard';
import './App.css';

const App: React.FC = () => {
    const [roomCode, setRoomCode] = useState<string>('');
    const [movies, setMovies] = useState<any[]>([]); // Замените any на конкретный тип, если у вас есть интерфейс для фильмов
    const [likedMovies, setLikedMovies] = useState<any[]>([]); // Список понравившихся фильмов
    const [currentMovie, setCurrentMovie] = useState<any>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
     
    const createRoom = async () => {
        const response = await fetch('http://localhost:5104/api/room/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const newRoomCode = await response.text();
        setRoomCode(newRoomCode);
    };

    const joinRoom = async () => {
        const response = await fetch(`http://localhost:5104/api/room/join/${roomCode}`, {
            method: 'POST',
        });
        if (response.ok) {
            await getMovies(roomCode);
            if (userId){
                await getNextMovie(roomCode, userId);
            }
            else{
                alert('User ID is not available')
            }
        } else {
            alert('Room not found');
        }
    };

    const getMovies = async (roomCode: string) => {
        const response = await fetch(`http://localhost:5104/api/room/${roomCode}/movies`);
        if (response.ok) {
            const moviesData = await response.json();
            setMovies(moviesData);
        } else {
            alert('Failed to load movies');
        }
    };

    const getNextMovie = async (roomCode: string, userId: string) => {
        const response = await fetch(`http://localhost:5104/api/room/${roomCode}/next-movie?userId=${userId}`);
        if (response.ok) {
            const movieData = await response.json();
            setCurrentMovie(movieData); // Устанавливаем текущий фильм
        } else {
            alert('No more movies available');
        }
    };

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (currentMovie) {
            if (userId){
                const response = await fetch(`http://localhost:5104/api/room/${roomCode}/swipe?userId=${userId}`, { // поменять айдишник
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(currentMovie.id), // Отправляем ID текущего фильма
                });
    
                if (response.ok) {
                    if (direction === 'right') {
                        setLikedMovies((prev) => [...prev, currentMovie]); // Добавляем фильм в список понравившихся
                    }
                    await getNextMovie(roomCode, userId); // Запрашиваем следующий фильм. Нужно поменять айдишник
                } else {
                    alert('Error while swiping');
                }
            } else {
                alert('User ID is not available')
            }
        }
    };

    useEffect(() => {
        // Подключение к WebSocket
        const newSocket = new WebSocket('ws://localhost:5104/ws'); // Замените на ваш URL WebSocket

        newSocket.onmessage = (event) => {
            const message = event.data;
            if  (typeof message === 'string' && message.startsWith('userId:')) {
                // Предполагаем, что сервер отправляет userId в формате "userId: <значение>"
                const id = message.split(': ')[1];
                setUserId(id);
            }
            else{
                alert(message); // Здесь вы можете обработать сообщение, например, показать уведомление
            }
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(newSocket);

        // Очистка при размонтировании компонента
        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <>
            <div>
                <h1>Movie Swipe App</h1>
                <CreateRoom onCreate={createRoom} />
                <JoinRoom roomCode={roomCode} onJoin={joinRoom} onChange={(e) => setRoomCode(e.target.value)} />
                
                {currentMovie ? (
                    <MovieCard 
                        movie={currentMovie} 
                        onSwipe={(direction) => handleSwipe(direction)} 
                    />
                ) : (
                    <p>Loading movie...</p>
                )}
                <ul>{userId}</ul>
    
                {likedMovies.length > 0 && (
                    <div>
                        <h2>Liked Movies</h2>
                        <ul>
                            {likedMovies.map((movie) => (
                                <li key={movie.id}>{movie.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
