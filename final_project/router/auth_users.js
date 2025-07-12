const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const jwtSecret = "access"; // 用于生成 JWT 的密钥

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 检查用户名和密码是否提供
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // 验证凭据
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // 生成 JWT 并存储到 session 中
  const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
  req.session.authorization = {
    token,
    username
  };

  return res.status(200).json({ message: "Login successful", token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    const username = req.session.authorization?.username;
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Missing review query parameter" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    book.reviews[username] = review;
  
    return res.status(200).json({
      message: `Review by '${username}' added/updated successfully`,
      reviews: book.reviews
    });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews[username]) {
      return res.status(404).json({ message: `No review by '${username}' found for this book` });
    }
  
    // 删除评论
    delete book.reviews[username];
  
    return res.status(200).json({ message: `Review by '${username}' deleted successfully` });
  });
  
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
