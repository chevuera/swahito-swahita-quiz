const questionBank = window.questionBank || [];

const state = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  correctStreak: 0
};

const screens = {
  start: document.getElementById("startScreen"),
  quiz: document.getElementById("quizScreen"),
  result: document.getElementById("resultScreen")
};

const startButton = document.getElementById("startButton");
const musicButton = document.getElementById("musicButton");
const floatingMusicButton = document.getElementById("floatingMusicButton");
const musicTrack = document.getElementById("musicTrack");
const installButton = document.getElementById("installButton");
const questionCounter = document.getElementById("questionCounter");
const questionTitle = document.getElementById("questionTitle");
const scorePill = document.getElementById("scorePill");
const progressBar = document.getElementById("progressBar");
const scenarioText = document.getElementById("scenarioText");
const answerHelp = document.getElementById("answerHelp");
const optionsList = document.getElementById("optionsList");
const openAnswer = document.getElementById("openAnswer");
const feedbackBox = document.getElementById("feedbackBox");
const skipButton = document.getElementById("skipButton");
const nextButton = document.getElementById("nextButton");
const resultTitle = document.getElementById("resultTitle");
const resultCopy = document.getElementById("resultCopy");
const resultScore = document.getElementById("resultScore");
const shareButton = document.getElementById("shareButton");
const restartButton = document.getElementById("restartButton");
const answerKey = document.getElementById("answerKey");

let deferredInstallPrompt;
let audioContext;
let musicTimer;
let masterGain;
let musicEnabled = false;
let audioConnected = false;
let stepIndex = 0;

const musicPattern = [
  { bass: 110.00, lead: 329.63, chord: [220.00, 261.63, 329.63] },
  { bass: 110.00, lead: 392.00, chord: [220.00, 261.63, 349.23] },
  { bass: 146.83, lead: 440.00, chord: [246.94, 293.66, 369.99] },
  { bass: 130.81, lead: 392.00, chord: [196.00, 261.63, 329.63] },
  { bass: 98.00, lead: 293.66, chord: [196.00, 246.94, 329.63] },
  { bass: 130.81, lead: 349.23, chord: [196.00, 261.63, 349.23] },
  { bass: 146.83, lead: 440.00, chord: [220.00, 293.66, 369.99] },
  { bass: 110.00, lead: 329.63, chord: [220.00, 277.18, 329.63] }
];

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = value * 16807 % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function dateSeed() {
  const now = new Date();
  return Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);
}

function pickDailyQuestions() {
  const random = seededRandom(dateSeed());
  const pool = [...questionBank];
  const picked = [];
  const families = new Set();

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  for (const question of pool) {
    if (families.has(question.family)) continue;
    picked.push(question);
    families.add(question.family);
    if (picked.length === 10) break;
  }

  return picked;
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function startQuiz() {
  if (!musicEnabled) {
    startMusic();
  }
  state.questions = pickDailyQuestions();
  state.currentIndex = 0;
  state.score = 0;
  state.answers = [];
  state.correctStreak = 0;
  showScreen("quiz");
  renderQuestion();
}

function ensureAudioEngine() {
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return null;

  audioContext = audioContext || new AudioEngine();
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  masterGain = masterGain || audioContext.createGain();
  masterGain.gain.setValueAtTime(0.18, audioContext.currentTime);
  if (!audioConnected) {
    masterGain.connect(audioContext.destination);
    audioConnected = true;
  }

  return audioContext;
}

function createOscillator(frequency, type, startTime, duration, gainValue) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.04);
}

function playMusicStep() {
  if (!musicEnabled || !audioContext) return;

  const now = audioContext.currentTime;
  const item = musicPattern[stepIndex % musicPattern.length];
  const accent = stepIndex % 4 === 0 ? 0.12 : 0.08;

  createOscillator(item.bass, "sine", now, 0.38, 0.09);
  item.chord.forEach((note, chordIndex) => {
    createOscillator(note, "triangle", now + chordIndex * 0.012, 0.72, 0.025);
  });
  createOscillator(item.lead, "square", now + 0.04, 0.16, accent);

  stepIndex += 1;
}

