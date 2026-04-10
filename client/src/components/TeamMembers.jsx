import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip, Modal, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enter from '../Ui/Enter';
import profile from '../assets/home_/profile_i.png';
import { mkConfig, generateCsv, download } from 'export-to-csv'; // For CSV export
import '../style/TeamMembers.css';

const TeamMembers = () => {
  const team_code = sessionStorage.getItem('team_code')?.replace(/['"]+/g, '');
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    email: '',
    role: '',
    password: '',
    team_code: `${team_code}`,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false); // For file format modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // For export modal
  const [fileName, setFileName] = useState(''); // For export file name

  // CSV Export Configuration
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  // Fetch team members
  useEffect(() => {
    const fetchMembers = async () => {
      if (!team_code) {
        setError('No team code found');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (Array.isArray(response.data)) {
          setMembers(response.data);
          setError(null);
        } else {
          setMembers([]);
          setError('No team members found');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error(error.response?.data?.message || 'Error fetching team members');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [team_code]);

  // Handle Export to CSV
  const handleExportData = () => {
    setIsExportModalOpen(true); // Open the custom modal
  };

  // Handle Export Confirmation
  const handleExportConfirm = () => {
    if (!fileName) {
      toast.error('Please enter a file name');
      return;
    }

    const filteredData = members.map((member) => ({
      full_name: member.full_name,
      title: member.title,
      email: member.email,
      role: member.role,
    }));

    const csv = generateCsv(csvConfig)(filteredData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExportModalOpen(false); // Close the modal
    setFileName(''); // Reset the file name input
  };

  // Handle Import from CSV
  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map((row) => row.split(','));

      const headers = rows[0].map((header) => header.trim());
      const data = rows.slice(1).map((row) => {
        return headers.reduce((obj, header, index) => {
          obj[header] = row[index].trim();
          return obj;
        }, {});
      });

      if (!data.length) {
        toast.error('No valid data found in the CSV file');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          'https://task-bridge-eyh5.onrender.com/team/import-members',
          { team_code, members: data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          toast.success('Members imported successfully!');
          const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          setMembers(updatedMembersResponse.data);
        } else {
          toast.error(response.data.message || 'Failed to import members');
        }
      } catch (error) {
        console.error('Error importing members:', error);
        toast.error(error.response?.data?.message || 'Error importing members');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  // Handle Adding a User
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.role || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsAddingUser(true);
    setLoading(true);
    try {
      const userData = {
        team_code: team_code,
        full_name: formData.full_name.trim(),
        title: formData.title.trim(),
        email: formData.email.toLowerCase().trim(),
        role: formData.role.toLowerCase(),
        password: formData.password,
      };

      const response = await axios.post('https://task-bridge-eyh5.onrender.com/team/new_user', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
      setMembers(updatedMembersResponse.data);

      setIsAddModalOpen(false);
      setFormData({
        full_name: '',
        title: '',
        email: '',
        role: '',
        password: '',
        team_code: team_code,
      });
      setError('');
      toast.success('User added successfully!');
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error(err.response?.data?.message || 'Failed to add user. Please try again.');
    } finally {
      setIsAddingUser(false);
      setLoading(false);
    }
  };

  // Handle Editing a User
  const handleEditUser = async (userData) => {
    if (!selectedUser) {
      toast.error('No user selected for editing.');
      return;
    }

    setUpdating(true);
    setLoading(true);

    try {
      const response = await axios.patch(
        `https://task-bridge-eyh5.onrender.com/team/user/${selectedUser.full_name}/${team_code}/edit`,
        userData
      );

      const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
      setMembers(updatedMembersResponse.data);

      toast.success('User updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Error updating user');
    } finally {
      setUpdating(false);
      setLoading(false);
    }
  };

  // Handle Deleting a User
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      setLoading(true);
      try {
        await axios.delete(`https://task-bridge-eyh5.onrender.com/team/user/${user.full_name}/${team_code}/delete`);

        const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
        setMembers(updatedMembersResponse.data);

        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.response?.data?.message || 'Error deleting user');
      } finally {
        setLoading(false);
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Full Name',
      },
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Box>
            <IconButton onClick={() => openEditModal(row.original)}>
              <Tooltip className="edit-btn" title="Edit">
                <span>Edit</span>
              </Tooltip>
            </IconButton>
            <IconButton onClick={() => handleDeleteUser(row.original)}>
              <Tooltip className="delete-btn" title="Delete">
                <span>Delete</span>
              </Tooltip>
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );


  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };
  return (
    <div className="container">
      <div className="header">
        <button className="home-btn" onClick={() => navigate('/home')}>
          Home
        </button>
        <h2>Team Members</h2>
        <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)}>
          Add Member
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleImportData}
          style={{ display: 'none' }}
          id="import-csv"
        />
        <label htmlFor="import-csv">
          <Button variant="contained" color="secondary" component="span">
            Import from CSV
          </Button>
        </label>
        <Button
          variant="contained"
          color="info"
          onClick={() => setIsFormatModalOpen(true)}
          style={{ marginLeft: '10px' }}
        >
          File Format Details
        </Button>
      </div>

      {loading && <Enter />}
      <ToastContainer />

      {error && <p className="error-message">{error}</p>}

      <MaterialReactTable
        columns={columns}
        data={members}
        enableRowSelection
        enableSorting
        enableColumnFilters
        enablePagination
        enableColumnResizing
        initialState={{ density: 'compact' }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
            <Button color="primary" onClick={handleExportData} variant="contained">
              Export to CSV
            </Button>
          </Box>
        )}
      />

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <EditUserForm
              user={selectedUser}
              onSubmit={handleEditUser}
              onCancel={closeEditModal}
              updating={updating}
            />
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Team Member</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleAddUser} className="form-container">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                className="form-input"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isAddingUser}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {isAddingUser ? <Enter /> : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Format Details Modal */}
      <Modal
        open={isFormatModalOpen}
        onClose={() => setIsFormatModalOpen(false)}
        aria-labelledby="file-format-modal"
        aria-describedby="file-format-details"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            CSV File Format
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p><strong>Required Fields:</strong></p>
            <ul>
              <li>Full Name</li>
              <li>Email</li>
              <li>Role (admin/member)</li>
            </ul>
            <p><strong>Optional Fields:</strong></p>
            <ul>
              <li>Title</li>
            </ul>
          </Typography>
          <Typography variant="body1" gutterBottom>
            <a
              href="/example_team_members.csv"
              download="example_team_members.csv"
              style={{ color: 'primary', textDecoration: 'underline' }}
            >
              Download Example CSV
            </a>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsFormatModalOpen(false)}
            style={{ marginTop: '10px' }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Export File Name Modal */}
      {isExportModalOpen && (
        <div className="export-modal-overlay">
          <div className="export-modal">
            <h3>Export Team Members</h3>
            <p>Enter a name for the exported CSV file:</p>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="File Name"
              className="export-input"
            />
            <div className="export-modal-buttons">
              <button
                className="export-cancel-btn"
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="export-confirm-btn"
                onClick={handleExportConfirm}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EditUserForm = ({ user, onSubmit, onCancel, updating }) => {
  if (!user) {
    return <p>No user selected for editing.</p>;
  }

  const [formData, setFormData] = useState({
    full_name: user.full_name,
    title: user.title || '',
    email: user.email || '',
    role: user.role || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {updating && <Enter />}
      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        required
        readOnly
        className="form-input"
      />
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="form-input"
      />
      <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
        required
        className="form-input"
      />
      <div className="form-buttons">
        <button type="button" onClick={onCancel} className="cancel-btn" disabled={updating}>
          Cancel
        </button>
        <button type="submit" className="submit-btn" disabled={updating}>
          {updating ? 'Updating...' : 'Update User'}
        </button>
      </div>
    </form>
  );
};

export default TeamMembers;