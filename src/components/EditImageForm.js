import "../styles/EditForm.css";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";

function EditImageForm({ image, onClose, onUpdate }) {
  const [title, setTitle] = useState(image?.title || "");
  const [description, setDescription] = useState(image?.description || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(image?.url || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      setTitle(image.title || "");
      setDescription(image.description || "");
      setPreviewUrl(image.url || "");
    }
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
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
        config.apiBaseUrl + `/api/images/${image.public_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdate(); // Refresh the images
      onClose(); // Close the form
    } catch (error) {
      alert("Error updating image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-overlay">
      <div className="edit-form">
        <h2>Edit Image Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <br></br>
            <input
              type="text"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <br></br>
          <label>
            Description:
            <textarea
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
          <br></br>
          <label className="edit-btn-file ">
            {/* <button type="submit" className="edit-btn-file "> */} Choose New
            Image: {/* </button> */}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="edit-image-preview"
            />
          )}
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className="btn-green"
          >
            {loading ? "Updating..." : "Update Image"}
          </button>
          <button type="button" onClick={onClose} className="btn-grey">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditImageForm;
