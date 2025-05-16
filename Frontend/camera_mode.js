let selectedParity = "odd";
let userChoice = "";
let userScore = 0;
let computerScore = 0;
let isUserBatting = true;
let isSecondInnings = false;
let tossDone = false;
let interval = null;

const video = document.getElementById('video');
const statusEl = document.getElementById('status');
const scoreEl = document.getElementById('score');
const detectBtn = document.getElementById('detectBtn');
const batBtn = document.getElementById('batBtn');
const bowlBtn = document.getElementById('bowlBtn');

// Camera setup
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    statusEl.textContent = 'Camera access denied.';
  });

async function getFingerCount() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg');
  try {
    const response = await fetch('http://127.0.0.1:5000/count-fingers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl })
    });
    const data = await response.json();
    return data.count;
  } catch (err) {
    statusEl.textContent = 'Error connecting to backend.';
    return 0;
  }
}

function setStatus(msg, color = "#fbbf24") {
  statusEl.textContent = msg;
  statusEl.style.color = color;
}

function setScore(msg, color = "#a3e635") {
  scoreEl.textContent = msg;
  scoreEl.style.color = color;
}

detectBtn.onclick = async function () {
  if (!tossDone) {
    detectBtn.disabled = true;
    setStatus("Detecting...", "#38bdf8");
    await startCameraToss();
    detectBtn.disabled = false;
  }
};

async function startCameraToss() {
  setStatus("Show your fingers for toss (1-6)...", "#38bdf8");
  const userNumber = await getFingerCount();
  if (userNumber < 1 || userNumber > 6) {
    setStatus("Please show 1 to 6 fingers.", "#ef4444");
    return;
  }
  const computerNumber = Math.floor(Math.random() * 6) + 1;
  const total = userNumber + computerNumber;
  const isEven = total % 2 === 0;
  const userWins = (isEven && selectedParity === "even") || (!isEven && selectedParity === "odd");
  if (userWins) {
    setStatus(`You won the toss with ${userNumber} (vs ${computerNumber})! Choose to Bat or Bowl.`, "#a3e635");
    batBtn.style.display = "inline-block";
    bowlBtn.style.display = "inline-block";
    tossDone = true;
  } else {
    userChoice = Math.random() < 0.5 ? "bowl" : "bat";
    isUserBatting = userChoice === "bat";
    setStatus(`Computer picked ${computerNumber} and won the toss and chose to ${userChoice} first.`, "#f472b6");
    tossDone = true;
    setTimeout(startInnings, 2000);
  }
}

batBtn.onclick = function () {
  userChoice = "bat";
  isUserBatting = true;
  batBtn.style.display = "none";
  bowlBtn.style.display = "none";
  startInnings();
};
bowlBtn.onclick = function () {
  userChoice = "bowl";
  isUserBatting = false;
  batBtn.style.display = "none";
  bowlBtn.style.display = "none";
  startInnings();
};

async function startInnings() {
  setStatus(isUserBatting ? "You're Batting! Show fingers to score." : "You're Bowling! Show fingers to Bowl.", "#38bdf8");
  updateScore();
  if (interval) clearInterval(interval);
  interval = setInterval(async () => {
    setStatus(isUserBatting ? "Show your fingers to bat..." : "Show your fingers to bowl...", "#38bdf8");
    const userRun = await getFingerCount();
    if (userRun < 1 || userRun > 6) {
      setStatus("Please show 1 to 5 fingers.", "#ef4444");
      return;
    }
    const compRun = Math.floor(Math.random() * 5) + 1;
    if (userRun === compRun) {
      clearInterval(interval);
      endInnings();
      return;
    }
    if (isUserBatting) {
      userScore += userRun;
    } else {
      computerScore += compRun;
    }
    updateScore();
  }, 1200);
}

function updateScore() {
  setScore(`You: ${userScore} | Computer: ${computerScore}`);
}

function endInnings() {
  if (!isSecondInnings) {
    isSecondInnings = true;
    isUserBatting = !isUserBatting;
    alert("Out! Switching innings.");
    startInnings();
  } else {
    declareResult();
  }
}

function declareResult() {
  let message = "";
  let color = "#38bdf8";
  if (userScore > computerScore) {
    message = "🏆 You won!";
    color = "#a3e635";
  } else if (userScore < computerScore) {
    message = "💻 Computer won!";
    color = "#f472b6";
  } else {
    message = "🤝 It's a draw!";
    color = "#fbbf24";
  }
  setStatus(`${message} Final Score - You: ${userScore}, Computer: ${computerScore}`, color);

}