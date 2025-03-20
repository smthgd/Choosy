import React, { useState } from 'react';

interface LoginProps {
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await fetch('http://localhost:5104/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('User logged in successfully');
            onClose();
            // Здесь вы можете добавить логику для сохранения токена или информации о пользователе
        } else {
            alert('Login failed');
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={() => onClose()}></div> {/* Затемняем фон */}
            <div className="modal"> {/* Применение класса modal */}
                <h2>Login</h2>
                <hr className="divider" /> {/* Горизонтальная линия */}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <hr className="divider" /> {/* Горизонтальная линия */}
                <div className="button-container"> {/* Контейнер для кнопок */}
                    <button onClick={onClose}>Close</button> {/* Кнопка для закрытия модального окна */}
                    <button onClick={handleLogin}>Login</button> {/* Кнопка для входа */}
                </div>
            </div>
        </>
    );
};

export default Login;
