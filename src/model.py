import cv2
import HandTrackingModule as htm

# Initialize the hand detector globally
detector = htm.FindHands(detection_con=0.75)

def count_fingers_from_landmarks(lmlist):
    if len(lmlist) == 0:
        return 0

    fingers = []

    # Determine hand type (right or left)
    if lmlist[5][0] > lmlist[17][0]:
        handType = "Right"
    else:
        handType = "Left"

    # Thumb
    if handType == "Right":
        fingers.append(1 if lmlist[4][0] > lmlist[3][0] else 0)
    else:
        fingers.append(1 if lmlist[4][0] < lmlist[3][0] else 0)

    # Other fingers
    fingers.append(1 if lmlist[8][1] < lmlist[6][1] else 0)   # Index
    fingers.append(1 if lmlist[12][1] < lmlist[10][1] else 0) # Middle
    fingers.append(1 if lmlist[16][1] < lmlist[14][1] else 0) # Ring
    fingers.append(1 if lmlist[20][1] < lmlist[18][1] else 0) # Pinky

    return fingers.count(1)

def count_fingers(image):
    # Convert image to RGB for hand detector
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    lmlist = detector.getPosition(img_rgb, list(range(21)), draw=False)
    return count_fingers_from_landmarks(lmlist)

def process_image(image_path):
    # Read the image from the given path
    image = cv2.imread(image_path)
    
    # Count the fingers in the image
    return count_fingers(image)