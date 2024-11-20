/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    address: '',
    emergencyContact: '',
    profilePic: '', // Added profilePic to user data
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== 'undefined') {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No valid user data found in localStorage");
      navigate('/'); // Redirect to login if no user data
    }
  }, [navigate]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: reader.result,
        }));
        localStorage.setItem("user", JSON.stringify({
          ...user,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    setIsEditing((prevEdit) => !prevEdit);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/'); // Redirect to login
  };

  if (!user) {
    return <div style={styles.loading}>Loading user data...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileContainer}>
        <div style={styles.profilePicContainer}>
          <img
            src={user.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            style={styles.profilePic}
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={styles.fileInput}
            />
          )}
        </div>
        <div style={styles.userInfo}>
          <h2>{user.name || 'This is Your Profile'}</h2>
          <p>{user.email || 'N/A'}</p>
          {isEditing ? (
            <>
              <label>Age:</label>
              <input type="text" name="age" value={user.age} onChange={handleInputChange} />
              <label>Address:</label>
              <input type="text" name="address" value={user.address} onChange={handleInputChange} />
              <label>Emergency Contact:</label>
              <input type="text" name="emergencyContact" value={user.emergencyContact} onChange={handleInputChange} />
            </>
          ) : (
            <>
              <p><strong>Age:</strong> {user.age || 'N/A'}</p>
              <p><strong>Address:</strong> {user.address || 'N/A'}</p>
              <p><strong>Emergency Contact:</strong> {user.emergencyContact || 'N/A'}</p>
            </>
          )}
          <div style={styles.buttonContainer}>
            <button onClick={toggleEdit} style={styles.editButton}>
              {isEditing ? "Save" : "Edit Profile"}
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: '#f0f4f8',
    padding: '20px',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  profilePicContainer: {
    marginBottom: '20px',
    textAlign: 'center',
    position: 'relative',
  },
  profilePic: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  fileInput: {
    display: 'block',
    marginTop: '10px',
  },
  userInfo: {
    textAlign: 'center',
    color: '#333',
  },
  editButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#26a69a',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  logoutButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#ff5252',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '24px',
    color: '#333',
  },
};
