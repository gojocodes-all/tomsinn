// ---------- Grab the page elements ----------
const openLetterButton = document.querySelector("#openLetter");
const story = document.querySelector("#story");
const progressBar = document.querySelector("#progressBar");
const noButton = document.querySelector("#noButton");
const yesButton = document.querySelector("#yesButton");
const buttonStage = document.querySelector("#buttonStage");
const buttonComment = document.querySelector("#buttonComment");
const finalSection = document.querySelector("#finalSection");
const savePromiseButton = document.querySelector("#savePromise");
const confettiCanvas = document.querySelector("#confettiCanvas");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Open the envelope ----------
openLetterButton.addEventListener("click", () => {
  if (openLetterButton.classList.contains("opening")) return;

  openLetterButton.classList.add("opening");
  openLetterButton.setAttribute("aria-label", "Letter opened");

  window.setTimeout(() => {
    story.hidden = false;
    watchSections();
    story.querySelector(".section").scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }, reduceMotion ? 10 : 900);
});

// ---------- Reveal sections while scrolling ----------
function watchSections() {
  const sections = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  sections.forEach((section) => observer.observe(section));
}

// ---------- Flip the little notes ----------
document.querySelectorAll(".note").forEach((note) => {
  note.addEventListener("click", () => {
    note.classList.toggle("open");
    note.setAttribute("aria-pressed", String(note.classList.contains("open")));
  });
});

// ---------- Make the No button escape ----------
const noButtonMessages = [
  "That answer seems a little shy.",
  "The button has officially left the group chat.",
  "Tomisin, please be serious 😭",
  "Even the button knows that’s not the real answer.",
  "Request denied by the friendship department."
];

let escapeCount = 0;

function moveNoButton(event) {
  if (event) event.preventDefault();

  const stageBox = buttonStage.getBoundingClientRect();
  const buttonBox = noButton.getBoundingClientRect();
  const padding = 10;
  const maxLeft = Math.max(padding, stageBox.width - buttonBox.width - padding);
  const maxTop = Math.max(padding, stageBox.height - buttonBox.height - padding);

  noButton.style.left = `${randomBetween(padding, maxLeft)}px`;
  noButton.style.top = `${randomBetween(padding, maxTop)}px`;
  buttonComment.textContent = noButtonMessages[escapeCount % noButtonMessages.length];
  escapeCount += 1;
}

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("pointerdown", moveNoButton);
noButton.addEventListener("focus", () => {
  buttonComment.textContent = "Keyboard detected. The answer is still yes, by the way.";
});
noButton.addEventListener("click", moveNoButton);

// ---------- Accept the promise ----------
yesButton.addEventListener("click", () => {
  finalSection.hidden = false;
  localStorage.setItem("tomisinFriendshipPromise", "accepted");

  if (!reduceMotion) launchConfetti();

  window.setTimeout(() => {
    finalSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, 180);
});

// Keep the ending visible if the page is refreshed after choosing Yes.
if (localStorage.getItem("tomisinFriendshipPromise") === "accepted") {
  finalSection.hidden = false;
}

// ---------- Draw a small confetti burst (no library needed) ----------
function launchConfetti() {
  const context = confettiCanvas.getContext("2d");
  const colours = ["#7b263b", "#d68b95", "#b7894d", "#f3d5bd", "#54182a"];
  const pieces = Array.from({ length: 110 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.35,
    width: 5 + Math.random() * 7,
    height: 8 + Math.random() * 10,
    speed: 2 + Math.random() * 4,
    drift: -1.5 + Math.random() * 3,
    rotation: Math.random() * Math.PI,
    spin: -0.15 + Math.random() * 0.3,
    colour: colours[Math.floor(Math.random() * colours.length)]
  }));

  confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
  confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
  context.scale(window.devicePixelRatio, window.devicePixelRatio);

  let frame = 0;

  function animate() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += piece.spin;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.colour;
      context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      context.restore();
    });

    frame += 1;
    if (frame < 190) {
      requestAnimationFrame(animate);
    } else {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  animate();
}

// ---------- Save the promise as a simple image ----------
savePromiseButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 1200;
  canvas.height = 675;

  context.fillStyle = "#f7eee4";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#7b263b";
  context.lineWidth = 3;
  context.setLineDash([14, 10]);
  context.strokeRect(45, 45, 1110, 585);
  context.setLineDash([]);

  context.textAlign = "center";
  context.fillStyle = "#7b263b";
  context.font = "bold 22px Arial";
  context.fillText("FRIENDSHIP PROMISE · 23 JULY 2026", 600, 135);

  context.fillStyle = "#321f1f";
  context.font = "64px Georgia";
  context.fillText("Still us? Always us.", 600, 245);

  context.fillStyle = "#7f6864";
  context.font = "30px Georgia";
  context.fillText("Tomisin × Jomiloju", 600, 325);

  context.fillStyle = "#7b263b";
  context.font = "italic 28px Georgia";
  context.fillText("Different schools. Same friendship.", 600, 405);

  context.fillStyle = "#321f1f";
  context.font = "bold 24px Arial";
  context.fillText("STATUS: NOT A GOODBYE", 600, 520);

  const downloadLink = document.createElement("a");
  downloadLink.download = "tomisin-and-jomiloju-promise.png";
  downloadLink.href = canvas.toDataURL("image/png");
  downloadLink.click();

  savePromiseButton.textContent = "Promise saved ✓";
});

// ---------- Reading progress ----------
window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, progress)}%`;
}, { passive: true });
