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

mongoose.connect(mongoUri);
const database = mongoose.connection;

database.on('error', (error: any) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use((req, res) => res.json("API route not found"));
app.get('/', (req, res) => res.json("server working...."));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
