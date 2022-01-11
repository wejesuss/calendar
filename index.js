const calendarHeader = document.querySelector(
  "section:nth-child(2) > .date-picker > .date-month-year"
);
const title = calendarHeader.querySelector("h3");
const pickers = calendarHeader.querySelectorAll(".picker i");

const toWeekString = [
  [0, "Dom"],
  [1, "Seg"],
  [2, "Ter"],
  [3, "Qua"],
  [4, "Qui"],
  [5, "Sex"],
  [6, "Sáb"],
];

const toMonthString = [
  [0, "Janeiro"],
  [1, "Fevereiro"],
  [2, "Março"],
  [3, "Abril"],
  [4, "Maio"],
  [5, "Junho"],
  [6, "Julho"],
  [7, "Agosto"],
  [8, "Setembro"],
  [9, "Outubro"],
  [10, "Novembro"],
  [11, "Dezembro"],
];

const dates = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, 31, null, null, null, null, null],
];

const mapWeek = new Map(toWeekString);
const mapMonth = new Map(toMonthString);

const todayMs = Date.now();
const today = new Date(todayMs);
console.log(today);

today.setDate(1);

console.log(today.getFullYear());
console.log(mapMonth.get(today.getMonth()));
console.log(mapWeek.get(today.getDay()));

/**
 * Create an array representing the first week
 *
 * @param {number} dayOfWeek The number of the day of the week from 0 to 6
 * 
 * If `dayOfWeek` is not a number, *throws* an error
 * 
 * @param {number} day The number of the day from 1 to 31
 *
 * @param {number} weekLength the maximum number of days in that week.
 * The param `weekLength` is used to limit `day` incrementation
 * @example if `weekLength` is set to 2 and `day` is 30, the final result will be 
 * e.g. [30, 31, null, null, null, null, null]
 * @default 7
 *
 * @returns {Array<number | null>} e.g.  [null, null, 2, 3, 4, 5, 6]
 */
function createWeekRow(dayOfWeek, day, weekLength = 7) {
  if (typeof dayOfWeek !== "number") {
    throw new Error('"dayOfWeek" is not a number');
  }

  const week = [null, null, null, null, null, null, null];

  return week.map((_, index) => {
    if (index < dayOfWeek || index >= weekLength) {
      return null;
    }

    if (index === dayOfWeek) {
      return day;
    }

    if (index > dayOfWeek) {
      return index - dayOfWeek + day;
    }
  });
}
