from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from model import count_fingers

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/count-fingers', methods=['POST'])
def count_fingers_api():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    # Decode base64 image
    image_data = data['image'].split(',')[1]
    img_bytes = base64.b64decode(image_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    

    # Use the robust hand landmark-based finger counting
    count = count_fingers(img)

    return jsonify({'count': count})

if __name__ == '__main__':
    app.run(debug=True)