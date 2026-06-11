import nodemailer from 'nodemailer'
import type { Config } from '@netlify/functions'

function createTransporter(config: any) {
  const host = Netlify.env.get('SMTP_HOST') || config?.host
  const portStr = Netlify.env.get('SMTP_PORT') || config?.port || '587'
  const smtpSecure = Netlify.env.get('SMTP_SECURE')
  const secure =
    smtpSecure !== undefined
      ? smtpSecure === 'true' || smtpSecure === '1'
      : config?.secure === true || config?.secure === 'true'
  const user = Netlify.env.get('SMTP_USER') || config?.user
  const pass = Netlify.env.get('SMTP_PASS') || config?.pass

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
    const { receiverEmail, smtpConfig } = await req.json()

    if (!receiverEmail) {
      return Response.json(
        { success: false, error: 'Missing destination receiver email address.' },
        { status: 400 },
      )
    }

    const host = Netlify.env.get('SMTP_HOST') || smtpConfig?.host
    if (!host) {
      return Response.json(
        { success: false, error: 'SMTP host is required. Configure it in the Netlify environment variables.' },
        { status: 400 },
      )
    }

    const transporter = createTransporter(smtpConfig)
    if (!transporter) {
      return Response.json(
        { success: false, error: 'Failed to initialize SMTP transporter. Review connection details.' },
        { status: 400 },
      )
    }

    const senderName = Netlify.env.get('SMTP_SENDER_NAME') || smtpConfig?.fromName || 'Swiss Peptides Verification'
    const senderAddress = Netlify.env.get('SMTP_USER') || smtpConfig?.user || 'no-reply@buyswisspeptides.shop'

    const testHtml = `
      <div style="font-family: sans-serif; background-color: #FAF9F5; padding: 40px 15px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1.5px solid #E2E8F0; text-align: left; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h2 style="color: #0E1B2C; border-bottom: 2px solid #DE5246; padding-bottom: 10px; margin-top: 0; text-transform: uppercase; font-size: 16px;">Test SMTP Successful!</h2>
          <p style="font-size: 14px; color: #334155; line-height: 1.5;">Congratulations! Your SMTP Mail Server credentials are correct and functioning perfectly.</p>
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 12px; color: #475569;">
            <strong>Host:</strong> ${Netlify.env.get('SMTP_HOST') || smtpConfig?.host}<br/>
            <strong>Port:</strong> ${Netlify.env.get('SMTP_PORT') || smtpConfig?.port}<br/>
            <strong>User:</strong> ${Netlify.env.get('SMTP_USER') || smtpConfig?.user}<br/>
            <strong>SSL/TLS:</strong> ${Netlify.env.get('SMTP_SECURE') === 'true' || smtpConfig?.secure ? 'Yes' : 'No'}<br/>
            <strong>Receiver:</strong> ${receiverEmail}
          </div>
          <p style="font-size: 12px; color: #64748B; margin-bottom: 0;">Swiss Peptides custom administration dispatcher utility.</p>
        </div>
      </div>
    `

    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderAddress}>`,
      to: receiverEmail,
      subject: `SMTP Connection Verified - Swiss Peptides`,
      html: testHtml,
    })

    console.log('SMTP test email sent. MessageId:', info.messageId)
    return Response.json({
      success: true,
      messageId: info.messageId,
      message: 'Successfully sent visual SMTP verification test email!',
    })
  } catch (error: any) {
    console.error('SMTP test failed:', error)
    let helper = 'Please double check your SMTP Host, Port, Username, and Password.'
    if (
      error.message &&
      (error.message.includes('BadCredentials') ||
        error.message.includes('535-5.7.8') ||
        error.message.includes('Username and Password not accepted'))
    ) {
      helper =
        "GMAIL REJECTED: Use a 16-character App Password instead of your regular Google password. Enable 2-Step Verification, then go to Security → App Passwords."
    }
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to connect or authenticate the SMTP server.',
        helper,
      },
      { status: 200 },
    )
  }
}

export const config: Config = {
  path: '/api/send-test-email',
}
