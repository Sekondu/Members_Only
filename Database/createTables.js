require("dotenv").config({path:require("path").resolve(__dirname,"..",".env")});
const db=require("./db");
const {Client}=require("pg");
const SQL=`

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS session;

CREATE TABLE IF NOT EXISTS users(
ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
Member Boolean DEFAULT FALSE,
ADMIN Boolean DEFAULT FALSE);

CREATE TABLE IF NOT EXISTS messages(
ID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
content TEXT NOT NULL,
user_id INTEGER NOT NULL REFERENCES users(ID),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS session(
"sid" varchar NOT NULL COLLATE "default" PRIMARY KEY,
"sess" json not null,
"expire" timestamp(6) not null
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session (expire);`
async function main()
{
let client=new Client({connectionString:process.env.CONNECTION_STRING});
await client.connect();
await client.query(SQL);
await client.end();
}
main();