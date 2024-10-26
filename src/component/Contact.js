import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const Contact = () => {
  return (
    <div
      className="container-fluid"
      style={{
        color: "black",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backgroundColor: "yellow", // Optional background color
        fontSize: "16px", // Optional font size
      }}
    >
      <span>
        Hello, thank you for using the app! If you want to contact me, here are
        the links:
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a
          href="https://github.com/your-username"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "black",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            marginRight: "15px",
            fontWeight: "bold", // Bold text
          }}
        >
          <FaGithub style={{ marginRight: "5px", fontSize: "20px" }} />
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/your-username"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "black",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold", // Bold text
          }}
        >
          <FaLinkedinIn style={{ marginRight: "5px", fontSize: "20px" }} />
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default Contact;
