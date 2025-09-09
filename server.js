require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB URI from the .env file
const uri = process.env.MONGO_URI;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    
    // Access the database and collection
    const db = client.db('userDB');  // Make sure 'userDB' matches your MongoDB Atlas DB name
    const usersCollection = db.collection('users');  // Ensure the collection name is 'users'

    // POST route to handle form submissions and save user data to MongoDB
    app.post('/submit', (req, res) => {
      const { name, email, age } = req.body;
      if (!name || !email || !age) {
        return res.status(400).send('All fields are required');
      }

      const newUser = { name, email, age };

      // Insert the new user into the 'users' collection
      usersCollection.insertOne(newUser)
        .then(result => {
          res.send('User added successfully!');
        })
        .catch(error => {
          console.error('Error inserting data:', error);
          res.status(500).send('Error adding user');
        });
    });

    // Serve the HTML form when visiting the root URL
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
