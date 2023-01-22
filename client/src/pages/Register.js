import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.replace('/dashboard')
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label">
          Email:
          <input
            className="register-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label className="register-label">
          Password:
          <input
            className="register-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <button className="register-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
