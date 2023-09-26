require("dotenv").config();

module.exports = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SCRAPPER_API_KEY: process.env.SCRAPPER_API_KEY,
  },
};
