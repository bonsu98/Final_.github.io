import React, { useState } from 'react';
import { Database, Landmark, ExternalLink, ShieldCheck, Cpu, Code, ClipboardCheck, Terminal } from 'lucide-react';

export default function DocsPortal() {
  const [activeTab, setActiveTab] = useState<'database' | 'gateways' | 'deploy' | 'security'>('database');

  // Interactive code copying helper
  const handleCopyCode = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    alert(`${title} code copied to transfer clipboard safely!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title block */}
      <div className="bg-[#111c15] text-white p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-emerald-900/40">
        <div>
          <span className="bg-emerald-800 text-emerald-100 text-[10px] font-mono font-black uppercase tracking-widest py-1 px-2.5 rounded-full inline-flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-300 animate-spin" />
            BUY PEPTIDES AUSTRALIA SYSTEM CORE
          </span>
          <h2 className="text-xl font-sans font-black tracking-tight mt-2 text-white">
            Architecture, Integrations, and Security Specifications
          </h2>
          <p className="text-xs text-emerald-300 font-mono mt-0.5 max-w-2xl">
            Fully detailed production-ready templates ready for immediate project deployment.
          </p>
        </div>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Spec Categories Column (Colspan 3) */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs space-y-2">
            {[
              { id: 'database', label: '1. Database & Schemas', desc: 'Firestore IR blueprints', icon: Database },
              { id: 'gateways', label: '2. Payment API Sets', desc: 'Secure Stripe & Emails', icon: Landmark },
              { id: 'deploy', label: '3. Docker & CI pipeline', desc: 'Cloud Run & Dockerfiles', icon: Code },
              { id: 'security', label: '4. Zero-Trust Security', desc: 'SSL metrics & CSP rules', icon: ShieldCheck }
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-100/50'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <IconComp className={`w-5 h-5 shrink-0 mt-0.5 ${activeTab === tab.id ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <div className="leading-tight">
                    <span className="text-xs font-bold font-sans block">{tab.label}</span>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">{tab.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Side: Active technical contents (Colspan 9) */}
        <main className="lg:col-span-9">
          
          {/* TAB 1: Database Specs */}
          {activeTab === 'database' && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Entity Schema Architecture</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Database Blueprint schema mappings defined in Firestore.</p>
              </div>

              {/* Graphical Schema visualization */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono space-y-3">
                <span className="text-[9px] text-gray-400 tracking-wider font-bold">RE-LOGICAL MODELS DIAGRAM</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white border border-gray-200 rounded-md shadow-2xs">
                    <span className="text-red-650 font-bold block mb-1">Users Collection (/users/&#123;uid&#125;)</span>
                    <ul className="space-y-1 text-[10px] text-gray-500">
                      <li>• uid (String - PK)</li>
                      <li>• email (String)</li>
                      <li>• name (String)</li>
                      <li>• role (String - [researcher])</li>
                      <li>• organization (String)</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-md shadow-2xs">
                    <span className="text-indigo-600 font-bold block mb-1">Orders Collection (/orders/&#123;id&#125;)</span>
                    <ul className="space-y-1 text-[10px] text-gray-500">
                      <li>• id (String - PK)</li>
                      <li>• userEmail (String - FK)</li>
                      <li>• items (Array of objects)</li>
                      <li>• total (Number)</li>
                      <li>• status (String - terminal states)</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white border border-gray-200 rounded-md shadow-2xs">
                    <span className="text-emerald-700 font-bold block mb-1">Batches (/batches/&#123;id&#125;)</span>
                    <ul className="space-y-1 text-[10px] text-gray-500">
                      <li>• id (String - PK)</li>
                      <li>• batchNumber (String)</li>
                      <li>• productTarget (String)</li>
                      <li>• purity (String)</li>
                      <li>• hplcPeaks (Array of coordinates)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Code schema blueprints */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-900 text-gray-400 px-4 py-2 rounded-t-lg font-mono text-xs">
                  <span>firebase-blueprint.json</span>
                  <button
                    onClick={() => handleCopyCode(dbCodeString, 'Database Blueprint')}
                    className="hover:text-white font-sans text-[10px] bg-gray-800 py-1 px-2.5 rounded cursor-pointer"
                  >
                    Copy Blueprint
                  </button>
                </div>
                <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-b-lg overflow-x-auto max-h-72 leading-relaxed">
                  {dbCodeString}
                </pre>
              </div>

              {/* Security rules specs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-900 text-gray-400 px-4 py-2 rounded-t-lg font-mono text-xs">
                  <span>firestore.rules (Zero-Trust)</span>
                  <button
                    onClick={() => handleCopyCode(securityRulesString, 'Firestore Rules')}
                    className="hover:text-white font-sans text-[10px] bg-gray-800 py-1 px-2.5 rounded cursor-pointer"
                  >
                    Copy Rules
                  </button>
                </div>
                <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-b-lg overflow-x-auto max-h-72 leading-relaxed">
                  {securityRulesString}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 2: Gateways and Integrations */}
          {activeTab === 'gateways' && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Third-Party Gateway Specifications</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Secure payment processing (Stripe SDK) and analytical transaction email logic (SendGrid module).</p>
              </div>

              {/* Stripe checkout explain */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 font-mono uppercase text-xs">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  Stripe Checkout Server Endpoint (Node.js API Route)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-900 text-gray-400 px-4 py-2 rounded-t-lg font-mono text-xs">
                    <span>api/payments/checkout.ts</span>
                    <button
                      onClick={() => handleCopyCode(stripeCodeString, 'Stripe Checkout API')}
                      className="hover:text-white font-sans text-[10px] bg-gray-800 py-1 px-2.5 rounded cursor-pointer"
                    >
                      Copy API
                    </button>
                  </div>
                  <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-b-lg overflow-x-auto max-h-72 leading-relaxed">
                    {stripeCodeString}
                  </pre>
                </div>
              </div>

              {/* Mail integration */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 font-mono uppercase text-xs">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  Automated SendGrid Transaction Invoice Despatcher
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-900 text-gray-400 px-4 py-2 rounded-t-lg font-mono text-xs">
                    <span>api/emails/invoiceSender.ts</span>
                    <button
                      onClick={() => handleCopyCode(emailCodeString, 'SendGrid Dispatcher')}
                      className="hover:text-white font-sans text-[10px] bg-gray-800 py-1 px-2.5 rounded cursor-pointer"
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-b-lg overflow-x-auto max-h-72 leading-relaxed">
                    {emailCodeString}
                  </pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Deployment Pipelines */}
          {activeTab === 'deploy' && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Deployment Pipeline configurations</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Automating Docker compilation and pushing onto Google Cloud Run nodes.</p>
              </div>

              {/* Multi-stage Dockerfile */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase font-mono tracking-wider">Multi-Stage Dockerfile Layout</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-900 text-gray-400 px-4 py-2 rounded-t-lg font-mono text-xs">
                    <span>Dockerfile (Optimized Container)</span>
                    <button
                      onClick={() => handleCopyCode(dockerfileString, 'Dockerfile')}
                      className="hover:text-white font-sans text-[10px] bg-gray-800 py-1 px-2.5 rounded cursor-pointer"
                    >
                      Copy Dockerfile
                    </button>
                  </div>
                  <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-b-lg overflow-x-auto max-h-64 leading-relaxed">
                    {dockerfileString}
                  </pre>
                </div>
              </div>

              {/* GitHub CI/CD build configuration */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase font-mono tracking-wider">GitHub CI Auto-Deploy Pipeline</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-900 text-gray-400 px-4 py-2 rounded-t-lg font-mono text-xs">
                    <span>.github/workflows/deploy.yml</span>
                    <button
                      onClick={() => handleCopyCode(githubPipelineString, 'GitHub Actions')}
                      className="hover:text-white font-sans text-[10px] bg-gray-800 py-1 px-2.5 rounded cursor-pointer"
                    >
                      Copy Config
                    </button>
                  </div>
                  <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-b-lg overflow-x-auto max-h-64 leading-relaxed">
                    {githubPipelineString}
                  </pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: General Security specs */}
          {activeTab === 'security' && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Security & Hardening Specifications</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Specifications for TLS handshakes, Content Security Policy header sets, and sanitizations.</p>
              </div>

              {/* SSL explain */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-gray-450 tracking-wider uppercase font-mono flex items-center gap-1.5 border-b pb-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  1. SSL/TLS Handshake Cipher Suites Recommendations
                </h4>
                <p className="text-xs text-gray-650 leading-relaxed font-sans mt-1">
                  Ensure all inbound traffic maps strictly over HTTPS. Enable TLS V1.3 protocol inside Nginx reverse proxy controllers, disabling weak legacy SSLv3 and TLSv1.0 models risking packet sniffing.
                </p>
                <div className="bg-gray-50 p-3 rounded text-[11px] font-mono border text-gray-700 leading-normal">
                  <strong className="text-gray-900 block font-mono text-[11px] border-b pb-1 mb-1">Recommended Cipher List:</strong>
                  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384
                </div>
              </div>

              {/* CSP explain */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[11px] font-bold text-gray-450 tracking-wider uppercase font-mono flex items-center gap-1.5 border-b pb-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  2. Required Content Security Policy (CSP) Headers
                </h4>
                <p className="text-xs text-gray-650 leading-relaxed font-sans mt-1">
                  Inject safe security headers to prevent Cross-Site Scripting (XSS) injection attacks and malicious iframe clickjacking:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-gray-700">
                  {`Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none';`}
                </div>
              </div>

              {/* Sanitization script snippet */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[11px] font-bold text-gray-440 tracking-wider uppercase font-mono flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  3. Input Validation and Sanitization Script
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-900 text-gray-400 px-4 py-2 rounded-t-lg font-mono text-xs">
                    <span>utils/sanitizer.ts</span>
                    <button
                      onClick={() => handleCopyCode(sanitizerCodeString, 'Input Sanitizer')}
                      className="hover:text-white font-sans text-[10px] bg-gray-800 py-1 px-2.5 rounded cursor-pointer"
                    >
                      Copy Sanitizer
                    </button>
                  </div>
                  <pre className="bg-gray-950 text-emerald-400 font-mono text-[11px] p-4 rounded-b-lg overflow-x-auto max-h-52 leading-relaxed">
                    {sanitizerCodeString}
                  </pre>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}

// SPECIFICATION CODES AS STATIC STRING DATA FOR DEVELOPERS COPYING
const dbCodeString = `{
  "entities": {
    "users": {
      "title": "UserProfile",
      "description": "Biological researcher accounts credentials registry",
      "type": "object",
      "properties": {
        "uid": { "type": "string", "description": "PK - Firebase Auth Unique Identifier" },
        "email": { "type": "string", "description": "Academic researcher primary email" },
        "name": { "type": "string", "description": "Full researcher name" },
        "organization": { "type": "string", "description": "Institution name" },
        "labLicense": { "type": "string", "description": "State laboratory credentials code" },
        "role": { "type": "string", "enum": ["researcher", "administrator"] },
        "joinedAt": { "type": "string", "format": "date-time" }
      },
      "required": ["uid", "email", "name", "role", "joinedAt"]
    },
    "orders": {
      "title": "OrderReceipt",
      "description": "Formulated research compound dispatches",
      "type": "object",
      "properties": {
        "id": { "type": "string", "description": "PK - SW-ORD series code" },
        "userEmail": { "type": "string", "description": "Purchasing account email" },
        "items": { "type": "array", "description": "List of vials, prices and doses" },
        "total": { "type": "number", "description": "Final sum in USD" },
        "paymentMethod": { "type": "string", "enum": ["bank_transfer", "credit_card", "crypto"] },
        "status": { "type": "string", "enum": ["pending", "processing", "shipped", "delivered"] },
        "orderDate": { "type": "string" },
        "trackingNumber": { "type": "string" }
      },
      "required": ["id", "userEmail", "items", "total", "paymentMethod", "status", "orderDate"]
    }
  },
  "firestore": {
    "/users/{userId}": {
      "schema": { "$ref": "users" },
      "description": "Restricted private user data records"
    },
    "/orders/{orderId}": {
      "schema": { "$ref": "orders" },
      "description": "Historic cargo invoice records"
    }
  }
}`;

const securityRulesString = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Global Safety default deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Hardened helper primitives
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
    function isEmailVerified() { return request.auth.token.email_verified == true; }
    
    // Rules for User accounts Profiles
    match /users/{userId} {
      allow get: if isOwner(userId);
      allow create: if isSignedIn() 
                    && isEmailVerified()
                    && request.resource.data.uid == request.auth.uid
                    && request.resource.data.role == 'researcher'; // Block self-admin elevations
      allow update: if isOwner(userId)
                    && request.resource.data.role == resource.data.role // Make role immutable
                    && request.resource.data.email == resource.data.email;
    }

    // Rules for Orders
    match /orders/{orderId} {
      allow read: if isSignedIn() && resource.data.userEmail == request.auth.token.email;
      allow create: if isSignedIn() 
                    && isEmailVerified()
                    && request.resource.data.userEmail == request.auth.token.email;
      allow update: if false; // Orders are immutable details on clients
    }
  }
}`;

const stripeCodeString = `import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { items, userEmail, orderId } = req.body;

    // Reconstruct lines items in Stripe format
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: \`Swiss Peptides Research Compound: \${item.dosage} vial\`,
        },
        unit_amount: Math.round(item.priceAtPurchase * 100), // convert to cents
      },
      quantity: item.quantity,
    }));

    // Generate Stripe Secure session checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: userEmail,
      mode: 'payment',
      success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=\${orderId}\`,
      cancel_url: \`\${process.env.APP_URL}/cart\`,
      metadata: {
        orderId: orderId,
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}`;

const emailCodeString = `import sgMail from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(450).end();

  const { order } = req.body;

  const msg = {
    to: order.userEmail,
    from: 'dispatch@swisspeptides.ch', // Safe authenticated domain
    subject: \`Formulation Invoice Registered - Swiss Peptides #\${order.id}\`,
    html: \`
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #047857;">SWISS PEPTIDES LABS</h2>
        <p>Dear Dr. \${order.userName},</p>
        <p>Your biological compound checkout has registered successfully under Order Code: <strong>\${order.id}</strong>.</p>
        <hr/>
        <h4>Order Composition:</h4>
        <ul>
          \${order.items.map((i: any) => \`<li>\${i.name} (x\${i.quantity}) - \$\${(i.priceAtPurchase * i.quantity).toFixed(2)}</li>\`).join('')}
        </ul>
        <p><strong>Cargo Total Sum: \$\${order.total.toFixed(2)} USD </strong></p>
        <p>Direct Swiss Post Express shipping tracked via code: <strong>\u200B\${order.trackingNumber}</strong>.</p>
        <p>Reconstitution formulas has been mapped on your credentials dashboard portal.</p>
        <br/>
        <p style="font-size: 11px; color: #777;">Swiss Peptides • Bio Research Hub</p>
      </div>
    \`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}`;

const dockerfileString = `# STAGE 1: Compilation build environment Node.js Alpine base
FROM node:20-alpine AS builder
WORKDIR /workspace
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Lightweight production server core running Vite preview preview
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /workspace/dist ./dist
COPY --from=builder /workspace/server.ts ./server.ts 2>/dev/null || true

# Set appropriate port and bind to host
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npx", "vite", "preview", "--port=3000", "--host=0.0.0.0"]`;

const githubPipelineString = `name: Build and Deploy Swiss Peptides to Cloud Run

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Git Repository Checkout
        uses: actions/checkout@v3

      - name: Google Cloud Authentication
        uses: google-github-actions/auth@v1
        with:
          credentials_json: \${{ secrets.GCP_SA_KEY }}

      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: Configure Docker to Artifact Registry
        run: |
          gcloud auth configure-docker australia-southeast1-docker.pkg.dev

      - name: Compile Docker Image & Push
        run: |
          docker build -t australia-southeast1-docker.pkg.dev/\${{ secrets.GCP_PROJECT_ID }}/peptides/au:latest .
          docker push australia-southeast1-docker.pkg.dev/\${{ secrets.GCP_PROJECT_ID }}/peptides/au:latest

      - name: Deploy Google Cloud Run
        run: |
          gcloud run deploy buy-peptides-australia \\
            --image australia-southeast1-docker.pkg.dev/\${{ secrets.GCP_PROJECT_ID }}/peptides/au:latest \\
            --platform managed \\
            --region australia-southeast1 \\
            --port 3000 \\
            --allow-unauthenticated`;

const sanitizerCodeString = `/**
 * Sanitize and scrub raw inputs to prevent basic Cross-Site Scripting (XSS)
 * and malicious database parameter command injections.
 */
export function sanitizeInput(rawString: string): string {
  if (!rawString) return '';
  return rawString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\\//g, '&#x2F;')
    .trim();
}

export function isValidLicenseFormat(lic: string): boolean {
  // Regex pattern matching AU-BIO-###### coordinates
  const regex = /^AU-BIO-\\d{6}$/;
  return regex.test(lic.trim());
}`;
