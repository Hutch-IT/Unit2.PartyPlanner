const COHORT = "2311-fsa-et-web-pt-sf";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
}
const eventList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
    await getEvents();
    renderEvents();

}

render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

function renderEvents() {
    if (!state.events.length) {
        eventList.innerHTML = "<li>No events.</li>";
        return;
    }
    const eventCards = state.events.map((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <h2>${event.name.toUpperCase()}</h2>
        <p>&#x1f5d2; ${event.description}</p>
        <p>&#x1F550; ${new Date(event.date)}</p>
        <p>&#127758; ${event.location}</p>
        `;
        const button = document.createElement("button");
        button.textContent = "Delete";
        button.value = event.id;
        li.append(button);
        button.addEventListener("click", deleteEvent);
        return li;
    });

    eventList.replaceChildren(...eventCards);
}

async function addEvent(event) {
    event.preventDefault();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: addEventForm.name.value,
                description: addEventForm.description.value,
                date: new Date(addEventForm.date.value),
                location: addEventForm.location.value,
            }),

        });
        if (!response.ok) {
            console.log(response.body);
            throw new Error("Failed to create event");
        } else {
            render();
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteEvent(event) {
    const eventId = event.target.value;
    try {
        const response = await fetch(`${API_URL}/${eventId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete event");
        } else {
            render();
        }
    } catch (error) {
        console.error(error);
    }
}

