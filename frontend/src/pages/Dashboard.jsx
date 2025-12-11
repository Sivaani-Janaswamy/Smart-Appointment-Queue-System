import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import LiveQueueDisplay from '../components/features/LiveQueueDisplay';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card'; // Import Card
import Input from '../components/ui/Input'; // Assuming we can use Input for select styling indirectly, or style select directly
import { motion } from 'framer-motion';

const AgentControlPanel = ({ queues }) => {
    const [selectedQueue, setSelectedQueue] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAction = async (action, body) => {
        if (!selectedQueue && action === 'call-next') {
            setError('Please select a queue first.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await api.post(`/tokens/action/${action}`, body);
            if(action === 'call-next') {
              setMessage(`SUCCESS! Called token: ${data.tokenNumber}`); // Capitalized message
            } else {
              setMessage(`SUCCESS! Action '${action.toUpperCase()}' completed.`); // Capitalized message
            }
        } catch (err) {
            setError(err.response?.data?.message || `FAILED to ${action}.`); // Capitalized error
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-8 p-6">
            <h2 className="text-2xl font-heading font-bold text-ghost-white mb-4 drop-shadow-[0_0_5px_rgba(240,0,184,0.6)]">
              AGENT CONTROLS
            </h2>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <select
                    value={selectedQueue}
                    onChange={(e) => setSelectedQueue(e.target.value)}
                    className="flex-grow p-2 rounded-lg bg-deep-space/50 border border-cyber-purple/50
                               text-light-grey placeholder-medium-grey focus:outline-none focus:ring-2
                               focus:ring-electric-magenta focus:ring-offset-1 focus:ring-offset-deep-space"
                >
                    <option value="" className="bg-deep-space">-- SELECT A QUEUE TO CALL FROM --</option>
                    {queues.map(q => (
                        <option key={q._id} value={q._id} className="bg-deep-space">{q.name.toUpperCase()}</option>
                    ))}
                </select>
                <Button onClick={() => handleAction('call-next', { queueId: selectedQueue })} disabled={loading || !selectedQueue}>
                    {loading ? 'PROCESSING...' : 'CALL NEXT'} {/* Capitalized button text */}
                </Button>
            </div>
            {error && <p className="text-electric-magenta mt-2 font-body">{error}</p>}
            {message && <p className="text-plasma-green mt-2 font-body">{message}</p>}
        </Card>
    );
};


const Dashboard = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const { data } = await api.get('/queues');
        setQueues(data);
      } catch (error) {
        console.error('Failed to fetch queues', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
  }, []);

  if (loading) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }} // Delay animation slightly after layout
    >
      <AgentControlPanel queues={queues} />
      <div className="flex flex-wrap gap-8 justify-center">
        {queues.length > 0 ? (
          queues.map((queue) => <LiveQueueDisplay key={queue._id} queue={queue} />)
        ) : (
          <p className="text-light-grey font-body text-center text-lg mt-8">NO ACTIVE QUEUES FOUND.</p>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
