const { isEmail, isMobilePhone, isTaxID } = validator;
const submitButton = document.getElementById("submit-button");
const form = document.getElementById("create-session");

const helpers = {
  isValidFormData: (formData) => formData instanceof FormData,
  invalidFormDataError: new Error("Invalid provided formData"),
};
const validFormInputs = {
  name: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return !!formData.get("name")?.trim();
  },
  email: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return isEmail(formData.get("email"));
  },
  phone: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return isMobilePhone(formData.get("phone"), "pt-BR");
  },
  cpf: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return isTaxID(formData.get("cpf"), "pt-BR");
  },
  description: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return !!formData.get("description");
  },
  year: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return /^[12][0-9]{3}$/.test(formData.get("year"));
  },
  month: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    const month = formData.get("month");
    const validFormat = /^(0?[1-9]|1[012])$/.test(month);
    const validRange = Number(month) >= 0 && Number(month) <= 12;

    return validFormat && validRange;
  },
  day: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    const day = formData.get("day");
    const validFormat = /^[0-3]?[0-9]$/.test(day);
    const validRange = Number(day) >= 1 && Number(day) <= 31;

    return validFormat && validRange;
  },
  time: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    const time = formData.get("time");
    const validFormat = /^\d{2}:\d{2}(:\d{2})?$/.test(time);

    const [hours, minutes] = time.split(":").map(Number);

    const isValidHour = hours >= 0 && hours < 24;
    const isValidMinute = minutes >= 0 && minutes < 60;

    const validRange = isValidHour && isValidMinute;

    return validFormat && validRange;
  },
  file: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return true;
  },
};
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

Object.freeze(helpers, validFormInputs, validRequestParameters);

function validateForm(formData) {
  const isInvalid = [];
  Object.keys(validFormInputs).forEach((key) => {
    const isInputValid = validFormInputs[key](formData);
    if (!isInputValid) {
      isInvalid.push(key);
    }
  });

  return isInvalid;
}

function makeRequestBody(formData) {
  const body = {};

  Object.keys(validRequestParameters).forEach((key) => {
    body[key] = validRequestParameters[key](formData);
  });

  return JSON.stringify(body, null, 2);
}

async function createSession(requestBody = "") {
  try {
    const response = await fetch("http://localhost:5000/api/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: requestBody,
    });

    return await response.json();
  } catch (error) {
    return error;
  }
}

submitButton.addEventListener("click", async (ev) => {
  ev.preventDefault();

  try {
    const formData = new FormData(form);
    const isInvalid = validateForm(formData);

    if (isInvalid.length > 0) {
      return false;
    }

    const body = makeRequestBody(formData);
    const response = await createSession(body);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
});
