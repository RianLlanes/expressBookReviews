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

module.exports.general = public_users;
