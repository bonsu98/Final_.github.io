import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const ORDERS_FILE_PATH = path.join(process.cwd(), "orders.json");
const QUERIES_FILE_PATH = path.join(process.cwd(), "queries.json");

function readQueries(): any[] {
  try {
    if (fs.existsSync(QUERIES_FILE_PATH)) {
      const data = fs.readFileSync(QUERIES_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading queries file:", err);
  }
  
  const seedQuery = {
    id: "contact-1128",
    name: "Prof. Sarah Jenkins",
    email: "s.jenkins@ox.ac.uk",
    subject: "Bulk purity inquiry on BPC-157",
    message: "Hello team, I would like to inquire about the maximum purity certificate for larger lots of 10mg BPC-157 vials. Do you offer bulk discounts or custom mass spec reports for research facilities?",
    date: "12 Jun 2026",
    status: "Unread"
  };
  
  writeQueries([seedQuery]);
  return [seedQuery];
}

function writeQueries(queries: any[]) {
  try {
    fs.writeFileSync(QUERIES_FILE_PATH, JSON.stringify(queries, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing queries file:", err);
  }
}

function readOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading orders file:", err);
  }
  
  const seedOrder = {
    id: "PEPS-CH-1128",
    userEmail: "m.evans@swisspep.ch",
    userName: "Dr. Matthew Evans",
    phone: "+41 44 200 11 22",
    shippingAddress: {
      street: "Geneva Scientifique Avenue 14",
      city: "Zürich",
      state: "ZH",
      postalCode: "8001",
      country: "Switzerland"
    },
    items: [
      { productId: "pep-retatrutide", name: "Retatrutide", quantity: 1, priceAtPurchase: 189.00 }
    ],
    paymentMethod: "bank_transfer",
    paymentDetails: "Direct SWIFT/IBAN Transfer Completed",
    total: 189.00,
    orderDate: "2026-05-18",
    status: "shipped",
    trackingNumber: "SP-DISPATCH-99120"
  };
  
  writeOrders([seedOrder]);
  return [seedOrder];
}

function writeOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing orders file:", err);
  }
}

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

  // REST endpoints for server-side order database
  app.get("/api/orders", (req, res) => {
    try {
      const orders = readOrders();
      return res.json({ success: true, orders });
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/orders", (req, res) => {
    try {
      const order = req.body;
      if (!order || !order.id) {
        return res.status(400).json({ success: false, error: "Invalid order data. ID is required." });
      }
      const orders = readOrders();
      const existingIndex = orders.findIndex(o => o.id === order.id);
      if (existingIndex !== -1) {
        orders[existingIndex] = { ...orders[existingIndex], ...order };
      } else {
        orders.unshift(order);
      }
      writeOrders(orders);
      return res.json({ success: true, order });
    } catch (err: any) {
      console.error("Error creating order:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch("/api/orders/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;
      const orders = readOrders();
      const index = orders.findIndex(o => o.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: "Order not found." });
      }
      if (status !== undefined) {
        orders[index].status = status;
      }
      if (trackingNumber !== undefined) {
        orders[index].trackingNumber = trackingNumber;
      }
      writeOrders(orders);
      return res.json({ success: true, order: orders[index] });
    } catch (err: any) {
      console.error("Error updating order:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/orders/:id", (req, res) => {
    try {
      const { id } = req.params;
      const orders = readOrders();
      const updated = orders.filter(o => o.id !== id);
      writeOrders(updated);
      return res.json({ success: true, message: "Order deleted successfully from server." });
    } catch (err: any) {
      console.error("Error deleting order:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Send Order Email Endpoint
  app.post("/api/send-order-email", async (req, res) => {
    try {
      const { order, receiverEmail, smtpConfig, emailProvider, emailjsConfig } = req.body;
      
      if (!order) {
        return res.status(400).json({ success: false, error: "Missing order object." });
      }

      const destination = receiverEmail || 'orders@buyswisspeptides.shop';

      // --- EMAILJS ROUTING BRANCH ---
      if (emailProvider === 'emailjs' && emailjsConfig) {
        const { serviceId, orderTemplateId, publicKey } = emailjsConfig;
        if (!serviceId || !orderTemplateId || !publicKey) {
          return res.status(400).json({ 
            success: false, 
            error: "EmailJS provider is selected, but configuration is incomplete. Check serviceId, templateId and publicKey." 
          });
        }

        const itemsSummary = order.items.map((it: any) => 
          `- ${it.product.name} (Qty: ${it.quantity}) [Purity: ${it.product.purity || '99.8%'}]`
        ).join('\n');

        const shippingAddressString = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;

        const templateParams = {
          order_id: order.id,
          to_email: destination,
          name: order.clientName,
          email: order.email,
          phone: order.phone || 'N/A',
          address: shippingAddressString,
          payment_method: order.paymentMethod === 'crypto' ? 'USDT / Crypto' : 'PAYID Direct',
          note: order.note || 'None',
          order_details: itemsSummary,
          total_price: `$${order.total.toFixed(2)}`,
          message: `Hello,\n\nA new order has been placed on Swiss Peptides Shop!\n\nOrder Details:\nOrder ID: ${order.id}\nCustomer Name: ${order.clientName}\nEmail: ${order.email}\nPhone: ${order.phone || 'N/A'}\n\nReagents Ordered:\n${itemsSummary}\n\nGrand Total: $${order.total.toFixed(2)}\nPayment Mode: ${order.paymentMethod === 'crypto' ? 'USDT/Crypto' : 'PAYID'}\nResearcher Notes: ${order.note || 'None'}\n\nShipping Address:\n${shippingAddressString}`
        };

        try {
          console.log(`Attempting to dispatch EmailJS order receipt notification using Service ID: ${serviceId}...`);
          const ejsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: orderTemplateId,
              user_id: publicKey,
              template_params: templateParams
            })
          });

          if (ejsResponse.ok) {
            const responseText = await ejsResponse.text();
            console.log("EmailJS order dispatch response success text:", responseText);
            return res.json({
              success: true,
              message: "Order notification email successfully sent to your EmailJS connected inbox!",
              provider: 'emailjs'
            });
          } else {
            const responseError = await ejsResponse.text();
            console.error("EmailJS order dispatch API error response:", responseError);
            return res.json({
              success: false,
              error: responseError || "EmailJS server rejected the request.",
              message: "Order placed, but EmailJS notification failed to send."
            });
          }
        } catch (ejsErr: any) {
          console.error("Failed to connect to EmailJS API endpoints:", ejsErr);
          return res.json({
            success: false,
            error: ejsErr.toString(),
            message: "Network error occurred while reaching EmailJS servers."
          });
        }
      }

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

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Real SMTP Order notification sent successfully! MessageId:", info.messageId);
        
        return res.json({
          success: true,
          messageId: info.messageId,
          message: "Order placed and email notification sent successfully to receiver email address!"
        });
      } catch (mailError: any) {
        console.error("SMTP sending failed for order notification:", mailError);
        let helperText = "";
        
        if (mailError.message && (mailError.message.includes('BadCredentials') || mailError.message.includes('535-5.7.8') || mailError.message.includes('Username and Password not accepted'))) {
          helperText = "GMAIL AUTO-DISPATCH REJECTED: Google blocked authentication. If using 'smtp.gmail.com', you MUST generate and use a 16-character 'App Password' instead of your regular Google password! (To do this: Enable 2-Step Verification in your Gmail account, then visit Security -> 'App Passwords' to generate a 16-character code).";
        } else {
          helperText = "Check that your SMTP mail host, port, username, and password in the Secrets/Settings are correct and authorized.";
        }

        return res.json({
          success: false,
          error: mailError.message,
          helper: helperText,
          message: "Order details received, but email notification dispatch failed."
        });
      }

    } catch (error: any) {
      console.error("Error dispatching order notification email:", error);
      return res.status(200).json({
        success: false,
        error: error.message || "Internal server error during email dispatch."
      });
    }
  });

  // Test SMTP connection and email delivery
  app.post("/api/send-test-email", async (req, res) => {
    try {
      const { receiverEmail, smtpConfig, emailProvider, emailjsConfig } = req.body;

      if (!receiverEmail) {
        return res.status(400).json({ success: false, error: "Missing destination receiver email address." });
      }

      // --- EMAILJS ROUTING BRANCH ---
      if (emailProvider === 'emailjs' && emailjsConfig) {
        const { serviceId, orderTemplateId, contactTemplateId, publicKey } = emailjsConfig;
        if (!serviceId || !publicKey) {
          return res.status(400).json({ success: false, error: "EmailJS Service ID and Public Key are required parameters." });
        }

        const templateId = contactTemplateId || orderTemplateId;
        if (!templateId) {
          return res.status(400).json({ success: false, error: "At least one template ID is required for testing." });
        }

        const templateParams = {
          to_email: receiverEmail,
          name: "Test Verifier",
          email: "test-auth-check@buyswisspeptides.shop",
          subject: "EmailJS Connection Verification Test",
          message: "Congratulations! This is an active connection validation notification dispatched by your Swiss Peptides platform through the EmailJS dynamic REST API interface. If you are reading this email, your configuration parameters are correct and your EmailJS integration is active in real-time!",
          order_id: "TEST-EJS-2026",
          total_price: "$199.00",
          order_details: "- Verified Bio-Active Liquid Compound Validation Reagent (Qty: 1)"
        };

        try {
          console.log(`Dispatched test verify connection payload directly to EmailJS REST servers...`);
          const ejsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey,
              template_params: templateParams
            })
          });

          if (ejsResponse.ok) {
            const textResponse = await ejsResponse.text();
            console.log("EmailJS test successful connection output status:", textResponse);
            return res.json({
              success: true,
              message: `EmailJS verification dispatch succeeded! A synthetic test was routed via EmailJS to ${receiverEmail}`
            });
          } else {
            const errText = await ejsResponse.text();
            console.error("EmailJS test failed connection output status:", errText);
            return res.json({
              success: false,
              error: `EmailJS service returned rejection: ${errText}`,
              helper: "Make sure you pasted the exact, case-sensitive Service ID, Public Key, and Template ID. Ensure the Email Service is properly paired with a real delivery service (such as Gmail, Yahoo, or Outlook) inside your EmailJS dashboard."
            });
          }
        } catch (netErr: any) {
          return res.json({
            success: false,
            error: netErr.toString(),
            helper: "A local or external networking error prevented the server from connecting with the Google/Vercel or EmailJS Rest API endpoints."
          });
        }
      }

      const host = process.env.SMTP_HOST || smtpConfig?.host;
      if (!host) {
        return res.status(400).json({ success: false, error: "SMTP host and parameters are required. Configure them in SMTP mode." });
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
      let helperText = "";
      
      if (error.message && (error.message.includes('BadCredentials') || error.message.includes('535-5.7.8') || error.message.includes('Username and Password not accepted'))) {
        helperText = "GMAIL LOGIN REJECTED: Google blocked authentication. If you are using GMail (smtp.gmail.com), you MUST generate and use a 16-character 'App Password' instead of your regular Google password! (To do this: Enable 2-Step Verification in your Gmail account settings, then visit Security -> 'App Passwords' to generate a 16-character code).";
      } else {
        helperText = "Please double check your server secrets settings (SMTP Host, SMTP Port, SMTP Username/User, SMTP Password/Pass) to ensure they are accurate and authorized by your mail provider.";
      }

      return res.status(200).json({
        success: false,
        error: error.message || "Failed to establish a connection or authenticate the SMTP server details.",
        helper: helperText
      });
    }
  });

  // Send Contact Message Email Endpoint
  app.post("/api/send-contact-email", async (req, res) => {
    try {
      const { name, email, subject, message, receiverEmail, emailProvider, emailjsConfig } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: "Please fill out all mandatory contact fields." });
      }

      const destination = receiverEmail || 'orders@buyswisspeptides.shop';

      // Persist contact message dynamics on server-side
      const queries = readQueries();
      const newQuery = {
        id: `contact-${Date.now()}`,
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Unread'
      };
      queries.unshift(newQuery);
      writeQueries(queries);

      // --- EMAILJS ROUTING BRANCH ---
      if (emailProvider === 'emailjs' && emailjsConfig) {
        const { serviceId, contactTemplateId, publicKey } = emailjsConfig;
        if (!serviceId || !contactTemplateId || !publicKey) {
          return res.status(400).json({ 
            success: false, 
            error: "EmailJS provider is selected, but configuration is incomplete. Check serviceId, templateId and publicKey." 
          });
        }

        const templateParams = {
          to_email: destination,
          name: name,
          email: email,
          subject: subject,
          message: message,
          message_body: message
        };

        try {
          console.log(`Attempting to dispatch EmailJS contact message notification using Service ID: ${serviceId}...`);
          const ejsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: contactTemplateId,
              user_id: publicKey,
              template_params: templateParams
            })
          });

          if (ejsResponse.ok) {
            const responseText = await ejsResponse.text();
            console.log("EmailJS contact message success response:", responseText);
            return res.json({
              success: true,
              message: "Your message has been received and routed successfully via EmailJS!",
              provider: 'emailjs'
            });
          } else {
            const responseError = await ejsResponse.text();
            console.error("EmailJS contact dispatch API error response:", responseError);
            return res.json({
              success: false,
              error: responseError || "EmailJS server rejected the request.",
              message: "Submission saved, but EmailJS message notification failed to send."
            });
          }
        } catch (ejsErr: any) {
          console.error("Failed to connect to EmailJS API endpoints:", ejsErr);
          return res.json({
            success: false,
            error: ejsErr.toString(),
            message: "Network error occurred while reaching EmailJS servers during contact submission."
          });
        }
      }
      
      const smtpSettingsStr = process.env.SMTP_HOST ? null : ""; // we check if env is set, or if we need configuration
      const transporter = createTransporter(null);

      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; padding: 40px 15px; text-align: center;">
          <div style="max-w: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1.5px solid #E2E8F0; width: 100%; text-align: left; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="background-color: #0E1B2C; padding: 25px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: 1px; margin: 0 0 5px 0; font-family: sans-serif;">SWISS PEPTIDES CONTACT</h1>
              <p style="color: #DE5246; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">NEW CUSTOMER INQUIRY</p>
            </div>
            
            <!-- Details -->
            <div style="padding: 24px; border-bottom: 1.5px solid #F1F1F0; background-color: #FAFBFD;">
              <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px; font-family: sans-serif;">Sender Details</h3>
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

            <!-- Message Body -->
            <div style="padding: 24px;">
              <h3 style="margin-top: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #0E1B2C; margin-bottom: 12px; font-family: sans-serif;">Message</h3>
              <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 20px; border-radius: 8px; font-size: 13px; color: #1E293B; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>

            <!-- Footer -->
            <div style="background-color: #F8FAFC; padding: 25px 20px; text-align: center; border-top: 1.5px solid #E2E8F0; font-size: 11px; color: #64748B;">
              <p style="margin: 0 0 6px 0; font-weight: bold; color: #475569; letter-spacing: 0.5px;">SWISS PEPTIDES SHOP</p>
              <p style="margin: 0; line-height: 1.4;">This automated contact form inquiry was dispatched to the central administration receiver email. You can reply directly to the customer at <a href="mailto:${email}" style="color:#DE5246; text-decoration:none;">${email}</a>.</p>
            </div>

          </div>
        </div>
      `;

      if (!transporter) {
        console.warn("=================================================");
        console.warn("NO SMTP SET UP FOR CONTACT ENQUIRIES. PRINTING:");
        console.warn(`SENDER: ${name} (${email})`);
        console.warn(`SUBJECT: ${subject}`);
        console.warn("=================================================");

        // Fallback or Test Account
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
            subject: `[Fallback Contact] ${subject}`,
            html: htmlBody
          });

          const testUrl = nodemailer.getTestMessageUrl(testInfo);
          return res.json({
            success: true,
            warning: "Real SMTP was not configured. Contact inquiry routed via transient SMTP sandbox.",
            sandboxUrl: testUrl,
            message: "Message received in simulation environment!"
          });
        } catch {
          return res.json({
            success: true,
            warning: "No SMTP config configured.",
            message: "Inquiry stored locally"
          });
        }
      }

      const senderName = process.env.SMTP_SENDER_NAME || "Swiss Peptides Portal";
      const senderAddress = process.env.SMTP_USER || "no-reply@buyswisspeptides.shop";

      const mailOptions = {
        from: `"${senderName}" <${senderAddress}>`,
        to: destination,
        subject: `✉️ New Contact Inquiry: ${subject}`,
        replyTo: email,
        html: htmlBody
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Real SMTP Contact notification sent successfully! MessageId:", info.messageId);

        return res.json({
          success: true,
          messageId: info.messageId,
          message: "Message sent successfully to receiver email address!"
        });
      } catch (mailError: any) {
        console.error("Contact form SMTP send failed:", mailError);
        let helperText = "";
        
        if (mailError.message && (mailError.message.includes('BadCredentials') || mailError.message.includes('535-5.7.8') || mailError.message.includes('Username and Password not accepted'))) {
          helperText = "GMAIL LOGIN REJECTED: Google blocked authentication. If using 'smtp.gmail.com', you MUST generate and use a 16-character 'App Password' instead of your regular Google password! (To do this: Enable 2-Step Verification in your Gmail account settings, then visit Security -> 'App Passwords' to generate a 16-character code).";
        } else {
          helperText = "Please double check your server secrets settings (SMTP Host, SMTP Port, SMTP Username/User, SMTP Password/Pass) to ensure they are accurate and authorized by your mail provider.";
        }

        return res.json({
          success: false,
          error: mailError.message,
          helper: helperText,
          message: "Inquiry received locally, but notification email dispatch failed due to server SMTP credential issues."
        });
      }

    } catch (error: any) {
      console.error("Error dispatching contact email:", error);
      return res.status(200).json({
        success: false,
        error: error.message || "Internal server error during contact email dispatch."
      });
    }
  });

  // Fetch all contact queries / inquiry records from the server-side registry
  app.get("/api/queries", (req, res) => {
    try {
      const queries = readQueries();
      return res.json({ success: true, queries });
    } catch (err: any) {
      console.error("Error fetching queries from server:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Quick updating of enquiry logs (e.g. read status, resolved state)
  app.patch("/api/queries/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const queries = readQueries();
      const index = queries.findIndex(q => q.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: "Submissions query not found." });
      }
      if (status !== undefined) {
        queries[index].status = status;
      }
      writeQueries(queries);
      return res.json({ success: true, query: queries[index] });
    } catch (err: any) {
      console.error("Error patching query status:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Permanently delete a contact enquiry record from persistent logs
  app.delete("/api/queries/:id", (req, res) => {
    try {
      const { id } = req.params;
      const queries = readQueries();
      const updated = queries.filter(q => q.id !== id);
      writeQueries(updated);
      return res.json({ success: true, message: "Query deleted successfully from server." });
    } catch (err: any) {
      console.error("Error deleting contact inquiry:", err);
      return res.status(500).json({ success: false, error: err.message });
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
