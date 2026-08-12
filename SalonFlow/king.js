

// // const days = []
// const totaldays = []
// const days = [
//     "Sun",
//     "Mon",
//     "Tue",
//     "Wed",
//     "Thu",
//     "Fri",
//     "Sat"
// ];
// let today = new Date().getDay()


// // console.log(months[new Date().getMonth()])

// for (let i = 0; i < 30; i++) {
//     // console.log()
//     totaldays.push(days[(today + i) % 7])
// }
// console.log(totaldays)
const dates =[]
for (let i = 0; i < 3; i++) {
    const date = new Date()
date.setDate(date.getDate()+i)
// console.log(date)
dates.push(date)
}
console.log(dates)