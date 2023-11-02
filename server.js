const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
connectDB();

app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/', (req, res) => res.send('Welcome to Xenon!'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
