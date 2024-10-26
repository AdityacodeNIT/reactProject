import React from "react";

const About = (props) => {
  let myStyle = {
    backgroundColor: props.backgroundColo === "dark" ? "#032845" : "white",
    color: props.backgroundColo === "dark" ? "white" : "black",
  };

  return (
    <div className="container my-3 mt-3" style={myStyle}>
      <h1>About</h1>
      <div className="accordion" id="accordionExample" style={myStyle}>
        {/* Existing Sections */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
              style={myStyle}
            >
              <h2>Text Transformation</h2>
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              <b>Convert Case:</b> Quickly change the case of your text to
              uppercase or lowercase with a single click.
              <br />
              <b>Clear Extra Spaces:</b> Eliminate unnecessary spaces and ensure
              clean, polished text.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
              style={myStyle}
            >
              <h2>Word Count and Character Analysis</h2>
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              Get insights into your text with real-time word count and
              character analysis.
              <br />
              Learn about the estimated reading time to make your content more
              reader-friendly.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
              style={myStyle}
            >
              <h2>Preview Your Text:</h2>
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              See a live preview of your edited text, allowing you to visualize
              changes instantly.
              <br />
              Preview ensures that your message looks exactly as you intend it
              to be.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="true"
              aria-controls="collapseFour"
              style={myStyle}
            >
              <h2>Dark and Light Modes:</h2>
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              Customize your writing environment with our dark and light modes
              for optimal comfort.
              <br />
              Switch seamlessly between modes to suit your preferences.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFive"
              aria-expanded="true"
              aria-controls="collapseFive"
              style={myStyle}
            >
              <h2>Responsive Design:</h2>
            </button>
          </h2>
          <div
            id="collapseFive"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              Access World Analyzer on any device, ensuring a seamless and
              consistent experience across desktops, tablets, and smartphones.
            </div>
          </div>
        </div>

        {/* New Sections for File Add and File Save */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSix"
              aria-expanded="false"
              aria-controls="collapseSix"
              style={myStyle}
            >
              <h2>File Add:</h2>
            </button>
          </h2>
          <div
            id="collapseSix"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              Easily add text files to the application for processing. Simply
              click on the "Add File" button and choose a text file to load your
              content into the text area.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSeven"
              aria-expanded="false"
              aria-controls="collapseSeven"
              style={myStyle}
            >
              <h2>File Save:</h2>
            </button>
          </h2>
          <div
            id="collapseSeven"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              Save your text and results to a file with a single click. Use the
              "Download Results" button to create a text file that you can keep
              for later reference.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
