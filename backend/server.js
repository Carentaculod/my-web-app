/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; // Correctly import body-parser as a CommonJS module
import { createConnection } from 'mysql2';
import { exec } from 'child_process'; // Import exec to run Python scripts
import path from 'path'; // Import path to resolve relative paths
import fs from 'fs'; // Import fs to check file existence

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Use the json method from body-parser

// Create MySQL connection
const db = createConnection({
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
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Predict route (adjusted)
app.post('/predict', (req, res) => {
  const { age, gender, status, educational_attainment, occupation, monthly_income, beneficiary, number_of_family_members } = req.body;

  // Log the request body to check the data
  console.log('Received data:', req.body);

  // Ensure the path to the Python script is correct
  const pythonScriptPath = path.join(path.resolve(), 'import.py');

  // Check if the Python script exists at the specified path
  if (fs.existsSync(pythonScriptPath)) {
    // Properly escape the values and create a safe command
    const command = `python "${pythonScriptPath}" ${age} "${gender}" "${status}" "${educational_attainment}" "${occupation}" ${monthly_income} "${beneficiary}" ${number_of_family_members}`;

    console.log('Command:', command); // Log the command to verify

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing Python script:', error);
        return res.status(500).json({ message: 'Error predicting', error: error.message });
      }

      if (stderr) {
        console.error('Python script error:', stderr);
        return res.status(500).json({ message: 'Error predicting', error: stderr });
      }

      try {
        // Parse the prediction from Python script output
        const prediction = stdout.trim();
        res.json({ prediction });
      } catch (parseError) {
        console.error('Error parsing Python script output:', parseError);
        return res.status(500).json({ message: 'Error parsing Python output', error: parseError.message });
      }
    });
  } else {
    console.error('Python script not found at:', pythonScriptPath);
    return res.status(500).json({ message: 'Python script not found, cannot execute.' });
  }
});


// Save route
app.post('/save', (req, res) => {
  const { name, gender, age, status, educational_attainment, occupation, monthly_income, beneficiary, number_of_family_members, predictionField } = req.body;

  const query = 'INSERT INTO dataset (name, gender, age, status, educational_attainment, occupation, monthly_income, beneficiary, number_of_family_members, predictionField) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [name, gender, age, status, educational_attainment, occupation, monthly_income, beneficiary, number_of_family_members, predictionField], (err, result) => {
    if (err) {
      console.error('Error saving household data:', err.message); // Log the error message
      return res.status(500).json({ message: 'Error saving data', error: err.message }); // Include the detailed error message
    }
    res.status(201).json({ message: 'Data saved successfully!' });
  });
});

// Fetch all users for table display
app.get('/getAllUsers', (req, res) => {
  const query = 'SELECT * FROM dataset';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Error fetching data', error: err.message });
    }
    res.status(200).json(results);
  });
});

// Start server
app.listen(3011, () => {
  console.log('Server running on port 3011'); // Fixed the port in the log message
});