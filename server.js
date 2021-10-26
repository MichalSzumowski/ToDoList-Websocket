const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port', 8000);
});

const io = socket(server);

const tasks = [];

io.on('connection', (socket) => {
  console.log("New client! It's id - " + socket.id);

  io.to(socket.id).emit('updateData', tasks);
  
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', taskId);
  });
})

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});