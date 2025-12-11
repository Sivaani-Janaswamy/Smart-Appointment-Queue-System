import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { generateWeeklyReportPDF } from '../utils/reportGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore'; // Corrected import path

// Helper component for Admin sections to ensure consistent styling
const AdminSection = ({ title, children }) => (
    <Card className="mb-8 p-6"> {/* Use Card for consistent styling */}
        <h2 className="text-2xl font-heading font-bold text-ghost-white mb-4 border-b border-cyber-purple/50 pb-2 drop-shadow-[0_0_5px_rgba(122,0,240,0.6)]">
          {title.toUpperCase()}
        </h2>
        {children}
    </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-deep-space/70 backdrop-blur-sm rounded-lg border border-cyber-purple/50 shadow-xl shadow-cyber-purple/20 text-light-grey font-body">
        <p className="font-heading text-ghost-white mb-1">{label}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentTheme = useThemeStore((state) => state.theme); // Get current theme

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/analytics/weekly');
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    if (analytics) {
        generateWeeklyReportPDF(analytics);
    }
  }

  if (loading) return <Spinner />;

  // Chart data colors based on theme
  const axisColor = currentTheme === 'dark' ? '#D1D1D1' : '#111119'; // Light Grey or Deep Space
  const legendColor = currentTheme === 'dark' ? '#F9F9F9' : '#111119'; // Ghost White or Deep Space

  return (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col space-y-8"
    >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-4xl font-heading font-bold text-ghost-white drop-shadow-[0_0_8px_rgba(240,0,184,0.7)] mb-4 sm:mb-0">
              ADMIN DASHBOARD
            </h1>
            <Button onClick={handleExport} disabled={!analytics}>
                EXPORT WEEKLY REPORT (PDF)
            </Button>
        </div>
        
        <AdminSection title="Last 7 Days Performance">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={analytics}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F000B8" stopOpacity={0.8}/> {/* Electric Magenta */}
                        <stop offset="95%" stopColor="#7A00F0" stopOpacity={0.8}/> {/* Cyber Purple */}
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7A00F050" /> {/* Cyber Purple with opacity */}
                    <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12, fontFamily: 'Inter' }} />
                    <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12, fontFamily: 'Inter' }}/>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240,0,184,0.1)' }} />
                    <Legend wrapperStyle={{ color: legendColor, fontFamily: 'Inter', fontSize: 14 }} />
                    <Bar dataKey="Tokens Served" fill="url(#colorUv)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </AdminSection>

        <AdminSection title="Average Wait Time (Last 7 Days)">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7A00F050" />
                    <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor, fontSize: 12, fontFamily: 'Inter' }}/>
                    <YAxis stroke={axisColor} tick={{ fill: axisColor, fontSize: 12, fontFamily: 'Inter' }}/>
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F000B8', strokeWidth: 2 }} />
                    <Legend wrapperStyle={{ color: legendColor, fontFamily: 'Inter', fontSize: 14 }} />
                    <Line type="monotone" dataKey="Avg Wait (min)" stroke="#33FF00" strokeWidth={3} dot={{ stroke: '#33FF00', strokeWidth: 2, r: 4 }} /> {/* Plasma Green */}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </AdminSection>
    </motion.div>
  );
};
