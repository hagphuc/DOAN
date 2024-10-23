import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';  // CSS để trang trí

function App() {
  return (
    <Router>
      <div className="App">
        {/* Main content */}
        <div className="main-content">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-info">
              <p>&copy; 2024 Flower Paradise. All rights reserved.</p>
              <p>Contact us: info@flowerparadise.com | Phone: +123 456 789</p>
            </div>
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                  <img src={`${process.env.PUBLIC_URL}/facebook.png`} alt="Facebook" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                  <img src={`${process.env.PUBLIC_URL}/instagram.png`} alt="Instagram" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                  <img src={`${process.env.PUBLIC_URL}/twitter.png`} alt="Twitter" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-background">
            <img src={`${process.env.PUBLIC_URL}/background.jpg`} alt="Flower Background" />
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
