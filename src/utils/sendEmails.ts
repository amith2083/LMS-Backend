
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to generate HTML email content
const generateEmailHtml = (message: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <div style="padding: 20px; border-bottom: 2px solid #007BFF;">
            <h1 style="margin: 0; font-size: 24px; color: #007BFF; text-align: center;">
              Easy LMS
            </h1>
          </div>
          <div style="padding: 20px;">
            <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.5;">
              ${message}
            </p>
          </div>
          <div style="padding: 20px; background-color: #f4f4f4; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #777;">
              This email was sent by Easy LMS. If you have any questions, feel free to 
              <a href="mailto:support@easylearningbd.com" style="color: #007BFF;">contact us</a>.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const sendEmails = async (emailInfo: Array<{ to: string; subject: string; message: string }>) => {
  if (!emailInfo || emailInfo.length === 0) return null;

  const response = await Promise.allSettled(
    emailInfo.map(async (data) => {
      if (!data.to || !data.subject || !data.message) {
        throw new Error(`Invalid email data: ${JSON.stringify(data)}`);
      }

      const html = generateEmailHtml(data.message);

      const sendInfo = await resend.emails.send({
        from: "onboarding@resend.dev", // Update to your verified domain
        to: data.to,
        subject: data.subject,
        html, // Send as HTML string
      });

      return sendInfo;
    })
  );

  return response;
};