import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import useWebSocket from '../hooks/useWebSocket';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button'; // Import Button for notification request
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useThemeStore } from '../store/themeStore'; // To get theme for QR color

const TokenStatus = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationPermission, setPermission] = useState(Notification.permission);
  const currentTheme = useThemeStore((state) => state.theme); // Get current theme

  // The WebSocket hook will give us real-time updates for the queue this token is in
  const { data: socketData } = useWebSocket(token?.queueId);

  const fetchTokenStatus = async () => {
    try {
      const { data } = await api.get(`/tokens/${id}/status`);
      setToken(data);
    } catch (err) {
      setError('Could not find token. Please check your ID.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTokenStatus();
  }, [id]);

  useEffect(() => {
      // Re-fetch status on websocket updates for simplicity
      if(socketData) {
          fetchTokenStatus();
          // Display notification
          if (socketData.type === 'notification' && (socketData.forTokenId === id || socketData.forTokenId === token?._id)) {
            new Notification('Queue Update', { body: socketData.message });
          }
      }
  }, [socketData, id, token]);

  const requestNotificationPermission = () => {
    Notification.requestPermission().then(setPermission);
  }

  if (loading) return <Spinner />;
  if (error) return <p className="text-electric-magenta text-center font-body">{error}</p>; // Styled error

  if (!token) return (
    <Card className="w-full max-w-lg mx-auto text-center p-8">
      <h2 className="text-2xl font-heading text-ghost-white mb-4">TOKEN NOT FOUND</h2>
      <p className="text-light-grey font-body">Please check the URL or join a new queue.</p>
    </Card>
  );

  const getStatusMessage = () => {
      switch(token.status) {
          case 'serving': return "IT'S YOUR TURN! PLEASE PROCEED.";
          case 'served': return 'YOUR SERVICE IS COMPLETE. THANK YOU!';
          case 'cancelled': return 'THIS TOKEN HAS BEEN CANCELLED.';
          case 'waiting': return `YOU ARE NUMBER ${token.position} IN THE QUEUE.`;
          default: return 'STATUS IS UPDATING...';
      }
  }

  return (
    <Card className="w-full max-w-lg mx-auto text-center p-8">
      {notificationPermission === 'default' && (
            <Button onClick={requestNotificationPermission} className="mb-4 text-sm px-3 py-1">
                Enable Notifications
            </Button>
        )}
      <h2 className="text-light-grey font-body mb-2">YOUR TOKEN</h2>
      <motion.div
        key={token.tokenNumber}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-8xl md:text-9xl font-heading font-bold text-electric-magenta my-4
                   drop-shadow-[0_0_15px_rgba(240,0,184,0.9)]" // Stronger neon glow
      >
        {token.tokenNumber}
      </motion.div>
      
      <div className="relative p-4 rounded-xl border border-cyber-purple/50 bg-deep-space/40 backdrop-blur-sm
                   shadow-xl shadow-cyber-purple/20 mb-6"> {/* Glassmorphism for status */}
          <h3 className="text-ghost-white font-heading text-3xl font-bold mb-2">{getStatusMessage()}</h3>
          {token.status === 'waiting' && (
              <p className="text-lg text-light-grey font-body">
                  ESTIMATED WAIT TIME: <strong className="text-plasma-green font-heading text-xl">~{token.estimatedWaitTime || '...'} MINUTES</strong>
              </p>
          )}
          {token.status === 'serving' && token.counter && (
              <p className="text-lg text-light-grey font-body mt-2">
                  PROCEED TO <strong className="text-plasma-green font-heading text-xl">{token.counter.name.toUpperCase()}</strong>
              </p>
          )}
      </div>
      <div className="mt-8 flex flex-col items-center relative p-4 rounded-xl border border-cyber-purple/50 bg-deep-space/40 backdrop-blur-sm
                   shadow-lg shadow-cyber-purple/20"> {/* Glassmorphism for QR */}
        <QRCodeSVG value={window.location.href} size={128} bgColor="transparent" fgColor={currentTheme === 'dark' ? '#F9F9F9' : '#1F2937'} /> {/* Using ghost-white hex */}
        <p className="mt-2 text-sm text-medium-grey font-body">SCAN TO CHECK STATUS</p>
      </div>
    </Card>
  );
};

export default TokenStatus;
