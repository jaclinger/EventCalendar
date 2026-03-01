export async function fetchDefaultEvents() {
    const response = await fetch("../data.json");
    const data = await response.json();
    return data.defaultEvents;
}