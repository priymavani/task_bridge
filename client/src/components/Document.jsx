
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Document.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Ui/Enter';

const Document = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const navigate = useNavigate();
  const team_code = sessionStorage.getItem('team_code');
  console.log(team_code)
  const token = sessionStorage.getItem('token');

  // API Configuration
  const api = axios.create({
    baseURL: 'https://task-bridge-eyh5.onrender.com/file',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch folders, documents, and team members
  useEffect(() => {
    // fetchFolders();
    fetchDocuments();
    fetchTeamMembers();
  }, []);

  // const fetchFolders = async () => {
  //   try {
  //     const response = await api.get(`/folder/${team_code}`);
  //     setFolders(response.data);
  //   } catch (err) {
  //     setError('Error fetching folders');
  //     toast.error('Error fetching folders');
  //     console.error(err);
  //   }
  // };

  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/team/${team_code}`);
      console.log('API Response:', response.data); // Debugging: Log the response

      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        setFiles(response.data);
      } else {
        throw new Error('Invalid response format: Expected an array');
      }
    } catch (err) {
      setError('Error fetching documents');
      toast.error('Error fetching documents');
      console.error('Error details:', err.response?.data || err.message);

      // Reset files to an empty array in case of error
      setFiles([]);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
      if (response.data && Array.isArray(response.data)) {
        setTeamMembers(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      // toast.error('Failed to fetch team members. Please try again.');
    }
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('team_code', team_code);
    if (currentFolder) {
      formData.append('folder_id', currentFolder);
    }

    setIsUploading(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Ensure `uploaded_by` is included in the response
      if (!response.data.uploaded_by) {
        throw new Error('Uploaded by information missing in response');
      }

      setFiles([...files, response.data]);
      toast.success('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error(err.response?.data?.message || 'Error uploading file');
    } finally {
      fetchDocuments();
      setIsUploading(false);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setIsDeleting(true);
      try {
        await api.delete(`/${id}`);
        setFiles(files.filter((file) => file._id !== id));
        toast.success('File deleted successfully!');
      } catch (err) {
        setError('Error deleting document');
        toast.error(err.response?.data?.message || 'Error deleting document');
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Open share modal and set selected file
  const openShareModal = (fileId) => {
    setSelectedFileId(fileId);
    setShowShareModal(true);
  };

  // Handle sharing a file
  const handleShare = async () => {
    if (!selectedMember) {
      toast.error('Please select a team member!');
      return;
    }

    setIsSharing(true);
    try {
      const response = await api.post(`/${selectedFileId}/share`,
        { user_id: selectedMember },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setFiles(files.map((file) => (file._id === selectedFileId ? response.data : file)));
      toast.success('File shared successfully!');
      setShowShareModal(false);
    } catch (err) {
      console.error('Error sharing document:', err);
      toast.error(err.response?.data?.message || 'Error sharing document');
    } finally {
      fetchDocuments();
      setIsSharing(false);
    }
  };

  return (
    <div className="document-container">
      {/* Header Section */}
      <div className="document-header">
        <button className="home-btn" onClick={() => navigate('/home')}>
          Home
        </button>
        <h1>Document Management</h1>
        <div className="header-actions">
          <label className="upload-button">
            {isUploading ? <Loader /> : 'Upload File'}
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Folder Structure */}
      <div className="folder-structure">
        <div className="folders-grid">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="folder-card"
              onClick={() => setCurrentFolder(folder._id)}
            >
              <div className="folder-icon">📁</div>
              <div className="folder-info">
                <h3>{folder.name}</h3>
                <p>Created by: {folder.created_by.full_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="files-section">
        <h2>Files</h2>
        <table className="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Uploaded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </td>
                <td>{(file.size / 1024).toFixed(2)} KB</td>
                <td>
                  {file.uploaded_by?.full_name} {/* Fallback to 'Unknown' if name is missing */}
                </td>
                <td>
                  <div className="file-actions">
                    <button onClick={() => handleDelete(file._id)} disabled={isDeleting}>
                      {isDeleting ? <Loader /> : 'Delete'}
                    </button>
                    <button onClick={() => openShareModal(file._id)}>Share</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select a Team Member to Share</h3>
            <select onChange={(e) => setSelectedMember(e.target.value)} defaultValue="">
              <option value="" disabled>Select Member</option>
              {teamMembers
                .filter(member =>
                  member._id !== files.find(file => file._id === selectedFileId)?.uploaded_by?._id &&  // Exclude uploader
                  !files.find(file => file._id === selectedFileId)?.shared_with?.includes(member._id) // Exclude shared members
                )
                .map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.full_name}
                  </option>
                ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleShare} disabled={isSharing}>
                {isSharing ? <Loader /> : 'Share'}
              </button>
              <button onClick={() => setShowShareModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Document;

