import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('PerformX API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
