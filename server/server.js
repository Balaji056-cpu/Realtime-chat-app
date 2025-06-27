
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/messages', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('sendMessage', async (msg) => {
    const message = new Message(msg);
    await message.save();
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(3001, () => console.log('Server running on http://localhost:3001'));
