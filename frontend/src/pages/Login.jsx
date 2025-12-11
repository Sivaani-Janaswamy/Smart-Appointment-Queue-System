import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }} // Delay animation slightly after layout
    >
      <Card className="w-full max-w-sm">
        <h2 className="text-3xl font-heading font-bold text-ghost-white text-center mb-6 drop-shadow-[0_0_5px_rgba(240,0,184,0.7)]">
          AGENT / ADMIN LOGIN
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-light-grey font-body text-sm mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-light-grey font-body text-sm mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-electric-magenta text-sm mb-4 font-body">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default LoginPage;
