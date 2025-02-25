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

getBookByISBN("9"); 

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

//using axios and async await to get book by author
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data); // Logs books by the author
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
};

getBooksByAuthor("Dante Alighieri"); 

 
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    let booksByAuthor = [];

    // Use Object.keys to iterate through books and find matches
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        booksByAuthor.push({ isbn, ...books[isbn] });
      }
    });

    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

//using axios and promises to get book by title
const title = "Fairy tales"; 

axios.get(`http://localhost:5000/title/${title}`)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error("Error fetching books:", error.message);
  });


// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    let booksByTitle = [];

    // Use Object.keys to iterate through books and find matches
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) {
        booksByTitle.push({ isbn, ...books[isbn] });
      }
    });

    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
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
