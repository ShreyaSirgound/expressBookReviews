const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the user already exists
    if (isValid(username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    // Add the new user to the users array
    users.push({ username: username, password: password });
    
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  });

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Simulating async operation with Promise
      const getAllBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
  
      const bookList = await getAllBooks();
      res.send(JSON.stringify(bookList, null, 2));
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
  
    getBookByISBN
      .then((book) => {
        res.json(book);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    try {
      const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
          let booksByAuthor = {};
          
          for (let isbn in books) {
            if (books[isbn].author === author) {
              booksByAuthor[isbn] = books[isbn];
            }
          }
          
          if (Object.keys(booksByAuthor).length > 0) {
            resolve(booksByAuthor);
          } else {
            reject("No books found by this author");
          }
        });
      };
  
      const result = await getBooksByAuthor();
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    const getBooksByTitle = new Promise((resolve, reject) => {
      let booksByTitle = {};
      
      for (let isbn in books) {
        if (books[ibn].title === title) {
          booksByTitle[isbn] = books[isbn];
        }
      }
      
      if (Object.keys(booksByTitle).length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });
  
    getBooksByTitle
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if the book exists
  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
