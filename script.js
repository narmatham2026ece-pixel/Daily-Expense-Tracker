let expenses = JSON.parse(
    localStorage.getItem("expenses") || "[]"
);

let budget = Number(localStorage.getItem("budget")) || 2000;

const today = new Date();
document.getElementById("date").value =
    today.toLocaleDateString("en-CA");

function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("budget", budget);
}

function setBudget() {
    let value = Number(document.getElementById("budgetInput").value);

    if (!Number.isFinite(value) || value <= 0) {
        alert("Please enter a valid budget!");
        return;
    }

    budget = value;
    saveData();
    displayExpenses();

    document.getElementById("budgetInput").value = "";
}

function addExpense() {
    let name = document.getElementById("expenseName").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;
    let type = document.getElementById("type").value;
    let date = document.getElementById("date").value;

    if (!name || !date || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid expense details!");
        return;
    }

    expenses.push({
        id: Date.now() + Math.random(),
        name,
        amount,
        category,
        type,
        date
    });

    saveData();
    displayExpenses();

    document.getElementById("expenseName").value = "";
    document.getElementById("amount").value = "";
}

function deleteExpense(id) {
    expenses = expenses.filter(item => item.id !== id);
    saveData();
    displayExpenses();
}

function displayExpenses() {

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let monthlyExpenses = expenses.filter(item => {
        let d = new Date(item.date + "T00:00:00");
        return d.getMonth() === currentMonth &&
               d.getFullYear() === currentYear;
    });

    let total = monthlyExpenses.reduce(
        (sum, item) => sum + item.amount, 0
    );

    let remaining = budget - total;

    document.getElementById("total").textContent =
        "₹" + total.toFixed(2);

    document.getElementById("budget").textContent =
        "₹" + budget.toFixed(2);

    document.getElementById("remaining").textContent =
        "₹" + remaining.toFixed(2);

    document.getElementById("remaining").style.color =
        remaining < 0 ? "#e5484d" : "#16a34a";

    let list = document.getElementById("expenseList");
    list.innerHTML = "";

    if (expenses.length === 0) {
        list.textContent = "No expenses added yet!";
    }

    expenses.slice().reverse().forEach(item => {

        let div = document.createElement("div");
        div.className = "expense-item";

        let title = document.createElement("h3");
        title.textContent = "💸 " + item.name;

        let details = document.createElement("p");
        details.textContent =
            item.category + " | " + item.type + " | " + item.date;

        let price = document.createElement("p");
        price.textContent = "Amount: ₹" + item.amount.toFixed(2);

        let button = document.createElement("button");
        button.className = "delete-btn";
        button.textContent = "Delete";
        button.onclick = () => deleteExpense(item.id);

        div.append(title, details, price, button);
        list.appendChild(div);
    });

    // Money Leak Detector
    let smallExpenses = monthlyExpenses.filter(
        item => item.amount <= 100
    );

    let smallTotal = smallExpenses.reduce(
        (sum, item) => sum + item.amount, 0
    );

    let insight = document.getElementById("insight");

    if (monthlyExpenses.length === 0) {
        insight.textContent =
            "Add expenses to discover your spending habits.";
    } else if (total > budget) {
        insight.textContent =
            "⚠️ Budget exceeded! You have spent ₹" +
            (total - budget).toFixed(2) + " more than your budget.";
    } else if (smallExpenses.length >= 3) {
        insight.textContent =
            "💡 You have made " + smallExpenses.length +
            " small purchases this month, adding up to ₹" +
            smallTotal.toFixed(2) +
            ". Small expenses can add up!";
    } else {
        insight.textContent =
            "🎉 Good job! Your spending is within your monthly budget.";
    }
}

displayExpenses();