import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomePage from './components/HomePage'; 
import AddHousehold from './components/AddHousehold';
import Table from './components/Table';
import Profile from './components/Profile';
import Graph from './components/Graph';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/addhousehold" element={<AddHousehold />} />
          <Route path="/table" element={<Table />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
