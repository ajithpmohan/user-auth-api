import sgMail from '@sendgrid/mail';

import ENV from './constants.js';

sgMail.setApiKey(ENV.SENDGRID_API_KEY);

class Email {
  constructor(recipientAddress, recipientName, templateId, templateData) {
    this.to = recipientAddress;
    this.name = recipientName;
    this.fromEmail = 'noreply@noreplytest.tk';
    this.fromName = 'Example App';
    this.templateId = templateId;
    this.dynamicTemplateData = templateData;
  }

  async sendMails() {
    const mailOptions = {
      to: this.to,
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      templateId: this.templateId, // Here goes your template-Id
      dynamic_template_data: this.dynamicTemplateData
    };

    await sgMail.send(mailOptions).then(
      () => {
        console.log('Sent');
      },
      (err) => {
        console.error('EMAIL delivery failed:', err.message);
      }
    );
  }
}

const email = ({
  recipientAddress,
  recipientName,
  templateId,
  templateData = {}
}) => new Email(recipientAddress, recipientName, templateId, templateData);

export default email;
