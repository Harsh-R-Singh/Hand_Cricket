# Hand Cricket game using OpenCV

This project is a finger counting application that uses OpenCV to detect and count the number of fingers shown by the user. It consists of a backend built with Flask and a frontend that communicates with the backend to display the results.

## Project Structure

```
finger-counter-app
├── src
│   ├── model.py        # OpenCV model implementation for finger detection
│   ├── app.py          # Flask backend application
│   └── utils.py        # Utility functions for image processing
├── frontend
│   ├── index.html      # Main HTML file for the frontend
│   ├── app.js          # JavaScript code for user interactions
│   └── style.css       # CSS styles for the frontend
├── requirements.txt    # Python dependencies
└── README.md           # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd finger-counter-app
   ```

2. **Install the required Python packages:**
   Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

   Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

3. **Run the backend application:**
   ```
   python src/app.py
   ```

4. **Open the frontend:**
   Open `frontend/index.html` in your web browser to access the application.

## Usage

- Point your camera at your hand and show the number of fingers you want to count.
- The application will process the video feed and display the number of fingers detected on the frontend.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.
