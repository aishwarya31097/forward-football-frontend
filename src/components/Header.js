import React from 'react';
import '../App.css';
const Header = ({ darkMode, handleDarkModeToggle }) => {
  return (
    <div className="row mb-4 fixed-top Heading-main">
      <div className="col-md-2">
        <img
          src="logoFFfilled.png"
          alt="Football Dashboard Logo"
          className="logo"
        />
      </div>
      <div className="col-md-8 text-center">
        <h1 className="Heading">Forward Football Dashboard</h1>
      </div>
      <div className="col-md-2 text-center">
        <button className="button" onClick={handleDarkModeToggle}>
          {darkMode ? (
            <i className="bi bi-sun"></i>
          ) : (
            <i className="bi bi-moon"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
