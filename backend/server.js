require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('------------------------------------------------');
  console.log(`[RESOURCES PEN] Architectural Core Active`);
  console.log(`[NODE_ADDR] http://localhost:${PORT}`);
  console.log(`[STATUS] Systems Synchronized`);
  console.log('------------------------------------------------');
});