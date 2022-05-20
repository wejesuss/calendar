const { isEmail, isMobilePhone, isTaxID } = validator;
const submitButton = document.getElementById("submit-button");
const form = document.getElementById("create-session");

const helpers = {
  isValidFormData: (formData) => formData instanceof FormData,
  invalidFormDataError: new Error("Invalid provided formData"),
  createError: (errName, message) => {
    const err = new Error(message);
    err.name = errName;

    return err;
  },
};
const validFormInputs = {
  name: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const isValid = !!formData.get("name")?.trim();
    const error = isValid
      ? undefined
      : helpers.createError("name", "O campo nome é obrigatório");

    return [isValid, error];
  },
  email: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const isValid = isEmail(formData.get("email"));
    const error = isValid
      ? undefined
      : helpers.createError(
          "email",
          "O campo email está inválido, verifique novamente"
        );

    return [isValid, error];
  },
  phone: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const isValid = isMobilePhone(formData.get("phone"), "pt-BR");
    const error = isValid
      ? undefined
      : helpers.createError(
          "phone",
          "O campo telefone está inválido, verifique novamente"
        );

    return [isValid, error];
  },
  cpf: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const isValid = isTaxID(formData.get("cpf"), "pt-BR");
    const error = isValid
      ? undefined
      : helpers.createError(
          "cpf",
          "O campo cpf está inválido, verifique novamente"
        );

    return [isValid, error];
  },
  description: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const isValid = !!formData.get("description");
    const error = isValid
      ? undefined
      : helpers.createError("description", "O campo descrição é obrigatório");

    return [isValid, error];
  },
  year: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const isValid = /^[12][0-9]{3}$/.test(formData.get("year"));
    const error = isValid
      ? undefined
      : helpers.createError(
          "year",
          "O campo ano não segue o formato apropriado YYYY"
        );

    return [isValid, error];
  },
  month: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const month = formData.get("month");
    const validFormat = /^(0?[1-9]|1[012])$/.test(month);
    const validRange = Number(month) >= 0 && Number(month) <= 12;

    const isValid = validFormat && validRange;
    const error = isValid
      ? undefined
      : helpers.createError(
          "month",
          "O campo mês não segue o formato apropriado MM"
        );

    return [isValid, error];
  },
  day: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const day = formData.get("day");
    const validFormat = /^[0-3]?[0-9]$/.test(day);
    const validRange = Number(day) >= 1 && Number(day) <= 31;

    const isValid = validFormat && validRange;
    const error = isValid
      ? undefined
      : helpers.createError(
          "day",
          "O campo dia não segue o formato apropriado DD"
        );

    return [isValid, error];
  },
  time: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const time = formData.get("time");
    const validFormat = /^\d{2}:\d{2}(:\d{2})?$/.test(time);

    const [hours, minutes] = time.split(":").map(Number);

    const isValidHour = hours >= 0 && hours < 24;
    const isValidMinute = minutes >= 0 && minutes < 60;

    const validRange = isValidHour && isValidMinute;

    const isValid = validFormat && validRange;
    const error = isValid
      ? undefined
      : helpers.createError(
          "time",
          "O campo hora não segue o formato apropriado HH:MM"
        );

    return [isValid, error];
  },
  file: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    return [true, undefined];
  },
};
const validRequestParameters = {
  name: (formData) => {
    if (!helpers.isValidFormData(formData)) return helpers.invalidFormDataError;

    return formData.get("name")?.trim();
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
    const [isInputValid, error] = validFormInputs[key](formData);
    if (!isInputValid) {
      isInvalid.push(error);
    }
  });

  return isInvalid;
}

function showError(error) {
  const span = document.querySelector("span.error-message");

  if (!error) {
    span.textContent = "";
    span.classList.remove("show");
    return;
  }

  const { name, message } = error;
  const input = document.querySelector(
    `input[name=${name}],textarea[name=${name}]`
  );

  input.classList.add("error");
  span.classList.add("show");
  span.textContent = message;

  input.addEventListener(
    "keydown",
    () => {
      input.classList.remove("error");
    },
    { once: true }
  );

  input.scrollIntoView({ block: "end", behavior: "smooth" });
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
    const invalidFields = validateForm(formData);

    if (invalidFields.length > 0) {
      showError(invalidFields[0]);
      return false;
    } else {
      showError(null);
    }

    const body = makeRequestBody(formData);
    const response = await createSession(body);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
});
