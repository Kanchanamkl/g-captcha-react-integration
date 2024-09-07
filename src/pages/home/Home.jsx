import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import './Home.css';

const Home = () => {
  const { isLoggedIn, handleLogout, username } = useContext(AuthContext);

  return (
    <div className="home-container">
      <h1>Welcome to the Home {username}</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;