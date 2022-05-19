const mongoose = require("mongoose");

const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  });
};

module.exports = connectToMongo;
