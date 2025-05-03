import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useRouter } from 'next/router';
import TaskItem from '../components/TaskItem';


export default function Dashboard() {
  const router = useRouter(); // Initialize router
    // Auth check
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }
          const res = await axios.get('/auth/check-auth'); // Your API endpoint to check if the user is authenticated
          if (!res.data.isAuthenticated) {
            router.push('/login'); // Redirect to login if not authenticated
          } else {
            setUserData(res.data.user);
          }
        } catch (error) {
          router.push('/login'); // Redirect on error (e.g., network failure)
        } finally {
          setLoading(false);
        }
      };
  
      checkAuthStatus();
    }, [router]);
  

  

  const [tasks, setTasks] = useState([]);


  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    assignedTo: '',
  });



  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get('/users').then((res) => setUsers(res.data));
  }, []);

  const [notifications, setNotifications] = useState([]);

  
  const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [priorityFilter, setPriorityFilter] = useState('');
const [dueDateFilter, setDueDateFilter] = useState('');
  // const router = useRouter();

  // const fetchTasks = async () => {
  //   try {
  //     const res = await axios.get('/tasks');
  //     setTasks(res.data);

  //     const handleTaskUpdated = (updated) => {
  //       setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  //     };
    
  //     const handleTaskDeleted = (id) => {
  //       setTasks((prev) => prev.filter((t) => t._id !== id));
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     alert('Session expired. Please login again.');
  //     localStorage.removeItem('token');
  //     router.push('/login');
  //   }
  // };
 
  const fetchTasks = async () => {
    try {
      const params = {};
  
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (dueDateFilter) params.dueDate = dueDateFilter;
  
      const res = await axios.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      router.push('/login');
    }
  };
  

  const fetchNotifications = async (token) => {
    try {
      const res = await axios.get('/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(res.data);  // Set notifications in state
    } catch (err) {
      console.error('Error loading notifications', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchTasks();
    if (token) {
      fetchNotifications(token);
    }
  }, [searchTerm, statusFilter, priorityFilter, dueDateFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users'); // backend route to get all users
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks', form);
      setForm({ title: '', description: '', dueDate: '', priority: 'Low' });
      fetchTasks(); // refresh task list
    } catch (err) {
      alert('Error creating task');
    }
  };
  const handleDelete = (taskId) => {
    setTasks(tasks.filter((t) => t._id !== taskId));
  };
  
  const handleUpdate = (updatedTask) => {
    setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };  

  

  return (
    <div style={{ padding: '2rem' }}>
<div style={{ backgroundColor: '#007bff', color: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h2>

  <button
    style={{
      backgroundColor: '#ff4d4d',
      color: 'white',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s ease',
    }}
    onClick={() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#d83d3d'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4d4d'}
  >
    Logout
  </button>
</div>


    <a
  href="/AnalyticsDashboard"
  style={{
    display: 'inline-block',
    marginTop: '1.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = '#4338ca')}
  onMouseOut={(e) => (e.target.style.backgroundColor = '#4f46e5')}
>
  📊 View Analytics Dashboard
</a>

    <form onSubmit={createTask} style={{ marginTop: '2rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
      <h3>Create Task</h3>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px' }}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px' }}
      />
      <input
        name="dueDate"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
        style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px' }}
      />
      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px' }}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <select
        name="assignedTo"
        value={form.assignedTo}
        onChange={handleChange}
        style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px' }}
      >
        <option value="">Assign to...</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name || user.email}
          </option>
        ))}
      </select>
      <button
        type="submit"
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '0.7rem 1.5rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Create Task
      </button>
    </form>

    <div style={{ marginTop: '2rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
      <h3>🔔 Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((note) => (
            <li key={note._id}>
              {note.message} ({new Date(note.createdAt).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  
    <hr style={{ margin: '2rem 0' }} />

    <h3>Your Tasks</h3>
    
    <div style={{ marginBottom: '1rem' }}>
      <h4>Search & Filter</h4>
      <input
        type="text"
        placeholder="Search title or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '0.5rem',
          marginRight: '1rem',
          borderRadius: '5px',
          border: '1px solid #ddd',
        }}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{
          padding: '0.5rem',
          marginRight: '1rem',
          borderRadius: '5px',
          border: '1px solid #ddd',
        }}
      >
        <option value="">All Statuses</option>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        style={{
          padding: '0.5rem',
          marginRight: '1rem',
          borderRadius: '5px',
          border: '1px solid #ddd',
        }}
      >
        <option value="">All Priorities</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input
        type="date"
        value={dueDateFilter}
        onChange={(e) => setDueDateFilter(e.target.value)}
        style={{
          padding: '0.5rem',
          marginRight: '1rem',
          borderRadius: '5px',
          border: '1px solid #ddd',
        }}
      />
    </div>

    {tasks.length === 0 ? (
      <p>No tasks yet.</p>
    ) : (
      <ul>
        {tasks
          .filter((task) => {
            const matchSearch =
              task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter ? task.status === statusFilter : true;
            const matchPriority = priorityFilter ? task.priority === priorityFilter : true;
            const matchDueDate = dueDateFilter
              ? task.dueDate && task.dueDate.slice(0, 10) === dueDateFilter
              : true;
            return matchSearch && matchStatus && matchPriority && matchDueDate;
          })
          .map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              users={users}
            />
          ))}
      </ul>
    )}

  </div>
  );
}


  