import "../styles/PhotoGallery.css";
import { useState, useEffect } from "react";
import axios from "axios";
import AddVideoForm from "./AddMediaForm";
import EditVideoForm from "./EditVideoForm";
import { useNavigate } from "react-router-dom";
import config from "../config/config";

function VideoGallery() {
  const navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null); // Selected media for modal
  const [selectedIndex, setSelectedIndex] = useState(null); // Selected index for navigating
  const [zoomLevel, setZoomLevel] = useState(1); // Media zoom level
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Media position for dragging
  const [isDragging, setIsDragging] = useState(false); // Is media being dragged
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Dragging start point

  const fetchMedia = async () => {
    try {
      const res = await axios.get(config.apiBaseUrl + "/api/media");
      setMedia(res.data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  };

  const handleDelete = async (public_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this media?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(config.apiBaseUrl + `/api/media/${public_id}`);
        fetchMedia(); // Refresh the media list
      } catch (error) {
        alert("Error deleting media: " + error.message);
      }
    }
  };

  const handleEdit = (image) => {
    setEditImage(image);
    setShowEditForm(true);
  };

  const handleMediaClick = (media, index) => {
    setSelectedMedia(media);
    setSelectedIndex(index); // Save the index of the selected media
    setZoomLevel(1); // Reset zoom level when opening new media
    setPosition({ x: 0, y: 0 }); // Reset position
    document.body.style.overflow = "hidden"; // Disable background scroll
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setSelectedMedia(null);
      document.body.style.overflow = "auto"; // Enable background scroll
    }
  };

  const handleWheel = (e) => {
    if (selectedMedia) {
      const newZoomLevel = zoomLevel + e.deltaY * -0.001; // Control zoom
      setZoomLevel(Math.max(1, newZoomLevel)); // Ensure zoom level is at least 1
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedMedia(media[newIndex]);
      setSelectedIndex(newIndex);
      setZoomLevel(1); // Reset zoom
      setPosition({ x: 0, y: 0 }); // Reset position
    }
  };

  const handleNext = () => {
    if (selectedIndex < media.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedMedia(media[newIndex]);
      setSelectedIndex(newIndex);
      setZoomLevel(1); // Reset zoom
      setPosition({ x: 0, y: 0 }); // Reset position
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <div className="App">
      <button onClick={() => navigate("/photo-gallery")} className="btn-blue">
        Back to Photo Gallery
      </button>
      <button onClick={() => setShowVideoForm(true)} className="btn-green">
        Add Video
      </button>
      {showVideoForm && (
        <AddVideoForm
          onClose={() => setShowVideoForm(false)}
          onUpload={fetchMedia}
        />
      )}
      {showEditForm && (
        <EditVideoForm
          media={editImage} // Match the prop name with EditVideoForm
          onClose={() => setShowEditForm(false)}
          onUpdate={fetchMedia}
        />
      )}

      <div className="quote">
        <p>“You never know when you’re making a memory.”</p>
      </div>
      <div className="image-gallery">
        {media.length > 0
          ? media.map((item, index) => (
              <div key={item.public_id} className="image-container">
                <video
                  width="500"
                  height="300"
                  controls
                  src={item.url}
                  alt={item.title}
                  onClick={() => handleMediaClick(item, index)}
                />
                {/* <div className="image-title">{item.title}</div> */}
                <div className="icon-container">
                  <span
                    className="material-icons edit-icon"
                    onClick={() => handleEdit(item)}
                  >
                    edit
                  </span>
                  <span
                    className="material-icons delete-icon"
                    onClick={() => handleDelete(item.public_id)}
                  >
                    delete
                  </span>
                </div>
              </div>
            ))
          : "No video uploaded yet"}
      </div>
      {/* Modal for viewing media */}
      {selectedMedia && (
        <div
          className="image-modal"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="modal-overlay" onClick={handleCloseModal}>
            {selectedIndex > 0 && (
              <button className="arrow left-arrow" onClick={handlePrevious}>
                &#9664;
              </button>
            )}
            <video
              controls
              src={selectedMedia.url}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
                position: "relative",
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            {selectedIndex < media.length - 1 && (
              <button className="arrow right-arrow" onClick={handleNext}>
                &#9654;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoGallery;
