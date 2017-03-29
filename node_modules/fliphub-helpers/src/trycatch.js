function tryCatch({cb, when, catchCb}) {
  if (when) {
    try {
      const result = cb()
      return cb
    } catch (e) {
      catchCb(e)
    }
  }

  return cb()
}
