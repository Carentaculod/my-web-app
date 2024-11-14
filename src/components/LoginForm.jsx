import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from '../assets/bg.png';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3008/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage(data.message);
        navigate('/home');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred during login.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        <p style={styles.message}>{message}</p>
        <p style={styles.registerLink}>
          Dont have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </form>
    </div>
  );
}

// Internal CSS styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    width: '300px',
    textAlign: 'center',
  },
  title: { fontSize: '24px', marginBottom: '20px', color: '#000' },
  input: {
    width: '93%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  message: { color: 'red', marginTop: '10px' },
  registerLink: { marginTop: '15px', color: '#000' },
  link: { color: '#00f', textDecoration: 'underline' },
};
