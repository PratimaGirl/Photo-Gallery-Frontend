import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/birthdayMessage.css'; // Import the CSS file

const BirthdayMessage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      document.querySelector('.sparkle').classList.toggle('active');
    }, 1000); // Toggle sparkle effect every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleSurpriseClick = () => {
    navigate('/photo-gallery');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="birthday-container">
      <h1 className="birthday-title sparkle">Gaurav Tandel</h1>
      <button className="birthday-button" onClick={handleSurpriseClick}>
        Let's move to Memory Lane!
      </button>
      <button className="birthday-back-button" onClick={handleBackClick}>
        Want to go back?
      </button>
    </div>
  );
};

export default BirthdayMessage;
