// This is general.js

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
      
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://your-api-endpoint/books');
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorToFind = req.params.author;

  // Find the first book that matches the provided author
  const book = Object.values(books).find((book) => book.author === authorToFind);

  // If a book by the author is found, send it as a response; otherwise, return a 404 status
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Books not found for the provided author." });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleToFind = req.params.title;

  // Find the first book that matches the provided title
  const book = Object.values(books).find((book) => book.title === titleToFind);

  // If a book by the title is found, send it as a response; otherwise, return a 404 status
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found for the provided title." });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].review);
});

module.exports.general = public_users;
