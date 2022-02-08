const daysOfWeek = document.getElementById("days-of-week");

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

function createWeekName(index) {
  const weekName = createElement("h3", mapDayName.get(index), {
    className: "week-name",
  });

  return weekName;
}

function createWeekInputsContainer(index, weekData) {
  const identifiers = weekData.length
    ? {
        className: "week-inputs-container",
        id: `week-${index}`,
      }
    : { className: "week-inputs-container" };
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

  inputContainer.append(inputFrom, span, inputTo, trash);
  return inputContainer;
}

function createControlMenu() {
  const controlMenu = createElement("div", "", { className: "control-menu" });
  const plus = createElement("div", "+", { className: "plus" });
  const copy = createElement("div", "©", { className: "copy" });

  controlMenu.append(plus, copy);
  return controlMenu;
}

function createElement(tag, content, { className = "", id = "" }) {
  const el = document.createElement(tag);

  if (className) {
    el.classList.add(className);
  }

  if (id) {
    el.id = id;
  }

  el.innerText = content;

  return el;
}
