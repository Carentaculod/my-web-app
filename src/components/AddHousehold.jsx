/* eslint-disable react/prop-types */
// UserForm.jsx
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserForm({ onUserAdded }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', gender: '', age: '', status: '',
    educational_attainment: '', occupation: '',
    monthly_income: '', beneficiary: '',
    number_of_family_members: '', predictionField: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3008/submitUserForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      // Reset the form
      setFormData({
        name: '', gender: '', age: '', status: '',
        educational_attainment: '', occupation: '',
        monthly_income: '', beneficiary: '',
        number_of_family_members: '', predictionField: '',
      });

      if (!response.ok) {
        console.error(`Error storing form data: ${data.message}`);
      } else {
        alert(data.message); // Notify on successful submission
        onUserAdded(); // Refresh the users in the table
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <div style={styles.navbar}>
        <button onClick={handleBack} style={styles.backButton}>Back</button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} />

        <label>Gender:</label>
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} style={styles.input} />

        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} style={styles.input} />

        <label>Status:</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} style={styles.input} />

        <label>Educational Attainment:</label>
        <input type="text" name="educational_attainment" value={formData.educational_attainment} onChange={handleChange} style={styles.input} />

        <label>Occupation:</label>
        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} style={styles.input} />

        <label>Monthly Income:</label>
        <input type="number" name="monthly_income" value={formData.monthly_income} onChange={handleChange} style={styles.input} />

        <label>4ps Beneficiary (yes or no):</label>
        <input type="text" name="beneficiary" value={formData.beneficiary} onChange={handleChange} style={styles.input} />

        <label>Number of Family Members:</label>
        <input type="number" name="number_of_family_members" value={formData.number_of_family_members} onChange={handleChange} style={styles.input} />

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundImage: 'url(/src/assets/bg.png)', // Adjust to relative path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    flexDirection: 'column',
    backgroundAttachment: 'fixed', // Ensures background stays fixed while scrolling
  },
  navbar: {
    width: '100%',
    backgroundColor: '#333',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '10',
  },
  backButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#89A6B6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '90vw',
    padding: '50px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '80px', // Adjust to give space for the navbar
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#89A6B6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
