const express = require('express');
const ejs = require('ejs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set up SQLite database (in-memory)
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)");
});

// Set up Express middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files

// Home Route - Fetch and display posts
app.get('/', (req, res) => {
  db.all("SELECT * FROM posts", (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      res.render('home', { posts: rows });
    }
  });
});

// Create a new post
app.post('/compose', (req, res) => {
  const { postTitle, postBody } = req.body;
  db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [postTitle, postBody], (err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

// Delete a post
app.post('/delete/:id', (req, res) => {
  const postId = req.params.id;
  db.run("DELETE FROM posts WHERE id = ?", [postId], (err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
