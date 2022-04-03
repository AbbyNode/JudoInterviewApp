/*
 * Author: Abby Shah
 * Background worker
 */

import { existsSync, readFileSync, writeFileSync } from "fs";

// Const vars
const intervalSeconds = process.env.MINI_ANALYTICS_INTERVAL | 5;
const interval = intervalSeconds * 1000;
const fileData1 = "data1.txt";
const fileData2 = "data2.json";

function readFile1() {
	const data = readFileSync(fileData1, "utf-8");
	const dataArr = data.trim().split(" ");
	return dataArr;
}

function storeCounts(dataArr) {
	let counts = {};
	
	dataArr.forEach(number => {
		if (!(number in counts)) {
			counts[number] = 0;
		}
		counts[number]++;
	});
	
	writeFileSync(fileData2, JSON.stringify(counts));
}

// Background worker
function worker() {
	if (existsSync(fileData1)) {
		try {
			let dataArr = readFile1();
			storeCounts(dataArr);
		} catch (err) {
			console.log(err);
		}
	} else {
		console.log("No data");
	}
}

// Run on timer
setInterval(worker, interval);
