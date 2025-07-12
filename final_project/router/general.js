const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // 检查是否提供用户名和密码
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // 检查用户名是否已存在
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // 添加新用户
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).send(JSON.stringify(books, null, 4)); // 美化输出
});

const axios = require('axios');

public_users.get('/books-promise', (req, res) => {
  axios.get('http://localhost:5000/')
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to fetch books", error: error.message });
    });
});

public_users.get('/books-promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(404).json({ message: "Book not found or error occurred", error: error.message });
    });
});

public_users.get('/books-promise/author/:author', (req, res) => {
    const author = req.params.author;
  
    axios.get(`http://localhost:5000/author/${author}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(404).json({ message: "Author not found or error occurred", error: error.message });
      });
  });

  public_users.get('/books-promise/title/:title', (req, res) => {
    const title = req.params.title;
  
    axios.get(`http://localhost:5000/title/${title}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(404).json({ message: "Title not found or error occurred", error: error.message });
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found for ISBN: " + isbn });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const matchingBooks = [];
  
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
  
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found for author: " + req.params.author });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const matchingBooks = [];
  
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
  
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found with title: " + req.params.title });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "Book not found for ISBN: " + isbn });
    }
  });
  

module.exports.general = public_users;
