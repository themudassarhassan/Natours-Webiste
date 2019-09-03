class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = statusCode == 500 ? "error" : "fail";
  }
}
module.exports = AppError;
