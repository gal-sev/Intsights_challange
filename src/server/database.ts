import path from 'path';
import sqlite3 from 'sqlite3';
import { pasteI } from './scrapper';

const dbPath: string = path.join(process.cwd(), 'src/server/pastes.db');

// Open the DB
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.error(err.message);
});

// Create Table
export function createDBTable() {
	const createTable = `CREATE TABLE IF NOT EXISTS pastes(
		id TEXT PRIMARY KEY, 
		author TEXT NOT NULL, 
		title TEXT NOT NULL, 
		content TEXT NOT NULL, 
		date TEXT NOT NULL, 
		sentiment INTEGER NOT NULL)`;
	db.run(createTable);
}

// Remove the table
export function dropTable() {
	db.run("DROP TABLE pastes", (err) => {
		if (err) return console.error(err.message);
	});
}

// Insert data to the table
export function insertData(data: pasteI[]) {
	data.forEach(pasteData => {
		//Ignores the insert if the paste has the same id as another one in the database
		const insertString = `INSERT OR IGNORE INTO pastes(id, author, title, content, date, sentiment)
		VALUES (?, ?, ?, ?, ?, ?)`;
		db.run(insertString,
			[pasteData.id, pasteData.author, pasteData.title, 
				pasteData.content, pasteData.date, pasteData.sentiment],
			(err) => {
				if (err) return console.error(err.message);
			}
		);
	});
}

// Print the data from the table
export function printTable() {
	const getRows = `SELECT * FROM pastes`;
	db.all(getRows, [], (err, rows) => {
		if (err) return console.error(err.message);
		rows.forEach(row => {
			console.log(row);
		});
	});
}

// Get the data from the table
export function getTableData() {
	return new Promise((resolve, reject) => {
		const getRows = `SELECT * FROM pastes`;
		db.all(getRows, [], (err, rows) => {
			if (err) {
				reject({message: err.message});
			}
			resolve(rows);
		});
	});
}

// Delete the data from the table
export function deleteTableData() {
	const getRows = `DELETE FROM pastes`;
	db.run(getRows, (err) => {
		if (err) return console.error(err.message);
	});
}



