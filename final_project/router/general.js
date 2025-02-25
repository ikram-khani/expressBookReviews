const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if both fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books: JSON.stringify(books, null, 2) });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from request parameters
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn]); // Return book details
  } else {
    return res.status(404).json({ message: "Book not found" }); // If ISBN does not exist
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Extract author from request parameters
  let booksByAuthor = [];

  // Iterate through the books object
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      booksByAuthor.push({ isbn, ...books[isbn] });
    }
  });

  // Check if any books were found
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});


// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Extract title from request parameters
  let booksByTitle = [];

  // Iterate through the books object
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      booksByTitle.push({ isbn, ...books[isbn] });
    }
  });

  // Check if any books were found
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from request parameters
  
  // Check if the book exists
  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
