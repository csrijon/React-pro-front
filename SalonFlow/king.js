

// const days = []
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
let today = new Date().getDay()

// console.log(months[new Date().getMonth()])

for (let i = 0; i < 30; i++) {
    console.log(days[(today + i) % 7])
}