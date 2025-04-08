import db from '../database/db.js';
const express = require('express');
const User = express.Router();

User.post('/login',(req,res)=>{
  try{
  const { username,password } = req.body;
  const query = `SELECT * FROM users WHERE (name,password) VALUES (?,?) `;
  const user = db.prepare(query).run(username,password);
  if(!user){
    res.status(411).json({
      msg:'Invalid credentials'
    })
    return 
  }
  res.json();
  return
  }catch(e){
    res.status(500).json();
    return
  }
  })
