const { GraphQLError } = require("graphql");
const validator = require("validator");

const validate = validator.default;

const validateEmail = (email) => {
  if (!validate.isEmail(email)) return "Email is not vaild";
  if (!validate.isLength(email, { max: 250 }))
    return "Email should not be more than 250 characters";
};

const validateName = (name) => {
  if (!validate.matches(name, /^[a-z ,.'-]+$/i))
    return "Field should contain letters or `,.'-`";
};

const validatePassword = (password) => {
  if (!validate.isLength(password, { min: 6 }))
    return "Password must contain at least 6 characters";
};

const validateWithMessage = (errorMessage) => (name) => {
  if (validate.isEmpty(name)) return errorMessage;
};

const validateOnRegister = ({ firstname, lastname, password, email }) => {
  let error = {};
  if (validateName(firstname)) error.firstname = validateName(firstname);

  if (validateName(lastname)) error.lastname = validateName(lastname);

  if (validateEmail(email)) error.email = validateName(email);

  if (validatePassword(password)) error.password = validatePassword(password);

  if (Object.keys(error).length > 0)
    return new GraphQLError(JSON.stringify(error));
};

const validateOnLogin = ({ email, password }) => {
  let error = {};
  if (validateEmail(email)) error.email = validateName(email);

  if (validatePassword(password)) error.password = validatePassword(password);

  if (Object.keys(error).length > 0)
    return new GraphQLError(JSON.stringify(error));
};

module.exports = {
  validateOnLogin,
  validateOnRegister,
};
