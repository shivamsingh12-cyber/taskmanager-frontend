import { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      console.log('Login success:', res.data);
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      alert('Login failed: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <form
    onSubmit={handleSubmit}
    style={{
      maxWidth: '400px',
      margin: '5rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    }}
  >
    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color:"black" }}>Login</h2>
  
    <input
      name="email"
      type="email"
      onChange={handleChange}
      placeholder="Email"
      required
      style={{
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
      }}
    />
  
    <input
      name="password"
      type="password"
      onChange={handleChange}
      placeholder="Password"
      required
      style={{
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1.5rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
      }}
    />
  
    <button
      type="submit"
      style={{
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
      }}
    >
      Login
    </button>
    <a href='/register' style={{ textAlign: 'center', color: 'blue', textDecoration: 'none' }}>Don't have an account</a>
  </form>
  
  );
}
