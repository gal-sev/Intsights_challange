import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';

const app: Express = express();
app.use(cors());
app.use(json());
const root: string = path.join(process.cwd(), 'client');

app.use(express.static(root));

app.get('/data', (_req, res) => {
  console.log("Processing /data");
  res.send({message: "Hello world"});
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Hosted: http://localhost:' + port);
});
