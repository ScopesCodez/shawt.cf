const config = require("./config.json");
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const router = express.Router();

router.get("/", function(req, res) {
    res.sendFile(__dirname + "/templates/index.html");
});

app.use("/", router);
app.listen(3000);

console.log("Running at Port 3000");