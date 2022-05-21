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

    const email = formData.get("email");
    let isValid = false;

    if (!email) {
      return [
        isValid,
        helpers.createError("email", "O campo email é obrigatório"),
      ];
    }

    isValid = isEmail(email);
    if (!isValid) {
      return [
        isValid,
        helpers.createError("email", "O campo email está inválido"),
      ];
    }

    return [isValid, undefined];
  },
  phone: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    let isValid = false;
    const phone = formData.get("phone");

    if (!phone) {
      return [
        isValid,
        helpers.createError("phone", "O campo telefone é obrigatório"),
      ];
    }

    isValid = isMobilePhone(phone, "pt-BR");
    if (!isValid) {
      return [
        isValid,
        helpers.createError("phone", "O campo telefone está inválido"),
      ];
    }

    return [isValid, undefined];
  },
  cpf: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const cpf = formData.get("cpf");
    let isValid = false;

    if (!cpf) {
      return [isValid, helpers.createError("cpf", "O campo cpf é obrigatório")];
    }

    isValid = isTaxID(cpf, "pt-BR");
    if (!isValid) {
      return [isValid, helpers.createError("cpf", "O campo cpf está inválido")];
    }

    return [isValid, undefined];
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

    const year = formData.get("year");
    let isValid = false;

    if (!year) {
      return [
        isValid,
        helpers.createError("year", "Selecione uma data válida"),
      ];
    }

    isValid = /^[12][0-9]{3}$/.test(year);
    if (!isValid) {
      return [
        isValid,
        helpers.createError("year", "O campo ano não segue o formato YYYY"),
      ];
    }

    return [isValid, undefined];
  },
  month: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const month = formData.get("month");
    let isValid = false;
    if (!month) {
      return [
        isValid,
        helpers.createError("month", "Selecione uma data válida"),
      ];
    }

    const validFormat = /^(0?[1-9]|1[012])$/.test(month);
    if (!validFormat) {
      return [
        isValid,
        helpers.createError("month", "O campo mês não segue o formato MM"),
      ];
    }

    const validRange = Number(month) >= 0 && Number(month) <= 12;
    if (!validRange) {
      return [
        isValid,
        helpers.createError("month", "O campo mês não está entre 0 e 12"),
      ];
    }

    isValid = validFormat && validRange;

    return [isValid, undefined];
  },
  day: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const day = formData.get("day");
    let isValid = false;

    if (!day) {
      return [isValid, helpers.createError("day", "Selecione uma data válida")];
    }

    const validFormat = /^[0-3]?[0-9]$/.test(day);
    if (!validFormat) {
      return [
        isValid,
        helpers.createError("day", "O campo data não segue o formato DD"),
      ];
    }

    const validRange = Number(day) >= 1 && Number(day) <= 31;
    if (!validRange) {
      return [
        isValid,
        helpers.createError("day", "O campo data não está entre 1 e 31"),
      ];
    }

    isValid = validFormat && validRange;

    return [isValid, undefined];
  },
  time: (formData) => {
    if (!helpers.isValidFormData(formData))
      return [false, helpers.invalidFormDataError];

    const time = formData.get("time");
    let isValid = false;

    if (!time) {
      return [
        isValid,
        helpers.createError("time", "Selecione um horário válido"),
      ];
    }

    const validFormat = /^\d{2}:\d{2}(:\d{2})?$/.test(time);
    if (!validFormat) {
      return [
        isValid,
        helpers.createError(
          "time",
          "O campo horário não segue o formato HH:MM"
        ),
      ];
    }

    const [hours, minutes] = time.split(":").map(Number);
    const isValidHour = hours >= 0 && hours < 24;
    const isValidMinute = minutes >= 0 && minutes < 60;

    const validRange = isValidHour && isValidMinute;
    if (!validRange) {
      return [
        isValid,
        helpers.createError(
          "time",
          "O campo horário não segue o intervalo 00-23 e 00-59"
        ),
      ];
    }

    isValid = validFormat && validRange;

    return [isValid, undefined];
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
    span.classList.remove("show");
    setTimeout(() => {
      span.textContent = "";
    }, 600);
    return;
  }

  const { name, message } = error;

  if (/^year|month|day|time$/.test(name)) {
    span.classList.add("show");
    span.textContent = message;
    span.scrollIntoView({ block: "center", behavior: "smooth" });
    setTimeout(() => {
      document
        .querySelector(".sections section:nth-child(2)")
        .scrollIntoView({ block: "center", behavior: "smooth" });
    }, 1200);
  } else {
    span.classList.add("show");
    span.textContent = message;

    const input = document.querySelector(
      `input[name=${name}],textarea[name=${name}]`
    );
    input.classList.add("error");
    input.addEventListener(
      "keydown",
      () => {
        input.classList.remove("error");
      },
      { once: true }
    );

    input.scrollIntoView({ block: "end", behavior: "smooth" });
  }
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
