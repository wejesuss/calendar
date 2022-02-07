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

for (let index = 0; index < 7; index++) {
  const week = createElement("div", "", { className: "week" });
  const weekName = createWeekName(index);
  const weekInputsContainer = createWeekInputsContainer(index);
  const controlMenu = createControlMenu();

  weekInputsContainer.append(createInputContainer());
  week.append(weekName, weekInputsContainer, controlMenu);

  daysOfWeek.appendChild(week);
}

function createWeekName(index) {
  const weekName = createElement("h3", mapDayName.get(index), {
    className: "week-name",
  });

  return weekName;
}

function createWeekInputsContainer(index) {
  const weekInputsContainer = createElement("div", "", {
    className: "week-inputs-container",
    id: `week-${index}`,
  });

  return weekInputsContainer;
}

function createInput(name, type, className, id) {
  const input = createElement("input", "", { className, id });
  input.setAttribute("name", name);
  input.setAttribute("type", type);

  return input;
}

function createInputContainer() {
  const inputContainer = createElement("div", "", {
    className: "input-container",
  });
  const inputFrom = createInput("week-time-from", "text", "time-from");
  const span = createElement("span", "-", {});
  const inputTo = createInput("week-time-to", "text", "time-to");
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
