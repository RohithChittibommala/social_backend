module.exports.verifyEmailTemplate = (userToken, email, name) => ({
  to: email,
  from: "company.social.network.org@gmail.com",
  subject: "Verify your email",
  html: ` <p>Thanks you ${name} for signing up</p>
         <p>please click on the link to verify your account</p>
      <a href=http://localhost:4000/conformation/${userToken}>click here</a>`,
});

module.exports.forgotPasswordTemplate = (userToken, email) => ({
  to: email,
  from: "company.social.network.org@gmail.com",
  subject: "account Password Reset",
  html: ` <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process\n'If you did not request this, please ignore this email and your password will remain unchanged.\n'</p>
      <a href=http://localhost:3000/reset/${userToken}>click here</a>`,
});

module.exports.accountPasswordChanged = (email) => ({
  to: email,
  from: "company.social.network.org@gmail.com",
  subject: "account Password changed",
  html: ` <p>This is a confirmation that the password for your account  ${email}has just been changed.\n</a>`,
});
