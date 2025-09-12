import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Tab, Tabs } from "react-bootstrap";
import AIFeatures from "./AIFeatures";
import AnalyticsDashboard from "./AnalyticsDashboard";

const TextForm = (props) => {
  const [selectedItem, setSelectedItem] = useState("italic");
  const [text, setText] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
        props.showAlert("File content loaded");
      };
      reader.readAsText(file);
    }
  };

  const downloadResults = () => {
    const data = `
      Text: ${text}
      Words: ${words()}
      Characters: ${trim()}
      Sentences: ${sentence()}
    `;
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "text-results.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    props.showAlert("Results downloaded!", "success");
  };

  const handleUpClick = () => {
    setText(text.toUpperCase());
    props.showAlert("Text converted to uppercase");
  };

  const handleLowClick = () => {
    setText(text.toLowerCase());
    props.showAlert("Text converted to lowercase");
  };

  const handleClrClick = () => {
    setText("");
    props.showAlert("All clear");
  };

  const handleonChange = (event) => {
    setText(event.target.value);
  };

  const handleExtraSpaces = () => {
    setText(text.split(/[ ]+/).join(" "));
    props.showAlert("Extra spaces cleared");
  };

  const capitalizeWord = () => {
    setText(
      text
        .split(" ")
        .map((word) => capitalize(word))
        .join(" ")
    );
    props.showAlert("First letter of all words capitalized");
  };

  const capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  const words = () => {
    return text.split(/\s+/).filter((word) => word).length;
  };

  const sentence = () => {
    return text.split(/[.!?]+/).filter((s) => s).length;
  };

  const trim = () => {
    return text.replace(/\s+/g, "").length;
  };

  return (
    <>
      <div
        className="container my-3"
        style={{ color: props.backgroundColo === "light" ? "black" : "white" }}
      >
        <h1>🤖 Parmarth AI Text Analyzer</h1>
        
        <Tabs defaultActiveKey="editor" id="main-tabs" className="mb-3">
          <Tab eventKey="editor" title="📝 Text Editor">
            <textarea
              id="myBox"
              className="form-control mb-3"
              onChange={handleonChange}
              value={text}
              rows="8"
              placeholder="Enter your text here to analyze with AI..."
              style={{
                backgroundColor:
                  props.backgroundColo === "dark" ? "#2B3035" : "white",
                color: props.backgroundColo === "dark" ? "white" : "black",
                fontStyle: selectedItem === "italic" ? "italic" : "normal",
                fontWeight: selectedItem === "bold" ? "bold" : "normal",
              }}
            ></textarea>

            <input
              type="file"
              accept=".txt"
              className="form-control mb-3"
              onChange={handleFileChange}
            />

            <div className="d-flex flex-wrap gap-2 mb-3">
              <button
                className="btn btn-primary"
                disabled={text.length === 0}
                onClick={handleUpClick}
              >
                Uppercase
              </button>
              <button
                className="btn btn-primary"
                disabled={text.length === 0}
                onClick={handleLowClick}
              >
                Lowercase
              </button>
              <button
                className="btn btn-primary"
                disabled={text.length === 0}
                onClick={handleClrClick}
              >
                Clear
              </button>
              <button
                className="btn btn-primary"
                disabled={text.length === 0}
                onClick={handleExtraSpaces}
              >
                Clear Extra Spaces
              </button>
              <button
                className="btn btn-primary"
                disabled={text.length === 0}
                onClick={capitalizeWord}
              >
                Capitalize
              </button>

              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {selectedItem}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="italic">Italic</Dropdown.Item>
                  <Dropdown.Item eventKey="bold">Bold</Dropdown.Item>
                  <Dropdown.Item eventKey="oblique">Oblique</Dropdown.Item>
                  <Dropdown.Item eventKey="inherit">Inherit</Dropdown.Item>
                  <Dropdown.Item eventKey="unset">Unset</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <button className="btn btn-secondary" onClick={downloadResults}>
                Download Results
              </button>
            </div>

            <div
              className="my-3"
              style={{ color: props.backgroundColo === "light" ? "black" : "white" }}
            >
              <h3>📊 Basic Statistics</h3>
              <div className="row">
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">{words()}</h5>
                      <p className="card-text">Words</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">{trim()}</h5>
                      <p className="card-text">Characters</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">{sentence()}</h5>
                      <p className="card-text">Sentences</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">{(0.003 * words()).toFixed(1)}</h5>
                      <p className="card-text">Min to Read</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-3">
              <h3>👀 Preview</h3>
              <div 
                className="p-3 border rounded"
                style={{
                  backgroundColor: props.backgroundColo === "dark" ? "#2B3035" : "#f8f9fa",
                  minHeight: "100px"
                }}
              >
                {text.length > 0 ? text : "Nothing to preview"}
              </div>
            </div>
          </Tab>

          <Tab eventKey="ai-analysis" title="🤖 AI Analysis">
            <AIFeatures 
              text={text} 
              backgroundColo={props.backgroundColo}
              showAlert={props.showAlert}
              onTextUpdate={setText}
            />
          </Tab>

          <Tab eventKey="analytics" title="📊 Analytics">
            <AnalyticsDashboard 
              text={text}
              backgroundColo={props.backgroundColo}
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default TextForm;
