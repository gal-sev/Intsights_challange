import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { getWebsiteInfo } from './scrapper';
import { createDBTable, deleteTableData, insertData, printTable } from './database';
import { baseDataExample } from './scrapperDataTemp';

const app: Express = express();
app.use(cors());
app.use(json());
const root: string = path.join(process.cwd(), 'client');

app.use(express.static(root));


app.get('/fetchData', (_req, res) => {
  createDBTable();
  console.log("Fetching data from website");

  getWebsiteInfo().then((pastes: any) => {
    console.log("Data fetched");
    insertData(pastes);
    res.send(`Inserted data to database: ${pastes}`);
  }).catch(err => {
    console.log("Data could not be fetched");
    res.send(err.message);
  });
});

app.get('/sql', (_req, res) => {
  createDBTable();
  insertData(baseDataExample);
  res.send({ message: "success" });
});

app.get('/table', (_req, res) => {
  printTable();
  res.send({ message: "success" });
});

app.get('/cleanTable', (_req, res) => {
  deleteTableData();
  res.send({ message: "success" });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Hosted: http://localhost:' + port);
});
