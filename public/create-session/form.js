const form = document.querySelector("form#create-session");

const validFormParameters = [
  "name",
  "email",
  "phone",
  "cpf",
  "description",
  "year",
  "month",
  "day",
  "time",
  "file",
];
const validRequestParameters = {
  name: (formData) => formData.get("name"),
  email: (formData) => formData.get("email"),
  phone: (formData) => formData.get("phone"),
  cpf: (formData) => formData.get("cpf"),
  description: (formData) => formData.get("description"),
  session_date: (formData) => {
    const year = Number(formData.get("year"));
    const month = Number(formData.get("month")) + 1;
    const day = Number(formData.get("day"));

    const monthPadded = `0${month}`.slice(-2);
    const dayPadded = `0${day}`.slice(-2);

    return `${year}/${monthPadded}/${dayPadded}`;
  },
  session_time: (formData) => formData.get("time"),
};
Object.freeze(validFormParameters);
Object.freeze(validRequestParameters);

function makeRequestBody() {
  const formData = new FormData(form);
  const body = {};

  Object.keys(validRequestParameters).forEach((key) => {
    body[key] = validRequestParameters[key](formData);
  });

  console.log(body);
}

makeRequestBody();
