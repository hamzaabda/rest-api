const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY='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'
sgMail.setApiKey(SENDGRID_API_KEY);

sgMail.send({
    to:'hamzaabda09@gmail.com',
    from:'hamzaabda09@gmail.com',
    subject:'this is my first creation',
    text:'i hope this one actually get to you'
})