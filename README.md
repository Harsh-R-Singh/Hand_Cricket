## Hand Cricket Game using OpenCV

This project is a real-time, gesture-controlled version of the traditional hand cricket game. It uses **OpenCV** with a **custom hand tracking module** to detect the number of fingers shown by the player via webcam. The finger count is used as input for gameplay (batting and bowling). 

The backend, built with **Flask**, processes the video stream and communicates with a **JavaScript-based frontend** using **WebSockets**. The frontend displays live scores, user input, and game status. This project demonstrates the integration of computer vision, real-time processing, and web-based interaction.

**NOTE** : This project is still in development.

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
