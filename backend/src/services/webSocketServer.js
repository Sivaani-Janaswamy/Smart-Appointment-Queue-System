const { WebSocketServer } = require('ws');

let wss;

const clientsByTokenId = new Map();
const clientsByQueueId = new Map();

const initializeWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'subscribe_queue' && data.queueId) {
            const queueId = data.queueId.toString();
            if (!clientsByQueueId.has(queueId)) {
                clientsByQueueId.set(queueId, new Set());
            }
            clientsByQueueId.get(queueId).add(ws);
            console.log(`Client subscribed to queue ${queueId}`);
            ws.send(JSON.stringify({ type: 'subscribed_queue', queueId }));
        }
        if (data.type === 'subscribe_token' && data.tokenId) {
            const tokenId = data.tokenId.toString();
            if (!clientsByTokenId.has(tokenId)) {
              clientsByTokenId.set(tokenId, new Set());
            }
            clientsByTokenId.get(tokenId).add(ws);
            console.log(`Client subscribed to token ${tokenId}`);
            ws.send(JSON.stringify({ type: 'subscribed_token', tokenId }));
        }
      } catch (error) {
        console.error('Failed to handle WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      // Cleanup logic for both maps
      clientsByQueueId.forEach((subscribers, queueId) => {
        if (subscribers.has(ws)) {
          subscribers.delete(ws);
          if (subscribers.size === 0) clientsByQueueId.delete(queueId);
        }
      });
      clientsByTokenId.forEach((subscribers, tokenId) => {
        if (subscribers.has(ws)) {
          subscribers.delete(ws);
          if (subscribers.size === 0) clientsByTokenId.delete(tokenId);
        }
      });
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

const broadcastToQueue = (queueId, data) => {
  if (!wss) return;
  const subscribers = clientsByQueueId.get(queueId.toString());
  if (subscribers) {
    const message = JSON.stringify(data);
    subscribers.forEach((client) => {
      if (client.readyState === client.OPEN) client.send(message);
    });
  }
};

const broadcastToToken = (tokenId, data) => {
    if (!wss) return;
    const subscribers = clientsByTokenId.get(tokenId.toString());
    if (subscribers) {
      const message = JSON.stringify(data);
      subscribers.forEach(client => {
        if (client.readyState === client.OPEN) client.send(message);
      });
    }
};

module.exports = {
  initializeWebSocket,
  broadcastToQueue,
  broadcastToToken,
};
