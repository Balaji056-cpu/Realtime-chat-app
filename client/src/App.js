
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));

  useEffect(() => {
    axios.get('http://localhost:3001/messages').then(res => setMessages(res.data));
    socket.on('newMessage', msg => setMessages(prev => [...prev, msg]));
    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('sendMessage', { username, content: input });
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2>Chat Room</h2>
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.username}:</strong> {msg.content}</div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, padding: 10 }} placeholder="Type a message..." />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }}>Send</button>
      </div>
    </div>
  );
}

export default App;
