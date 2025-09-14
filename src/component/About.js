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

        {/* AI-Powered Features */}
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
              <h2>🤖 AI-Powered Analysis:</h2>
            </button>
          </h2>
          <div
            id="collapseSix"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              <strong>Sentiment Analysis:</strong> Automatically detect the emotional tone of your text (positive, negative, neutral).
              <br />
              <strong>Language Detection:</strong> Identify the language of your text with confidence scores.
              <br />
              <strong>Grammar & Spell Check:</strong> Get real-time suggestions for grammar and style improvements.
              <br />
              <strong>Readability Score:</strong> Calculate Flesch Reading Ease score and grade level assessment.
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
              <h2>✨ Smart Text Tools:</h2>
            </button>
          </h2>
          <div
            id="collapseSeven"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              <strong>Text Summarization:</strong> Generate concise summaries of long text automatically.
              <br />
              <strong>Paraphrasing:</strong> Rewrite text while maintaining the original meaning.
              <br />
              <strong>Tone Adjustment:</strong> Convert text to formal, casual, professional, or friendly tone.
              <br />
              <strong>Translation:</strong> Translate text to multiple languages instantly.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEight"
              aria-expanded="false"
              aria-controls="collapseEight"
              style={myStyle}
            >
              <h2>🚀 Advanced Features:</h2>
            </button>
          </h2>
          <div
            id="collapseEight"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              <strong>OCR (Image to Text):</strong> Extract text from images using AI-powered optical character recognition.
              <br />
              <strong>Text-to-Speech:</strong> Convert your text to speech with customizable voice settings.
              <br />
              <strong>Batch Processing:</strong> Process multiple text files simultaneously with comprehensive analysis.
              <br />
              <strong>Keyword Extraction:</strong> Automatically identify important keywords and generate hashtags.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseNine"
              aria-expanded="false"
              aria-controls="collapseNine"
              style={myStyle}
            >
              <h2>📊 Analytics Dashboard:</h2>
            </button>
          </h2>
          <div
            id="collapseNine"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              <strong>Writing Quality Metrics:</strong> Analyze sentence variety, complexity score, and writing patterns.
              <br />
              <strong>Advanced Statistics:</strong> Get detailed insights including average words per sentence, character analysis, and reading time.
              <br />
              <strong>Visual Analytics:</strong> Interactive charts and progress bars for better data visualization.
              <br />
              <strong>Export Results:</strong> Download comprehensive analysis reports in CSV format.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTen"
              aria-expanded="false"
              aria-controls="collapseTen"
              style={myStyle}
            >
              <h2>💡 Creative Tools:</h2>
            </button>
          </h2>
          <div
            id="collapseTen"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              <strong>Writing Prompt Generator:</strong> Get AI-generated creative writing prompts based on your text keywords.
              <br />
              <strong>Hashtag Generator:</strong> Automatically create relevant hashtags for social media content.
              <br />
              <strong>File Management:</strong> Upload, process, and download text files with ease.
              <br />
              <strong>Real-time Processing:</strong> All AI features work instantly as you type or upload content.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEleven"
              aria-expanded="false"
              aria-controls="collapseEleven"
              style={myStyle}
            >
              <h2>📁 Document Management System:</h2>
            </button>
          </h2>
          <div
            id="collapseEleven"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
            style={myStyle}
          >
            <div className="accordion-body" style={myStyle}>
              <strong>Multi-File Upload:</strong> Upload and manage multiple documents simultaneously with progress tracking.
              <br />
              <strong>AI-Powered Analysis:</strong> Automatic sentiment analysis, summarization, keyword extraction, and readability scoring.
              <br />
              <strong>Bulk Operations:</strong> Process multiple documents at once with batch analysis and bulk actions.
              <br />
              <strong>Advanced Search & Filter:</strong> Find documents quickly with powerful search and filtering capabilities.
              <br />
              <strong>Export & Reporting:</strong> Export document data as JSON, CSV, or comprehensive summary reports.
              <br />
              <strong>Document Insights:</strong> Detailed analytics including word counts, file sizes, and AI-generated insights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
