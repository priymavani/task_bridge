import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Task.css";
import { Link } from 'react-router-dom';
import TeamLoader from "../Ui/Enter";
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedCommitType, setSelectedCommitType] = useState({});
    const [commentText, setCommentText] = useState({});
    const [expandedTask, setExpandedTask] = useState(null);
    const [newTask, setNewTask] = useState({ 
        title: "", description: "", priority: "normal", label: "", assignedMembers: [], date: "" 
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = sessionStorage.getItem("token");
    const teamCode = (sessionStorage.getItem("team_code"));
    const userRole = JSON.parse(sessionStorage.getItem("role"));
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        fetchTasks();
        fetchTeamMembers();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://task-bridge-eyh5.onrender.com/task/${teamCode}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks. Please try again."); // Toast for error
        }
        setLoading(false);
    };

    const fetchTeamMembers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${teamCode}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeamMembers(response.data);
        } catch (error) {
            console.error("Error fetching team members:", error);
            toast.error("Failed to fetch team members. Please try again."); // Toast for error
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleMemberSelection = (memberId) => {
        setNewTask(prevState => {
            const updatedMembers = prevState.assignedMembers.includes(memberId)
                ? prevState.assignedMembers.filter(id => id !== memberId)
                : [...prevState.assignedMembers, memberId];
            return { ...prevState, assignedMembers: updatedMembers };
        });
    };

    const handleCommitChange = (taskId, type) => {
        setSelectedCommitType(prev => ({ ...prev, [taskId]: type }));
        if (type !== "commented") {
            setCommentText(prev => ({ ...prev, [taskId]: "" }));
        }
    };

    const handleCommit = async (taskId) => {
        if (!user || !user.full_name) {
            toast.error("User data is not available. Please log in again."); // Toast for error
            return;
        }

        const commitType = selectedCommitType[taskId] || "started";
        const text = commentText[taskId]?.trim() || `Marked as ${commitType}`;
        const activity = commentText[taskId]?.trim() || `Marked as ${commitType}`;

        if (!text) {
            toast.error("Commit text cannot be empty!"); // Toast for error
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `https://task-bridge-eyh5.onrender.com/task/${taskId}/comments`,
                {
                    type: commitType,
                    activity,
                },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success(`Commit of ${commitType} added successfully!`); // Toast for success
                fetchTasks();
            } else {
                toast.error(`Failed to add commit of ${commitType}.`); // Toast for error
            }
        } catch (error) {
            console.error("Error adding commit:", error.response?.data || error.message);
            toast.error(`Error updating commit: ${error.response?.data?.message || "Please try again."}`); // Toast for error
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newTask.title.trim() || !newTask.description.trim()) {
            toast.error("Task title and description are required!"); // Toast for error
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `https://task-bridge-eyh5.onrender.com/task`,
                {
                    team_code: teamCode,
                    title: newTask.title.trim(),
                    description: newTask.description.trim(),
                    priority: newTask.priority,
                    label: newTask.label.trim(),
                    date: new Date(newTask.date).toISOString(),
                    assignedMembers: newTask.assignedMembers,
                },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            if (response.status === 201) {
                toast.success("Task added successfully!"); // Toast for success
                fetchTasks();
                setNewTask({ title: "", description: "", priority: "normal", label: "", assignedMembers: [], date: "" });
            } else {
                toast.error("Failed to add task."); // Toast for error
            }
        } catch (error) {
            console.error("Error adding task:", error.response?.data || error.message);
            toast.error(`Error adding task: ${error.response?.data?.message || "Please try again."}`); // Toast for error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        setLoading(true);
        try {
            await axios.delete(`https://task-bridge-eyh5.onrender.com/task/delete/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Task deleted successfully!"); // Toast for success
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error("Failed to delete task. Please try again."); // Toast for error
        }
        setLoading(false);
    };

    const handleStageUpdate = async (taskId, newStage) => {
        setLoading(true);
        try {
            await axios.patch(`https://task-bridge-eyh5.onrender.com/task/${taskId}`, { stage: newStage }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, stage: newStage } : task
                )
            );
            toast.success(`Task stage updated successfully to ${newStage}!`); // Toast for success
        } catch (error) {
            console.error('Error updating task stage:', error);
            toast.error("Failed to update task stage. Please try again."); // Toast for error
        }
        setLoading(false);
    };

    return (
        <div className="task-details-container">
            <Link className="home-btn1" to='/home'>
                Home
            </Link>
            {loading && <TeamLoader />}
            <ToastContainer /> {/* Add ToastContainer to render toasts */}

            <div className="task-details-header">
                <h2>Task Management</h2>
            </div>

            {userRole === "admin" && (
                <form className="task-creation-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <textarea 
                            name="description"
                            className="form-textarea"
                            placeholder="Task Description"
                            value={newTask.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-label">Priority</div>
                            <select 
                                name="priority"
                                className="form-select"
                                value={newTask.priority}
                                onChange={handleChange}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="normal">Normal</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div className="form-label">Label</div>
                            <select 
                                name="label"
                                className="form-select"
                                value={newTask.label}
                                onChange={handleChange}
                            >
                                <option value="research">Research</option>
                                <option value="design">Design</option>
                                <option value="content">Content</option>
                                <option value="planning">Planning</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div className="form-label">Due Date</div>
                            <input 
                                type="date"
                                name="date"
                                className="form-input"
                                value={newTask.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="member-assignment-section">
                        <h3>Assign to Members</h3>
                        <div className="member-list">
                            {teamMembers.length > 0 ? teamMembers.map(member => (
                                <div key={member._id} className="member-item">
                                    <label htmlFor={member._id}>{member.full_name}</label>
                                    <input 
                                        type="checkbox"
                                        id={member._id}
                                        checked={newTask.assignedMembers.includes(member._id)}
                                        onChange={() => handleMemberSelection(member._id)}
                                    />
                                </div>
                            )) : <p>No team members available</p>}
                        </div>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Adding..." : "Add Task"}
                    </button>
                </form>
            )}

            <div className="lable-indicator"> 
                Status 
                <div className="lable-circle lable-todo">todo</div>
                <div className="lable-circle lable-progress">in progress</div>
                <div className="lable-circle lable-review">Review</div>
                <div className="lable-circle lable-done">Done</div>
            </div>

            <div className="task-list">
                {tasks.length > 0 ? tasks.map((task) => (
                    <div 
                        key={task._id} 
                        className="task-card"
                        data-status={task.stage}
                    >
                        <div className="task-header">
                            <h2 className="task-title1">{task.title}</h2>
                            <div className="task-badges">
                                <span className={`priority-badge ${task.priority}`}>
                                    {task.priority}
                                </span>
                                <span className="label-badge">{task.label}</span>
                            </div>
                        </div>

                        <div className="task-body">
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                                <p className="gap-margin"><strong>Due Date:</strong> {formatDate(task.date)}</p>
                                <div className="task-status">
                                    <strong>Status:</strong>
                                    <select 
                                        className="status-select"
                                        value={task.stage}
                                        onChange={(e) => handleStageUpdate(task._id, e.target.value)}
                                    >
                                        <option value="todo">Todo</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="task-actions">
                            {userRole === 'admin' && (
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(task._id)}
                                >
                                    Delete
                                </button>
                            )}
                            <button 
                                className="details-button"
                                onClick={() => setExpandedTask(task._id === expandedTask ? null : task._id)}
                            >
                                {expandedTask === task._id ? "Hide Details" : "View Details"}
                            </button>
                        </div>

                        {expandedTask === task._id && (
                            <div className="task-details">
                                <div className="activity-section">
                                    <h4>Task Activity</h4>
                                    {task.activities?.length > 0 || task.comments?.length > 0 ? (
                                        <ul className="activity-list">
                                            {[...(task.activities || []), ...(task.comments || [])]
                                                .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
                                                .map((activity, index) => {
                                                    const userInfo = teamMembers.find(member => 
                                                        member._id === (activity.by || activity.user)
                                                    );
                                                    
                                                    return (
                                                        <li key={index} className="activity-item">
                                                            <div className="activity-header">
                                                                <strong>{userInfo ? userInfo.full_name : "Unknown User"}</strong>
                                                                <span className="activity-type">({activity.type})</span>
                                                            </div>
                                                            <p className="activity-text">{activity.activity || activity.text}</p>
                                                            <span className="activity-date">
                                                                {formatDate(activity.date || activity.createdAt)}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    ) : (
                                        <p className="no-activity">No activity recorded yet.</p>
                                    )}
                                </div>

                                <div className="commit-section">
                                    <h4>Add Activity</h4>
                                    <div className="commit-options">
                                        {["started", "in progress", "bug", "completed", "commented"].map(type => (
                                            <label key={type} className="commit-option">
                                                <input 
                                                    type="radio"
                                                    name={`commit-${task._id}`}
                                                    value={type}
                                                    checked={selectedCommitType[task._id] === type}
                                                    onChange={() => handleCommitChange(task._id, type)}
                                                />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {selectedCommitType[task._id] && (
                                        <textarea 
                                            className="commit-textarea"
                                            placeholder="Enter activity details..."
                                            value={commentText[task._id] || ""}
                                            onChange={(e) => setCommentText(prev => ({ 
                                                ...prev, [task._id]: e.target.value 
                                            }))}
                                        ></textarea>
                                    )}

                                    <button 
                                        className="commit-button"
                                        onClick={() => handleCommit(task._id)}
                                    >
                                        Add Activity
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <p className="no-tasks">No tasks available</p>
                )}
            </div>
        </div>
    );
};

export default Task;