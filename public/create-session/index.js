/**
 * Verify if the year is a leap year
 * @param {number} year The year to verify
 * @returns {boolean} whether the year is a leap year or not
 */
const isLeapYear = (year) => (year % 4 === 0 ? true : false);

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

const mapMonthName = toMonthString();
const mapMonthDays = toMonthDays();
let dayActive = "";
let timeActiveIndex = undefined;

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

/**
 * Creates a calendar structure that returns an array of arrays, each inner-array represents a week
 * @param {number} year The year of that month
 * @param {number} month month to be created the calendar structure
 * @returns {number[][]} An array with up to 6 arrays, each inner-array is a fixed-7-length array of numbers with the corresponding days of that week
 *
 * @example createMonth(1931, 1)
 * // returns
 * [[1, 2, 3, 4, 5, 6, 7],
 * [8, 9, 10, 11, 12, 13, 14],
 * [15, 16, 17, 18, 19, 20, 21],
 * [22, 23, 24, 25, 26, 27, 28]]
 */
function createMonth(year, month) {
  const WEEK_LENGTH = 7;
  const thisMonth = new Date(year, month, 1);
  const dates = [];

  let dayOfWeek = thisMonth.getDay();
  let day = 1;

  let weekLength = 7;
  while (weekLength > 0) {
    const week = createWeekRow(dayOfWeek, day, weekLength);
    dates.push(week);

    day = WEEK_LENGTH - dayOfWeek + day;
    dayOfWeek = 0;
    weekLength = calcWeekLength(year, month, day);
  }

  return dates;
}

/**
 * Calculate de difference between the number of days in that month (e.g. 31) and the `day` passed in this function as a parameter (inclusive)
 * @param {number} year year to calculate leap years (only useful for February)
 * @param {number} month month to get total number of days in that month
 * @param {number} day day to calculate the difference
 * @returns {number} returns `weekLength` used to determine the number of days in that week
 *
 * @example calcWeekLength(anyYear, 11, 28)
 * // returns
 * 4 // 31 - 28 + 1
 */
function calcWeekLength(year, month, day) {
  const days = mapMonthDays.get(month)(year);

  return days - day + 1;
}

function createCalendar(year, month) {
  const dates = [];
  const monthsToCreate = getMonthsToBeCreated(year, month);
  monthsToCreate.forEach((date) => {
    dates.push(createMonth(date.year, date.month));
  });

  const firstMonthToCreate = monthsToCreate[0];

  setCalendarTitle(firstMonthToCreate.year, firstMonthToCreate.month);
  setCalendarDays(dates[0], firstMonthToCreate.year, firstMonthToCreate.month);
  setPickersEvent(monthsToCreate, dates);
}

function setCalendarDays(monthDates, year, month) {
  const inputDay = document.getElementById("date-picker-day");
  const inputMonth = document.getElementById("date-picker-month");
  const inputYear = document.getElementById("date-picker-year");

  document.querySelector("table tbody").innerHTML = "";
  monthDates.forEach((week, weekIndex) => {
    const tr = document.createElement("tr");

    week.forEach((day, dayIndex) => {
      const td = document.createElement("td");

      if (day !== null) {
        const div = document.createElement("div");
        div.innerText = day;
        div.addEventListener("click", () => {
          if (dayActive) {
            const [weekIndex, dayIndex] = dayActive.split("/").map(Number);

            const previousActiveDay = document.querySelector(
              `table tbody tr:nth-child(${weekIndex + 1}) td:nth-child(${
                dayIndex + 1
              }) div`
            );
            previousActiveDay.classList.remove("active");
          }

          dayActive = `${weekIndex}/${dayIndex}`;
          div.classList.add("active");

          inputDay.value = day;
          inputMonth.value = month;
          inputYear.value = year;
        });

        td.append(div);
      }

      tr.append(td);
    });

    document.querySelector("table tbody").append(tr);
  });
}

function setPickersEvent(monthsToCreate, dates) {
  const inputMonth = document.getElementById("date-picker-month");
  const inputYear = document.getElementById("date-picker-year");

  const calendarHeader = document.querySelector(
    "section:nth-child(2) > .date-picker > .date-month-year"
  );

  let index = Number(calendarHeader.dataset.index);
  const pickers = calendarHeader.querySelectorAll(".picker i");

  pickers[0].addEventListener("click", () => {
    const isLimited = index < 1;

    if (isLimited) {
      return;
    }

    index--;

    const monthToCreate = monthsToCreate[index];
    setCalendarTitle(monthToCreate.year, monthToCreate.month);
    setCalendarDays(dates[index], monthToCreate.year, monthToCreate.month);
    calendarHeader.dataset.index = index;

    if (
      dayActive &&
      monthToCreate.year === Number(inputYear.value) &&
      monthToCreate.month === Number(inputMonth.value)
    ) {
      const [weekIndex, dayIndex] = dayActive.split("/").map(Number);

      const previousActiveDay = document.querySelector(
        `table tbody tr:nth-child(${weekIndex + 1}) td:nth-child(${
          dayIndex + 1
        }) div`
      );
      previousActiveDay.classList.add("active");
    }
  });

  pickers[1].addEventListener("click", () => {
    const isLimited = index > 1;

    if (isLimited) {
      return;
    }

    index++;

    const monthToCreate = monthsToCreate[index];
    setCalendarTitle(monthToCreate.year, monthToCreate.month);
    setCalendarDays(dates[index], monthToCreate.year, monthToCreate.month);
    calendarHeader.dataset.index = index;

    if (
      dayActive &&
      monthToCreate.year === Number(inputYear.value) &&
      monthToCreate.month === Number(inputMonth.value)
    ) {
      const [weekIndex, dayIndex] = dayActive.split("/").map(Number);

      const previousActiveDay = document.querySelector(
        `table tbody tr:nth-child(${weekIndex + 1}) td:nth-child(${
          dayIndex + 1
        }) div`
      );
      previousActiveDay.classList.add("active");
    }
  });
}

function setCalendarTitle(year, month) {
  const title = document.querySelector(
    "section:nth-child(2) > .date-picker > .date-month-year h3"
  );

  const monthName = mapMonthName.get(month);
  title.innerText = `${monthName} de ${year}`;
}

function getMonthsToBeCreated(year, month) {
  const thisMonth = new Date(year, month, 1);
  return [{}, {}, {}].map((_, index) => {
    const incrementation = index === 0 ? 0 : 1;
    const month = thisMonth.getMonth();

    thisMonth.setMonth(month + incrementation);

    const nextYear = thisMonth.getFullYear();
    const nextMonth = thisMonth.getMonth();

    return {
      year: nextYear,
      month: nextMonth,
    };
  });
}

const today = new Date();
createCalendar(today.getFullYear(), today.getMonth());

document
  .querySelectorAll(
    "body > main > div > section:nth-child(2) > div.hour-picker > ol > li"
  )
  .forEach((timeEl, timeIndex) => {
    timeEl.addEventListener("click", (e) => {
      if (typeof timeActiveIndex === "number") {
        const previousActiveTime = document.querySelector(
          `section:nth-child(2) .hour-picker > ol > li:nth-child(${
            timeActiveIndex + 1
          })`
        );

        previousActiveTime.classList.remove("active");
      }

      timeActiveIndex = timeIndex;
      timeEl.classList.add("active");

      const time = `0${e.target.innerText}`.slice(-5);
      document.getElementById("date-picker-time").value = time;
    });
  });
