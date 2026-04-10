import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../style/Meeting.css';
import { JitsiMeeting } from '@jitsi/react-sdk';

const Meeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    agenda: '',
    scheduledDate: '',
    participants: []
  });
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  // Get user details from session storage
  const teamCode = sessionStorage.getItem('team_code')?.replace(/"/g, ''); // Remove quotes if present
  const userId = sessionStorage.getItem('user_id');
  const userName = sessionStorage.getItem('full_name');
  const token = sessionStorage.getItem('token');

  // Create axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: 'https://task-bridge-eyh5.onrender.com',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Fetch upcoming meetings
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!teamCode || !token) {
        throw new Error('Missing team code or authentication token');
      }

      const response = await axiosInstance.get(`/meetings/upcoming/${teamCode}`);

      if (Array.isArray(response.data)) {
        setMeetings(response.data);
      } else {
        console.error('API response is not an array:', response.data);
        setMeetings([]);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      if (error.response?.status === 401) {
        setError('Please log in again. Your session may have expired.');
      } else {
        setError('Failed to load meetings');
      }
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      if (!teamCode || !token) {
        throw new Error('Missing team code or authentication token');
      }

      const response = await axiosInstance.get(`/team/${teamCode}`);
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      if (error.response?.status === 500) {
        setError('Server error while loading team members. Please try again later.');
      } else {
        setError('Failed to load team members');
      }
    }
  };

  // Setup socket connection
  useEffect(() => {
    if (!token) {
      setError('Please log in to access meetings');
      return;
    }

    fetchMeetings();
    fetchTeamMembers();

    const newSocket = io('https://task-bridge-eyh5.onrender.com', {
      auth: {
        token: token
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [teamCode, token]);

  // Handle creating a new meeting
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/meetings/create', {
        ...newMeeting,
        team_code: teamCode,
      });

      setMeetings((prevMeetings) => [...prevMeetings, response.data.meeting]);
      setNewMeeting({
        title: '',
        agenda: '',
        scheduledDate: '',
        participants: [],
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      setError('Failed to create meeting');
    }
  };

  // Handle viewing a meeting
  const handleViewMeeting = async (meetingId) => {
    try {
      const meetingResponse = await axiosInstance.get(`/meetings/${meetingId}`);
      const chatResponse = await axiosInstance.get(`/meetings/${meetingId}/chat`);

      setSelectedMeeting(meetingResponse.data);
      setChatMessages(Array.isArray(chatResponse.data) ? chatResponse.data : []);

      if (socket) {
        socket.emit('joinMeeting', meetingId);
      }
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      setError('Failed to load meeting details');
    }
  };

  // Handle joining a meeting
  const handleJoinMeeting = async (meetingId) => {
    try {
      const response = await axiosInstance.post(`/meetings/${meetingId}/join`, {});

      if (response.data.meeting && response.data.meeting.meetingLink) {
        setSelectedMeeting(response.data.meeting);
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      setError('Failed to join meeting');
    }
  };

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMeeting && socket) {
      socket.emit('sendMessage', {
        meetingId: selectedMeeting._id,
        sender: userId,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  // Listen for new chat messages
  useEffect(() => {
    if (socket && selectedMeeting) {
      socket.on('newMessage', (message) => {
        setChatMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket, selectedMeeting]);

  // Handle participant selection
  const handleParticipantChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setNewMeeting({ ...newMeeting, participants: selectedOptions });
  };

  return (
    <div className="meeting-container">
      <div className="meeting-list">
        <h2>Upcoming Meetings</h2>
        <button onClick={() => setSelectedMeeting(null)}>Create New Meeting</button>

        {loading ? (
          <p>Loading meetings...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : meetings.length > 0 ? (
          meetings.map((meeting) => (
            <div key={meeting._id} className="meeting-item" onClick={() => handleViewMeeting(meeting._id)}>
              <h3>{meeting.title}</h3>
              <p>Date: {new Date(meeting.scheduledDate).toLocaleString()}</p>
              <p>Agenda: {meeting.agenda}</p>
            </div>
          ))
        ) : (
          <p>No upcoming meetings found</p>
        )}
      </div>

      <div className="meeting-details">
        {!selectedMeeting ? (
          <form onSubmit={handleCreateMeeting} className="create-meeting-form">
            <h2>Schedule New Meeting</h2>
            <input
              type="text"
              placeholder="Meeting Title"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Meeting Agenda"
              value={newMeeting.agenda}
              onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
              required
            />
            <input
              type="datetime-local"
              value={newMeeting.scheduledDate}
              onChange={(e) => setNewMeeting({ ...newMeeting, scheduledDate: e.target.value })}
              required
            />
            <select
              multiple
              value={newMeeting.participants}
              onChange={handleParticipantChange}
              required
            >
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.full_name} ({member.email})
                </option>
              ))}
            </select>
            <button type="submit">Schedule Meeting</button>
          </form>
        ) : (
          <div className="selected-meeting">
            <h2>{selectedMeeting.title}</h2>
            <p>Date: {new Date(selectedMeeting.scheduledDate).toLocaleString()}</p>
            <p>Agenda: {selectedMeeting.agenda}</p>
            <p>
              Meeting Link:{' '}
              <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer">
                Join Meeting
              </a>
            </p>

            {selectedMeeting.participants && !selectedMeeting.participants.some((p) => p._id === userId) && (
              <button onClick={() => handleJoinMeeting(selectedMeeting._id)}>Join Meeting</button>
            )}

            <div className="video-meeting-container">
              <JitsiMeeting
                roomName={selectedMeeting.title.replace(/\s+/g, '-')}
                configOverwrite={{
                  disableThirdPartyRequests: true, // Disable Gravatar and other third-party requests
                  startWithAudioMuted: true,
                  startWithVideoMuted: true,
                  prejoinPageEnabled: false,
                  disableModeratorIndicator: true,
                }}
                userInfo={{
                  displayName: userName,
                  email: JSON.parse(sessionStorage.getItem('user'))?.email,
                }}
                jwt={token}
                getIFrameRef={(iframeRef) => {
                  iframeRef.style.height = '600px';
                }}
              />
            </div>

            <div className="meeting-chat">
              <h3>Meeting Chat</h3>
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${msg.sender && msg.sender._id === userId ? 'sent' : 'received'}`}
                  >
                    <strong>{msg.sender && msg.sender.full_name ? msg.sender.full_name : 'Unknown User'}</strong>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meeting;