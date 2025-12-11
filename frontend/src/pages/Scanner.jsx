import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';

const Scanner = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      try {
        const url = new URL(data.text);
        // Assuming url is like http://.../token/someId
        const pathParts = url.pathname.split('/');
        const tokenId = pathParts[pathParts.length - 1];
        if (pathParts[pathParts.length - 2] === 'token' && tokenId) {
          navigate(`/token/${tokenId}`);
        } else {
          setError('Invalid QR code format. Please scan a valid token QR.');
        }
      } catch (e) {
        setError('Not a valid URL in QR code. Please scan a valid token QR.');
      }
    }
  };

  const handleError = (err) => {
    setError('Camera permission denied or camera not found. Please enable camera access.');
    console.error(err);
  };

  // Styles for the QR scanner component (adjust as needed for visual integration)
  const previewStyle = {
    height: 240, // Match the height of the container div
    width: '100%',
    objectFit: 'cover', // Ensure video feed covers the area
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto p-8 text-center"> {/* Added p-8 */}
        <h2 className="text-3xl font-heading font-bold text-ghost-white mb-6 drop-shadow-[0_0_8px_rgba(240,0,184,0.7)]">
          SCAN TOKEN QR CODE
        </h2>
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-cyber-purple/70 shadow-lg shadow-electric-magenta/30 flex items-center justify-center"> {/* Styled scanner frame */}
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
            facingMode="environment" // Prefer rear camera on mobile
          />
        </div>
        {error && <p className="text-electric-magenta text-center mt-4 font-body">{error}</p>}
      </Card>
    </motion.div>
  );
};

export default Scanner;
