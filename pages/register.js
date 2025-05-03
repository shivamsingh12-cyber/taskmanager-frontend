import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form 
    onSubmit={handleSubmit} 
    style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#fafafa'
    }}
  >
    <h2 style={{ textAlign: 'center', color:'black' }}>Signup Here</h2>
  
    <input 
      name="name" 
      onChange={handleChange} 
      placeholder="Name" 
      style={{
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem'
      }}
    />
  
    <input 
      name="email" 
      type="email" 
      onChange={handleChange} 
      placeholder="Email" 
      style={{
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem'
      }}
    />
  
    <input 
      name="password" 
      type="password" 
      onChange={handleChange} 
      placeholder="Password" 
      style={{
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem'
      }}
    />
  
    <button 
      type="submit"
      style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '0.75rem',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
    >
      Register
    </button>
    <a href='/login' style={{ textAlign: 'center', color: 'blue', textDecoration: 'none' }}>Already have an account</a>
  </form>
  
  );
}
