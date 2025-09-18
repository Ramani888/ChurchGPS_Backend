import express from 'express';
import { MongoClient } from 'mongodb';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import routes from './routes/routes'

dotenv.config();

const app = express();
const cors = require('cors')
const port = process.env.PORT || 3010;
const mongoUri = process.env.DATABASE_URL;

if (!mongoUri) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

// Connect to MongoDB only when not in a serverless environment
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Database Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Only set up connection events in non-serverless environment
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(mongoUri);
  const database = mongoose.connection;
  
  database.on('error', (error: any) => {
    console.log(error);
  });
  
  database.once('connected', () => {
    console.log('Database Connected');
  });
}

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use((req, res) => res.status(404).json("API route not found"));
app.get('/', (req, res) => res.json("server working...."));

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// Export for serverless use
export default app;
