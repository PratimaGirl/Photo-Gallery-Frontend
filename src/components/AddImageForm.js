import React, { useState } from "react";
import axios from "axios";
import "../styles/AddForm.css";
import config from "../config/config";

const AddImageForm = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelectFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append("my_file", file);
      data.append("title", title);
      data.append("description", description);

      await axios.post(config.apiBaseUrl + `/api/images/upload`, data);
      onUpload(); // Fetch images again after upload
      onClose(); // Close the form
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    onClose(); // Close form without uploading
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Upload Image</h2>

        {/* Custom file select button */}
        <button
          onClick={() => document.getElementById("file-input").click()}
          className="btn-file"
        >
          Choose File
        </button>

        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          onChange={handleSelectFile}
          style={{ display: "none" }}
        />

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="image-preview"
          />
        )}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="form-buttons">
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="btn-green"
          >
            {loading ? "Uploading..." : "Add Image"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="btn-grey"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImageForm;
