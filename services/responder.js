module.exports = {

  success: function(res, data) {
    res.status(200).send(data);
  },
  error: function(res, error) {
    res.status(200).send({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }
}