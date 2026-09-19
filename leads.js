const {isAuthed,json,sb,purge}=require('./_lib');
function clean(v,max){return String(v??'').trim().slice(0,max)}
module.exports=async function(req,res){
 try{await purge()}catch(e){if(req.method==='GET'&&isAuthed(req))return json(res,500,{error:e.message})}
 if(req.method==='GET'){if(!isAuthed(req))return json(res,401,{error:'Unauthorized'});try{const rows=await sb('leads?select=*&order=created_at.desc');return json(res,200,{leads:rows||[]})}catch(e){return json(res,500,{error:e.message})}}
 if(req.method==='POST'){
  try{const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):req.body||{};const name=clean(body.name,120),email=clean(body.email,200).toLowerCase(),phone=clean(body.phone,60),zip=clean(body.zip,10);if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.replace(/\D/g,'').length<7||!/^[0-9]{5}$/.test(zip))return json(res,400,{error:'Please provide a valid name, email, phone and 5-digit ZIP code.'});const data=body.data&&typeof body.data==='object'?body.data:{};const row=await sb('leads',{method:'POST',body:JSON.stringify({name,email,phone,zip,data})});return json(res,201,{ok:true,lead:row?.[0]||row})}catch(e){return json(res,500,{error:e.message})}
 }
 return json(res,405,{error:'Method not allowed'});
}
