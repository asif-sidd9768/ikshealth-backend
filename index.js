require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./router/routes');
const { connectDatabase } = require('./db/connection');


const app = express();
app.use(cors());

console.log({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
})
// Database connection
connectDatabase();

// const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
