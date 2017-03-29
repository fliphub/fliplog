const AbstractError = require('./AbstractError')
class FlipValidationError extends AbstractError {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}
global.FlipValidationError = FlipValidationError
