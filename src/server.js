const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/user');
const workRoutes = require('./routes/work');

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/api/user', userRoutes);
app.use('/api/work', workRoutes);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message });
  }
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('DB CONNECTED ERROR', err));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
