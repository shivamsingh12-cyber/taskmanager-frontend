import {useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

export default function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedTo?._id || '',
  });
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    if (isEditing) {
      axios.get('/users') // Make sure this endpoint exists
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [isEditing]);

 // Fetch users when the component mounts
 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users'); // Adjust the endpoint as needed
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };
  fetchUsers();
}, []); // This will only run once when the component mounts


  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put(`/tasks/${task._id}`, editData);
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      alert("You can't edit this task only creator can edit this task");
    }
  };

  const deleteTask = async () => {
    if (!confirm('Are you sure?')) return;
  
    try {
      console.log('Deleting task with ID:', task._id);
      await axios.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Only the task creator can delete this task.");
      } else {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };



  return (
    <li style={{ 
      marginBottom: '2rem', 
      padding: '1rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      backgroundColor: '#f9f9f9' 
    }}>
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ color: 'black' }}>
            <strong>Title:</strong>
            <input 
              name="title" 
              value={editData.title} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </label>
    
          <label style={{ color: 'black' }}>
            <strong>Description:</strong>
            <textarea 
              name="description" 
              value={editData.description} 
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </label>
    
          <label style={{ color: 'black' }}>
            <strong>Due Date:</strong>
            <input 
              name="dueDate" 
              type="date" 
              value={editData.dueDate} 
              onChange={handleChange}
              style={{ padding: '0.5rem' }}
            />
          </label>
    
          <label style={{ color: 'black' }}>
            <strong>Priority:</strong>
            <select 
              name="priority" 
              value={editData.priority} 
              onChange={handleChange}
              style={{ padding: '0.5rem' }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
    
          <label style={{ color: 'black' }}>
            <strong>Status:</strong>
            <select 
              name="status" 
              value={editData.status} 
              onChange={handleChange}
              style={{ padding: '0.5rem' }}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </label>
    
          <label style={{ color: 'black' }}>
            <strong>Assigned To:</strong>
            <select 
              name="assignedTo" 
              value={editData.assignedTo} 
              onChange={handleChange}
              style={{ padding: '0.5rem' }}
            >
              <option value="">Assign to...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </label>
    
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={saveChanges} 
              style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              💾 Save
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              ✖ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 style={{ marginBottom: '0.5rem', color: 'black' }}>{task.title}</h3>
          <p style={{ color: 'black' }}><strong>Status:</strong> {task.status} | <strong>Priority:</strong> {task.priority}</p>
          <p style={{ color: 'black' }}><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
          <p style={{ color: 'black' }}><strong>Assigned To:</strong> {task.assignedTo?.name || 'N/A'}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button 
              onClick={() => setIsEditing(true)} 
              style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              ✏️ Edit
            </button>
            <button 
              onClick={deleteTask} 
              style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      )}
    </li>
    
  );
}
