const cors = require("cors");
const cookieParser = require("cookie-parser");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema");
const validateToken = require("../middlewares/validateToken");

const config =
  process.env.NODE_ENV !== "production"
    ? { origin: "http://localhost:3000", credentials: true }
    : { origin: process.env.FRONTEND_ENDPOINT, credentials: true };

module.exports = async (app) => {
  app.use(cors(config));
  app.use(cookieParser());
  app.use(validateToken);
  app.use(
    "/graphql",
    graphqlHTTP(async (req, res) => ({
      schema,
      context: { req, res }, // Get access to the Response object
      pretty: true,
      graphiql: true,
    }))
  );
};
