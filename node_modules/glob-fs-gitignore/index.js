'use strict';

var lazy = require('lazy-cache')(require);
var lookup = lazy('look-up');
var ignore = lazy('parse-gitignore');
var mm = lazy('micromatch');
var cwd = process.cwd();

function parseGitignore(opts) {
  opts = opts || {};

  var gitignoreFile = lookup()('.gitignore', {cwd: cwd});
  var ignorePatterns = ignore()(gitignoreFile);

  var isMatch = function (fp) {
    return mm().any(ignorePatterns, fp, opts);
  };

  return function gitignore(file) {
    opts = this.setDefaults(this.pattern.options, opts);

    if (opts.dot || opts.dotfiles || opts.dotdirs) {
      if (file.isDotfile() || file.isDotdir()) {
        return file;
      }
    }

    if (opts.gitignore === false) {
      return file;
    }

    if (isMatch(file.relative)) {
      file.isIgnored = true;
      file.exclude = true;
    }
    return file;
  };
}

/**
 * Expose `parseGitignore`
 */

module.exports = parseGitignore;
