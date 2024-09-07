import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';useNavigate

export const AuthContext = createContext(null);

const AuthContextProvider = (props) => {
    const navigate = useNavigate(); 
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const [username, setUsername] = useState(() => localStorage.getItem('username') || '');

    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
        localStorage.setItem('username', username);
    }, [isLoggedIn, username]);

    const handleLogIn = (username) => {
        setIsLoggedIn(true); 
        setUsername(username);
        navigate('g-captcha-react-integration/'); 
    };

    const handleLogout = () => {
        setIsLoggedIn(false); 
        setUsername('');
        localStorage.clear();
        navigate('g-captcha-react-integration/login'); 
    };

    const contextValue = {
        isLoggedIn,
        username,
        handleLogout,
        handleLogIn,
        setIsLoggedIn
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
