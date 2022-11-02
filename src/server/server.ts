import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { getWebsiteInfo } from './scrapper';
import { createDBTable, deleteTableData, getTableData, insertData } from './database';

const app: Express = express();
app.use(cors());
app.use(json());
const root: string = path.join(process.cwd(), 'client');

app.use(express.static(root));

//initialize interval as undefined
let fetchInterval: any = undefined;

app.get('/fetch', (_req, res) => {
  fetchData();
  res.send("fetching data");
});

app.get('/fetchLoop', (_req, res) => {
  if (fetchInterval === undefined) {
    const interval = setInterval(() => fetchData(), 300000);
    fetchInterval = interval;
    res.send("Fetch loop started");
  } else {
    res.send("Fetch loop already started");
  }
});

app.get('/stopFetchLoop', (_req, res) => {
  if(fetchInterval !== undefined) {
    clearInterval(fetchInterval);
    fetchInterval = undefined;
    res.send("Fetch loop stopped"); 
  } else {
    res.send("Fetch loop isn't active");
  }
});

app.get('/createTable', (_req, res) => {
  createDBTable();
  res.send({ message: "success" });
});

app.get('/getPastes', (_req, res) => {
  getTableData().then((pastes: any) => {
    console.log(`Sending ${pastes.length} pastes to client`);
    res.send(pastes);
  }).catch(err => {
    res.send({ err: `Data could not be fetched -> ${err.message}` });
  });
});

app.get('/cleanTable', (_req, res) => {
  deleteTableData();
  res.send({ message: "success" });
});

app.get('*', (_req, res) => {
  res.send("404")
});

function fetchData() {
  createDBTable();
  console.log("Fetching data from website");

  getWebsiteInfo().then((pastes: any) => {
    console.log("Data fetched");
    insertData(pastes);
    console.log(`Inserted data to database`);
  }).catch(err => {
    console.log(`Data could not be fetched -> ${err.message}`);
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Hosted: http://localhost:' + port);
});
