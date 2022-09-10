import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { getWebsiteInfo } from './scrapper';
import { createDBTable, insertData, printTable } from './database';
import { baseDataExample } from './scrapperDataTemp';

const app: Express = express();
app.use(cors());
app.use(json());
const root: string = path.join(process.cwd(), 'client');

app.use(express.static(root));

app.get('/data', (_req, res) => {
  console.log("Processing /data");
  getWebsiteInfo();
  res.send({ message: "Hello world" });
});

app.get('/sql', (_req, res) => {
  createDBTable();
  insertData(baseDataExample);
  res.send({ message: "SQL :D" });
});

app.get('/table', (_req, res) => {
  printTable();
  res.send({ message: "SQL :D" });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Hosted: http://localhost:' + port);
});
