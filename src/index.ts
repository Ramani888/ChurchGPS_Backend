import express from 'express';
import { MongoClient } from 'mongodb';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import routes from './routes/routes'

dotenv.config();

const app = express();
const cors = require('cors')
const port = process.env.PORT || 3010;
const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://CVLCluster1:Ramani%407258@atlascluster.g9ls9b9.mongodb.net/ChurchGPS';

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
