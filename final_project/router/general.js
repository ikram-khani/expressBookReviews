const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');


const getBooksAsync = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data); // Logs the books to the console
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
};

getBooksAsync();

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books); // Directly returning books (no infinite loop)
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Store as an array of objects
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

//get books by isbn directly through axios
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data); // Logs the book details
  } catch (error) {
    console.error("Error fetching book:", error.message);
  }
};

getBookByISBN("9"); // Replace with a valid ISBN

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn; 
    if (books[isbn]) {
      return res.status(200).json(books[isbn]); // Return book details
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
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
