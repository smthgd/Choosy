import React from 'react';

interface UserMenuProps {
    userName: string;
    onLogout: () => void;
    roomCode: string;
    onShowRoomHistory: () => void; 
}

const UserMenu: React.FC<UserMenuProps> = ({ userName, onLogout, roomCode, onShowRoomHistory }) => {
    return (
        <div>
            <button className="login-button" onClick={onShowRoomHistory}>{userName}</button>
            <button className="register-button" onClick={onLogout}>Logout</button>
        </div>
    );
};

export default UserMenu;