/* eslint-disable react/prop-types */
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

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Basic form validation
    if (!formData.name || !formData.age || !formData.gender || !formData.status || !formData.educational_attainment) {
      return 'Please fill out all required fields.';
    }

    if (isNaN(formData.age) || isNaN(formData.monthly_income) || isNaN(formData.number_of_family_members)) {
      return 'Please enter valid numbers for age, monthly income, and number of family members.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message before submission

    // Validate form data
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3011/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Prediction failed: ${errorData}`);
      }

      const data = await response.json();
      setFormData({
        ...formData,
        predictionField: data.prediction, // Update the form data with the prediction
      });

      alert(`Prediction successful: ${data.prediction}`);

      // Save the form data with the prediction to the database
      await saveFormDataWithPrediction({ ...formData, predictionField: data.prediction });
    } catch (error) {
      console.error('Error predicting:', error);
      setErrorMessage(error.message || 'Unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveFormDataWithPrediction = async (formDataWithPrediction) => {
    try {
      const response = await fetch('http://localhost:3011/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataWithPrediction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving data');
      }

      alert('Data saved successfully!');
      resetForm(); // Reset the form after successful save
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage(error.message || 'Unexpected error occurred while saving.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gender: '',
      age: '',
      status: '',
      educational_attainment: '',
      occupation: '',
      monthly_income: '',
      beneficiary: '',
      number_of_family_members: '',
      predictionField: '',
    });
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

      {/* Error Message */}
      {errorMessage && (
        <div style={styles.errorMessage}>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />

        <label>Gender:</label>
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} style={styles.input} required />

        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} style={styles.input} required />

        <label>Status:</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} style={styles.input} required />

        <label>Educational Attainment:</label>
        <input type="text" name="educational_attainment" value={formData.educational_attainment} onChange={handleChange} style={styles.input} required />

        <label>Occupation:</label>
        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} style={styles.input} required />

        <label>Monthly Income:</label>
        <input type="number" name="monthly_income" value={formData.monthly_income} onChange={handleChange} style={styles.input} required />

        <label>4ps Beneficiary (yes or no):</label>
        <input type="text" name="beneficiary" value={formData.beneficiary} onChange={handleChange} style={styles.input} required />

        <label>Number of Family Members:</label>
        <input type="number" name="number_of_family_members" value={formData.number_of_family_members} onChange={handleChange} style={styles.input} required />

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
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
  errorMessage: {
    color: 'red',
    backgroundColor: '#f8d7da',
    padding: '10px',
    margin: '20px',
    borderRadius: '5px',
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
