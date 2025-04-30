
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create socket instance
const socket = io('http://localhost:9000');  // Ensure the server is running at this URL

const MyComponent = () => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      
      socket.emit('fromclient', message);

      
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Message from Server:</h1>
      <p>{message}</p>
      <input
      placeholder='msg to server'
      onChange={(e)=>setMessage(event.target.value)}
      onClick={sendMessage}
      />
    </div>
  );
};

export default MyComponent;
