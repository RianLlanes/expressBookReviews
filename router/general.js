const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/books')
      .then(response => resolve(response.data))
      .catch(error => reject('Unable to fetch books'));
  });
};

const fetchBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => resolve(response.data))
      .catch(error => reject(`Unable to fetch book by ISBN: ${isbn}`));
  });
};

const fetchBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/author/${author}`)
      .then(response => resolve(response.data))
      .catch(error => reject(`Unable to fetch books by author: ${author}`));
  });
};

const fetchBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/title/${title}`)
      .then(response => resolve(response.data))
      .catch(error => reject(`Unable to fetch books by title: ${title}`));
  });
};

public_users.get('/', async function (req, res) {
  try {
    const books = await fetchBooks();
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  fetchBookByISBN(isbn)
    .then(book => res.send(JSON.stringify(book, null, 4)))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  fetchBooksByAuthor(author)
    .then(books => res.send(JSON.stringify(books, null, 4)))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  fetchBooksByTitle(title)
    .then(books => res.send(JSON.stringify(books, null, 4)))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

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

module.exports.general = public_users;
