let sessionId = null;
let currentQuestionIndex = 0;
let questions = []; 
const totalQuestions = 10; 

document.getElementById("start-btn").addEventListener("click", async () => {
    const response = await fetch("/quiz/start/", { method: "POST" });
    const data = await response.json();
    sessionId = data.session_id;

    // Fetch all questions upfront
    const questionsResponse = await fetch(`/quiz/questions/${sessionId}/?limit=${totalQuestions}`);
    const questionsData = await questionsResponse.json();
    questions = questionsData.questions; 

    document.getElementById("question-container").style.display = "block";
    document.getElementById("start-btn").style.display = "none";
    loadQuestion();
});

function loadQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        showStats();
        return;
    }

    const question = questions[currentQuestionIndex];
    currentQuestionId = question.question_id;

    // Update question text and options
    document.getElementById("question-text").innerText = question.text;
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = ""; 
    const ul = document.createElement("ul");
    for (const [key, value] of Object.entries(question.options)) {
        const li = document.createElement("li"); 

        
        const input = document.createElement("input");
        input.type = "radio";
        input.id = `option-${key}`;
        input.name = "selector";
        input.value = key;

        
        input.addEventListener("click", () => {
            selectedOption = key;
            document.getElementById("submit-btn").disabled = false;
            document.getElementById("next-btn").disabled = false;
        });

        
        const label = document.createElement("label");
        label.htmlFor = `option-${key}`;
        label.innerText = value;

        
        const checkDiv = document.createElement("div");
        checkDiv.className = "check";

        
        li.appendChild(input);
        li.appendChild(label);
        li.appendChild(checkDiv);

       
        ul.appendChild(li);
    }

    optionsContainer.appendChild(ul);

    // Manage buttons for next/submit
    if (currentQuestionIndex === totalQuestions - 1) {
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("submit-btn").style.display = "inline-block";
    } else {
        document.getElementById("next-btn").style.display = "inline-block";
        document.getElementById("submit-btn").style.display = "none";
    }

    document.getElementById("submit-btn").disabled = true;
    document.getElementById("next-btn").disabled = true;
}

let selectedOption = null;

function selectOption(button) {
    document.querySelectorAll("#options-container button").forEach((btn) => {
        btn.style.backgroundColor = "";
    });
    button.style.backgroundColor = "#ddd";
    selectedOption = button.dataset.option;
    document.getElementById("submit-btn").disabled = false;
    document.getElementById("next-btn").disabled = false;
}

document.getElementById("next-btn").addEventListener("click", async () => {
    const response = await fetch(`/quiz/submit/${sessionId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question_id: currentQuestionId,
            selected_option: selectedOption,
        }),
    });
    const data = await response.json();

    currentQuestionIndex++;
    loadQuestion();
});

document.getElementById("submit-btn").addEventListener("click", async () => {
    const response = await fetch(`/quiz/submit/${sessionId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question_id: currentQuestionId,
            selected_option: selectedOption,
        }),
    });
    const data = await response.json();
    showStats();
});

async function showStats() {
    const response = await fetch(`/quiz/stats/${sessionId}/`);
    const data = await response.json();
    document.getElementById("total-questions").innerText = data.total_questions;
    document.getElementById("correct-answers").innerText = data.correct_answers;
    document.getElementById("incorrect-answers").innerText = data.incorrect_answers;
    document.getElementById("stats-container").style.display = "block";
    document.getElementById("question-container").style.display = "none";
}
