'use server'

import nodemailer from 'nodemailer'

export async function sendContactMessage(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  // Validation
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return { error: 'Veuillez remplir tous les champs obligatoires.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Adresse email invalide.' };
  }

  const subjectLabels: Record<string, string> = {
    activity: 'Recherche d\'activité physique',
    info: 'Demande d\'information générale',
    pro: 'Professionnel de santé',
    club: 'Représentant de club sportif',
    partnership: 'Proposition de partenariat',
    other: 'Autre demande',
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"HandiBoost Contact" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `[Handiboost Contact] ${subjectLabels[subject] || subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">Nouveau message de contact</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Prénom</td><td style="padding: 8px 12px;">${firstName}</td></tr>
            <tr style="background: #f8fafc;"><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Nom</td><td style="padding: 8px 12px;">${lastName}</td></tr>
            <tr><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Email</td><td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr style="background: #f8fafc;"><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Sujet</td><td style="padding: 8px 12px;">${subjectLabels[subject] || subject}</td></tr>
          </table>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <h3 style="color: #334155; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; color: #334155; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Ce message a été envoyé depuis le formulaire de contact de handiboost.fr</p>
        </div>
      `,
    });

    return { success: 'Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.' };
  } catch (error: any) {
    console.error('Contact form email error:', error);
    return { error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement par email." };
  }
}
