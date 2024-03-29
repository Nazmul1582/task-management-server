const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middlewares
app.use(express.json())
app.use(cors());

app.get("/", (req, res) => {
    res.send("ProTaskManager is runing...");
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vatgn7i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("taskDB").collection("tasks");

    app.get("/tasks", async(req, res) => {
      const email = req.query.email;
      const query = { email: email}
      const result = await taskCollection.find(query).toArray();
      res.send(result)
    })

    app.get("/tasks/:id", async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await taskCollection.findOne(query);
      res.send(result)
    })

    app.post("/tasks", async(req, res) => {
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
    })

    app.put("/tasks/:id", async(req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      const filter = { _id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          title: updatedTask.title,
          deadline: updatedTask.deadline,
          priority: updatedTask.priority,
          message: updatedTask.message
        }
      }
      const result = await taskCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.delete("/tasks/:id", async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(filter);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`ProTaskManager is runing on PORT ${port}`)
})