const mongoose = require('mongoose');
const models = require('./models');

const { DB_URL } = process.env;

module.exports = async () => {
  const connection = await mongoose.createConnection(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  models.forEach(({ name, schema }) => connection.model(name, schema));

  return connection;
};
