import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.replace("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <div className="sample-credentials">
        <p>Sample login credentials:</p>
        <p>Email: test@example.com</p>
        <p>Password: testpassword</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">
          Email:
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label className="login-label">
          Password:
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
