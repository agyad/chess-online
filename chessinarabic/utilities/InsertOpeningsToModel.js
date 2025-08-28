const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const config_env_Path = path.join(__dirname, '../config.env');
dotenv.config({ path: config_env_Path });
const openingModels = require('./../models/openingModels');
// file 1
const Path_ecoA = path.join(__dirname, '../dev-data/Openings/ecoA.json'); // config path
const opening_ecoA = fs.readFileSync(Path_ecoA, 'utf-8'); // read file
const object_ecoA = JSON.parse(opening_ecoA); // turn it to json
const keys_ecoA = Object.keys(object_ecoA); // get keys of te object
let objectArray_ecoAll = [];
for (let i = 0; i < keys_ecoA.length; i++) {
  let object = {};
  object.position = keys_ecoA[i];
  object.name = object_ecoA[keys_ecoA[i]].name;
  object.moves = object_ecoA[keys_ecoA[i]].moves;
  objectArray_ecoAll.push(object);
}
// file 2
const Path_ecoB = path.join(__dirname, '../dev-data/Openings/ecoB.json');
const opening_ecoB = fs.readFileSync(Path_ecoB, 'utf-8');
const object_ecoB = JSON.parse(opening_ecoB);
const keys_ecoB = Object.keys(object_ecoB);

for (let i = 0; i < keys_ecoB.length; i++) {
  let object = {};
  object.position = keys_ecoB[i];
  object.name = object_ecoB[keys_ecoB[i]].name;
  object.moves = object_ecoB[keys_ecoB[i]].moves;

  objectArray_ecoAll.push(object);
}
// file 3

const Path_ecoC = path.join(__dirname, '../dev-data/Openings/ecoC.json');
const opening_ecoC = fs.readFileSync(Path_ecoC, 'utf-8');
const object_ecoC = JSON.parse(opening_ecoC);
const keys_ecoC = Object.keys(object_ecoC);

for (let i = 0; i < keys_ecoC.length; i++) {
  let object = {};
  object.position = keys_ecoC[i];
  object.name = object_ecoC[keys_ecoC[i]].name;
  object.moves = object_ecoC[keys_ecoC[i]].moves;

  objectArray_ecoAll.push(object);
}

// file 4

const Path_ecoD = path.join(__dirname, '../dev-data/Openings/ecoD.json');
const opening_ecoD = fs.readFileSync(Path_ecoD, 'utf-8');
const object_ecoD = JSON.parse(opening_ecoD);
const keys_ecoD = Object.keys(object_ecoD);

for (let i = 0; i < keys_ecoD.length; i++) {
  let object = {};
  object.position = keys_ecoD[i];
  object.name = object_ecoD[keys_ecoD[i]].name;
  object.moves = object_ecoD[keys_ecoD[i]].moves;

  objectArray_ecoAll.push(object);
}

// file 5

const Path_ecoE = path.join(__dirname, '../dev-data/Openings/ecoE.json');
const opening_ecoE = fs.readFileSync(Path_ecoE, 'utf-8');
const object_ecoE = JSON.parse(opening_ecoE);
const keys_ecoE = Object.keys(object_ecoE);

for (let i = 0; i < keys_ecoE.length; i++) {
  let object = {};
  object.position = keys_ecoE[i];
  object.name = object_ecoE[keys_ecoE[i]].name;
  object.moves = object_ecoE[keys_ecoE[i]].moves;

  objectArray_ecoAll.push(object);
}
const insertall = async () => {
  try {
    const Openings = await openingModels.insertMany(objectArray_ecoAll, {
      ordered: false,
    });
    console.log('Openings DataBase Is Ready');
  } catch (err) {
    console.log(err.message);
  }
};
setTimeout(() => {
  insertall();
}, 60000);
