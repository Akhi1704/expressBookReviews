const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
const public_users = express.Router();

// Base URL for Axios
const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using Promises or Async-Await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Task 11: Get book details by ISBN using Promises or Async-Await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${BASE_URL}/books/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found", error: error.message });
    }
});

// Task 12: Get books by author using Promises or Async-Await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        const booksByAuthor = Object.values(response.data).filter(
            book => book.author.toLowerCase() === author
        );
        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Task 13: Get books by title using Promises or Async-Await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        const booksByTitle = Object.values(response.data).filter(
            book => book.title.toLowerCase() === title
        );
        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

module.exports.general = public_users;
