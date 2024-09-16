import "../styles/PhotoGallery.css";
import { useState, useEffect } from "react";
import axios from "axios";
import AddImageForm from "./AddImageForm";
import EditImageForm from "./EditImageForm";
import { useNavigate } from "react-router-dom";
import config from "../config/config";

function PhotoGallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null); // Selected image for modal
  const [selectedIndex, setSelectedIndex] = useState(null); // Selected index for navigating
  const [zoomLevel, setZoomLevel] = useState(1); // Image zoom level
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Image position for dragging
  const [isDragging, setIsDragging] = useState(false); // Is image being dragged
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Dragging start point

  const fetchImages = async () => {
    try {
      const res = await axios.get(config.apiBaseUrl +"/api/images");
      setImages(res.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const handleDelete = async (public_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(config.apiBaseUrl +`/api/images/${public_id}`);
        fetchImages(); // Refresh the image list
      } catch (error) {
        alert("Error deleting image: " + error.message);
      }
    }
  };

  const handleEdit = (image) => {
    setEditImage(image);
    setShowEditForm(true);
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index); // Save the index of the selected image
    setZoomLevel(1); // Reset zoom level when opening a new image
    setPosition({ x: 0, y: 0 }); // Reset position
    document.body.style.overflow = "hidden"; // Disable background scroll
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setSelectedImage(null);
      document.body.style.overflow = "auto"; // Enable background scroll
    }
  };

  const handleWheel = (e) => {
    if (selectedImage) {
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
      setSelectedImage(images[newIndex]);
      setSelectedIndex(newIndex);
      setZoomLevel(1); // Reset zoom
      setPosition({ x: 0, y: 0 }); // Reset position
    }
  };

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedImage(images[newIndex]);
      setSelectedIndex(newIndex);
      setZoomLevel(1); // Reset zoom
      setPosition({ x: 0, y: 0 }); // Reset position
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      <button
        onClick={() => navigate("/birthday-message")}
        className="btn-blue"
      >
        Back
      </button>
      <button onClick={() => setShowForm(true)} className="btn-green">
        Add Image
      </button>
      {showForm && (
        <AddImageForm
          onClose={() => setShowForm(false)}
          onUpload={fetchImages}
        />
      )}
      {showEditForm && (
        <EditImageForm
          image={editImage}
          onClose={() => setShowEditForm(false)}
          onUpdate={fetchImages}
        />
      )}
      <button
        onClick={() => navigate("/video-gallery")}
        className="btn-blue-video"
      >
        Move to Video Gallery
      </button>
      <div className="quote">
        <p>
          “A picture is worth a thousand words but the memories are priceless.”
        </p>
      </div>
      <div className="image-gallery">
        {images.length > 0
          ? images.map((image, index) => (
              <div key={image._id} className="image-container">
                <img
                  src={image.url}
                  alt="uploaded"
                  className="uploaded-image"
                  onClick={() => handleImageClick(image, index)}
                />
                <div className="image-title">{image.title}</div>
                <div className="icon-container">
                  <span
                    className="material-icons edit-icon"
                    onClick={() => handleEdit(image)}
                  >
                    edit
                  </span>
                  <span
                    className="material-icons delete-icon"
                    onClick={() => handleDelete(image.public_id)}
                  >
                    delete
                  </span>
                </div>
              </div>
            ))
          : "No images uploaded yet"}
      </div>

      {/* Modal for viewing selected image */}
      {selectedImage && (
        <div
          className="image-modal"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="modal-overlay" onClick={handleCloseModal}>
            {/* Previous arrow */}
            {selectedIndex > 0 && (
              <button className="arrow left-arrow" onClick={handlePrevious}>
                &#9664;
              </button>
            )}

            {/* Image */}
            <img
              src={selectedImage.url}
              alt="selected"
              className="modal-image"
              style={{
                transform: `scale(${zoomLevel})`,
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            />

            {/* Next arrow */}
            {selectedIndex < images.length - 1 && (
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

export default PhotoGallery;
