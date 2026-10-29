import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-zgr00ce-shard-00-00.hffrouf.mongodb.net:27017,ac-zgr00ce-shard-00-01.hffrouf.mongodb.net:27017,ac-zgr00ce-shard-00-02.hffrouf.mongodb.net:27017/?ssl=true&replicaSet=atlas-97vqqn-shard-0&authSource=admin`;
const client = new MongoClient(uri);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Paharika Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
