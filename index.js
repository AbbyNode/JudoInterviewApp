// Author: Abby Shah

const express = require("express");
const path = require("path");
const spawn = require("child_process").spawn;
const fs = require("fs");

const app = express();
const port = process.env.PORT || "8000";

const fileData1 = "data1.txt";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get("/", (req, res) => {
	res.status(200).send("Express App");
});

// Ingest data
app.post("/event", (req, res) => {
	let expId = req.body.experienceID;
	let data = " " + expId.toString();
	fs.appendFileSync(fileData1, data);

	let obj = {data: "event"};
	res
	.status(200)
	.type("text")
	.send(JSON.stringify(obj));
});

// Start api
app.listen(port, () => {
	console.log(`Listening to requests on http://localhost:${port}`);
});

// Start async worker
let worker = spawn("node", ["worker.js"]);

// Log worker messages to console
worker.stdout.setEncoding('utf8');
worker.stdout.on("data", (data) => {
	console.log(data.toString());
});
