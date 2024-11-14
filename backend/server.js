/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const axios = require('axios');  // Import axios to request predictions from Python server

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'home', // Update if needed
  password: 'home', // Update if needed
  database: 'home', // Your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Register route
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'INSERT INTO user (email, password) VALUES (?, ?)';
  db.query(query, [email, password], err => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ message: 'Error registering user' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging in' });
    }
    if (results.length > 0) {
      const user = results[0];
      // Return user data upon successful login
      return res.status(200).json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          // Add any other user fields you want to include here
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Route to store form data with prediction
app.post('/submitUserForm', async (req, res) => {
  const {
    name, gender, age, status,
    educational_attainment, occupation,
    monthly_income, beneficiary,
    number_of_family_members
  } = req.body;

  try {
    // Send data to the Python Flask API for prediction
    const predictionResponse = await axios.post('http://localhost:5001/predict', {
      age,
      monthly_income,
      number_of_family_members
    });

    const prediction = predictionResponse.data.prediction;

    // Store the form data along with the prediction in the database
    const query = `INSERT INTO dataset 
      (name, gender, age, status, educational_attainment, occupation, monthly_income, beneficiary, number_of_family_members, predictionField) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [name, gender, age, status, educational_attainment, occupation, monthly_income, beneficiary, number_of_family_members, prediction], err => {
      if (err) {
        console.error('Error storing form data:', err.message);
        return res.status(500).json({ message: 'Error storing form data', error: err.message });
      }
      res.status(200).json({ message: 'Form data stored successfully with prediction', prediction });
    });
  } catch (error) {
    console.error('Error getting prediction:', error.message);
    res.status(500).json({ message: 'Error getting prediction', error: error.message });
  }
});

// Fetch all users for table display
app.get('/getAllUsers', (req, res) => {
  const query = 'SELECT * FROM dataset';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err); // Log the exact error
      return res.status(500).json({ message: 'Error fetching data', error: err.message });
    }
    res.status(200).json(results);
  });
});

// Start server
app.listen(3008, () => {
  console.log('Server running on port 3008');
});
