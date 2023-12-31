require("dotenv").config();
const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")
});

app.post("/",function(req,res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);
  
  const url = 'https://us12.api.mailchimp.com/3.0/lists/5850214230';

  const options = {
      method:"POST",
      auth : process.env.API_KEY
  }

  const request = https.request(url , options , function(response){
    response.on("data",function(data){
      console.log(JSON.parse(data))
    })
  });

  request.write(jsonData);
  request.end();

});

app.listen(3000,function(){
  console.log("Server running on port 3000");
})


