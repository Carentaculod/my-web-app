/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3008/getAllUsers');
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePrediction = async (user) => {
    try {
      const response = await axios.post('http://localhost:3008/predict', user);
      const updatedUser = { ...user, predictionField: response.data.prediction };
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      );
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);  // Navigates to the previous page
  };

  const handlePrint = () => {
    window.print();  // Opens the print dialog
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="table-container">
      {/* Back and Print Buttons */}
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
      <button className="print-button" onClick={handlePrint}>
        Print
      </button>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Status</th>
            <th>Educational Attainment</th>
            <th>Occupation</th>
            <th>Monthly Income</th>
            <th>4ps Beneficiary</th>
            <th>Number of Family Members</th>
            <th>Prediction Field</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.gender}</td>
                <td>{user.age}</td>
                <td>{user.status}</td>
                <td>{user.educational_attainment}</td>
                <td>{user.occupation}</td>
                <td>{user.monthly_income}</td>
                <td>{user.beneficiary}</td>
                <td>{user.number_of_family_members}</td>
                <td>{user.predictionField}</td>
                <td>
                  <button onClick={() => handlePrediction(user)}>Predict</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          margin: 20px;
          padding: 20px;
          background-color: #f4f7fa;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .back-button,
        .print-button {
          position: absolute;
          top: 10px;
          padding: 8px 16px;
          background-color: #89A6B6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .back-button {
          left: 10px;
        }

        .print-button {
          right: 10px;
        }

        .back-button:hover,
        .print-button:hover {
          background-color: #45a049;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 40px;
        }

        .user-table th,
        .user-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .user-table th {
          background-color: #89A6B6;
          color: white;
          font-size: 16px;
        }

        .user-table tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .user-table tr:hover {
          background-color: #ddd;
        }

        .loading {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #4CAF50;
        }

        .error {
          text-align: center;
          font-size: 18px;
          color: red;
        }

        .user-table td {
          font-size: 14px;
          color: #333;
        }

        /* Print styles */
        @media print {
          .back-button,
          .print-button {
            display: none; /* Hide buttons during printing */
          }

          .table-container {
            box-shadow: none;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default UserTable;
