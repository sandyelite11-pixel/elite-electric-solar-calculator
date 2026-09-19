const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const S={
 step:1,zip:"",bill:165,sqft:2200,heating:"gas",orientation:"south",shade:10,roof:"normal",leadKey:null,calc:null,
 goal:"essential",resilience:true,
 loads:{fridge:true,lights:true,wifi:true,tv:false,fans:false,microwave:false,washer:false,ac:false,heat:false}
};
const applianceData=[
 {id:"fridge",n:"Refrigerator",w:180,h:8,d:"Cycling appliance"},
 {id:"lights",n:"LED lights",w:180,h:5,d:"Essential lighting"},
 {id:"wifi",n:"Wi‑Fi / networking",w:35,h:12,d:"Router + modem"},
 {id:"tv",n:"Television",w:120,h:4,d:"Entertainment"},
 {id:"fans",n:"Fans",w:160,h:8,d:"Ceiling / portable"},
 {id:"microwave",n:"Microwave",w:1200,h:.25,d:"Short intermittent load"},
 {id:"washer",n:"Washer",w:500,h:.5,d:"Intermittent load"},
 {id:"ac",n:"Central A/C",w:3500,h:3,d:"Large variable load"},
 {id:"heat",n:"Electric heat / heat pump",w:4500,h:3,d:"Large variable load"}
];
const products=[
 {id:"enphase",name:"Enphase IQ Battery 10C",cap:"10.08 kWh",power:"7.08 kW",rebate:1000,low:9000,high:12000,desc:"AC-coupled storage for homes using Enphase IQ8 solar."},
 {id:"tesla",name:"Tesla Powerwall 3",cap:"13.5 kWh",power:"11.5 kW",rebate:2000,low:11500,high:14500,desc:"Integrated solar inverter with high continuous backup power."},
 {id:"sigenergy",name:"Sigenergy PointGuard / SigenStor",cap:"5–20 kWh",power:"Up to 12 kW*",rebate:2000,low:8500,high:14000,desc:"Scalable storage platform installed by Elite Electric in Utah."}
];
function money(n){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n)}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function setText(id,value){const el=$("#"+id); if(el) el.textContent=value;}
function renderLoads(){
 $("#appliances").innerHTML=applianceData.map(a=>`<label class="appliance"><input type="checkbox" data-load="${a.id}" ${S.loads[a.id]?"checked":""}><div><b>${a.n}</b><small>${a.w.toLocaleString()} W · ${a.d}</small></div></label>`).join("");
 $$("[data-load]").forEach(x=>x.addEventListener("change",()=>{S.loads[x.dataset.load]=x.checked;calculate()}));
}
function loadCalc(){
 let w=0,k=0;
 applianceData.forEach(a=>{if(S.loads[a.id]){w+=a.w;k+=a.w*a.h/1000}});
 const simultaneous=w*(S.goal==="essential"?.52:S.goal==="comfort"?.72:1);
 const daily=k*(S.goal==="essential"?.62:S.goal==="comfort"?.78:1);
 return {w:Math.max(0,simultaneous),k:Math.max(0,daily)};
}
function calculate(){
 S.bill=clamp(Number($("#bill").value)||165,50,2500);S.sqft=clamp(Number($("#sqft").value)||2200,500,15000);S.shade=clamp(Number($("#shade").value)||0,0,35);S.heating=$("#heating").value;
 const orient={south:1,se:.95,ew:.88,north:.68}[S.orientation];
 const roof={normal:1,complex:.94,limited:.90}[S.roof];
 const shade=clamp(1-S.shade/100*.72,.7,1);
 const heatingFactor={gas:1,heatpump:1.12,electric:1.18,mixed:1.06}[S.heating];
 // Editable planning assumptions:
 const sun=Math.max(500,4.8*365*orient*roof*shade);
 const rate=.145;
 const annualUse=Math.max(1,S.bill*12/rate*heatingFactor);
 const target=S.resilience?.92:.86;
 let kw=clamp(annualUse*target/sun,3,25);
 if(S.sqft<1300)kw=Math.min(kw,11);
 if(S.sqft>4500)kw=Math.max(kw,8);
 const production=kw*sun;
 const offset=clamp(production/annualUse*100,0,100);
 const load=loadCalc();
 const min={essential:8,comfort:12,whole:18}[S.goal];
 let battery=Math.max(min,load.k*(S.goal==="whole"?1.35:S.goal==="comfort"?1.55:1.8));
 battery=Math.ceil(battery/2)*2;battery=clamp(battery,8,40);
 const usable=battery*.9;
 const runtime=load.w>0?usable/(load.w/1000):0;
 const solarLow=kw*2000,solarHigh=kw*2625;
 let p=products.find(x=>x.id==="tesla");
 if(load.w<5500 && S.goal==="essential")p=products.find(x=>x.id==="enphase");
 if(battery>=16 || S.goal==="whole")p=products.find(x=>x.id==="sigenergy");
 const projectLow=solarLow+p.low,projectHigh=solarHigh+p.high;
 const annualBill=S.bill*12;
 const twentyFive=Math.max(0,annualBill*offset/100*25);
 const previewKw=$("#previewKw"); if(previewKw) previewKw.innerHTML=kw.toFixed(1)+' <small>kW</small>';
 const liveKw=$("#liveKw"); if(liveKw) liveKw.textContent=kw.toFixed(1)+" kW";
 const liveOffset=$("#liveOffset"); if(liveOffset) liveOffset.textContent=Math.round(offset)+"%";
 const liveBattery=$("#liveBattery"); if(liveBattery) liveBattery.textContent=battery+" kWh";
 const liveLoad=$("#liveLoad"); if(liveLoad) liveLoad.textContent=Math.round(load.w).toLocaleString()+" W";
 const previewOffset=$("#previewOffset"); if(previewOffset) previewOffset.textContent=Math.round(offset)+"%";
 const previewBattery=$("#previewBattery"); if(previewBattery) previewBattery.textContent=battery+" kWh";
 const previewPrice=$("#previewPrice"); if(previewPrice) previewPrice.textContent=money(projectLow)+"+";
 const previewProgress=$("#previewProgress"); if(previewProgress) previewProgress.style.width=offset+"%";
 setText("watts",Math.round(load.w).toLocaleString()+" W");
 setText("daily",load.k.toFixed(1)+" kWh");
 setText("battery",battery+" kWh");
 setText("rKw",kw.toFixed(1)+" kW");setText("rOffset",Math.round(offset)+"%");setText("rBattery",battery+" kWh");
 setText("rProduction",Math.round(production).toLocaleString());
 setText("rAnnual",money(annualBill));
 setText("rRuntime",runtime>=24?Math.round(runtime/24*10)/10+" days":Math.max(.5,Math.round(runtime*10)/10)+" hrs");
 setText("rPrice",money(projectLow)+"–"+money(projectHigh));
 setText("savings25",money(twentyFive));
 $("#savingsText").textContent=`At the modeled ${Math.round(offset)}% energy offset, the calculator estimates roughly ${money(twentyFive)} of electricity spending avoided over 25 years before accounting for utility-rate changes, system degradation, financing and other project costs.`;
 $("#rebatePill").textContent=`Planning RMP rebate: $${p.rebate.toLocaleString()}*`;
 $("#products").innerHTML=products.map(x=>`<article class="product ${x.id===p.id?"recommended":""}">
   <span class="tag">${x.id===p.id?"MODEL MATCH":"EQUIPMENT PATH"}</span><h4>${x.name}</h4><p>${x.desc}</p>
   <div class="spec"><span>Storage</span><b>${x.cap}</b></div><div class="spec"><span>Continuous power</span><b>${x.power}</b></div>
   <div class="spec"><span>Planning rebate*</span><b>$${x.rebate.toLocaleString()}</b></div>
   <div class="range">${money(x.low)}–${money(x.high)}</div>
 </article>`).join("");
 $("#notes").innerHTML=[
   `The model starts from ${money(S.bill)}/month and converts it into estimated annual electricity consumption using an editable ${money(rate)}/kWh planning rate.`,
   `Roof direction, ${S.shade}% modeled shade and roof complexity adjust the solar-production estimate.`,
   `The recommended battery is based on your selected outage goal and the appliances you selected; actual inverter power and starting loads can materially change runtime.`,
   `The project range combines a planning solar range with the selected battery platform's current website-published installation range. Final pricing requires a site assessment.`,
   `RMP incentive figures shown here are planning values from Elite Electric's current website and must be verified for the customer's utility territory, equipment and program rules before a quote is issued.`
 ].map(x=>`<li>${x}</li>`).join("");
 setText("leadSummary",kw.toFixed(1)+" kW · "+Math.round(offset)+"% offset");
 setText("leadBattery",battery+" kWh");
 setText("leadZip",S.zip||"—");
}
function setChoice(group,value){
 $$(group+" .card").forEach(x=>x.classList.toggle("selected",x.dataset.v===value));
}
function go(n){
 S.step=n;
 $$(".screen").forEach(x=>x.classList.toggle("active",Number(x.dataset.screen)===n));
 $$(".step").forEach(x=>{const v=Number(x.dataset.step);x.classList.toggle("active",v===n);x.classList.toggle("done",v<n)});
 const pct=n/5*100;$("#stepText").textContent=n+" / 5";$("#stepPct").textContent=pct+"%";$("#barFill").style.width=pct+"%";
 $("#back").classList.toggle("hidden",n===1);$("#next").classList.toggle("hidden",n===5);
 if(n>=4)calculate();
 window.scrollTo({top:$("#calculator").offsetTop-12,behavior:"smooth"});
}
function valid(){
  if(S.step===1){
    S.zip=$("#zip").value.trim();
    const name=$("#leadName").value.trim();
    const email=$("#leadEmail").value.trim();
    const phone=$("#leadPhone").value.trim();
    if(!/^(84)\d{3}$/.test(S.zip)){alert("Please enter a valid Utah ZIP code beginning with 84.");$("#zip").focus();return false}
    if(S.bill<50){alert("Please enter a monthly bill of at least $50.");$("#bill").focus();return false}
    if(!name){alert("Please enter your name so we can save your estimate.");$("#leadName").focus();return false}
    if(!/^\S+@\S+\.\S+$/.test(email)){alert("Please enter a valid email address.");$("#leadEmail").focus();return false}
    if(phone.replace(/\D/g,"").length<7){alert("Please enter a valid phone number.");$("#leadPhone").focus();return false}
    if(!$("#leadConsent").checked){alert("Please confirm that Elite Electric may contact you about this estimate.");$("#leadConsent").focus();return false}
  }
  return true;
}
function buildLeadPayload(){
  return {
    lead_key:S.leadKey || (S.leadKey=crypto.randomUUID()),
    name:$("#leadName").value.trim(),
    email:$("#leadEmail").value.trim(),
    phone:$("#leadPhone").value.trim(),
    zip:S.zip || $("#zip").value.trim(),
    data:{
      source:"Elite Electric Solar & Battery Calculator",
      step:S.step,
      home:{bill:S.bill,sqft:S.sqft,heating:S.heating},
      roof:{orientation:S.orientation,shade:S.shade,roof:S.roof},
      battery:{goal:S.goal,resilience:S.resilience},
      loads:S.loads,
      estimate:S.calc || null,
      saved_at:new Date().toISOString()
    }
  };
}
async function saveLead(silent=false){
  const status=$("#saveLeadStatus");
  try{
    const r=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(buildLeadPayload())});
    const out=await r.json();
    if(!r.ok) throw new Error(out.error||"Could not save estimate");
    status.textContent="Saved — your estimate is securely stored.";
    status.className="saved";
    if(!silent) setTimeout(()=>{status.textContent=""},5000);
    return true;
  }catch(err){
    console.error(err);
    status.textContent="We couldn't save it right now. You can still continue.";
    status.className="error";
    return false;
  }
}

