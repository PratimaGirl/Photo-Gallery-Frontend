import "../styles/EditForm.css";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";

function EditVideoForm({ media, onClose, onUpdate }) {
  const [title, setTitle] = useState(media?.title || "");
  const [description, setDescription] = useState(media?.description || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(media?.url || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (media) {
      setTitle(media.title || "");
      setDescription(media.description || "");
      setPreviewUrl(media.url || "");
    }
  }, [media]); // Ensure media is being watched for changes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set preview URL for the new video
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (selectedFile) {
        formData.append("my_file", selectedFile);
      }

      await axios.put(
        config.apiBaseUrl + `/api/media/${media.public_id}`, // Update video URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdate(); // Refresh the videos after updating
      onClose(); // Close the form
    } catch (error) {
      alert("Error updating video: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-overlay">
      <div className="edit-form">
        <h2>Edit Video Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <br />
            <input
              type="text"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <br />
          <label>
            Description:
            <textarea
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
          <br />
          <label className="edit-btn-file">
            {" "}
            Choose New Video:{" "}
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </label>
          {/* Video Preview */}
          {previewUrl && (
            <video
              src={previewUrl}
              controls
              className="edit-image-preview"
              style={{ width: "100%", height: "auto" }}
            />
          )}
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className="btn-green"
          >
            {loading ? "Updating..." : "Update Video"}
          </button>
          <button type="button" onClick={onClose} className="btn-grey">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditVideoForm;
