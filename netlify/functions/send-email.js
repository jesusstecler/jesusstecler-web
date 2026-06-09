exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const { nombre, email } = JSON.parse(event.body);
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const PDF_URL = process.env.PDF_URL;
  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, attributes: { FIRSTNAME: nombre }, listIds: [2], updateEnabled: true })
  });
  const emailResp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Jesús Stecler", email: "renestecler@gmail.com" },
      to: [{ email, name: nombre }],
      subject: "Tu Protocolo de Fase 1 está listo — Jesús Stecler",
      htmlContent: `<div style="background:#0f1a14;color:#F0EDE8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;"><h1 style="font-size:28px;margin:16px 0;">Hola ${nombre}, tu Fase 1 está lista.</h1><div style="text-align:center;margin:32px 0;"><a href="${PDF_URL}" style="background:#1D9E75;color:#fff;padding:16px 32px;border-radius:8px;font-size:16px;font-weight:bold;text-decoration:none;">Descargar Fase 1 — Gratis</a></div><p style="color:#4a6a55;font-size:12px;text-align:center;">Instagram: @jesus_stecler | jesusstecler.com</p></div>`
    })
  });
  return emailResp.ok ? { statusCode: 200, body: '{"ok":true}' } : { statusCode: 500, body: '{"ok":false}' };
};
