let questions;
let selectedAnswers = [];

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        selectedAnswers = new Array(questions.exam.questions.length).fill(null);
        init();
    })
    .catch(error => console.error("Error loading JSON:", error));

let currentQuestionIndex = 0;
let timeLeft = 2.5 * 60;
let timerInterval;

function loadQuestion(index) {
    const questionContainer = document.querySelector(".main-content");
    const questionData = questions.exam.questions[index];
    const questionHtml = `
        <div class="timer" id="timer">Time Left - ${formatTime(timeLeft)}</div>
        <div class="question-header">${questions.exam.title} - Question No. ${index + 1}</div>
        <div class="question">
            <p><strong>${questionData.text}</strong></p>
        </div>
        <div class="options">
            ${questionData.options.map(option => `
                <label>
                    <input type="radio" name="option" value="${option.value}" ${selectedAnswers[index] === option.value ? 'checked' : ''} onchange="saveAnswer(${index}, '${option.value}')"> 
                    (${option.label}) ${option.text}
                </label>
            `).join("")}
        </div>
        <div class="actions">
            <button onclick="prevQuestion()">Previous</button>
            <button onclick="nextQuestion()">Next</button>
            <button style="background-color: green;" onclick="markAsDone()">Done</button>
        </div>
    `;
    questionContainer.innerHTML = questionHtml;
    updateSummary();
}

function saveAnswer(index, value) {
    selectedAnswers[index] = value;
    updateSummary();
}

function updateSummary() {
    const totalQuestions = questions.exam.questions.length;
    const answeredCount = selectedAnswers.filter(answer => answer !== null).length;
    const notAnsweredCount = totalQuestions - answeredCount;

    const summaryPanel = document.querySelector(".summary");
    summaryPanel.innerHTML = `
        <p>Total Questions: <strong>${totalQuestions}</strong></p>
        <p>Answered: <strong>${answeredCount}</strong></p>
        <p>Not Answered: <strong>${notAnsweredCount}</strong></p>
    `;
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.exam.questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
}

function markAsDone() {
    clearInterval(timerInterval);
    alert("Exam submitted!");
    window.location.href = "thankyou.html";
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        const timerElement = document.getElementById("timer");
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "Time's up!";
            timerElement.classList.add("expired");
            alert("Time's up! The exam is submitted automatically.");
            window.location.href = "thankyou.html";
        } else {
            timeLeft--;
            timerElement.textContent = `Time Left - ${formatTime(timeLeft)}`;
        }
    }, 1000);
}

function init() {
    loadQuestion(currentQuestionIndex);
    startTimer();
    updateSummary();
}
