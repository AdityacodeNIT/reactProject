import "./App.css";
import React, { useState } from "react";
import Navbar from "./component/Navbar";
import TextForm from "./component/TextForm";
import About from "./component/About";
import Alert from "./component/Alert";
import Contact from "./component/Contact";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [alert, setAlert] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("light");

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1700);
  };

  const removeBodyClasses = () => {
    document.body.classList.remove("bg-light");
    document.body.classList.remove("bg-dark");
    document.body.classList.remove("bg-warning");
    document.body.classList.remove("bg-success");
    document.body.classList.remove("bg-primary");
  };

  const toggleMode = (cls) => {
    removeBodyClasses();
    document.body.classList.add("bg-" + cls);
    showAlert(`${cls} mode has been enabled`, "success");
  };

  const toggleColor = () => {
    if (backgroundColor === "light") {
      setBackgroundColor("dark");
      document.body.style.backgroundColor = "#032845";
      showAlert("Dark mode has been enabled", "success");
    } else {
      setBackgroundColor("light");
      document.body.style.backgroundColor = "white";
      showAlert("Light mode has been enabled", "success");
    }
  };

  return (
    <>
      <Navbar
        title="Parmarth"
        backgroundColo={backgroundColor}
        toggleMode={toggleMode}
        toggleColor={toggleColor}
      />
      <Alert alert={alert} backgroundColo={backgroundColor} />
      <div className="container my-3">
        <BrowserRouter>
          <Routes>
            <Route
              path="/About"
              element={
                <About
                  backgroundColo={backgroundColor}
                  showAlert={showAlert}
                  toggleColor={toggleColor}
                />
              }
            />
            <Route
              path="/"
              element={
                <TextForm
                  backgroundColo={backgroundColor}
                  showAlert={showAlert}
                  toggleColor={toggleColor}
                />
              }
            />
            <Route path="/Contact" element={<Contact />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
