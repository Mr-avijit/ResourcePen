/**
 * DATA INTEGRITY PROTOCOLS
 */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (pw) => pw.length >= 8;

module.exports = { validateEmail, validatePassword };