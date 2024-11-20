/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const UserGraph = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGraph, setSelectedGraph] = useState(null); // State to manage selected graph

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3011/getAllUsers');
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Process data for charts
  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [
          users.filter(user => user.gender === 'Male').length,
          users.filter(user => user.gender === 'Female').length,
        ],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const ageData = {
    labels: users.map(user => user.name),
    datasets: [
      {
        label: 'Age',
        data: users.map(user => user.age),
        backgroundColor: '#000000', // Set bar color to black
      },
    ],
  };

  const incomeData = {
    labels: users.map(user => user.name),
    datasets: [
      {
        label: 'Monthly Income',
        data: users.map(user => user.monthly_income),
        borderColor: '#000000', // Set line color to black
        fill: false,
      },
    ],
  };

  const renderGraph = () => {
    switch (selectedGraph) {
      case 'gender':
        return <Pie data={genderData} />;
      case 'age':
        return <Bar data={ageData} />;
      case 'income':
        return <Line data={incomeData} />;
      default:
        return <div>Select a graph to view</div>;
    }
  };

  // Function to print the selected graph
  const printGraph = () => {
    // Ensure the graph is fully rendered before printing
    const graphContainer = document.getElementById('single-graph-container');
    
    // Clone the graph container to avoid modifying the original
    const graphClone = graphContainer.cloneNode(true);

    // Remove the print button and back button from the cloned graph container
    const printButton = graphClone.querySelector('button');
    const backButton = graphClone.querySelector('.back-button');
    if (printButton) {
      printButton.remove();
    }
    if (backButton) {
      backButton.remove();
    }

    // Open a new print window
    const printWindow = window.open('', '_blank');
    
    // Ensure the window is styled properly to render the graph
    printWindow.document.write('<html><head><title>Graph</title>');
    
    // Include necessary styles for the graph to render properly
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      .graph-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
      }
      canvas {
        width: 100% !important;
        height: auto !important;
      }
    `);
    printWindow.document.write('</style>');
  
    // Write the cloned graph content into the print window
    printWindow.document.write('</head><body>');
    printWindow.document.write(graphClone.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
  
    // Wait for the content to fully load and then trigger the print dialog
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="graph-container" id="graph-container">
      {/* Back Button to previous page */}
      <div className="back-button-top" onClick={() => window.history.back()}>
        <button>Back To Home</button>
      </div>

      {/* Back Button to All Graphs */}
      {selectedGraph && (
        <div className="back-button" onClick={() => setSelectedGraph(null)}>
          <button>Back to All Graphs</button>
        </div>
      )}

      <h2>Data Analysis</h2>
      {!selectedGraph ? (
        <div className="card-container">
          <div
            className={`card ${selectedGraph === 'gender' ? 'selected' : ''}`}
            onClick={() => setSelectedGraph('gender')}
          >
            <h3>Gender Distribution</h3>
            <Pie data={genderData} />
          </div>
          <div
            className={`card ${selectedGraph === 'age' ? 'selected' : ''}`}
            onClick={() => setSelectedGraph('age')}
          >
            <h3>Age Distribution</h3>
            <Bar data={ageData} />
          </div>
          <div
            className={`card ${selectedGraph === 'income' ? 'selected' : ''}`}
            onClick={() => setSelectedGraph('income')}
          >
            <h3>Monthly Income Distribution</h3>
            <Line data={incomeData} />
          </div>
        </div>
      ) : (
        <div className="single-graph" id="single-graph-container">
          <h3>Viewing {selectedGraph} graph</h3>
          {renderGraph()}
          <button onClick={printGraph}>Print Graph</button>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .graph-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 1200px;
          margin: auto;
          padding: 40px;
          background-color: #89A6B6;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .back-button-top {
          margin-bottom: 20px;
        }
        .back-button-top button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: black;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .back-button-top button:hover {
          background-color: black;
        }
        .back-button {
          margin-bottom: 20px;
        }
        .back-button button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: black;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .back-button button:hover {
          background-color: black;
        }
        h2 {
          font-size: 2.5rem;
          margin-bottom: 30px;
          color: #333;
          margin-top: 20px; /* Adjusted margin for the back button */
        }
        .card-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          width: 100%;
        }
        .card {
          width: 280px;
          margin: 20px;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .card.selected {
          background-color: white !important; /* Ensure it stays white */
        }
        .card:hover {
          transform: scale(1.05);
        }
        .card h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }
        .single-graph {
          width: 100%;
          max-width: 800px;
          margin: auto;
        }
        button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default UserGraph;
