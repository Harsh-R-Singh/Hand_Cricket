def preprocess_image(image):
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Apply Gaussian blur to the image
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Perform edge detection
    edged = cv2.Canny(blurred, 50, 150)
    return edged

def count_fingers(contour):
    # Approximate the contour and find the convex hull
    epsilon = 0.01 * cv2.arcLength(contour, True)
    approx = cv2.approxPolyDP(contour, epsilon, True)
    hull = cv2.convexHull(approx)

    # Find the convexity defects
    defects = cv2.convexityDefects(approx, cv2.convexHull(approx, returnPoints=False))

    if defects is not None:
        finger_count = 0
        for i in range(defects.shape[0]):
            s, e, f, d = defects[i, 0]
            start = tuple(approx[s][0])
            end = tuple(approx[e][0])
            far = tuple(approx[f][0])
            # Calculate the angle between the start, end, and far points
            angle = calculate_angle(start, end, far)
            if angle <= 90:  # If the angle is less than or equal to 90 degrees, count it as a finger
                finger_count += 1
        return finger_count + 1  # Add one for the thumb
    return 0

def calculate_angle(start, end, far):
    # Calculate the angle between three points
    a = np.linalg.norm(np.array(end) - np.array(start))
    b = np.linalg.norm(np.array(far) - np.array(start))
    c = np.linalg.norm(np.array(end) - np.array(far))
    angle = np.arccos((b**2 + c**2 - a**2) / (2 * b * c))
    return np.degrees(angle)