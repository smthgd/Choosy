import React, { useState } from 'react';

interface LoginProps {
    onClose: () => void;
    setUserName: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onClose, setUserName }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await fetch('http://localhost:5104/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('User logged in successfully');
            setUserName(data.userName);
            onClose();
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
