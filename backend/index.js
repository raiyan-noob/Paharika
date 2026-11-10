import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-zgr00ce-shard-00-00.hffrouf.mongodb.net:27017,ac-zgr00ce-shard-00-01.hffrouf.mongodb.net:27017,ac-zgr00ce-shard-00-02.hffrouf.mongodb.net:27017/?ssl=true&replicaSet=atlas-97vqqn-shard-0&authSource=admin`;
const client = new MongoClient(uri);

const db = client.db("Paharika");
const destinationCollection = db.collection("destinations");

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Paharika Server is running');
});

// GET all destinations from MongoDB
app.get('/all-destination', async (req, res) => {
  try {
    const cursor = destinationCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error("Error fetching destinations:", err);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
});

app.get('/all-destination/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: parseInt(id) || id };
    }
    let destination = await destinationCollection.findOne(query);
    if (!destination) {
      destination = await destinationCollection.findOne({ id: parseInt(id) || id });
    }
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.send(destination);
  } catch (err) {
    console.error("Error fetching destination:", err);
    res.status(500).json({ message: 'Error fetching destination' });
  }
});

// POST add a new destination into MongoDB
app.post('/add-destination', async (req, res) => {
  try {
    const newDestination = req.body;
    console.log("Adding destination to MongoDB:", newDestination?.name);
    const result = await destinationCollection.insertOne(newDestination);
    res.send(result);
  } catch (err) {
    console.error("Error adding destination:", err);
    res.status(500).send({ error: 'Failed to add destination' });
  }
});

// PUT update a destination in MongoDB
app.put('/all-destination/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };
    delete updatedData._id; // Exclude immutable _id

    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: parseInt(id) || id };
    }

    const result = await destinationCollection.updateOne(query, { $set: updatedData });
    res.send(result);
  } catch (err) {
    console.error("Error updating destination:", err);
    res.status(500).json({ message: 'Error updating destination', error: err.message });
  }
});

// DELETE a destination from MongoDB
app.delete('/all-destination/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let query;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: parseInt(id) || id };
    }

    const result = await destinationCollection.deleteOne(query);
    res.send(result);
  } catch (err) {
    console.error("Error deleting destination:", err);
    res.status(500).json({ message: 'Error deleting destination', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
