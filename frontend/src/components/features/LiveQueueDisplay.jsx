import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import useWebSocket from '../../hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';
import Card from '../ui/Card';

const TokenCard = ({ token, isServing = false }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative rounded-lg p-4 mb-2 shadow-lg
        ${
          isServing
            ? 'bg-deep-space/50 border-2 border-plasma-green shadow-plasma-green/40' // Stronger glow for serving
            : 'bg-deep-space/40 border border-cyber-purple/50 shadow-cyber-purple/20'
        }
        text-light-grey
      `}
    >
      <div className="flex justify-between items-center">
        <motion.span
            key={token.tokenNumber} // Animate token number changes
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-heading font-bold text-electric-magenta drop-shadow-[0_0_5px_rgba(240,0,184,0.7)]"
        >
          {token.tokenNumber}
        </motion.span>
        <span className="text-sm text-medium-grey">
          {formatDistanceToNow(new Date(token.createdAt), { addSuffix: true })}
        </span>
      </div>
      {isServing && token.counter && (
        <p className="text-sm text-light-grey mt-2">
            TO <strong className="text-plasma-green font-heading">{token.counter.name.toUpperCase()}</strong>
        </p>
      )}
    </motion.div>
  );
};

const LiveQueueDisplay = ({ queue }) => {
  const [tokens, setTokens] = useState([]);
  const [servingToken, setServingToken] = useState(null);
  const { data: socketData } = useWebSocket(queue._id);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data } = await api.get(`/queues/${queue._id}`);
        setTokens(data.tokens.filter((t) => t.status === 'waiting'));
        setServingToken(data.tokens.find((t) => t.status === 'serving'));
      } catch (error) {
        console.error('Failed to fetch queue data', error);
      }
    };
    fetchInitialData();
  }, [queue._id]);

  useEffect(() => {
    if (socketData) {
      const { type, payload } = socketData;
      switch (type) {
        case 'token_created':
          setTokens((prev) => [...prev, payload].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
          break;
        case 'token_called':
          setServingToken(payload);
          setTokens((prev) => prev.filter((t) => t._id !== payload._id));
          break;
        case 'token_served':
        case 'token_cancelled':
          if (servingToken?._id === payload._id) {
            setServingToken(null);
          }
          setTokens((prev) => prev.filter((t) => t._id !== payload._id));
          break;
        default:
          break;
      }
    }
  }, [socketData, servingToken?._id]);
  
  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex-shrink-0"
    >
        <Card className="p-6 h-full flex flex-col">
          <h3 className="text-3xl font-heading font-bold text-ghost-white text-center mb-6 drop-shadow-[0_0_8px_rgba(240,0,184,0.7)]">
            {queue.name.toUpperCase()}
          </h3>
          
          <div className="mb-6 flex-grow">
            <h4 className="font-heading text-light-grey mb-2 text-center text-lg">SERVING NOW</h4>
            {servingToken ? (
              <TokenCard token={servingToken} isServing />
            ) : (
              <div className="text-center text-medium-grey p-4 bg-deep-space/30 rounded-lg font-body">
                NO ONE IS BEING SERVED.
              </div>
            )}
          </div>

          <div>
            <h4 className="font-heading text-light-grey mb-2 text-center text-lg">WAITING (<span className="text-plasma-green">{tokens.length}</span>)</h4>
            <div className="h-64 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {tokens.length > 0 ? (
                    tokens.map((token) => <TokenCard key={token._id} token={token} />)
                  ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-medium-grey mt-8 font-body"
                    >
                        QUEUE IS EMPTY.
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          </div>
        </Card>
    </motion.div>
  );
};

export default LiveQueueDisplay;
