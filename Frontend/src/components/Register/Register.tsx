import React, { useState } from 'react';
import './Register.css';

interface RegisterProps {
    onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async () => {
        const response = await fetch('http://localhost:5104/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        });

        if (response.ok) {
            alert('User registered successfully');
            onClose();
        } else {
            alert('Registration failed');
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={() => onClose()}></div> {/* Затемняем фон */}
            <div className="modal"> {/* Применение класса modal */}
                <h2>Register</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <button onClick={handleRegister}>Register</button>
                <button onClick={onClose}>Close</button> {/* Кнопка для закрытия модального окна */}
            </div>
        </>
    );
};

export default Register;
