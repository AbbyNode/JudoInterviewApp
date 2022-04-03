/*
 * Author: Abby Shah
 * Main API
 */

import express, { json, urlencoded } from "express";
import { spawn } from "child_process";
import { appendFileSync } from "fs";

// Create express app
const app = express();
const port = process.env.PORT || "8000";

// Variables
const fileData1 = "data1.txt";

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Root
app.get("/", (req, res) => {
	res.status(200).send("Express App");
});

// Ingest data
app.post("/event", (req, res) => {
	let expId = req.body.experienceID;

	let data = " " + expId.toString();
	appendFileSync(fileData1, data);

	res.status(200).type("text").send("Success");
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
