
const express = require('express');

const mysql = require("mysql2");
//it allows fronted to communicate with backend on different ports
const cors =require("cors")
 require('dotenv').config();


const port = 3003;


const app = express();
//used to parse the json request
app.use(express.json());  
//it enables the cors for all requests
app.use(cors())


//creates the connection to the mysql database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


//it establishes the connection to the mysql
db.connect((err) => {
    if(err){
        console.log("error connecting to mysql: ",err)
    }else{
        console.log("connected to mysql")
    }
});


app.get("/tasks",(req,res) => {
    db.query("select * from tasks",(err,result) => {
        if(err){
            res.send("error in fetching data",+err);
            res.status(500);
        }else{
            res.send(result);
        }
    })

});

app.post("/sendingData",(req,res) => {
    console.log(req.body)
    db.query(`insert into tasks (title) values (?)`,[req.body.title],(err,result) => {
        if(err){
            res.send(err)
        }else{
            res.send("successfully added tasks to the table")
        }
    })
});

app.delete("/deleteTask/:id",(req,res) => {
   
     db.query("delete from tasks where id = ?",[req.params.id],(err,result) => {
        if(err){
            res.send("error in deleting task:" +err)
            res.status(500)
        }else{
            res.send("task deleted successfully")
        }
     })
});

app.patch("/updateTask/:id",(req,res) => {
    db.query("update tasks set title = ? where id = ?",[req.body.title,req.params.id],(err,result) => {
        if(err){
            console.log("error updating task"+err)
            res.status(500);
        }else{
            console.log("task updated successfully")
        }
    })
})

app.listen(port,()=> {
    console.log("connected to the port "+port)
});