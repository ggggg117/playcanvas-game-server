const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS許可（PlayCanvasからの通信を解禁）
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('プレイヤーが接続しました:', socket.id);

  // 移動データの同期
  socket.on('playerMove', (data) => {
    socket.broadcast.emit('playerMoved', {
      id: socket.id,
      position: data
    });
  });

  // 切断処理
  socket.on('disconnect', () => {
    console.log('切断されました:', socket.id);
    io.emit('playerDisconnected', socket.id);
  });
});

// Renderのポート番号（process.env.PORT）に対応
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`通信サーバー起動完了！ Port: ${PORT}`);
});
