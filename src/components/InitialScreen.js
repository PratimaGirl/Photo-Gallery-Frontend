import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InitialScreen.css';
import portraitImage from '../images/IMG-20240204-WA0116.jpg';

const InitialScreen = () => {
  const navigate = useNavigate();

  const handlePress = () => {
    navigate('/birthday-message');
  };

  return (
    <div className="initial-container">
      <img  src={portraitImage} alt="Portrait" className="portrait-image" />
      <button className="press-button" onClick={handlePress}>My Gallery</button>
    </div>
  );
};

export default InitialScreen;
