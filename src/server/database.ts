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
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		author TEXT NOT NULL, 
		title TEXT NOT NULL, 
		contentShort TEXT NOT NULL, 
		contentFull TEXT NOT NULL, 
		date TEXT NOT NULL)`;
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
		const insertString = `INSERT INTO pastes(author, title, contentShort, contentFull, date)
		VALUES (?, ?, ?, ?, ?)`;
		db.run(insertString,
			[pasteData.author, pasteData.title,
			pasteData.contentShort, pasteData.contentFull, pasteData.date],
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

// Delete the data from the table
export function deleteTableData() {
	const getRows = `DELETE FROM pastes`;
	db.run(getRows, (err) => {
		if (err) return console.error(err.message);
		
	});
}



