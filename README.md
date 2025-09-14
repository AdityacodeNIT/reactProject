# TextCraft AI: Your All-in-One Text & AI Toolkit

This project is a React-based application offering various text manipulation utilities and advanced AI/OCR features. It provides a user-friendly interface for tasks such as text formatting, analysis, and integration with AI services.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features

This application includes a range of functionalities:

- **Text Utilities**:
  - `TextForm`: A versatile component for text input, manipulation (e.g., uppercase, lowercase, clear text), and analysis (word count, character count, reading time).
  - `TextToSpeech`: Converts text input into speech.

- **AI & OCR Capabilities**:
  - `AIFeatures`: Integrates various Artificial Intelligence functionalities.
  - `OCRFeatures`: Provides Optical Character Recognition capabilities for extracting text from images.
  - `aiServices`: Backend services for handling AI-related requests.

- **Application Management**:
  - `Navbar`: Responsive navigation bar for easy access to different sections.
  - `Alert`: Displays contextual alerts and notifications to the user.
  - `AnalyticsDashboard`: Provides insights and analytics related to application usage or processed data.
  - `ApiKeyTester` & `ApiStatus`: Tools for testing and monitoring API keys and service status.
  - `BatchProcessor`: Handles batch processing of text or documents.
  - `DocumentManager`: Manages documents within the application.
  - `ErrorBoundary`: Catches and displays errors gracefully.
  - `SetupGuide`: Guides users through the initial setup process.

- **Informational Pages**:
  - `About`: Information about the application or organization.
  - `Contact`: Contact details or a contact form.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have Node.js and npm (Node Package Manager) installed on your system.

- Node.js (LTS version recommended)
- npm (usually comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AdityacodeNIT/reactProject.git
   cd reactProject
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

To run the application in development mode:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits.

## Project Structure

The project follows a standard React application structure:

```
.
├── public/                 # Public assets (index.html, favicon, etc.)
├── src/
│   ├── component/          # React components
│   │   ├── About.js
│   │   ├── AIFeatures.js
│   │   ├── Alert.js
│   │   ├── AnalyticsDashboard.js
│   │   ├── ApiKeyTester.js
│   │   ├── ApiStatus.js
│   │   ├── BatchProcessor.js
│   │   ├── Contact.js
│   │   ├── DocumentManager.js
│   │   ├── ErrorBoundary.js
│   │   ├── Navbar.js
│   │   ├── OCRFeatures.js
│   │   ├── OptionsDisplay.js
│   │   ├── SetupGuide.js
│   │   ├── TextForm.js
│   │   └── TextToSpeech.js
│   ├── services/           # Service files (e.g., API calls)
│   │   └── aiServices.js
│   ├── App.js              # Main application component
│   ├── index.js            # Entry point of the React application
│   └── ...                 # Other core files (CSS, tests, etc.)
└── README.md               # This file
└── package.json            # Project metadata and dependencies
└── .env                    # Environment variables
└── .gitignore              # Files ignored by Git
```

## Screenshots

Here are some screenshots showcasing the application's interface and features.
*(Please replace these placeholders with actual screenshots of your application)*

### Home Page / Text Utility
![Home Page Screenshot](docs/screenshots/homepage.png)
*A screenshot of the main text utility interface.*

### AI Features Dashboard
![AI Features Screenshot](docs/screenshots/aifeatures.png)
*A screenshot demonstrating the AI features section.*

### OCR Functionality
![OCR Screenshot](docs/screenshots/ocr.png)
*A screenshot showing the OCR capabilities in action.*

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
