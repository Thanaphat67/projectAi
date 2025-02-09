const express = require("express");
const { MongoClient, ObjectId } = require("mongodb")
const app = express();

let db;
const client = new MongoClient("mongodb://localhost:27017");
client.connect().then(() => {
    db = client.db("project");
    console.log("MongoDB connected")
}).catch(() => {
    console.log("MongoDB unconnect")
});


// ดึงข้อมูลทั้งหมด
app.get('/project', async (req, res) => {
    const product = await db.collection("product").find().toArray();
    res.json(product);
});

// ดึงข้อมูลรายการนั้น
app.get('/project/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await db.collection("product").findOne({
            "_id": new ObjectId(id)
        });
        res.json(product);
    } catch (err) {
        res.json("error");
    }
});

app.post('/project', async (req, res) => {
    try {
        const data = req.body;
        const product = await db.collection("product").inserto(data);
        res.json(product);
    }
    catch (err) {
        res.json("error");
    }
});

app.listen(3000, () => {
    console.log('Server started: success');
});