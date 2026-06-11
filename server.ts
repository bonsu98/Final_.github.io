import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

function createTransporter(config: any) {
  // Pull from environment variables first (configured safely on server "behind the scenes")
  // Or fall back to client-provided config if any
  const host = process.env.SMTP_HOST || config?.host;
  const portStr = process.env.SMTP_PORT || config?.port || "587";
  const secure = process.env.SMTP_SECURE !== undefined 
    ? (process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1')
    : (config?.secure === true || config?.secure === 'true');
  const user = process.env.SMTP_USER || config?.user;
  const pass = process.env.SMTP_PASS || config?.pass;

  if (!host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(portStr, 10) || 587,
    secure,
    auth: user && pass ? {
      user,
      pass,
    } : undefined,
    tls: {
      rejectUnauthorized: false
    }
  });
}

function generateOrderHtml(order: any) {
  const itemsRows = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: left; font-size: 13px; color: #1E293B;">
        <strong style="font-weight: bold; color: #0E1B2C;">${item.name}</strong><br/>
        <span style="font-size: 11px; color: #64748B; font-family: monospace;">Product ID: ${item.productId}</span>
      </td>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: center; font-size: 13px; color: #1E293B;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: right; font-size: 13px; color: #1E293B; font-family: monospace;">
        $${Number(item.priceAtPurchase).toFixed(2)}
      </td>
      <td style="padding: 12px 10px; border-bottom: 1.5px solid #F1F1F0; text-align: right; font-size: 13px; color: #1E293B; font-family: monospace; font-weight: bold;">
        $${(Number(item.priceAtPurchase) * Number(item.quantity)).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; padding: 40px 15px; text-align: center;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1.5px solid #E2E8F0; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #0E1B2C; padding: 25px; text-align: center;">
          <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0 0 5px 0; font-family: sans-serif;">SWISS PEPTIDES SHOP</h1>
          <p style="color: #DE5246; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">NEW RESEARCH ORDER CONFIRMATION</p>
        </div>
        
        <!-- Order info -->
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

        <!-- Customer & Delivery -->
        <div style="padding: 24px; border-bottom: 1.5px solid #F1F1F0; background-color: #FAFBFD;">
          <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px; font-family: sans-serif;">Shipping & Contact Information</h3>
          <table style="width: 100%; font-size: 13px; line-height: 1.5; color: #334155;">
            <tr>
              <td style="padding: 3px 0; font-weight: bold; width: 110px; color: #64748B;">Client Name:</td>
              <td style="padding: 3px 0; color: #0E1B2C; font-weight: 600;">${order.userName}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748B;">Client Email:</td>
              <td style="padding: 3px 0;"><a href="mailto:${order.userEmail}" style="color: #DE5246; text-decoration: none;">${order.userEmail}</a></td>
            </tr>
            ${order.phone ? `
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748B;">Client Phone:</td>
              <td style="padding: 3px 0; color: #0E1B2C;">${order.phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748B; vertical-align: top;">Address:</td>
              <td style="padding: 3px 0; color: #0E1B2C; line-height: 1.4;">
                ${order.shippingAddress.street}<br/>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br/>
                ${order.shippingAddress.country}
              </td>
            </tr>
            ${order.note ? `
            <tr>
              <td style="padding: 10px 0 3px 0; font-weight: bold; color: #64748B; vertical-align: top;">Researcher Note:</td>
              <td style="padding: 10px 0 3px 0; color: #EF4444; font-style: italic; border-top: 1px dashed #E2E8F0;">
                "${order.note}"
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        <!-- Order Items -->
        <div style="padding: 24px;">
          <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px; font-family: sans-serif;">Reagents Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <thead>
              <tr style="background-color: #F8FAFC;">
                <th style="padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold;">Product</th>
                <th style="padding: 10px; text-align: center; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold; width: 40px;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold; width: 80px;">Price</th>
                <th style="padding: 10px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #CBD5E1; font-weight: bold; width: 90px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="float: right; width: 240px; font-size: 13px; line-height: 1.8; color: #334155; border-top: 1.5px solid #0E1B2C; padding-top: 10px; margin-top: 5px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: left; font-weight: bold; color: #64748B;">Grand Total:</td>
                <td style="text-align: right; font-size: 16px; font-weight: bold; color: #DE5246; font-family: monospace;">
                  $${order.total.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style="text-align: left; font-weight: bold; color: #64748B;">Payment Method:</td>
                <td style="text-align: right; font-weight: bold; font-size: 11px; color: #0E1B2C; text-transform: uppercase;">
                  ${order.paymentMethod === 'crypto' ? 'USDT / Crypto' : 'PAYID Direct'}
                </td>
              </tr>
            </table>
          </div>
          <div style="clear: both;"></div>
        </div>

        <!-- Footer -->
        <div style="background-color: #F8FAFC; padding: 25px 20px; text-align: center; border-top: 1.5px solid #E2E8F0; font-size: 11px; color: #64748B;">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #475569; letter-spacing: 0.5px;">SWISS PEPTIDES RESEARCH REAGENTS</p>
          <p style="margin: 0; line-height: 1.4;">This automated scientific receipt notification was dispatched to the central administration receiver email. For express fulfillment or quick check processing, please follow instructions on our portal.</p>
        </div>

      </div>
    </div>
  `;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Backup route for directly serving the images directory
  app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src/assets/images')));

  // Send Order Email Endpoint
  app.post("/api/send-order-email", async (req, res) => {
    try {
      const { order, receiverEmail, smtpConfig } = req.body;
      
      if (!order) {
        return res.status(400).json({ success: false, error: "Missing order object." });
      }

      const destination = receiverEmail || 'orders@buyswisspeptides.shop';
      const transporter = createTransporter(smtpConfig);

      const htmlBody = generateOrderHtml(order);

      if (!transporter) {
        // No SMTP configuration has been set up, fallback or print to console
        console.warn("=================================================");
        console.warn("NO SMTP SET UP YET. PRINTING ORDER INSTEAD:");
        console.warn(`ORDER ID: ${order.id}`);
        console.warn(`RECEIVER EMAIL: ${destination}`);
        console.warn(`GRAND TOTAL: $${order.total.toFixed(2)}`);
        console.warn("=================================================");

        // Let's create an Ethereal Account automatically so the user can test / verify complete email flows instantly
        try {
          const testAccount = await nodemailer.createTestAccount();
          const testTransporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass
            }
          });

          const testInfo = await testTransporter.sendMail({
            from: `"Swiss Peptides Fallback" <${testAccount.user}>`,
            to: destination,
            subject: `[Fallback Sandbox] Swiss Peptides Order Notification: ${order.id}`,
            html: htmlBody
          });

          const testUrl = nodemailer.getTestMessageUrl(testInfo);
          return res.json({
            success: true,
            warning: "Real SMTP was not configured. Email routed via transient SMTP sandbox.",
            sandboxUrl: testUrl,
            message: "Order received and sandbox preview generated!"
          });
        } catch (innerErr) {
          return res.json({
            success: true,
            warning: "No SMTP config configured. Fallback sandbox initialization failed.",
            message: "Order simulated in offline state"
          });
        }
      }

      // real custom SMTP configured! Attempt sending real email
      const senderName = process.env.SMTP_SENDER_NAME || smtpConfig?.fromName || "Swiss Peptides";
      const senderAddress = process.env.SMTP_USER || smtpConfig?.user || "no-reply@buyswisspeptides.shop";

      const mailOptions = {
        from: `"${senderName}" <${senderAddress}>`,
        to: destination,
        subject: `🔔 New Order Placed: ID ${order.id} ($${order.total.toFixed(2)})`,
        html: htmlBody
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Real SMTP Order notification sent successfully! MessageId:", info.messageId);
      
      return res.json({
        success: true,
        messageId: info.messageId,
        message: "Order placed and email notification sent successfully to receiver email address!"
      });

    } catch (error: any) {
      console.error("Error dispatching order notification email:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Internal server error during email dispatch."
      });
    }
  });

  // Test SMTP connection and email delivery
  app.post("/api/send-test-email", async (req, res) => {
    try {
      const { receiverEmail, smtpConfig } = req.body;

      if (!receiverEmail) {
        return res.status(400).json({ success: false, error: "Missing destination receiver email address." });
      }

      const host = process.env.SMTP_HOST || smtpConfig?.host;
      if (!host) {
        return res.status(400).json({ success: false, error: "SMTP host and parameters are required. Configure them in the Secrets Panel behind the scenes." });
      }

      const transporter = createTransporter(smtpConfig);
      if (!transporter) {
        return res.status(400).json({ success: false, error: "Failed to initialize SMTP transporter. Review connection details." });
      }

      const senderName = process.env.SMTP_SENDER_NAME || smtpConfig?.fromName || "Swiss Peptides Verification";
      const senderAddress = process.env.SMTP_USER || smtpConfig?.user || "no-reply@buyswisspeptides.shop";

      const testHtml = `
        <div style="font-family: sans-serif; background-color: #FAF9F5; padding: 40px 15px; text-align: center;">
          <div style="max-w: 500px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1.5px solid #E2E8F0; text-align: left; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <h2 style="color: #0E1B2C; border-bottom: 2px solid #DE5246; padding-bottom: 10px; margin-top: 0; text-transform: uppercase; font-size: 16px;">Test SMTP Successful!</h2>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">Congratulations! Your SMTP Mail Server credentials are correct and functioning perfectly.</p>
            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 12px; color: #475569;">
              <strong>Host:</strong> ${process.env.SMTP_HOST || smtpConfig?.host}<br/>
              <strong>Port:</strong> ${process.env.SMTP_PORT || smtpConfig?.port}<br/>
              <strong>User:</strong> ${process.env.SMTP_USER || smtpConfig?.user}<br/>
              <strong>SSL/TLS:</strong> ${(process.env.SMTP_SECURE === 'true' || smtpConfig?.secure) ? 'Yes' : 'No'}<br/>
              <strong>Receiver:</strong> ${receiverEmail}
            </div>
            <p style="font-size: 12px; color: #64748B; margin-bottom: 0;">Swiss Peptides custom administration dispatcher utility.</p>
          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderAddress}>`,
        to: receiverEmail,
        subject: `✅ SMTP Connection Verified - Swiss Peptides`,
        html: testHtml
      });

      console.log("SMTP Test notification sent! MessageId:", info.messageId);

      return res.json({
        success: true,
        messageId: info.messageId,
        message: "Successfully logged in and sent visual SMTP verification test email!"
      });

    } catch (error: any) {
      console.error("SMTP Test failed with error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to establish a connection or authenticate the SMTP server details."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from compiled dist directory in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Support modern SPA fallback so direct links like /admin load the main index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
