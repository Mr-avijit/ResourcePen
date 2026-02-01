module.exports = {
  host: process.env.MAIL_HOST || 'smtp.resourcespen.io',
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  from: '"Resources Pen Hub" <noreply@resourcespen.io>'
};