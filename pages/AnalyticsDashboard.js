import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a6cee3'];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    completedTasksPerUser: [],
    overdueTasks: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get('/analytics/summary');
        console.log('Analytics Response:', res.data); // Add this
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err.message);
      }
    };
    fetchAnalytics();
  }, []);

  const formatPieData = () => [
    { name: 'Completed', value: parseFloat(analytics.completionRate) || 0 },
    { name: 'Remaining', value: 100 - parseFloat(analytics.completionRate) || 100 },
  ];

  const formatBarData = () =>
    analytics.completedTasksPerUser.map(item => ({
      user: item.user || 'Unknown',
      count: item.count || 0,
    }));

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>📊 Analytics Dashboard</h2>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
        {/* Completion Rate Pie Chart */}
        <div>
          <h3>Task Completion Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={formatPieData()}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Overdue Tasks Count */}
        <div>
          <h3>Overdue Tasks</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics.overdueTasks}</p>
        </div>

        {/* Completed Tasks per User Bar Chart */}
        <div style={{ gridColumn: 'span 2' }}>
          <h3>Completed Tasks per User</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatBarData()}>
              <XAxis dataKey="user" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <a
        href='/dashboard'
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1rem',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back to Dashboard
      </a>
    </div>
  );
}
