/**
 * @TODO:
 * - [ ] containsAllOf
 * - [ ] case insensitive flags
 *
 * pass in a string to compare to an array of strings
 *
 * @example
 * // can is in canada, so yes.
 * stringContainsAnyOf('canada', ['eh', 'can'])
 */
module.exports = (string, strings, delimiter = false) => {
  // @TODO: and contains more than one comma...
  if (delimiter && typeof strings === 'string' && strings.includes(','))
    strings = strings.split(',')

  for (let i = 0, len = strings.length; i < len; i++)
    if (string.includes(strings[i])) return true
  return false
}
