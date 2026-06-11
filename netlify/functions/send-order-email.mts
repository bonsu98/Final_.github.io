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

function generateOrderHtml(order: any) {
  const itemsRows = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: left; font-size: 13px; color: #1E293B;">
        <strong style="font-weight: bold; color: #0E1B2C;">${item.name}</strong><br/>
        <span style="font-size: 11px; color: #64748B; font-family: monospace;">Product ID: ${item.productId}</span>
      </td>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: center; font-size: 13px; color: #1E293B;">${item.quantity}</td>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: right; font-size: 13px; color: #1E293B; font-family: monospace;">$${Number(item.priceAtPurchase).toFixed(2)}</td>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: right; font-size: 13px; color: #1E293B; font-family: monospace; font-weight: bold;">$${(Number(item.priceAtPurchase) * Number(item.quantity)).toFixed(2)}</td>
    </tr>
  `,
    )
    .join('')

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; padding: 40px 15px; text-align: center;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1.5px solid #E2E8F0; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #0E1B2C; padding: 25px; text-align: center;">
          <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0 0 5px 0;">SWISS PEPTIDES SHOP</h1>
          <p style="color: #DE5246; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">NEW RESEARCH ORDER CONFIRMATION</p>
        </div>
        <div style="padding: 24px; border-bottom: 1.5px solid #F1F1F0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: bold; display: block; margin-bottom: 2px;">Order ID</span>
                <strong style="font-size: 16px; color: #0E1B2C; font-family: monospace;">${order.id}</strong>
              </td>
              <td style="text-align: right;">
                <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: bold; display: block; margin-bottom: 2px;">Date Placed</span>
                <strong style="font-size: 14px; color: #0E1B2C;">${order.orderDate}</strong>
              </td>
            </tr>
          </table>
        </div>
        <div style="padding: 24px; border-bottom: 1.5px solid #F1F1F0; background-color: #FAFBFD;">
          <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px;">Shipping &amp; Contact Information</h3>
          <table style="width: 100%; font-size: 13px; line-height: 1.5; color: #334155;">
            <tr>
              <td style="padding: 3px 0; font-weight: bold; width: 110px; color: #64748B;">Client Name:</td>
              <td style="padding: 3px 0; color: #0E1B2C; font-weight: 600;">${order.userName}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748B;">Client Email:</td>
              <td style="padding: 3px 0;"><a href="mailto:${order.userEmail}" style="color: #DE5246; text-decoration: none;">${order.userEmail}</a></td>
            </tr>
            ${order.phone ? `<tr><td style="padding: 3px 0; font-weight: bold; color: #64748B;">Client Phone:</td><td style="padding: 3px 0; color: #0E1B2C;">${order.phone}</td></tr>` : ''}
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748B; vertical-align: top;">Address:</td>
              <td style="padding: 3px 0; color: #0E1B2C; line-height: 1.4;">
                ${order.shippingAddress.street}<br/>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br/>
                ${order.shippingAddress.country}
              </td>
            </tr>
            ${order.note ? `<tr><td style="padding: 10px 0 3px 0; font-weight: bold; color: #64748B; vertical-align: top;">Researcher Note:</td><td style="padding: 10px 0 3px 0; color: #EF4444; font-style: italic; border-top: 1px dashed #E2E8F0;">"${order.note}"</td></tr>` : ''}
          </table>
        </div>
        <div style="padding: 24px;">
          <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px;">Reagents Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <thead>
              <tr style="background-color: #F8FAFC;">
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold;">Product</th>
                <th style="padding: 10px; text-align: center; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold; width: 40px;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold; width: 80px;">Price</th>
                <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold; width: 90px;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
          </table>
          <div style="float: right; width: 240px; font-size: 13px; line-height: 1.8; color: #334155; border-top: 1.5px solid #0E1B2C; padding-top: 10px; margin-top: 5px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: left; font-weight: bold; color: #64748B;">Grand Total:</td>
                <td style="text-align: right; font-size: 16px; font-weight: bold; color: #DE5246; font-family: monospace;">$${order.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="text-align: left; font-weight: bold; color: #64748B;">Payment Method:</td>
                <td style="text-align: right; font-weight: bold; font-size: 11px; color: #0E1B2C; text-transform: uppercase;">${order.paymentMethod === 'crypto' ? 'USDT / Crypto' : 'PAYID Direct'}</td>
              </tr>
            </table>
          </div>
          <div style="clear: both;"></div>
        </div>
        <div style="background-color: #F8FAFC; padding: 25px 20px; text-align: center; border-top: 1.5px solid #E2E8F0; font-size: 11px; color: #64748B;">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #475569; letter-spacing: 0.5px;">SWISS PEPTIDES RESEARCH REAGENTS</p>
          <p style="margin: 0; line-height: 1.4;">This automated scientific receipt notification was dispatched to the central administration receiver email.</p>
        </div>
      </div>
    </div>
  `
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { order, receiverEmail, smtpConfig } = await req.json()

    if (!order) {
      return Response.json({ success: false, error: 'Missing order object.' }, { status: 400 })
    }

    const destination = receiverEmail || 'orders@buyswisspeptides.shop'
    const transporter = createTransporter(smtpConfig)
    const htmlBody = generateOrderHtml(order)

    if (!transporter) {
      console.warn('NO SMTP CONFIGURED — order received but email not sent. Order ID:', order.id)
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
          subject: `[Fallback Sandbox] Swiss Peptides Order Notification: ${order.id}`,
          html: htmlBody,
        })
        return Response.json({
          success: true,
          warning: 'Real SMTP was not configured. Email routed via transient SMTP sandbox.',
          sandboxUrl: nodemailer.getTestMessageUrl(testInfo),
          message: 'Order received and sandbox preview generated!',
        })
      } catch {
        return Response.json({
          success: true,
          warning: 'No SMTP config configured. Fallback sandbox initialization failed.',
          message: 'Order simulated in offline state',
        })
      }
    }

    const senderName = Netlify.env.get('SMTP_SENDER_NAME') || smtpConfig?.fromName || 'Swiss Peptides'
    const senderAddress = Netlify.env.get('SMTP_USER') || smtpConfig?.user || 'no-reply@buyswisspeptides.shop'

    try {
      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderAddress}>`,
        to: destination,
        subject: `New Order Placed: ID ${order.id} ($${order.total.toFixed(2)})`,
        html: htmlBody,
      })
      console.log('Order notification sent. MessageId:', info.messageId)
      return Response.json({
        success: true,
        messageId: info.messageId,
        message: 'Order placed and email notification sent successfully!',
      })
    } catch (mailError: any) {
      console.error('SMTP send failed for order notification:', mailError)
      let helper =
        'Check that your SMTP host, port, username, and password are correct and authorized.'
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
        message: 'Order received, but email notification failed.',
      })
    }
  } catch (error: any) {
    console.error('Error in send-order-email function:', error)
    return Response.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 200 },
    )
  }
}

export const config: Config = {
  path: '/api/send-order-email',
}
