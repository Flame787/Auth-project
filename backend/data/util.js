// 2 helper-functions for working with events.json file - enables that a JSON-file can be used as a database, with write/read functions: 
// readData() & writeData()

const fs = require('node:fs/promises');   
// imports fs module for work with files, *fs-version which uses Promises
// readData() & writeData() return Promises and can be used with async/await

async function readData() {
  const data = await fs.readFile('events.json', 'utf8');
  // reads full content of the events.json file as string in UTF‑8 code
  return JSON.parse(data);    
  // turns string into JS-object and returns this object
}

async function writeData(data) {
  await fs.writeFile('events.json', JSON.stringify(data));
  // JSON.stringify(data) turns JS-object into JSON string
  // await makes sure that writing is finished before function ends
}

// exporting these 2 functions:
exports.readData = readData;    
exports.writeData = writeData;

// functions can be used/imported like this:  
// const { readData, writeData } = require('./data/util');