$$("#orientation .card").forEach(x=>x.onclick=()=>{S.orientation=x.dataset.v;setChoice("#orientation",S.orientation);calculate()});
$$("#roofArea .card").forEach(x=>x.onclick=()=>{S.roof=x.dataset.v;setChoice("#roofArea",S.roof);calculate()});
$$("#goals .goal").forEach(x=>x.onclick=()=>{$$("#goals .goal").forEach(y=>y.classList.remove("selected"));x.classList.add("selected");S.goal=x.dataset.v;calculate()});
$("#shade").oninput=e=>{S.shade=Number(e.target.value);$("#shadeLabel").textContent=S.shade+"% shade";calculate()};
$("#bill").oninput=calculate;$("#sqft").oninput=calculate;$("#heating").onchange=calculate;
$("#resilience").onchange=e=>{S.resilience=e.target.checked;calculate()};
$("#zip").oninput=e=>e.target.value=e.target.value.replace(/\D/g,"").slice(0,5);
$("#reset").onclick=()=>{Object.keys(S.loads).forEach(k=>S.loads[k]=["fridge","lights","wifi"].includes(k));renderLoads();calculate()};
$("#saveLead").onclick=async()=>{if(valid()) await saveLead(false)};
$("#next").onclick=async()=>{
  if(!valid() || S.step>=5) return;
  if(S.step===1){const ok=await saveLead(true); if(!ok) return;}
  else if(S.leadKey){await saveLead(true);}
  go(S.step+1);
};
$("#back").onclick=()=>{if(S.step>1)go(S.step-1)};

