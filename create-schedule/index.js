const daysOfWeek = document.getElementById("days-of-week");
const inputReplacements = document.getElementById("replacements");
const eventsList = document.getElementById("events");

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
const events = {
  "25 de Jan, 2022. De 15:15 até 15:30": {
    name: "Tiago Corona",
    email: "tiagocorona@example.com",
    cpf: "111.111.111-11",
    id: "MTY1NjQ2MTgyMTMx",
  },
  "25 de Jan, 2022. De 15:30 até 15:45": {
    name: "Tiago Corona",
    email: "tiagocorona@example.com",
    cpf: "111.111.111-11",
    id: "MTY1NjQ2MTgyMTMx",
  },
  "19 de Fev, 2022. De 09:00 até 09:15": {
    name: "Tiago Corona 2",
    email: "tiagocorona2@example.com",
    cpf: "222.222.222-22",
    id: "MTY1NjQ2MTgyMTMx",
  },
};

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

// listeners

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

function removeInputContainer(e) {
  const inputContainer = e.target.parentNode;
  const weekInputsContainer = inputContainer.parentNode;

  inputContainer.remove();
  if (weekInputsContainer.children.length < 1) {
    weekInputsContainer.textContent = "Indisponível";
  }
}

function removeReplacementDate(e) {
  const replacementDate = e.target.parentNode;

  replacementDate.remove();
}

// decorators

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

function createTrashIcon() {
  const trash = createElement("div", "", { className: "trash icon" });
  const icon = createElement("img", "", {});

  icon.setAttribute("src", "/images/delete.svg");
  icon.setAttribute("alt", "Deletar");

  trash.appendChild(icon);

  return trash;
}

function createPlusIcon() {
  const plus = createElement("div", "", { className: "plus icon" });
  const icon = createElement("img", "", {});

  icon.setAttribute("src", "/images/plus.svg");
  icon.setAttribute("alt", "Adicionar");

  plus.appendChild(icon);
  plus.addEventListener("click", addInputContainer);

  return plus;
}

function createCopyIcon() {
  const copy = createElement("div", "", { className: "copy icon" });
  const icon = createElement("img", "", {});

  icon.setAttribute("src", "/images/copy.svg");
  icon.setAttribute("alt", "Copiar");

  copy.appendChild(icon);

  return copy;
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
  const trash = createTrashIcon();
  trash.addEventListener("click", removeInputContainer);

  inputContainer.append(inputFrom, span, inputTo, trash);
  return inputContainer;
}

function createControlMenu() {
  const controlMenu = createElement("div", "", { className: "control-menu" });
  const plus = createPlusIcon();
  const copy = createCopyIcon();

  controlMenu.append(plus, copy);
  return controlMenu;
}

// replacements

function createReplacementDate() {
  return createElement("li", "", {
    className: "replacement-date",
  });
}

function createReplacementDay(date) {
  return createElement("div", date, { className: "day" });
}

function createTimeIntervalList(content) {
  return createElement("ol", content, {
    className: `time-interval-list${content ? " unavailable" : ""}`,
  });
}

function createTimeInterval(timeFrom, timeTo) {
  return createElement("li", `${timeFrom} - ${timeTo}`, {
    className: "time-interval",
  });
}

function createReplacement(replacementData) {
  const { date, time_intervals } = replacementData;

  const replacementDate = createReplacementDate();
  const day = createReplacementDay(date);
  const trash = createTrashIcon();
  let timeIntervalList;

  if (!time_intervals || time_intervals.length === 0) {
    timeIntervalList = createTimeIntervalList("Indisponível");
  } else {
    timeIntervalList = createTimeIntervalList("");

    time_intervals.forEach(({ time_from, time_to }) => {
      const timeInterval = createTimeInterval(time_from, time_to);

      timeIntervalList.append(timeInterval);
    });
  }

  trash.addEventListener("click", removeReplacementDate);

  replacementDate.append(day, timeIntervalList, trash);
  return replacementDate;
}

function createEventDate(eventDate) {
  return createElement("h3", eventDate, {
    className: "event-date",
  });
}

function createTable() {
  return createElement("dl", "", {});
}

function createTableRow(key, data) {
  const $key = createElement("dt", key, {});
  const $value = createElement("dd", data, {});

  return { $key, $value };
}

function createEvent(eventDate, data) {
  const $event = createElement("div", "", { className: "event" });

  const $eventDate = createEventDate(eventDate);
  const $table = createTable();

  const { name, email, cpf, id } = data;

  const { $key: $nameKey, $value: $nameValue } = createTableRow("Nome:", name);
  const { $key: $emailKey, $value: $emailValue } = createTableRow(
    "Email:",
    email
  );
  const { $key: $cpfKey, $value: $cpfValue } = createTableRow("CPF:", cpf);
  const { $key: $idKey, $value: $idValue } = createTableRow("ID:", id);

  $table.append(
    $nameKey,
    $nameValue,
    $emailKey,
    $emailValue,
    $cpfKey,
    $cpfValue,
    $idKey,
    $idValue
  );
  $event.append($eventDate, $table);

  return $event;
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
    return createReplacement(replacement);
  });

  replacementList.append(...$replacements);
}

function renderEvents() {
  const $events = Object.entries(events).map(([eventDate, data]) => {
    return createEvent(eventDate, data);
  });

  eventsList.append(...$events);
}

renderAvailability();
renderReplacements();
renderEvents();
