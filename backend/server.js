require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

// pentru test
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// rute de autentificare și diary
const authRoutes = require('./routes/auth');
const diaryRoutes = require('./routes/diary');

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
