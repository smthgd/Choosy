import { useState, useEffect  } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import MovieList from './components/MovieList/MovieList';
import MovieCard from './components/MovieCard';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import UserMenu from './components/UserMenu';
import './App.css';
import logo from './assets/ChoosyLogo.png';

const App: React.FC = () => {
    const [roomCode, setRoomCode] = useState<string>('');
    const [movies, setMovies] = useState<any[]>([]); // Замените any на конкретный тип, если у вас есть интерфейс для фильмов
    const [likedMovies, setLikedMovies] = useState<any[]>([]); // Список понравившихся фильмов
    const [currentMovie, setCurrentMovie] = useState<any>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isStarted, setIsStarted] = useState(false); // Состояние для управления видимостью параграфа
    const [roomHistory, setRoomHistory] = useState<any>(null); // Состояние для хранения истории комнаты
    const [isRoomHistoryVisible, setIsRoomHistoryVisible] = useState(false);

    const handleButtonClick = () => {
        setIsStarted(true); // Скрываем параграф
    };

    const openRegisterModal = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    const closeRegisterModal = () => {
        setIsRegisterOpen(false);
    };

    const openLoginModal = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginOpen(false);
    };

    const handleLogout = () => {
        setUserId(null);
        setUserName(null);
    };

    const handleShowRoomHistory = () => {
        if (roomCode) {
            fetchRoomHistory(roomCode);
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
                const response = await fetch(`http://localhost:5104/api/room/${roomCode}/watched-movies?userId=${userId}`, { // поменять айдишник
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(currentMovie.id), // Отправляем ID текущего фильма
                });
    
                if (response.ok) {
                    if (direction === 'right') {
                        setLikedMovies((prev) => { 
                            const updatedLikedMovies = [...prev, currentMovie]; // Обновляем список понравившихся

                            // Вызываем метод MatchChecking с likedMovies
                            fetch(`http://localhost:5104/api/room/${roomCode}/match-checking?userId=${userId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(currentMovie.id), 
                            });

                            return updatedLikedMovies; // Возвращаем обновленный список
                        });
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

    const fetchRoomHistory = async (roomCode: string) => {
        try {
            const response = await fetch(`http://localhost:5104/api/room/${roomCode}/history`);
            if (response.ok) {
                const data = await response.json();
                setRoomHistory(data);
                setIsRoomHistoryVisible(true);
            } else {
                alert('Error fetching room history');
            }
        } catch (error) {
            console.error('Error fetching room history:', error);
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
            <header className="app-header">
                <h1 className="app-title">Choosy</h1>
                <div className="header-buttons">
                    {userName ? (
                        <UserMenu 
                            userName={userName} 
                            onLogout={handleLogout} 
                            roomCode={"47534720"!} 
                            onShowRoomHistory={handleShowRoomHistory}
                        />
                    ) : (
                        <>
                            <button className="login-button" onClick={openLoginModal}>
                                Log in
                            </button>
                            <button className="register-button" onClick={openRegisterModal}>
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </header>
            <div>
                <img src={logo} alt="Logo" className='logo' />
                {!isStarted && (
                    <>
                        <div className='blur-background'>
                            <p>
                                We're giving you time. The time you can spend not choosing a movie, but watching it. Just connect with a friend,
                                partner, or family member and start swiping through suggested movies. As soon as the "match" happens, 
                                you will get your perfect movie for a great evening!
                            </p>
                        </div>

                        <button className="register-button" onClick={handleButtonClick}>
                            Get started
                        </button>
                    </>
                )}

                {isStarted && (
                    <>
                        <JoinRoom
                            roomCode={roomCode}
                            setRoomCode={setRoomCode} 
                            userId={userId} 
                            CreateRoomComponent={CreateRoom}
                            setCurrentMovie={setCurrentMovie}
                        />

                        {currentMovie ? (
                            <MovieCard 
                                movie={currentMovie} 
                                onSwipe={(direction) => handleSwipe(direction)} 
                            />
                        ) : (
                            <p></p> // TODO: заменить на чтение состояния
                        )}
                        <p>Your ID: {userId}</p>

                        {console.log(roomHistory)}

                        {isRoomHistoryVisible && roomHistory && (
                            <div>
                                <h3>Room History</h3>
                                <p>Room ID: {roomHistory.roomCode}</p>
                                <p>Creation Date: {roomHistory.creationDate}</p>
                                <h4>Users:</h4>
                                <ul>
                                    {roomHistory.users.map((user: any) => (
                                        <li key={user.id}>{user.username}</li>
                                    ))}
                                </ul>
                                <h4>Matched Films:</h4>
                                <ul>
                                    {roomHistory.matchedFilms.map((film: any) => (
                                        <li key={film.id}>{film.title}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
    
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

                {isRegisterOpen && <Register onClose={() => closeRegisterModal()} />}
                {isLoginOpen && <Login onClose={closeLoginModal} setUserName={setUserName} />}
            </div>
        </>
    );
}

export default App;
