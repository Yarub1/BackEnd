import xss from "xss";

const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return xss(input);
  } else if (typeof input === "object" && input !== null) {
    for (let key in input) {
      input[key] = sanitizeInput(input[key]);
    }
    return input;
  }
  return input;
};

export default sanitizeInput;
