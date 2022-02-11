const daysOfWeek = document.getElementById("days-of-week");
const inputReplacements = document.getElementById("replacements");

const toDayString = () => {
  const mapDayName = new Map();
  mapDayName.set(0, "Dom");
  mapDayName.set(1, "Seg");
  mapDayName.set(2, "Ter");
  mapDayName.set(3, "Qua");
  mapDayName.set(4, "Qui");
  mapDayName.set(5, "Sex");
  mapDayName.set(6, "Sáb");

  return mapDayName;
};

const mapDayName = toDayString();

const weeks = [
  [],
  [
    {
      time_from: "03:50",
      time_to: "07:00",
    },
    {
      time_from: "09:00",
      time_to: "14:00",
    },
  ],
  [
    {
      time_from: "03:50",
      time_to: "07:00",
    },
  ],
  [
    {
      time_from: "03:50",
      time_to: "07:00",
    },
  ],
  [
    {
      time_from: "03:50",
      time_to: "07:00",
    },
  ],
  [
    {
      time_from: "03:50",
      time_to: "07:00",
    },
  ],
  [
    {
      time_from: "03:50",
      time_to: "07:00",
    },
  ],
];
const replacements = [
  {
    date: "20/01/2022",
    time_intervals: [
      {
        time_from: "16:00",
        time_to: "17:00",
      },
      {
        time_from: "18:00",
        time_to: "19:30",
      },
    ],
  },
  {
    date: "22/01/2022",
    time_intervals: [],
  },
];

function createWeekName(index) {
  const weekName = createElement("h3", mapDayName.get(index), {
    className: "week-name",
  });

  return weekName;
}

function createWeekInputsContainer(index, weekData) {
  const identifiers = {
    className: "week-inputs-container",
    id: `week-${index}`,
  };
  const content = weekData.length ? "" : "Indisponível";

  const weekInputsContainer = createElement("div", content, identifiers);

  return weekInputsContainer;
}

function createInput(name, type, value = "", { className = "", id = "" }) {
  const input = createElement("input", (content = ""), { className, id });
  input.setAttribute("name", name);
  input.setAttribute("type", type);
  input.value = value;

  return input;
}

function removeInputContainer(e) {
  const inputContainer = e.target.parentNode;
  const weekInputsContainer = inputContainer.parentNode;

  inputContainer.remove();
  if (weekInputsContainer.children.length < 1) {
    weekInputsContainer.textContent = "Indisponível";
  }
}

function createInputContainer(timeFrom, timeTo) {
  const inputContainer = createElement("div", "", {
    className: "input-container",
  });
  const inputFrom = createInput("week-time-from", "text", timeFrom, {
    className: "time-from",
  });
  const span = createElement("span", "-", {});
  const inputTo = createInput("week-time-to", "text", timeTo, {
    className: "time-to",
  });
  const trash = createElement("div", "trash", { className: "trash" });

  trash.addEventListener("click", removeInputContainer);

  inputContainer.append(inputFrom, span, inputTo, trash);
  return inputContainer;
}

function addInputContainer(e) {
  const week = e.target.parentNode.parentNode;
  const weekInputsContainer = week.querySelector(".week-inputs-container");
  if (!weekInputsContainer) {
    return new Error("week-inputs-container element does not exist");
  }

  let inputContainer = weekInputsContainer.querySelector(
    ".input-container:last-child"
  );

  if (inputContainer) {
    inputContainer = inputContainer.cloneNode(true);
    inputContainer.children[3].addEventListener("click", removeInputContainer);
  } else {
    inputContainer = createInputContainer("09:00", "17:00");
    weekInputsContainer.textContent = "";
  }

  weekInputsContainer.append(inputContainer);
}

function createControlMenu() {
  const controlMenu = createElement("div", "", { className: "control-menu" });
  const plus = createElement("div", "+", { className: "plus" });
  const copy = createElement("div", "©", { className: "copy" });

  plus.addEventListener("click", addInputContainer);

  controlMenu.append(plus, copy);
  return controlMenu;
}

function createElement(tag, content, { className = "", id = "" }) {
  const el = document.createElement(tag);

  if (className) {
    el.classList.add(...className.split(" "));
  }

  if (id) {
    el.id = id;
  }

  el.innerText = content;

  return el;
}

function renderAvailability() {
  for (let index = 0; index < 7; index++) {
    const weekData = weeks[index];
    const week = createElement("div", "", { className: "week" });
    const weekName = createWeekName(index);
    const weekInputsContainer = createWeekInputsContainer(index, weekData);
    const controlMenu = createControlMenu();

    weekData.forEach((timeInterval) => {
      weekInputsContainer.append(
        createInputContainer(timeInterval.time_from, timeInterval.time_to)
      );
    });

    week.append(weekName, weekInputsContainer, controlMenu);

    daysOfWeek.appendChild(week);
  }
}

function renderReplacements() {
  const replacementList = inputReplacements.querySelector(".replacement-list");

  const $replacements = replacements.map((replacement) => {
    const { date, time_intervals } = replacement;

    const replacementDate = createElement("li", "", {
      className: "replacement-date",
    });

    const day = createElement("div", date, { className: "day" });
    let timeIntervalList;
    const trash = createElement("div", "trash", { className: "trash" });

    if (!time_intervals || time_intervals.length === 0) {
      timeIntervalList = createElement("ol", "Indisponível", {
        className: "time-interval-list unavailable",
      });
    } else {
      timeIntervalList = createElement("ol", "", {
        className: "time-interval-list",
      });

      time_intervals.forEach(({ time_from, time_to }) => {
        const timeInterval = createElement("li", `${time_from} - ${time_to}`, {
          className: "time-interval",
        });

        timeIntervalList.append(timeInterval);
      });
    }

    replacementDate.append(day, timeIntervalList, trash);
    return replacementDate;
  });

  replacementList.append(...$replacements);
}

renderAvailability();
renderReplacements();