function updateMusicButtons() {
  const label = musicEnabled ? "Zet achtergrondliedje uit" : "Zet achtergrondliedje aan";
  musicButton.textContent = label;
  floatingMusicButton.textContent = musicEnabled ? "aan" : "muziek";
  musicButton.classList.toggle("music-on", musicEnabled);
  floatingMusicButton.classList.toggle("music-on", musicEnabled);
}

function startMusic() {
  if (musicEnabled) return;

  if (musicTrack) {
    musicTrack.volume = 0.58;
    musicTrack.play().then(() => {
      musicEnabled = true;
      updateMusicButtons();
    }).catch(() => {
      startSynthFallback();
    });
    return;
  }

  startSynthFallback();
}

function startSynthFallback() {
  if (musicEnabled) return;
  if (!ensureAudioEngine()) return;

  musicEnabled = true;
  updateMusicButtons();
  playMusicStep();
  musicTimer = window.setInterval(playMusicStep, 520);
}

function playStreakSound(streak) {
  const engine = ensureAudioEngine();
  if (!engine || !masterGain) return;

  const now = engine.currentTime + 0.01;
  const root = 392;
  const boost = Math.min(0.02 * Math.floor(streak / 10), 0.08);
  const notes = [root, root * 1.2599, root * 1.4983, root * 2];

  notes.forEach((frequency, index) => {
    createOscillator(
      frequency,
      index === notes.length - 1 ? "square" : "triangle",
      now + index * 0.07,
      0.22 + index * 0.03,
      0.05 + boost
    );
  });
}

function playFinishedSound() {
  const engine = ensureAudioEngine();
  if (!engine || !masterGain) return;

  const now = engine.currentTime + 0.02;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((frequency, index) => {
    createOscillator(
      frequency,
      index < 2 ? "triangle" : "square",
      now + index * 0.09,
      0.28,
      0.07
    );
  });

  createOscillator(1318.51, "sine", now + 0.4, 0.45, 0.09);
}

function stopMusic() {
  musicEnabled = false;
  updateMusicButtons();
  if (musicTrack) {
    musicTrack.pause();
  }
  window.clearInterval(musicTimer);
  musicTimer = undefined;
}

