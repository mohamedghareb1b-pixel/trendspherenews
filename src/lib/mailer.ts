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

export async function sendContactFormEmail(input: {
  name: string;
  email: string;
  message: string;
}) {
  const recipient = process.env.CONTACT_EMAIL;
  if (!recipient) {
    throw new Error("CONTACT_EMAIL غير موجود في .env");
  }

  await getTransporter().sendMail({
    to: recipient,
    from: process.env.EMAIL_FROM,
    replyTo: input.email,
    subject: `New contact form message from ${input.name}`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>New message from the Contact Us form</h2>
        <p><strong>Name:</strong> ${input.name}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p><strong>Message:</strong></p>
        <p>${input.message.replace(/\n/g, "<br/>")}</p>
      </div>
    `,
  });
}

/**
 * بيتبعت تلقائيًا لكل مشترك مؤكد ومهتم بالتصنيف ده لما مقال جديد ينشر.
 * "تلقائي وبدون تكلفة" - نفس الـ SMTP المستخدم للإيميلات التانية بالظبط،
 * مفيش خدمة إضافية أو تكلفة زيادة.
 */
export async function sendNewArticleNotification(
  subscriberEmail: string,
  unsubscribeToken: string,
  article: { title: string; slug: string; excerpt: string | null }
) {
  const site = getSiteUrl();
  const link = `${site}/articles/${article.slug}`;
  const unsubscribeLink = `${site}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

  await getTransporter().sendMail({
    to: subscriberEmail,
    from: process.env.EMAIL_FROM,
    subject: `New article: ${article.title}`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>${article.title}</h2>
        ${article.excerpt ? `<p>${article.excerpt}</p>` : ""}
        <p><a href="${link}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">Read the full article</a></p>
        <hr/>
        <p style="color:#888;font-size:12px;">
          You're getting this because you subscribed to this topic.
          <a href="${unsubscribeLink}">Unsubscribe</a>
        </p>
        <p style="color:#aaa;font-size:11px;">${process.env.COMPANY_MAILING_ADDRESS ?? ""}</p>
      </div>
    `,
  });
}
