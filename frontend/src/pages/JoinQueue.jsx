import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { motion } from 'framer-motion';

const JoinQueue = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const { data } = await api.get('/queues');
        setQueues(data);
      } catch (error) {
        setError('Could not fetch available services.');
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
  }, []);

  const handleJoinQueue = async (queueId) => {
    setSelectedQueue(queueId);
    setError('');
    try {
        const { data } = await api.post('/tokens', { queueId });
        navigate(`/token/${data._id}`);
    } catch (err) {
        setError('Failed to get a token. Please try again.');
        setSelectedQueue(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto p-8">
          <h2 className="text-4xl font-heading font-bold text-ghost-white text-center mb-4 drop-shadow-[0_0_8px_rgba(240,0,184,0.7)]">
            JOIN A QUEUE
          </h2>
          <p className="text-center text-light-grey font-body mb-8 text-lg">
            Select a service below to get your digital token.
          </p>
          {error && <p className="text-electric-magenta text-center mb-4 font-body">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {queues.map(queue => (
                  <Button
                      key={queue._id}
                      onClick={() => handleJoinQueue(queue._id)}
                      className="py-6 text-xl" // Increased padding and font size for buttons
                      disabled={selectedQueue === queue._id}
                  >
                      {selectedQueue === queue._id ? <Spinner/> : queue.name.toUpperCase()}
                  </Button>
              ))}
          </div>
      </Card>
    </motion.div>
  );
};

export default JoinQueue;
