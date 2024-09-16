import { useState } from "react";
import axios from "axios";
import "../styles/AddForm.css";
import config from "../config/config";

const AddVideoForm = ({ onClose, onUpload }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("my_file", videoFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setLoading(true);
      await axios.post(config.apiBaseUrl + `/api/media/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onUpload(); // Fetch videos after upload
      onClose(); // Close the form after upload
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVideoFile(null);
    setTitle("");
    setDescription("");
    onClose(); // Close form without uploading
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Upload Video</h2>
        {/* <label>Video Title</label> */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {/* <label>Video Description</label> */}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Custom File Input */}
        <label htmlFor="file-input" className="btn-file">
          Select Video File
        </label>
        <input
          id="file-input"
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          required
          style={{ display: "none" }} // Hide the default file input
        />
        {videoFile && (
          <div className="video-preview-container">
            <video
              className="video-preview"
              src={URL.createObjectURL(videoFile)}
              controls
              width="300"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <button
          onClick={handleVideoUpload}
          disabled={!videoFile || loading}
          className="btn-green"
        >
          {loading ? "Uploading..." : "Add Video"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="btn-grey"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddVideoForm;
