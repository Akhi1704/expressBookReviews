const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

// Helper functions
const isValid = (username) => users.some(user => user.username === username);

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Register new user
regd_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Login user
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
    req.session.token = token;

    return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const { review } = req.body;
    const isbn = req.params.isbn;

    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const username = jwt.verify(req.session.token, "fingerprint_customer").username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (!req.session.token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const username = jwt.verify(req.session.token, "fingerprint_customer").username;

    if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
