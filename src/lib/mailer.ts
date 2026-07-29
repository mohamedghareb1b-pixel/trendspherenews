import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport(process.env.EMAIL_SERVER);
}

function getSiteUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${getSiteUrl()}/api/newsletter/verify?token=${token}`;

  await getTransporter().sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Confirm your subscription to TrendSphere",
    html: `
      <div style="font-family: sans-serif;">
        <h2>One step left!</h2>
        <p>Click the link below to confirm your newsletter subscription:</p>
        <p><a href="${link}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Confirm subscription</a></p>
        <p style="color:#888;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  const unsubscribeLink = `${getSiteUrl()}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  await getTransporter().sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Welcome to TrendSphere 🎉",
    html: `
      <div style="font-family: sans-serif;">
        <h2>Your subscription is confirmed</h2>
        <p>You'll get our latest articles and updates straight to your inbox.</p>
        <hr/>
        <p style="color:#888;font-size:12px;">
          Don't want these emails anymore? <a href="${unsubscribeLink}">Unsubscribe</a>
        </p>
        <p style="color:#aaa;font-size:11px;">${process.env.COMPANY_MAILING_ADDRESS ?? ""}</p>
      </div>
    `,
  });
}
