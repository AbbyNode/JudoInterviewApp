/*
 * Author: Abby Shah
 * Background worker
 */

import { existsSync, readFileSync, createReadStream, writeFileSync } from "fs";

// Const vars
const intervalSeconds = process.env.MINI_ANALYTICS_INTERVAL | 5;
const interval = intervalSeconds * 1000;
const fileData1 = "data1.txt";
const fileData2 = "data2.json";
const fileOffset = "offset.txt";

// Vars
let offset;
let counts;

// Read existing offset on start
function readOffset() {
	console.log(`Loading ${fileOffset}`);
	let data = readFileSync(fileOffset, "utf-8");
	offset = parseInt(data);
	console.log(`Loaded ${fileOffset}. Offset set to ${offset}`);
}

// Read existing counts on start
function readFile2() {
	console.log(`Loading ${fileData2}`);
	const data = readFileSync(fileData2, "utf-8");
	const dataJson = JSON.parse(data);
	counts = dataJson;
	console.log(`Loaded ${fileData2}. Counts set to ${JSON.stringify(counts)}`);
}

// Read data file every interval
function readFile1() {
	// Read from offset onwards
	const stream = createReadStream(fileData1, { encoding: "utf-8", start: offset });

	stream.on("data", function (chunk) {
		const data = chunk.toString();
		console.log(`Found new data in ${fileData1}: ${data}`);
		offset += data.length;
		writeFileSync(fileOffset, offset.toString());

		const dataArr = data.trim().split(" ");
		addToCounts(dataArr);
	});
}

// Add new data counts
function addToCounts(dataArr) {
	console.log(`Saving new data ${dataArr}`);

	dataArr.forEach((number) => {
		if (!(number in counts)) {
			counts[number] = 0;
		}
		counts[number]++;
	});

	writeFileSync(fileData2, JSON.stringify(counts));
	console.log(`Save complete. New counts: ${JSON.stringify(counts)}`);
}

// Start
function start() {
	console.log("Setting up worker");

	if (!existsSync(fileData2) || !existsSync(fileOffset)) {
		console.log("No existing files. Starting from scratch.");
		counts = {};
		offset = 0;
	} else {
		readOffset();
		readFile2();
	}

	setInterval(worker, interval);
	console.log(`Worker started. Running every ${intervalSeconds} seconds`);
}

// Background worker
function worker() {
	if (existsSync(fileData1)) {
		try {
			readFile1();
		} catch (err) {
			console.log(err);
		}
	} else {
		console.log("No data", fileData1);
	}
}

// Run
start();
