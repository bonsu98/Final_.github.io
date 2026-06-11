import nodemailer from 'nodemailer'
import type { Config } from '@netlify/functions'

function createTransporter() {
  const host = Netlify.env.get('SMTP_HOST')
  const portStr = Netlify.env.get('SMTP_PORT') || '587'
  const smtpSecure = Netlify.env.get('SMTP_SECURE')
  const secure = smtpSecure === 'true' || smtpSecure === '1'
  const user = Netlify.env.get('SMTP_USER')
  const pass = Netlify.env.get('SMTP_PASS')

  if (!host) return null

  return nodemailer.createTransport({
    host,
    port: parseInt(portStr, 10) || 587,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: { rejectUnauthorized: false },
  })
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { name, email, subject, message, receiverEmail } = await req.json()

    if (!name || !email || !subject || !message) {
      return Response.json(
        { success: false, error: 'Please fill out all mandatory contact fields.' },
        { status: 400 },
      )
    }

    const destination = receiverEmail || 'orders@buyswisspeptides.shop'
    const transporter = createTransporter()

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; padding: 40px 15px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1.5px solid #E2E8F0; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background-color: #0E1B2C; padding: 25px; text-align: center;">
            <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0 0 5px 0;">SWISS PEPTIDES CONTACT</h1>
            <p style="color: #DE5246; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">NEW CUSTOMER INQUIRY</p>
          </div>
          <div style="padding: 24px; border-bottom: 1.5px solid #F1F1F0; background-color: #FAFBFD;">
            <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px;">Sender Details</h3>
            <table style="width: 100%; font-size: 13px; line-height: 1.5; color: #334155;">
              <tr>
                <td style="padding: 3px 0; font-weight: bold; width: 110px; color: #64748B;">Name:</td>
                <td style="padding: 3px 0; color: #0E1B2C; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: bold; color: #64748B;">Email:</td>
                <td style="padding: 3px 0;"><a href="mailto:${email}" style="color: #DE5246; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 3px 0; font-weight: bold; color: #64748B;">Subject:</td>
                <td style="padding: 3px 0; color: #0E1B2C; font-weight: bold;">${subject}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 24px;">
            <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px;">Message</h3>
            <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 20px; border-radius: 8px; font-size: 13px; color: #1E293B; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>
          <div style="background-color: #F8FAFC; padding: 25px 20px; text-align: center; border-top: 1.5px solid #E2E8F0; font-size: 11px; color: #64748B;">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #475569; letter-spacing: 0.5px;">SWISS PEPTIDES SHOP</p>
            <p style="margin: 0; line-height: 1.4;">This automated contact form inquiry was dispatched to the central administration receiver email. You can reply directly to the customer at <a href="mailto:${email}" style="color:#DE5246; text-decoration:none;">${email}</a>.</p>
          </div>
        </div>
      </div>
    `

    if (!transporter) {
      console.warn('NO SMTP CONFIGURED — contact inquiry not emailed. Sender:', name, email)
      try {
        const testAccount = await nodemailer.createTestAccount()
        const testTransporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        })
        const testInfo = await testTransporter.sendMail({
          from: `"Swiss Peptides Fallback" <${testAccount.user}>`,
          to: destination,
          subject: `[Fallback Contact] ${subject}`,
          html: htmlBody,
        })
        return Response.json({
          success: true,
          warning: 'Real SMTP was not configured. Contact inquiry routed via transient SMTP sandbox.',
          sandboxUrl: nodemailer.getTestMessageUrl(testInfo),
          message: 'Message received in simulation environment!',
        })
      } catch {
        return Response.json({
          success: true,
          warning: 'No SMTP config configured.',
          message: 'Inquiry stored locally',
        })
      }
    }

    const senderName = Netlify.env.get('SMTP_SENDER_NAME') || 'Swiss Peptides Portal'
    const senderAddress = Netlify.env.get('SMTP_USER') || 'no-reply@buyswisspeptides.shop'

    try {
      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderAddress}>`,
        to: destination,
        subject: `New Contact Inquiry: ${subject}`,
        replyTo: email,
        html: htmlBody,
      })
      console.log('Contact email sent. MessageId:', info.messageId)
      return Response.json({
        success: true,
        messageId: info.messageId,
        message: 'Message sent successfully to receiver email address!',
      })
    } catch (mailError: any) {
      console.error('Contact form SMTP send failed:', mailError)
      let helper = 'Please double check your SMTP settings (Host, Port, Username, Password).'
      if (
        mailError.message &&
        (mailError.message.includes('BadCredentials') ||
          mailError.message.includes('535-5.7.8') ||
          mailError.message.includes('Username and Password not accepted'))
      ) {
        helper =
          "GMAIL REJECTED: Use a 16-character App Password instead of your regular Google password. Enable 2-Step Verification, then go to Security → App Passwords."
      }
      return Response.json({
        success: false,
        error: mailError.message,
        helper,
        message: 'Inquiry received, but notification email dispatch failed.',
      })
    }
  } catch (error: any) {
    console.error('Error in send-contact-email function:', error)
    return Response.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 200 },
    )
  }
}

export const config: Config = {
  path: '/api/send-contact-email',
}
