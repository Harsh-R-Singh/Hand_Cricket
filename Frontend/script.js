let selectedParity = "";
let userChoice = "";
let userScore = 0;
let computerScore = 0;
let isUserBatting = true;
let isSecondInnings = false;

window.onload = function () {
  const body = document.getElementById("body");

  document.getElementById("odd").addEventListener("click", () => handleToss("odd"));
  document.getElementById("even").addEventListener("click", () => handleToss("even"));

  function handleToss(choice) {
    selectedParity = choice;
    body.innerHTML = `
      <p class="text-4xl py-4">Choose a number between 1 to 6</p>
      <div class="flex flex-wrap justify-center gap-4 max-w-md mx-auto py-4">
        ${[1, 2, 3, 4, 5, 6].map(num => `
          <button data-num="${num}" class="group relative border-none cursor-pointer bg-black rounded-xl">
            <span
              class="block box-border border-2 border-black rounded-xl px-6 py-3 bg-[#e8e8e8] text-black font-bold text-[17px] transform translate-y-[-0.5] transition-transform duration-100 ease-in-out group-hover:-translate-y-0.5 group-active:translate-y-0">
              ${num}
            </span>
          </button>
        `).join("")}
      </div>
    `;
    async function startCameraToss() {
      try {
        const res = await fetch("http://127.0.0.1:5000/finger-count");
        const data = await res.json();
        const userNumber = data.fingers;
    
        document.getElementById("output").innerText = userNumber;
    
        if (userNumber < 1 || userNumber > 6) {
          document.getElementById("status").innerText = "Please show 1 to 6 fingers.";
          return;
        }
    
        const computerNumber = Math.floor(Math.random() * 6) + 1;
        const total = userNumber + computerNumber;
    
        // Example: user chose 'odd' beforehand — you can store this from a button
        const selectedParity = "odd";
    
        const isEven = total % 2 === 0;
        const userWins = (isEven && selectedParity === "even") || (!isEven && selectedParity === "odd");
    
        if (userWins) {
          document.getElementById("status").innerText = `You won the toss with ${userNumber} (vs ${computerNumber})! Choose Bat or Bowl next.`;
          // Now call your chooseBatOrBowl() logic here
        } else {
          const cpuChoice = Math.random() < 0.5 ? "bat" : "bowl";
          document.getElementById("status").innerText = `Computer won the toss and chose to ${cpuChoice} first.`;
          // Continue game logic here...
        }
    
      } catch (err) {
        console.error("Error:", err);
        document.getElementById("status").innerText = "Error reading from camera model.";
      }
    }
     
    document.querySelectorAll("[data-num]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const selectedNum = parseInt(e.target.closest("button").dataset.num);
        const randomNum = Math.floor(Math.random() * 6) + 1;
        const total = selectedNum + randomNum;
        const isEven = total % 2 === 0;

        const userWonToss = (isEven && selectedParity === "even") || (!isEven && selectedParity === "odd");

        if (userWonToss) {
          body.innerHTML = `
            <p class="text-4xl py-4">You won the toss!</p>
            <p class="text-2xl pb-4">Choose to Bat or Bowl</p>
            <div class="flex flex-wrap justify-center gap-4 max-w-md mx-auto py-4">
              <button data-action="bat" class="group relative border-none cursor-pointer bg-black rounded-xl">
                <span
                  class="block box-border border-2 border-black rounded-xl px-6 py-3 bg-white text-black font-bold text-[17px] transform translate-y-[-0.5] transition-transform duration-100 ease-in-out group-hover:-translate-y-0.5 group-active:translate-y-0">
                  Bat
                </span>
              </button>
              <button data-action="bowl" class="group relative border-none cursor-pointer bg-black rounded-xl">
                <span
                  class="block box-border border-2 border-black rounded-xl px-6 py-3 bg-white text-black font-bold text-[17px] transform translate-y-[-0.5] transition-transform duration-100 ease-in-out group-hover:-translate-y-0.5 group-active:translate-y-0">
                  Bowl
                </span>
              </button>
            </div>
          `;

          document.querySelectorAll("[data-action]").forEach(btn => {
            btn.addEventListener("click", e => {
              userChoice = e.target.closest("button").dataset.action;
              isUserBatting = userChoice === "bat";
              startInnings();
            });
          });
        } else {
          const randomChoice = Math.random() < 0.5 ? "bat" : "bowl";
          userChoice = randomChoice === "bat" ? "bowl" : "bat";
          isUserBatting = userChoice === "bat";
          body.innerHTML = `
            <p class="text-4xl py-4">Computer won the toss and chose to ${randomChoice} first!</p>
          `;
          setTimeout(startInnings, 2000);
        }
      });
    });
  }

  function startInnings() {
    body.innerHTML = `
      <p class="text-3xl">${isUserBatting ? "You're Batting" : "You're Bowling"}</p>
      <p id="scoreDisplay" class="text-xl py-4">You: ${userScore} | Computer: ${computerScore}</p>
      <div class="flex flex-wrap justify-center gap-4 max-w-md mx-auto py-4">

        ${[1, 2, 3, 4, 5, 6].map(num => `
          <button data-run="${num}" class="group relative border-none cursor-pointer bg-black rounded-xl">
            <span
              class="block box-border border-2 border-black rounded-xl px-6 py-3 bg-[#e8e8e8] text-black font-bold text-[17px] transform translate-y-[-0.5] transition-transform duration-100 ease-in-out group-hover:-translate-y-0.5 group-active:translate-y-0">
              ${num}
            </span>
          </button>
        `).join("")}
      </div>
    `;

    document.querySelectorAll("[data-run]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const userRun = parseInt(e.target.closest("button").dataset.run);
        const compRun = Math.floor(Math.random() * 6) + 1;

        if (userRun === compRun) {
          endInnings();
        } else {
          if (isUserBatting) {
            userScore += userRun;
          } else {
            computerScore += compRun;
          }
          updateScore();
        }
      });
    });
  }

  function updateScore() {
    document.getElementById("scoreDisplay").textContent = `You: ${userScore} | Computer: ${computerScore}`;
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
    if (userScore > computerScore) {
      message = "🏆 You won!";
    } else if (userScore < computerScore) {
      message = "💻 Computer won!";
    } else {
      message = "🤝 It's a draw!";
    }

    body.innerHTML = `
      <p class="text-4xl py-4">${message}</p>
      <p class="text-2xl py-2">Final Score - You: ${userScore}, Computer: ${computerScore}</p>
      <button onclick="location.reload()" class="group relative border-none cursor-pointer bg-black rounded-xl mt-4">
        <span
          class="block box-border border-2 border-black rounded-xl px-6 py-3 bg-white text-black font-bold text-[17px] transform translate-y-[-0.5] transition-transform duration-100 ease-in-out group-hover:-translate-y-0.5 group-active:translate-y-0">
          Play Again
        </span>
      </button>
    `;
  }
};
