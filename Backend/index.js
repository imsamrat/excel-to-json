const express = require("express");
const app = express();
const cors = require("cors");
const BodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(BodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpdhc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("cex_dashboard");
    // const appointmentsCollection = database.collection('appointments');
    // const usersCollection = database.collection('users');
    const agentsCollection = database.collection("agents");
    const enablersCollection = database.collection("attendance");
    const adjustmentCollection = database.collection("adjustment");
    const auditCollection = database.collection("callAudit");
    const roleCollection = database.collection("role");
    const excelCollection = database.collection("excel");

    // app.get("/", (req, res) => {
    //   agentsCollection.find().toArray((err, items) => {
    //     res.send(items);
    //   });
    // });

    // app.get("/agents/:id", (req, res) => {
    //   const id = ObjectID(req.params.id);
    //   agentsCollection.find(id).toArray((err, items) => {
    //     res.send(items[0]);
    //   });
    // });

    app.post("/addFile", (req, res) => {
      const newFile = req.body;
      console.log(newFile);
      console.log("Adding New Agent", newFile);
      excelCollection.insertOne(newFile).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.delete("/delete/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      agentsCollection.deleteOne({ _id: id }).then((result) => {
        res.send(result.deletedCount > 0);
      });
    });
  
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Database Connected");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});