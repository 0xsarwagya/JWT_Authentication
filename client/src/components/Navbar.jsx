import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLogin(true);
    } else {
      fetch("http://localhost:5000/protected", {
        headers: {
          "x-access-token": token,
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setLogin(true);
          });
        } else {
          setLogin(true);
        }
      });
    }
  }, []);

  return (
    <nav>
      <Link to="/" className="branding">
        Sarwagya Singh
      </Link>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
      {login ? (
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            setLogin(false);
          }}
        >
          Logout
        </button>
      ) : null}
    </nav>
  );
}

export default Navbar;
