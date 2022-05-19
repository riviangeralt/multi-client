exports.errorHandler = (err, req, res, next) => {
  let message = "";
  if (err.code === 11000) {
    let duplicate =
      Object.keys(err.keyValue)[0].charAt(0).toUpperCase() +
      Object.keys(err.keyValue)[0].slice(1);
    return (message = `${duplicate} already exists`);
  }
  if (err) {
    return (message = err.message.split(":")[2].trim());
  }
};