function sendEmbedHeight(){
  const height=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  if(window.parent && window.parent!==window){
    window.parent.postMessage({type:"elite-electric-calculator-height",height},"*");
  }
}
window.addEventListener("load",()=>{sendEmbedHeight();setTimeout(sendEmbedHeight,350);setTimeout(sendEmbedHeight,1000);});
window.addEventListener("resize",()=>setTimeout(sendEmbedHeight,100));
window.addEventListener("message",e=>{
  if(!e.data || e.data.type!=="elite-lead-height") return;
  const h=parseInt(e.data.height,10);
  const frame=$("#leadFrame");
  if(frame && h>300 && h<8000){ frame.style.height=(h+12)+"px"; setTimeout(sendEmbedHeight,50); }
});
if(window.ResizeObserver){new ResizeObserver(sendEmbedHeight).observe(document.body);}
function initCalculator(){
  try{
    renderLoads();
    calculate();
    setTimeout(sendEmbedHeight,120);
  }catch(err){
    console.error("Elite Electric calculator initialization failed",err);
    const live=document.querySelector(".live-estimate");
    if(live){live.insertAdjacentHTML("beforeend",'<div style="padding:10px 14px;color:#fff;background:#8a1f1f;font-size:11px">Please refresh the calculator to continue.</div>');}
  }
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",initCalculator,{once:true}); else initCalculator();
