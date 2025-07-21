require("dotenv").config({path:require("path").resolve(__dirname,"..",".env")});
const {Pool}=require("pg");

module.exports=new Pool({
    connectionString:process.env.CONNECTION_STRING,
    client_encoding:"utf8",
})
