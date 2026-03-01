export function saveEvents(events) {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
}

export function loadEvents() {
    return JSON.parse(localStorage.getItem("calendarEvents")) || {};
}