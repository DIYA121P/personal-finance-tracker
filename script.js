// SECTION SWITCHER
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// EXPENSE SYSTEM
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let goal = localStorage.getItem("goal") || 0;

function detectCategory(name) {
    let text = name.toLowerCase();
    if (text.includes("chai") || text.includes("pizza") || text.includes("food") || text.includes("snack"))
        return "Food";
    if (text.includes("uber") || text.includes("auto") || text.includes("rickshaw") || text.includes("bus"))
        return "Travel";
    if (text.includes("shoe") || text.includes("clothes") || text.includes("shopping"))
        return "Shopping";
    if (text.includes("fees") || text.includes("college") || text.includes("books"))
        return "College";
    return "Misc";
}

function addExpense() {
    let name = expName.value;
    let amt = Number(expAmount.value);

    if (!name || !amt) return expMsg.innerText = "Enter valid details!";

    let cat = detectCategory(name);

    expenses.push({ name, amt, cat });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    expMsg.innerText = "Added! ✔";
    expName.value = "";
    expAmount.value = "";

    updateDashboard();
    loadExpenses();
}

function loadExpenses() {
    let tbody = document.querySelector("#expensesTable tbody");
    tbody.innerHTML = "";

    expenses.forEach((e, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${e.name}</td>
                <td>₹${e.amt}</td>
                <td>${e.cat}</td>
                <td><button onclick="editExpense(${i})">✏️</button></td>
                <td><button onclick="deleteExpense(${i})">🗑️</button></td>
            </tr>
        `;
    });
}

function deleteExpense(i) {
    expenses.splice(i, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
    updateDashboard();
}

function editExpense(i) {
    let newName = prompt("New name:", expenses[i].name);
    let newAmt = Number(prompt("New amount:", expenses[i].amt));

    if (!newName || !newAmt) return;

    expenses[i].name = newName;
    expenses[i].amt = newAmt;
    expenses[i].cat = detectCategory(newName);

    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
    updateDashboard();
}

function setGoal() {
    goal = Number(goalInput.value);
    localStorage.setItem("goal", goal);
    goalMsg.innerText = "Goal Saved! 🎯";
    updateDashboard();
}

function updateDashboard() {
    let total = expenses.reduce((a, b) => a + b.amt, 0);

    totalSpent.innerText = "₹" + total;
    totalTransactions.innerText = expenses.length;

    if (goal > 0) {
        let percentage = Math.min(Math.round((total / goal) * 100), 100);
        savingsProgress.innerText = percentage + "%";
    }

    generatePersonality();
    loadChart();
}

function generatePersonality() {
    if (expenses.length === 0)
        return personalityText.innerText = "Not enough data yet.";

    let total = expenses.reduce((a, b) => a + b.amt, 0);
    let avg = total / expenses.length;

    if (avg > 500)
        personalityText.innerText = "You are a Big Spender 💸";
    else if (expenses.length > 15 && avg > 300)
        personalityText.innerText = "You are an Impulsive Spender 😬";
    else if (avg < 200)
        personalityText.innerText = "You are a Minimalist 🧘";
    else
        personalityText.innerText = "You are a Balanced Spender ⚖️";
}

let chart;
function loadChart() {
    let ctx = document.getElementById("weeklyChart").getContext("2d");

    let weekly = [0,0,0,0,0,0,0];
    expenses.forEach(e => weekly[Math.floor(Math.random()*7)] += e.amt);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
            datasets: [{
                label: "Weekly Spending",
                data: weekly,
                fill: false
            }]
        }
    });
}

function showSignup() { showSection("signup"); }

function signup() {
    localStorage.setItem("user", signUser.value);
    localStorage.setItem("pass", signPass.value);
    signupMsg.innerText = "Account created!";
}

function login() {
    if (loginUser.value === localStorage.getItem("user") &&
        loginPass.value === localStorage.getItem("pass")) {
        loginMsg.innerText = "Login success 🎉";
        showSection("dashboard");
    } else {
        loginMsg.innerText = "Wrong details!";
    }
}

function funFact() {
    let facts = [
        "If you save ₹50 daily, you save ₹18,250 yearly!",
        "Richest people track every rupee they spend.",
        "Impulse buying is the #1 reason students go broke.",
        "Tracking expenses is the first step to financial freedom!"
    ];
    funText.innerText = facts[Math.floor(Math.random() * facts.length)];
}

updateDashboard();
loadExpenses();

