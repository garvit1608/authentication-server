/**
 *
 * @file Defines responder service
 *
 */


module.exports = {

  /**
   *  Reply client with success
   */

  success: function(res, data) {
    res.status(200).send(data);
  },

  /**
   *  Reply client with error
   */

  error: function(res, error) {
    res.status(200).send({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }
}