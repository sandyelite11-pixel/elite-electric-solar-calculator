import crypto from 'node:crypto';

function sign(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function cookie(name, value, maxAge) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const {username, password} = req.body || {};
  const expectedUser = process.env.PORTAL_USER;
  const expectedPassword = process.env.PORTAL_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!expectedUser || !expectedPassword || !secret) return res.status(500).json({error:'Portal is not configured.'});
  const userOk = typeof username === 'string' && username.length===expectedUser.length && crypto.timingSafeEqual(Buffer.from(username), Buffer.from(expectedUser));
  const passOk = typeof password === 'string' && password.length===expectedPassword.length && crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expectedPassword));
  if (!userOk || !passOk) return res.status(401).json({error:'Invalid login.'});
  const token = sign({u: username, exp: Date.now()+8*60*60*1000}, secret);
  res.setHeader('Set-Cookie', cookie('elite_portal_session', token, 8*60*60));
  return res.status(200).json({ok:true});
}
