from flask import Flask, jsonify, send_from_directory, render_template
import cv2
import os

app = Flask(
    __name__,
    static_folder='../opencv_included/static',
    template_folder='../opencv_included/templates'
)

def detect_fingers():
    # Your OpenCV finger detection logic here
    # For demonstration, let's return a random number between 1 and 6
    import random
    return random.randint(1, 6)

@app.route('/')
def index():
    # Serve the main HTML file (e.g., index.html) from templates
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    # Serve static files (JS, CSS, etc.)
    return send_from_directory(app.static_folder, filename)

@app.route('/fingers', methods=['GET'])
def fingers():
    count = detect_fingers()
    return jsonify({'fingers': count})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)