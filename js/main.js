// --------------------
// ELEMENTS
// --------------------
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const eventForm = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");
const themeSwitcher = document.getElementById("themeSwitcher");

let currentDate = new Date();
let selectedDate = null;

// --------------------
// LOCAL STORAGE FUNCTIONS
// --------------------
function saveEvents(events) {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
}

function loadEvents() {
    return JSON.parse(localStorage.getItem("calendarEvents")) || {};
}

let events = loadEvents();

// --------------------
// FETCH DEFAULT EVENTS
// --------------------
fetch("../data.json")
    .then(res => res.json())
    .then(data => {
        data.defaultEvents.forEach(event => {
            if (!events[event.date]) events[event.date] = [];

            // Only add default event if it doesn't already exist
            const exists = events[event.date].some(e => e.title === event.title);
            if (!exists) {
                events[event.date].push(event);
            }
        });

        saveEvents(events); // <- SAVE merged events to localStorage
        renderCalendar();
    })
    .catch(() => renderCalendar());

// --------------------
// CALENDAR RENDERING
// --------------------
function renderCalendar() {
    calendar.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent =
        currentDate.toLocaleString("default", { month: "long" }) + " " + year;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.setAttribute("role", "gridcell");
        dayDiv.setAttribute("tabindex", "0");

        const number = document.createElement("div");
        number.classList.add("day-number");
        number.textContent = day;
        dayDiv.appendChild(number);

        // Add event dots if any
        if (events[dateKey]) {
            const dotContainer = document.createElement("div");
            dotContainer.classList.add("event-dots");

            events[dateKey].forEach(event => {
                const dot = document.createElement("span");
                dot.classList.add("dot", event.category);
                dotContainer.appendChild(dot);
            });

            dayDiv.appendChild(dotContainer);
        }

        dayDiv.addEventListener("click", () => {
            document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
            dayDiv.classList.add("selected");
            selectedDate = dateKey;
            displayEvents();
        });

        dayDiv.addEventListener("keydown", e => {
            if (e.key === "Enter") dayDiv.click();
        });

        calendar.appendChild(dayDiv);
    }
}

// --------------------
// DISPLAY EVENTS
// --------------------
function displayEvents() {
    eventList.innerHTML = "";

    if (!selectedDate || !events[selectedDate]) return;

    events[selectedDate].forEach(event => {
        const li = document.createElement("li");
        li.textContent = `${event.time || ""} - ${event.title}`;
        li.classList.add(event.category);
        eventList.appendChild(li);
    });
}

// --------------------
// FORM SUBMIT
// --------------------
eventForm.addEventListener("submit", e => {
    e.preventDefault();

    if (!eventForm.checkValidity()) {
        eventForm.reportValidity();
        return;
    }

    if (!selectedDate) {
        alert("Please select a date first.");
        return;
    }

    const title = document.getElementById("eventTitle").value;
    const time = document.getElementById("eventTime").value;
    const category = document.getElementById("eventCategory").value;

    if (!events[selectedDate]) events[selectedDate] = [];

    events[selectedDate].push({ title, time, category });

    saveEvents(events); // <- SAVE new events
    eventForm.reset();
    renderCalendar();
    displayEvents();
});

// --------------------
// NAVIGATION
// --------------------
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// --------------------
// THEME SWITCHER
// --------------------
themeSwitcher.addEventListener("change", e => {
    document.body.className = e.target.value;
});