import {
    format,
    getUnixTime,
    fromUnixTime,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
} from "date-fns";

const datePickerButton = document.querySelector(".date-picker-button");
const dateTable = document.querySelector(".date-picker");
const headerCurrentMonth = document.querySelector(".current-month");
const prevMonthButton = document.querySelector(".prev-month-button ");
const nextMonthButton = document.querySelector(".next-month-button");
const dateGrid = document.querySelector(".date-picker-grid-dates");

//REFERENCE DATE FOR ACTIONS && WILL BE RERENDERED COUNTLESS TIMES

let currentDate = new Date();

// FOR OPENING DATE TABLE && UPDATING THE BUTTON

datePickerButton.addEventListener("click", () => {
    dateTable.classList.toggle("show");
    const selectedDate = fromUnixTime(datePickerButton.dataset.selectedDate);
    currentDate = selectedDate;
    renderDateTable(selectedDate);
});

// GET THE DATE, TURN IT INTO UNIX TIME AND THEN ASSIGN TO THE BUTTON

function setDate(date) {
    datePickerButton.textContent = format(date, "MMM do, yyyy");
    datePickerButton.dataset.selectedDate = getUnixTime(date);
}

// UPDATE AND RE-RENDER SHOWN MONTH-HEADER && INVOKE RENDER-ALL-DATES FUNCTION

function renderDateTable(selectedDate) {
    headerCurrentMonth.textContent = format(currentDate, "MMMM yyyy");
    setupDates(selectedDate);
}

function setupDates(selectedDate) {
    // GET THE FIRST AND LAST WEEK THE MONTH YOU'RE IN
    const startFirstWeek = startOfWeek(startOfMonth(currentDate));
    const endLastWeek = endOfWeek(endOfMonth(currentDate));

    // GET THE ALL DAYS IN THOSE WEEKS AS AN INTERVAL
    const allDates = eachDayOfInterval({
        start: startFirstWeek,
        end: endLastWeek,
    });
    // CLEAR NUMERICAL DATES ON THE TABLE BEFORE RE-RENDERING THEM
    dateGrid.innerHTML = "";

    allDates.forEach((date) => {
        // CREATE DATE BUTTONS
        const dateElement = document.createElement("button");
        dateElement.classList.add("date");

        // ASSIGN NUMERICAL DATES TO THE BUTTONS
        dateElement.textContent = date.getDate();

        // FIND THE DATES ACTUALLY BELONGS TO OTHER MONTHS (LEFTOVERS OF allDates)
        !isSameMonth(date, currentDate)
            ? dateElement.classList.add("date-picker-other-month-date")
            : null;

        // AUTO-SELECT CURRENT DAY WHEN PAGE LOADED
        isSameDay(date, selectedDate)
            ? dateElement.classList.add("selected")
            : null;

        // SELECT ANOTHER DAY BY CLICKING ON IT
        dateElement.addEventListener("click", () => {
            setDate(date);
            dateTable.classList.remove("show");
        });

        // INJECT DATE BUTTONS TO DOCUMENT
        dateGrid.appendChild(dateElement);
    });
}

prevMonthButton.addEventListener("click", () => {
    // KEEPING SELECTED DATE UP TO DATE
    const selectedDate = fromUnixTime(datePickerButton.dataset.selectedDate);

    // RENDER PREVIOUS MONTH
    currentDate = subMonths(currentDate, 1);
    renderDateTable(selectedDate);
});

nextMonthButton.addEventListener("click", () => {
    // KEEPING SELECTED DATE UP TO DATE
    const selectedDate = fromUnixTime(datePickerButton.dataset.selectedDate);

    // RENDER NEXT MONTH
    currentDate = addMonths(currentDate, 1);
    renderDateTable(selectedDate);
});

// STARTER - GET CURRENT LIVE DATE

setDate(new Date());
