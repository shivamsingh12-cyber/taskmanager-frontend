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
    <li style={{ marginBottom: '1rem' }}>
      {isEditing ? (
        <div>
          <input name="title" value={editData.title} onChange={handleChange} />
          <textarea name="description" value={editData.description} onChange={handleChange} />
          <input name="dueDate" type="date" value={editData.dueDate} onChange={handleChange} />
          <select name="priority" value={editData.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select name="status" value={editData.status} onChange={handleChange}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select name="assignedTo" value={editData.assignedTo} onChange={handleChange}>
      <option value="">Assign to...</option>
      {users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.name || user.email}
        </option>
      ))}
    </select>

          <button onClick={saveChanges}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <strong>{task.title}</strong> - {task.status} - {task.priority}
          <br />
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
          <br />
          Assigned To: {task.assignedTo?.name || 'N/A'}
          <br />
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={deleteTask}>Delete</button>
        </div>
      )}
    </li>
  );
}
