const crypto=require('crypto');
function secret(){return process.env.SESSION_SECRET||'change-this-session-secret'}
function sign(payload){const body=Buffer.from(JSON.stringify(payload)).toString('base64url');const sig=crypto.createHmac('sha256',secret()).update(body).digest('base64url');return body+'.'+sig}
function verify(token){try{const [body,sig]=String(token||'').split('.');if(!body||!sig)return null;const expected=crypto.createHmac('sha256',secret()).update(body).digest('base64url');if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;const p=JSON.parse(Buffer.from(body,'base64url').toString());if(!p.exp||Date.now()>p.exp)return null;return p}catch{return null}}
function cookies(req){const out={};for(const part of (req.headers.cookie||'').split(';')){const i=part.indexOf('=');if(i>0)out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim())}return out}
function isAuthed(req){return !!verify(cookies(req).elite_portal)}
function cookieHeader(token,maxAge=28800){return `elite_portal=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}
function clearCookie(){return 'elite_portal=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'}
function json(res,status,data,headers={}){res.statusCode=status;Object.entries({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}).forEach(([k,v])=>res.setHeader(k,v));res.end(JSON.stringify(data))}
function supabase(){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Supabase is not configured.');return {url:key?url.replace(/\/$/,''):url,key}}
async function sb(path,opt={}){const {url,key}=supabase();const r=await fetch(url+'/rest/v1/'+path,{...opt,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation',...(opt.headers||{})}});const text=await r.text();let data;try{data=text?JSON.parse(text):null}catch{data=text}if(!r.ok){const e=new Error(data?.message||data?.error||'Database request failed');e.status=r.status;throw e}return data}
async function purge(){await sb('leads?created_at=lt.'+encodeURIComponent(new Date(Date.now()-60*86400000).toISOString()),{method:'DELETE'})}
module.exports={sign,verify,isAuthed,cookieHeader,clearCookie,json,sb,purge}
