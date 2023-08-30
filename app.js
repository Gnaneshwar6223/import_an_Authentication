const express = require("express");
const {open} = require("sqlite");
const sqlite3=require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
 app.use(express.json());
 const dbPath = path.join(__dirname,"userData.db");
 let db = null;
 const initializeDBAndServer =async () =>{
     try{
         db=await open ({
             filename: dbPath,
             driver:sqlite3.Database,
         });
         app.listen(3000,()=>{
             console.log("Server Running at http://localhost:3000/");
         });
     }catch (error){
         console.log(`DB Error: ${error}`);
         process.exit(1)
     }
 };
 initializeDBAndServer();

 app.post("/register/",async(request,response)=>{
  const {username,name,password,gender,location}=request.body;
  const hashedPassword=await bcrypt.hash(password,10);
  const checkUserQuery =`
  SELECT
    username
  FROM
    user
  WHERE
    username='${username}' ;`;
  const userResponse=await db.get(checkUserQuery);
  if (userResponse===undefined){
      const createUserQuery=`
      INSERT INTO
        user (username,name,password,gender,location)
      VALUES
        ('${username}','${name}','${hashedPassworf}','${gender}','${location}');`;
      if(password.length>5){
          const createUser = await database.run(createUserQuery);
          response.send("User created successfully") //Scenario 3
      }else{
          response.status(400);
          response.send("Password is too short");  //Scenario 2
      }
  }else{
      response.status(400);
      response.send("User already exists");  //Scenario 1
  }
 });

 //API 2
//Path: /login
//Method: POST
app.post("/login/",async(request,response)=>{
  const {username,password}=request.body;
  const checkUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const userNameResponse = await db.get(checkUserQuery);
  if(userNameResponse!==undefined){
      const isPasswordMatched=await bcrypt.compare(password.userNameResponse.password);
      if(isPasswordMatched){
          response.status(200);
          response.send("Login success!") //Scenario 3
      }else{
          response.status(400);
          response.send("Invalid password") //Scenario 2
      }
    }else{
        response.status(400);
        response.send("Invalid user")  //Scenario 1
  }
});

//API 3
//Path: /change-password
//Method: PUT

app.put("/change-password/",(request,response)=>{
  const {username, oldPassword, newPassword}=request.body;
  const checkUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const userDetails= await db.get(checkUserQuery);
  if(userDetails!==undefined){
    const isPasswordValid=await bcrypt.compare(oldPassword,userDetails.password);
    if(isPasswordValid){
        if(newPassword.length>5){
            const hashedPassword=await bcrypt.hash(newPassword,10)
            const updatePasswordQuery=`update user set
            password='${hashedPassword}' where username='${username}';`;
            const userDetails = await db.get(checkUserQuery);
            response.status(200);
            response.send("Password updated") //Scenario 3
        }else{
            response.status(400);
            response.send("Password is too short");
        }
    }else{
        response.status(400);
        response.send("Invalid current password")
    }
    }else{
      response.status(400);
      response.send(`Invalid user`); // Scenario 4
    }
})


module.exports = app;