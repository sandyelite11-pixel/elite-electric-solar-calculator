import crypto from 'node:crypto';

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const part = raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='));
  return part ? decodeURIComponent(part.slice(name.length+1)) : '';
}
function authorized(req) {
  const token = readCookie(req,'elite_portal_session');
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return false;
  const [body,sig] = token.split('.');
  if (!body || !sig) return false;
  const expected = crypto.createHmac('sha256',secret).update(body).digest('base64url');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(body,'base64url').toString()).exp > Date.now(); } catch { return false; }
}
async function sb(path, options={}) {
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url || !key) throw new Error('Database is not configured.');
  const r=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`, 'Content-Type':'application/json', ...(options.headers||{})}});
  const text=await r.text();
  let data; try{data=text?JSON.parse(text):null}catch{data=text}
  if(!r.ok) throw new Error(typeof data==='string'?data:(data?.message||'Database request failed'));
  return data;
}
function sanitizeLead(input={}) {
  return {
    lead_key:String(input.lead_key||'').slice(0,80), name:String(input.name||'').slice(0,120), email:String(input.email||'').slice(0,180), phone:String(input.phone||'').slice(0,60), zip:String(input.zip||'').slice(0,10), data:input.data||{}
  };
}
export default async function handler(req,res){
  try{
    if(req.method==='POST'){
      const lead=sanitizeLead(req.body);
      if(!lead.lead_key) return res.status(400).json({error:'Missing lead key.'});
      if(!lead.name || !lead.email || !lead.phone || !/^84\d{3}$/.test(lead.zip)) return res.status(400).json({error:'Name, email, phone and a valid Utah ZIP are required.'});
      const rows=await sb('leads?on_conflict=lead_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({...lead,updated_at:new Date().toISOString()})});
      return res.status(200).json({ok:true,lead:rows?.[0]||null});
    }
    if(req.method==='GET'){
      if(!authorized(req)) return res.status(401).json({error:'Unauthorized'});
      // Retention: remove anything older than 60 days whenever the portal is opened/refreshed.
      const cutoff=new Date(Date.now()-60*24*60*60*1000).toISOString();
      await sb(`leads?created_at=lt.${encodeURIComponent(cutoff)}`,{method:'DELETE'});
      const rows=await sb('leads?select=*&order=created_at.desc&limit=500',{method:'GET'});
      return res.status(200).json({leads:rows||[]});
    }
    return res.status(405).json({error:'Method not allowed'});
  }catch(e){return res.status(500).json({error:e.message||'Server error'});}
}
