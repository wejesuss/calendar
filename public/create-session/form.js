const form = document.querySelector("form#create-session");

const helpers = {
  isValidFormData: (formData) => formData instanceof FormData,
  invalidFormDataError: new Error("Invalid provided formData"),
};
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
  name: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return formData.get("name");
  },
  email: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return formData.get("email");
  },
  phone: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return formData.get("phone");
  },
  cpf: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return formData.get("cpf");
  },
  description: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return formData.get("description");
  },
  session_date: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    const year = Number(formData.get("year"));
    const month = Number(formData.get("month")) + 1;
    const day = Number(formData.get("day"));

    const monthPadded = `0${month}`.slice(-2);
    const dayPadded = `0${day}`.slice(-2);

    return `${year}/${monthPadded}/${dayPadded}`;
  },
  session_time: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return formData.get("time");
  },
};
Object.freeze(helpers);
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
