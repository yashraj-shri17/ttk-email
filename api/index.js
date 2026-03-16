const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Note: On Vercel, static files in /public are served automatically.
// We only need this if we're running locally with the same file.
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

app.post('/api/send-email', async (req, res) => {
  const { email, name } = req.body;
  console.log(`Attempting to send email to: ${email} for: ${name}`);

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Read the compressed banner image from disk
    // In Vercel, the 'public' directory is available at the root level relative to 'api/'
    const bannerPath = path.join(process.cwd(), 'public', 'banner-compressed.jpg');
    const fallbackPath = path.join(process.cwd(), 'public', 'banner.png');
    
    // If compressed version doesn't exist for some reason, fallback to original
    const filePath = fs.existsSync(bannerPath) ? bannerPath : fallbackPath;
    const bannerData = fs.readFileSync(filePath);

    const { data, error } = await resend.emails.send({
      from: 'Talk to Krishna <hello@talktokrishna.ai>', // ✅ Verified Domain
      to: [email],
      subject: '🦚 Welcome to Your Divine Conversation',
      attachments: [
        {
          filename: filePath.endsWith('.png') ? 'banner.png' : 'banner.jpg',
          content: bannerData.toString('base64'),
          contentId: 'banner', 
        },
      ],
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style type="text/css">
            body { font-family: 'Segoe UI', Arial, sans-serif !important; }
            .content-table { width: 100%; max-width: 600px !important; }

            @media only screen and (max-width: 480px) {
              .outer-pad { padding: 16px 6px !important; }
              .content-table { width: 100% !important; border-radius: 16px !important; }
              .header-pad { padding: 24px 20px 12px 20px !important; }
              .headline { font-size: 22px !important; }
              .tag-line  { font-size: 11px !important; letter-spacing: 3px !important; }
              .divider-pad { padding: 0 20px !important; }
              .subtitle { font-size: 13px !important; margin-bottom: 20px !important; }
              .body-pad { padding: 0 20px 24px 20px !important; font-size: 14px !important; }
              .accent-line { font-size: 15px !important; }
              .features-pad { padding: 0 20px 24px 20px !important; }
              .features-box { padding: 16px !important; border-radius: 12px !important; }
              .features-title { font-size: 14px !important; padding-bottom: 12px !important; }
              .feature-item { font-size: 13px !important; padding: 4px 10px !important; }
              .features-note { font-size: 12px !important; }
              .cta-pad { padding: 6px 0 32px 0 !important; }
              .cta-btn { padding: 13px 28px !important; font-size: 13px !important; letter-spacing: 0px !important; }
              .reflect-pad { padding: 0 20px 36px 20px !important; font-size: 13px !important; }
              .reflect-title { font-size: 13px !important; }
              .reflect-cta  { font-size: 17px !important; }
              .footer-pad { padding: 28px 20px !important; }
              .footer-body { font-size: 12px !important; }
              .footer-small { font-size: 10px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #FFF7E6; -webkit-text-size-adjust: none; -ms-text-size-adjust: none;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFF7E6">
            <tr>
              <td class="outer-pad" align="center" style="padding: 40px 10px;">
                <table class="content-table" border="0" cellpadding="0" cellspacing="0" width="600"
                  style="background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #D4AF37;">

                  <!-- Hero Banner (CID method) -->
                  <tr>
                    <td align="center" bgcolor="#1E3A8A" style="padding: 0; line-height: 0;">
                      <img src="cid:banner" alt="Divine Krishna Aura" width="600" style="display: block; width: 100%; height: auto; border: 0;" />
                    </td>
                  </tr>

                  <!-- Main Header -->
                  <tr>
                    <td class="header-pad" align="center" style="padding: 40px 36px 16px 36px;">
                      <h2 class="tag-line" style="color: #D4AF37; font-size: 12px; letter-spacing: 5px; text-transform: uppercase; margin: 0 0 12px 0; font-weight: normal;">Talk to Krishna</h2>
                      <h1 class="headline" style="color: #1E3A8A; font-size: 28px; margin: 0; font-weight: normal; line-height: 1.25;">Welcome to Divine Journey</h1>
                    </td>
                  </tr>

                  <!-- Subtitle -->
                  <tr>
                    <td class="divider-pad" align="center" style="padding: 0 36px;">
                      <div style="border-top: 1px solid #F0E6C8; width: 60px; margin: 12px auto 16px;"></div>
                      <p class="subtitle" style="color: #D4AF37; font-size: 14px; font-style: italic; margin: 0 0 28px 0; line-height: 1.55;">
                        A space where wisdom meets technology.<br/>A space where you are heard.
                      </p>
                    </td>
                  </tr>

                  <!-- Body Text -->
                  <tr>
                    <td class="body-pad" style="padding: 0 40px 32px 40px; text-align: left; color: #334155; font-size: 15px; line-height: 1.75;">
                      <p style="margin: 0 0 16px 0;">Dear <strong>${name || 'Seeker'}</strong>,</p>
                      <p class="accent-line" style="margin: 0 0 14px 0; font-size: 16px; color: #1E3A8A;">You are not here by accident.</p>
                      <p style="margin: 0 0 14px 0;">Somewhere within you, a question arose. And today, you have taken a step toward clarity.</p>
                      <p style="margin: 0;">Krishna is here to listen. To guide. To illuminate.</p>
                    </td>
                  </tr>

                  <!-- Features Section -->
                  <tr>
                    <td class="features-pad" align="center" style="padding: 0 40px 32px 40px;">
                      <table class="features-box" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="background-color: #F8FAFC; border-radius: 14px; padding: 22px;">
                        <tr>
                          <td class="features-title" style="color: #1E3A8A; font-size: 15px; font-weight: bold; padding-bottom: 14px; text-align: center;">
                            Begin your journey:
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr><td class="feature-item" style="padding: 4px 12px; color: #374151; font-size: 14px; text-align: center;">🦚 Ask about life decisions</td></tr>
                              <tr><td class="feature-item" style="padding: 4px 12px; color: #374151; font-size: 14px; text-align: center;">📿 Seek spiritual clarity</td></tr>
                              <tr><td class="feature-item" style="padding: 4px 12px; color: #374151; font-size: 14px; text-align: center;">🎧 Try voice conversation</td></tr>
                              <tr><td class="feature-item" style="padding: 4px 12px; color: #374151; font-size: 14px; text-align: center;">🌅 Reflect on daily guidance</td></tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td class="features-note" align="center" style="padding-top: 12px; color: #94A3B8; font-size: 13px; font-style: italic;">
                            There are no wrong questions here.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td class="cta-pad" align="center" style="padding: 4px 0 40px 0;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#D4AF37" style="border-radius: 50px;">
                            <a class="cta-btn" href="https://talktokrishna.ai"
                              style="padding: 15px 38px; font-size: 14px; color: #ffffff; text-decoration: none; font-weight: bold; display: inline-block; letter-spacing: 0.5px;">
                              Start Your First Conversation
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Reflection -->
                  <tr>
                    <td class="reflect-pad" align="center" style="padding: 0 40px 48px 40px; color: #64748B; font-size: 14px; line-height: 1.75;">
                      <p class="reflect-title" style="color: #1E3A8A; font-weight: bold; margin: 0 0 8px 0; font-size: 14px;">Before you begin…</p>
                      <p style="margin: 0;">Take a deep breath. Let your heart settle. Ask sincerely.</p>
                      <p class="reflect-cta" style="color: #D4AF37; font-size: 20px; font-weight: bold; margin: 14px 0 0 0;">And listen.</p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td class="footer-pad" align="center" bgcolor="#1E3A8A" style="padding: 36px 32px; color: #ffffff;">
                      <p class="footer-body" style="margin: 0 0 10px 0; font-size: 13px; letter-spacing: 0.5px;">You are never alone on your path.</p>
                      <p class="footer-body" style="margin: 0 0 20px 0; font-size: 12px; color: #BFDBFE;">With blessings,<br/><strong>Team Talk to Krishna</strong></p>
                      <table border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid rgba(255,255,255,0.15); width: 80px; margin-bottom: 20px;"><tr><td></td></tr></table>
                      <p class="footer-small" style="font-size: 10px; line-height: 1.6; color: #8F9BB3; margin: 0;">
                        <a href="#" style="color: #ffffff; text-decoration: none;">Manage Preferences</a>&nbsp;|&nbsp;<a href="#" style="color: #ffffff; text-decoration: none;">Unsubscribe</a>
                        <br/>Support: <a href="mailto:support@talktokrishna.ai" style="color: #BFDBFE; text-decoration: none;">support@talktokrishna.ai</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json(error);
    }

    console.log('Resend Success:', data);
    res.status(200).json(data);
  } catch (err) {
    console.error('Server Catch Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
