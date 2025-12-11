import { useState, useEffect, useRef } from 'react';

const useWebSocket = (queueId) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    if (!queueId) return;

    const wsUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/^http/, 'ws');
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log(`WebSocket connected for queue ${queueId}`);
      setIsConnected(true);
      // Subscribe to the queue
      ws.current.send(JSON.stringify({ type: 'subscribe_queue', queueId }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message); // The component using this hook will handle the message
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [queueId]);

  return { data, isConnected };
};

export default useWebSocket;
