import React from 'react';

interface UserMenuProps {
    userName: string;
    onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName, onLogout }) => {
    return (
        <div>
            <button className="login-button">{userName}</button>
            <button className="register-button" onClick={onLogout}>Logout</button>
        </div>
    );
};

export default UserMenu;