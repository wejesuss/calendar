const calendarHeader = document.querySelector(
  "section:nth-child(2) > .date-picker > .date-month-year"
);
const title = calendarHeader.querySelector("h3");
const pickers = calendarHeader.querySelectorAll(".picker i");

/**
 * Verify if the year is a leap year
 * @param {number} year The year to verify
 * @returns {boolean} whether the year is a leap year or not
 */
const isLeapYear = (year) => (year % 4 === 0 ? true : false);

/**
 * Creates a Map that maps each day of the week to its corresponding name. The day of the week is from 0 to 6
 * @returns {Map<number, string>}
 */
const toWeekString = () => {
  const mapWeekName = new Map();
  mapWeekName.set(0, "Dom");
  mapWeekName.set(1, "Seg");
  mapWeekName.set(2, "Ter");
  mapWeekName.set(3, "Qua");
  mapWeekName.set(4, "Qui");
  mapWeekName.set(5, "Sex");
  mapWeekName.set(6, "Sáb");

  return mapWeekName;
};

/**
 * Creates a Map that maps each month to its corresponding name. The month is from 0 to 11
 * @returns {Map<number, string>}
 */
const toMonthString = () => {
  const mapMonthName = new Map();
  mapMonthName.set(0, "Janeiro");
  mapMonthName.set(1, "Fevereiro");
  mapMonthName.set(2, "Março");
  mapMonthName.set(3, "Abril");
  mapMonthName.set(4, "Maio");
  mapMonthName.set(5, "Junho");
  mapMonthName.set(6, "Julho");
  mapMonthName.set(7, "Agosto");
  mapMonthName.set(8, "Setembro");
  mapMonthName.set(9, "Outubro");
  mapMonthName.set(10, "Novembro");
  mapMonthName.set(11, "Dezembro");

  return mapMonthName;
};

/**
 * Creates a Map that maps each month to a function that returns its corresponding number of days. The month is from 0 to 11.
 *
 * February returned function has a parameter year, it will automatically detect leap years (i.e. 28 or 29 days)
 * @returns {(Map<number, () => number>|Map<number, (year: number) => number>)}
 */
const toMonthDays = () => {
  const mapMonthDays = new Map();
  mapMonthDays.set(0, () => 31);
  mapMonthDays.set(1, (year) => (isLeapYear(year) ? 29 : 28));
  mapMonthDays.set(2, () => 31);
  mapMonthDays.set(3, () => 30);
  mapMonthDays.set(4, () => 31);
  mapMonthDays.set(5, () => 30);
  mapMonthDays.set(6, () => 31);
  mapMonthDays.set(7, () => 31);
  mapMonthDays.set(8, () => 30);
  mapMonthDays.set(9, () => 31);
  mapMonthDays.set(10, () => 30);
  mapMonthDays.set(11, () => 31);

  return mapMonthDays;
};

const mapWeekName = toWeekString();
const mapMonthName = toMonthString();
const mapMonthDays = toMonthDays();

/**
 * Create an array representing the first week
 *
 * @param {number} dayOfWeek The number of the day of the week from 0 to 6
 * @throws If `dayOfWeek` is not a number, *throws* an error
 *
 * @param {number} day The number of the day from 1 to 31
 * @throws If `day` is not a number, *throws* an error
 *
 * @param {number} [weekLength] The maximum number of days in that week.
 * The param `weekLength` is used to limit `day` incrementation
 * @default 7
 *
 * @example createWeekRow(0, 30, 2)
 * // [30, 31, null, null, null, null, null]
 * createWeekRow(2, 1)
 * // [null, null, 1, 2, 3, 4, 5]
 *
 * @returns {Array<number | null>} e.g.  [null, null, 2, 3, 4, 5, 6]
 */
function createWeekRow(dayOfWeek, day, weekLength = 7) {
  if (typeof dayOfWeek !== "number") {
    throw new Error('"dayOfWeek" is not a number');
  }

  if (typeof day !== "number") {
    throw new Error('"day" is not a number');
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

function createMonth(year, month) {
  const thisMonth = new Date(year, month, 1);
  console.log(thisMonth);
  const dates = [
    [null, null, null, null, null, null, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
    [30, 31, null, null, null, null, null],
  ];

  let dayOfWeek = thisMonth.getDay();
  let day = 1;
  const WEEK_LENGTH = 7;

  for (let i = 0; i < 3; i++) {
    if (day === 1) {
      const firstWeek = createWeekRow(dayOfWeek, day);
      console.log(firstWeek);
    }

    day = WEEK_LENGTH - dayOfWeek + day;
    dayOfWeek = 0;

    const week = createWeekRow(dayOfWeek, day);
    console.log(week);
  }

  day = WEEK_LENGTH - dayOfWeek + day;
  let weekLength = calcWeekLength(year, month, day);

  while (weekLength > 0) {
    const week = createWeekRow(dayOfWeek, day, weekLength);
    console.log(week);
    day = WEEK_LENGTH - dayOfWeek + day;
    weekLength -= 7;
  }
}

function calcWeekLength(year, month, day) {
  const days = mapMonthDays.get(month)(year);

  return days - day + 1;
}

createMonth(2022, 0);
