import { useEffect, useState } from "react";

const Dashboard = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
    } else {
      fetch("http://localhost:5000/protected", {
        headers: {
          "x-access-token": token,
        },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log(data);
            setMessage(data.message);
          });
        } else {
          window.location.replace("/login");
        }
      });
    }
  }, []);

  return (
    <>
      <h1> {message == null ? "Loading.." : message} </h1>
    </>
  );
};

export default Dashboard;
