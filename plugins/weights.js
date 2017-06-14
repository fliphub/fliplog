// https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
// https://www.tutorialspoint.com/log4j/log4j_logging_levels.htm
// @TODO:
module.exports = {
  /**
   * @TODO: implement this
   * @example .filter('< debug < verbose')
   * @return {FlipLog} @chainable
   */
  weights() {
    const defaults = {
      11: ['verbose', 'all', '*'],
      9: ['debug'],
      // some wiggle room ^ for better custom,
      // below is quite fixed & standard
      6: ['notice', 'significant', ''],
      5: ['info'],
      4: ['warn', 'important'],
      3: ['error', 'critical', 'exception'],
      2: ['alert'],
      1: ['emergency', 'fatal'],
      0: ['silent', 'off'],
    }
    return this
  },
}
