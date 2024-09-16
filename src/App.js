import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InitialScreen from './components/InitialScreen';
import BirthdayMessage from './components/BirthdayMessage';
import PhotoGallery from './components/PhotoGallery';
import VideoGallery from './components/VideoGallery';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InitialScreen />} />
      <Route path="/birthday-message" element={<BirthdayMessage />} />
      <Route path="/photo-gallery" element={<PhotoGallery />} />
      <Route path="/video-gallery" element={<VideoGallery />} />
    </Routes>
  );
}

export default App;
