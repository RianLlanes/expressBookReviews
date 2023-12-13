// This is auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Simple check if the username exists in the users array
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Simple check if the username and password match
  return users.some((user) => user.username === username && user.password === password);
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username) && authenticatedUser(username, password)) {
    // Implement JWT creation and session saving logic here
    // You may use the 'jsonwebtoken' library for this
    const token = jwt.sign({ username: username }, 'your_secret_key');
    req.session.username = username; // Save username in session
    res.json({ message: "Login successful", token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