function toggleMusic() {
  if (musicEnabled) {
    stopMusic();
  } else {
    startMusic();
  }
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  const position = state.currentIndex + 1;

  questionCounter.textContent = `vraag ${position} van ${state.questions.length}`;
  questionTitle.textContent = question.title;
  scorePill.textContent = `${state.score} goed`;
  progressBar.style.width = `${((position - 1) / state.questions.length) * 100}%`;
  scenarioText.textContent = question.scenario;
  optionsList.innerHTML = "";
  feedbackBox.hidden = true;
  feedbackBox.innerHTML = "";
  nextButton.disabled = true;
  nextButton.textContent = position === state.questions.length ? "Uitslag" : "Volgende";

  if (question.type === "open") {
    answerHelp.textContent = "Typ je antwoord in het vak en tik daarna op Volgende.";
    openAnswer.hidden = false;
    openAnswer.value = "";
    openAnswer.focus({ preventScroll: true });
    openAnswer.oninput = () => {
      nextButton.disabled = openAnswer.value.trim().length < 8;
    };
    return;
  }

  answerHelp.textContent = "Tik op een antwoord hieronder. Daarna verschijnt meteen feedback.";
  openAnswer.hidden = true;
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span>`;
    button.addEventListener("click", () => chooseOption(index));
    optionsList.appendChild(button);
  });
}

function chooseOption(index) {
  const question = state.questions[state.currentIndex];
  const buttons = [...optionsList.querySelectorAll(".option")];
  const correct = index === question.answer;

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === question.answer) button.classList.add("correct");
    if (buttonIndex === index && !correct) button.classList.add("wrong");
  });

  if (correct) {
    state.score += 1;
    state.correctStreak += 1;
    if (state.correctStreak > 0 && state.correctStreak % 10 === 0) {
      playStreakSound(state.correctStreak);
    }
  } else {
    state.correctStreak = 0;
  }

  state.answers[state.currentIndex] = {
    title: question.title,
    correct,
    note: question.note
  };

  feedbackBox.hidden = false;
  feedbackBox.innerHTML = correct
    ? `<strong>Correct.</strong> De liefdesstaat blijft bestuurbaar, net aan. ${question.note}`
    : `<strong>Bijna.</strong> De officiele richting: ${question.options[question.answer]} ${question.note}`;

  scorePill.textContent = `${state.score} goed`;
  nextButton.disabled = false;
}

function handleOpenAnswer() {
  const question = state.questions[state.currentIndex];
  const answer = openAnswer.value.trim();

  state.score += 1;
  state.correctStreak = 0;
  state.answers[state.currentIndex] = {
    title: question.title,
    correct: true,
    note: `${question.note} Voorbeeldrichting: ${question.sample}. Haar antwoord: ${answer}`
  };
}

function goNext() {
  const question = state.questions[state.currentIndex];

  if (question.type === "open" && !state.answers[state.currentIndex]) {
    handleOpenAnswer();
  }

  if (!state.answers[state.currentIndex]) {
    state.answers[state.currentIndex] = {
      title: question.title,
      correct: false,
      note: question.note
    };
  }

  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
    return;
  }

  showResults();
}

function skipQuestion() {
  const question = state.questions[state.currentIndex];
  state.correctStreak = 0;
  state.answers[state.currentIndex] = {
    title: question.title,
    correct: false,
    note: `Overgeslagen. ${question.note}`
  };
  goNext();
}

function showResults() {
  progressBar.style.width = "100%";
  showScreen("result");
  playFinishedSound();

  resultTitle.textContent = state.score >= 8
    ? "Staatsgevaarlijk goed"
    : state.score >= 5
      ? "Romantisch verdacht"
      : "Charmante chaos";

  resultScore.textContent = `${state.score} van ${state.questions.length} volgens de officiele liefdescommissie`;
  resultCopy.textContent = state.score >= 8
    ? "Swahita heeft de quiz overleefd met intellectuele elegantie en vermoedelijk te veel charisma voor een reguliere vergunning."
    : state.score >= 5
      ? "De liefde is bestuurlijk instabiel, maar inhoudelijk kansrijk. Aanbevolen interventie: lachen, zoenen, eventueel snacks."
      : "De uitslag is onduidelijk, maar dat geldt ook voor quantumfysica en daar doen mensen ook moeilijk interessant over.";

  answerKey.innerHTML = "";
  state.answers.forEach((answer, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${answer.title}: ${answer.note}`;
    answerKey.appendChild(item);
  });
}

async function shareResult() {
  const text = [
    "Swahito & Swahita quiz:",
    `${resultTitle.textContent} - ${resultScore.textContent}`,
    resultCopy.textContent
  ].join("\n");

  if (navigator.share) {
    try {
      await navigator.share({ title: "Swahito & Swahita Quiz", text });
      return;
    } catch {
      // Fall through to clipboard when sharing is cancelled or unavailable.
    }
  }

  await navigator.clipboard.writeText(text);
  shareButton.textContent = "Uitslag gekopieerd";
  setTimeout(() => {
    shareButton.textContent = "Kopieer uitslag";
  }, 1800);
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = undefined;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

startButton.addEventListener("click", startQuiz);
musicButton.addEventListener("click", toggleMusic);
floatingMusicButton.addEventListener("click", toggleMusic);
nextButton.addEventListener("click", goNext);
skipButton.addEventListener("click", skipQuestion);
restartButton.addEventListener("click", startQuiz);
shareButton.addEventListener("click", shareResult);
