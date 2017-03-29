module.exports = () => String(process.env.CI).match(/^(1|true)$/gi)
