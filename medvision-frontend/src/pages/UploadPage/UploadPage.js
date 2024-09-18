import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '../../components/Sidebar/Sidebar'; // Assuming you have a Sidebar component
import './UploadPage.css'; // Add appropriate styling

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Use react-dropzone to manage file drop and selection
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    }
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please upload a CT scan image!');
      return;
    }

    // Create form data to submit the file
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Make a POST request to upload the image (you need to set up this endpoint)
    fetch('http://localhost:8000/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded successfully:', data);
        alert('File uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div className="upload-page-container">
      <Sidebar /> {/* Assuming you have the Sidebar component */}
      <div className="upload-content">
        <h1>Upload CT Scan</h1>
        <div className="dropzone" {...getRootProps()}>
          <input {...getInputProps()} />
          {selectedFile ? (
            <p>{selectedFile.name}</p>
          ) : (
            <p>Upload the CT Scan here</p>
          )}
        </div>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default UploadPage;
