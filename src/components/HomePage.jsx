/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sagbayanImage from '../assets/MAIN3.png';
import addHouseholdImage from '../assets/H2.png';
import table from '../assets/LIST.png';
import graph from '../assets/GRAPH.png';
import user from '../assets/RECORD.png';

export default function HomePage() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle the sidebar visibility
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false); // Close the sidebar
  };

  return (
    <div style={styles.container}>
      {/* Sidebar button to toggle visibility */}
      <button onClick={toggleSidebar} style={styles.toggleButton}>
        {isSidebarVisible ? 'Hide Menu' : 'Show Menu'}
      </button>

      {/* Sidebar */}
      <div style={{ ...styles.sidebar, display: isSidebarVisible ? 'block' : 'none' }}>
        <button onClick={closeSidebar} style={styles.closeButton}>X</button> {/* Close button */}
        <h2 style={styles.sidebarTitle}>Menu</h2>
        <ul style={styles.menuList}>
          <li><Link to="/profile" style={styles.menuItem}>Profile</Link></li>
        
        </ul>
      </div>

      <div style={styles.mainContent(isSidebarVisible)}>
       
        <div style={styles.cardContainer}>
          <Link to="/addhousehold" style={{ ...styles.card, backgroundImage: `url(${addHouseholdImage})` }}>
          </Link>
          <Link to="/table" style={{ ...styles.card, backgroundImage: `url(${table})` }}>
          </Link>
          <Link to="/graph" style={{ ...styles.card, backgroundImage: `url(${graph})` }}>
          </Link>
          <Link to="/user" style={{ ...styles.card, backgroundImage: `url(${user})` }}>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(${sagbayanImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  toggleButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  sidebar: {
    width: '100px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: '0',
    top: '0',
    bottom: '0',
  },
  closeButton: {
    
    color: 'black',
   
    
    
   
    cursor: 'pointer',
    fontSize: '10px',
    alignSelf: 'center',
  },
  sidebarTitle: { fontSize: '24px', marginBottom: '20px' },
  menuList: { listStyleType: 'none', padding: '0' },
  menuItem: {
    padding: '12px 20px',
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'block',
  },
  mainContent: (isSidebarVisible) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: isSidebarVisible ? '220px' : '0', // Adjust content to make room for the sidebar when visible
  }),
  title: { fontSize: '36px', color: 'white', marginTop: '%' },
  paragraph: { fontSize: '18px', color: 'white' },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '150px',
  },
  card: {
    width: '150px',
    height: '100px',
    backgroundColor: '#89A6B6',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    cursor: 'pointer',
    textDecoration: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cardText: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '16px',
  },
};
