const config = require("./config.json");
const express = require("express");
const app = express();
const router = express.Router();
const urlMetadata = require("url-metadata");

const { MongoClient } = require("mongodb");
const uri = config.mongoURI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect();
console.log("Connected to Database!");

let defaultDescription = "Shawt - Free & Easy to use URL shortener";
let defaultTitle = "Shawt";

router.get("/", function(req, res) {
    res.sendFile(__dirname + "/templates/index.html");
});

router.get("/:url", async function(req, res) {
    let url = req.params.url;
    data = await client.db("Main").collection("urls").findOne({ name: url });
    if (data === null) {
        res.redirect("/notfound");
    } else {
        urlMetadata(url).then(function(metadata) {
            let title = metadata["og:title"];
            let description = metadata["og:description"];

            if (title === "") {
                title = defaultTitle;
            }
            if (description === "") {
                description = defaultDescription;
            }

            let redirect = data.redirect;

            res.render("result.ejs", {
                redirect: redirect,
                desc: description,
                title: title,
            });
        });
    }
});

router.get("/createurl", async function(req, res) {
    let name = req.query.name;
    let redirect = req.query.redirect;
    let data = await client.db("Main").collection("urls").findOne({ name: name });
    if (!data === null) {
        res.redirect("/exists");
        return;
    }

    let post = {
        name: name,
        redirect: redirect,
    };

    await client.db("Main").collection("urls").createOne(post);
    res.redirect("/created");
});

app.use("/", router);
app.listen(3000);

console.log("Running at Port 3000");