const paymentList = document.getElementById("payments");

const payments = [
  {
    id: "MTY1NjQ2MTgyMTMx",
    date: "25 de Jan, 2022. De 15:15 até 15:30",
    name: "Tiago corona",
    email: "tiagocorona@example.com",
    cpf: "111.111.111-11",
    value: "R$ 120,00",
    paid: false,
  },
  {
    id: "MTY1NjQ2MTgyMTMx",
    date: "25 de Jan, 2022. De 15:15 até 15:30",
    name: "Tiago corona",
    email: "tiagocorona@example.com",
    cpf: "111.111.111-11",
    value: "R$ 120,00",
    paid: true,
  },
  {
    id: "MTY1NjQ2MTgyMTMx",
    date: "25 de Jan, 2022. De 15:15 até 15:30",
    name: "Tiago corona",
    email: "tiagocorona@example.com",
    cpf: "111.111.111-11",
    value: "R$ 120,00",
    paid: false,
  },
];

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

// decorators
function createTable({ className = "", id = "" }) {
  return createElement("dl", "", { className, id });
}

function createTableRow(key, data, keySelectors = {}, valueSelectors = {}) {
  const $key = createElement("dt", key, keySelectors);
  const $value = createElement("dd", data, valueSelectors);

  return { $key, $value };
}

function createPaymentEvent(payment) {
  const $event = createTable({ className: "event" });

  const { date, name, email, cpf, value, id } = payment;

  const { $key: $dateKey, $value: $dateValue } = createTableRow("Data:", date);
  const { $key: $nameKey, $value: $nameValue } = createTableRow("Nome:", name);
  const { $key: $emailKey, $value: $emailValue } = createTableRow(
    "Email:",
    email
  );
  const { $key: $cpfKey, $value: $cpfValue } = createTableRow("CPF:", cpf);
  const { $key: $valueKey, $value: $valueValue } = createTableRow(
    "Valor:",
    value
  );
  const { $key: $idKey, $value: $idValue } = createTableRow("ID:", id);

  $event.append(
    $dateKey,
    $dateValue,
    $nameKey,
    $nameValue,
    $emailKey,
    $emailValue,
    $cpfKey,
    $cpfValue,
    $valueKey,
    $valueValue,
    $idKey,
    $idValue
  );

  return $event;
}

function createPaymentStatus(paid) {
  const $status = createTable({ className: "status" });

  const status = paid ? "Pago" : "Não Pago";
  const statusClass = paid ? "complete" : "incomplete";

  const { $key: $statusKey, $value: $statusValue } = createTableRow(
    "Status:",
    status,
    {},
    { className: statusClass }
  );

  $status.append($statusKey, $statusValue);

  return $status;
}

function createForm(action, method) {
  const form = createElement("form", "", {});
  form.setAttribute("action", action);
  form.setAttribute("method", method);

  return form;
}

function createInput(name, type, value = "", { className = "", id = "" }) {
  const input = createElement("input", "", { className, id });
  input.setAttribute("name", name);
  input.setAttribute("type", type);
  input.value = value;

  return input;
}

function createSubmitButton(type, content, { className = "", id = "" }) {
  const button = createElement("button", content, { className, id });
  button.setAttribute("type", type);

  return button;
}

function createPaymentData(payment) {
  const $paymentData = createElement("div", "", { className: "payment-data" });

  const $event = createPaymentEvent(payment);
  const $verticalLine = createElement("span", "", {
    className: "vertical-line",
  });
  const $status = createPaymentStatus(payment.paid);

  $paymentData.append($event, $verticalLine, $status);

  return $paymentData;
}

function createPaymentForm(id) {
  const $formContainer = createElement("div", "", { className: "form" });
  const $form = createForm("/payments", "get");
  const $input = createInput("id", "hidden", id, { id: "id" });
  const $button = createSubmitButton("submit", "Aprovar Pagamento", {});

  $form.append($input, $button);
  $formContainer.appendChild($form);

  return $formContainer;
}

function createPayment(payment) {
  const $payment = createElement("div", "", { className: "payment" });
  const $paymentData = createPaymentData(payment);

  if (payment.paid) {
    $payment.appendChild($paymentData);
    return $payment;
  }

  const $form = createPaymentForm(payment.id);
  $payment.append($paymentData, $form);

  return $payment;
}

function renderPayments() {
  const $payments = payments.map((payment) => {
    return createPayment(payment);
  });

  paymentList.append(...$payments);
}

renderPayments();
