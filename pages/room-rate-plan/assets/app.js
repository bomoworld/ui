
function toast(msg){let t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function closeModal(){document.getElementById('modal').innerHTML=''}

const PLAN_ID=new URLSearchParams(globalThis.location?.search||'').get('plan')||'new';
const RP_KEY=`bomoRatePlanDraftV7:${PLAN_ID}`;
const SAMPLE_RULE_LIBRARY={
 peak:{id:'override-peak',type:'override',name:'Peak stay dates',adjustType:'increase_percent',value:15,start:'2026-07-15',end:'2026-07-20',scope:'All Room Types',rule:'Always',priority:10,active:true},
 weekend:{id:'override-weekend',type:'override',name:'Weekend demand',adjustType:'increase_percent',value:8,start:'2026-07-01',end:'2026-12-31',scope:'All Room Types',rule:'Weekend',priority:20,active:true},
 longStay:{id:'promo-long-stay',type:'promo',name:'3-night stay discount',code:'',adjustType:'decrease_percent',value:10,start:'2026-07-01',end:'2026-12-31',scope:'All Room Types',minNights:3,minBooking:0,priority:20,active:true},
 early:{id:'promo-early',type:'promo',name:'Early booking discount',code:'EARLY15',adjustType:'decrease_percent',value:15,start:'2026-07-01',end:'2026-12-31',scope:'All Room Types',minNights:1,minBooking:0,priority:10,active:true},
 holiday:{id:'override-holiday',type:'override',name:'Christmas and New Year demand',adjustType:'increase_percent',value:25,start:'2026-12-20',end:'2027-01-02',scope:'All Room Types',rule:'Always',priority:10,active:true},
 holidayPromo:{id:'promo-holiday',type:'promo',name:'Holiday package discount',code:'FESTIVE10',adjustType:'decrease_percent',value:10,start:'2026-12-20',end:'2027-01-02',scope:'All Room Types',minNights:3,minBooking:0,priority:10,active:true},
 corporate:{id:'promo-corporate',type:'promo',name:'Corporate preferred discount',code:'CORP10',adjustType:'decrease_percent',value:10,start:'2026-07-01',end:'2026-12-31',scope:'All Room Types',minNights:1,minBooking:0,priority:10,active:true},
 summer:{id:'override-summer',type:'override',name:'Summer weekend demand',adjustType:'increase_percent',value:12,start:'2027-03-01',end:'2027-05-31',scope:'All Room Types',rule:'Weekend',priority:10,active:true},
 summerPromo:{id:'promo-summer',type:'promo',name:'Summer escape discount',code:'SUMMER10',adjustType:'decrease_percent',value:10,start:'2027-03-01',end:'2027-05-31',scope:'All Room Types',minNights:2,minBooking:0,priority:10,active:true}
};
function sampleRules(...keys){return keys.map(key=>({...SAMPLE_RULE_LIBRARY[key]}))}
const SAMPLE_ROOMS={
 deluxe:{name:'Deluxe King Room',code:'DLX-KING',basicRate:5000},
 twin:{name:'Premier Twin Room',code:'PRM-TWIN',basicRate:5800},
 suite:{name:'Executive Suite',code:'EXE-SUITE',basicRate:8500}
};
const baseDefaultState={
 ratePlanName:'',ratePlanCode:'',description:'',roomTypes:'All Room Types',
 startDate:'2026-07-09',endDate:'2026-12-31',noEndDate:false,
 cancellation:'Free Cancellation',payment:'Full Payment',partialPaymentValue:20,balanceCollection:'property',meals:'Breakfast Included',addons:['Extra bed'],
 baseRate:'3500.00',platformFee:'10',status:'Draft',planStatus:'draft',planRole:'conditional',planPriority:100,minAdvanceDays:0,planMinNights:1,applicationType:'weekdays',applicationDays:['Sat','Sun'],overrideResolution:'priority',promoResolution:'best',
 rateAdjustments:sampleRules('peak','weekend','early','longStay')
};
const PLAN_PRESETS={
 standard:{ratePlanName:'Flexible Rate',ratePlanCode:'FLEX',description:'Everyday fallback rate with free cancellation and breakfast.',planStatus:'active',planRole:'default',planPriority:999,applicationType:'daily',cancellation:'Free Cancellation',payment:'Full Payment',meals:'Breakfast Included',addons:['Extra bed','Late check-out'],rateAdjustments:sampleRules('weekend','longStay')},
 weekend:{ratePlanName:'Weekend Escape',ratePlanCode:'WKND-ESCAPE',description:'Weekend offer for couples staying two nights or longer.',planStatus:'active',planRole:'conditional',planPriority:20,minAdvanceDays:0,planMinNights:2,applicationType:'weekdays',applicationDays:['Fri','Sat','Sun'],roomMode:'selected',selectedRooms:[SAMPLE_ROOMS.deluxe,SAMPLE_ROOMS.twin],cancellation:'Partial Refund',payment:'Pay at Property',partialPaymentValue:20,balanceCollection:'property',meals:'Breakfast Included',addons:['Late check-out'],rateAdjustments:sampleRules('weekend','longStay')},
 holiday:{ratePlanName:'Christmas & New Year',ratePlanCode:'FESTIVE',description:'Peak-season package for stays from December 20 to January 2.',planStatus:'scheduled',planRole:'conditional',planPriority:10,startDate:'2026-12-20',endDate:'2027-01-02',planMinNights:3,applicationType:'daily',roomMode:'selected',selectedRooms:[SAMPLE_ROOMS.deluxe,SAMPLE_ROOMS.suite],cancellation:'No Refund',payment:'Partial Payment',partialPaymentValue:50,balanceCollection:'before_checkin',meals:'Half Board',addons:['Airport transfer'],rateAdjustments:sampleRules('holiday','holidayPromo')},
 corporate:{ratePlanName:'Corporate Preferred',ratePlanCode:'CORP-PREF',description:'Negotiated weekday rate for approved company travelers.',planStatus:'paused',planRole:'conditional',planPriority:30,applicationType:'weekdays',applicationDays:['Mon','Tue','Wed','Thu','Fri'],roomMode:'selected',selectedRooms:[SAMPLE_ROOMS.twin,SAMPLE_ROOMS.suite],cancellation:'Free Cancellation',payment:'Pay at Property',partialPaymentValue:10,balanceCollection:'property',meals:'Breakfast Included',addons:['Airport transfer','Late check-out'],rateAdjustments:sampleRules('corporate')},
 advance:{ratePlanName:'Early Bird — 30 Days',ratePlanCode:'EARLY-30',description:'Automatic discount for reservations made at least 30 days before check-in.',planStatus:'active',planRole:'conditional',planPriority:40,minAdvanceDays:30,applicationType:'daily',roomMode:'selected',selectedRooms:[SAMPLE_ROOMS.twin],cancellation:'No Refund',payment:'Full Payment',meals:'Breakfast Included',addons:[],rateAdjustments:sampleRules('early')},
 summer:{ratePlanName:'Summer Escape',ratePlanCode:'SUMMER',description:'Two-night seasonal offer for stays from March through May.',planStatus:'draft',planRole:'conditional',planPriority:50,startDate:'2027-03-01',endDate:'2027-05-31',planMinNights:2,applicationType:'daily',roomMode:'selected',selectedRooms:[SAMPLE_ROOMS.deluxe,SAMPLE_ROOMS.suite],cancellation:'Partial Refund',payment:'Pay at Property',partialPaymentValue:25,balanceCollection:'property',meals:'Breakfast Included',addons:['Airport transfer','Late check-out'],rateAdjustments:sampleRules('summer','summerPromo')}
};
const defaultState={...baseDefaultState,...(PLAN_PRESETS[PLAN_ID]||{})};
function getState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(RP_KEY)||'{}')}}catch(e){return {...defaultState}}}
function setState(patch){const state={...getState(),...patch};localStorage.setItem(RP_KEY,JSON.stringify(state));return state}
function formatDate(v){if(!v)return '-';const d=new Date(v+'T00:00:00');return d.toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'})}
function bindState(){
 const state=getState();
 document.querySelectorAll('[data-summary]').forEach(el=>{
   const key=el.dataset.summary;
   if(state[key]!==undefined && state[key]!=='' && el.id!=='startDate') el.value=state[key];
   el.addEventListener('input',()=>setState({[key]:el.value}));
   el.addEventListener('change',()=>setState({[key]:el.value}));
 });
}
document.addEventListener('DOMContentLoaded',bindState);
function initGuestPolicies(){
 const state=getState();
 const cancellationCards=[...document.querySelectorAll('.cancellation-policy-options .choice')];
 cancellationCards.forEach(card=>{
  const input=card.querySelector('input');
  input.checked=input.value===state.cancellation;
  card.classList.toggle('selected',input.checked);
  input.addEventListener('change',()=>{
   cancellationCards.forEach(item=>item.classList.toggle('selected',item.querySelector('input').checked));
   setState({cancellation:input.value});
  });
 });

 const paymentCards=[...document.querySelectorAll('.payment-policy-options .choice')];
 const paymentFields=document.getElementById('partialPaymentFields');
 const paymentTitle=document.getElementById('paymentConfigTitle');
 const paymentText=document.getElementById('paymentConfigText');
 const paymentBadge=document.getElementById('paymentStatusBadge');
 const paymentLabel=document.getElementById('partialPaymentLabel');
 const depositValue=document.getElementById('partialValue');
 const balance=document.getElementById('balanceCollection');
 const notice=document.getElementById('payAtPropertyNotice');
 if(paymentCards.length&&paymentFields&&depositValue&&balance){
  depositValue.value=Number(state.partialPaymentValue)||20;
  balance.value=state.balanceCollection||'property';
  function renderPayment(policy){
   paymentCards.forEach(card=>{
    const input=card.querySelector('input');
    input.checked=input.value===policy;
    card.classList.toggle('selected',input.checked);
   });
   const isPartial=policy==='Partial Payment';
   const isProperty=policy==='Pay at Property';
   paymentFields.classList.toggle('hidden',!isPartial&&!isProperty);
   notice.classList.toggle('hidden',!isProperty);
   balance.disabled=isProperty;
   if(isProperty){
    balance.value='property';
    paymentTitle.textContent='Pay at property';
    paymentText.textContent='Collect a required deposit online, then collect the balance at check-in.';
    paymentBadge.textContent='Deposit + balance on-site';
    paymentLabel.textContent='Deposit required';
   }else if(isPartial){
    paymentTitle.textContent='Partial payment';
    paymentText.textContent='Collect part of the total online and schedule the remaining balance.';
    paymentBadge.textContent='Split payment';
    paymentLabel.textContent='Amount due at booking';
   }else{
    paymentTitle.textContent='Full payment online';
    paymentText.textContent='The full booking amount will be collected online.';
    paymentBadge.textContent='100% online';
   }
   setState({payment:policy,partialPaymentValue:Number(depositValue.value)||20,balanceCollection:balance.value});
  }
  paymentCards.forEach(card=>card.querySelector('input').addEventListener('change',event=>renderPayment(event.currentTarget.value)));
  depositValue.addEventListener('input',()=>{
   const value=Math.min(99,Math.max(1,Number(depositValue.value)||1));
   depositValue.value=value;
   setState({partialPaymentValue:value});
  });
  balance.addEventListener('change',()=>setState({balanceCollection:balance.value}));
  renderPayment(paymentCards.some(card=>card.querySelector('input').value===state.payment)?state.payment:'Full Payment');
 }

 const addonInputs=[...document.querySelectorAll('[data-addon]')];
 const selectedAddons=new Set(Array.isArray(state.addons)?state.addons:[]);
 addonInputs.forEach(input=>{
  input.checked=selectedAddons.has(input.dataset.addon);
  input.addEventListener('change',()=>setState({addons:addonInputs.filter(item=>item.checked).map(item=>item.dataset.addon)}));
 });
}
document.addEventListener('DOMContentLoaded',initGuestPolicies);
function initPlanMeta(){
 const status=document.getElementById('planStatus');
 const badge=document.getElementById('planStatusBadge');
 const role=document.getElementById('planRole');
 const priority=document.getElementById('planPriority');
 if(!status||!badge||!role||!priority)return;
 const labels={draft:'Draft',active:'Active',scheduled:'Scheduled',paused:'Paused',archived:'Archived'};
 function renderStatus(){
  badge.textContent=labels[status.value]||'Draft';
  badge.dataset.status=status.value;
 }
 function renderRole(){
  const fallback=role.value==='default';
  if(fallback)priority.value=999;
  priority.disabled=fallback;
  priority.closest('label')?.classList.toggle('is-disabled',fallback);
  setState({planRole:role.value,planPriority:Number(priority.value)||999});
 }
 status.addEventListener('change',renderStatus);
 role.addEventListener('change',renderRole);
 ['minAdvanceDays','planMinNights'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>{
  const minAdvance=document.getElementById('minAdvanceDays'),minStay=document.getElementById('planMinNights');
  setState({minAdvanceDays:Number(minAdvance.value),planMinNights:Number(minStay.value)});
 }));
 document.querySelector('.form-header h1').textContent=PLAN_ID==='new'?'Create rate plan':`Edit ${getState().ratePlanName||'rate plan'}`;
 renderStatus();renderRole();
}
document.addEventListener('DOMContentLoaded',initPlanMeta);
function validateCurrentStep(){
 const step=Number(document.body.dataset.step||1);let ok=true;
 document.querySelectorAll('.field-message').forEach(e=>e.remove());document.querySelectorAll('.field-error').forEach(e=>e.classList.remove('field-error'));
 if(step===1){
  [['ratePlanName','Enter a rate plan name.']].forEach(([id,msg])=>{
   const el=document.getElementById(id);if(el&&!el.value.trim()){ok=false;el.classList.add('field-error');el.insertAdjacentHTML('afterend',`<span class="field-message">${msg}</span>`)}
  })
 }
 return ok
}
function initRoomSelection(){
 const modes=[...document.querySelectorAll('input[name="roomMode"]')];
 const rows=[...document.querySelectorAll('.room-select-row')];
 if(!modes.length||!rows.length)return;
 const state=getState();
 const search=document.getElementById('roomSearch');
 const count=document.getElementById('selectedRoomCount');

 function selectedRooms(){
   return rows.filter(r=>r.querySelector('.room-checkbox').checked).map(r=>({
     name:r.dataset.roomName,code:r.dataset.roomCode,basicRate:Number(r.dataset.rate)
   }));
 }
 function update(){
   const mode=document.querySelector('input[name="roomMode"]:checked')?.value||'all';
   document.querySelectorAll('.mode-option').forEach(x=>x.classList.toggle('selected',x.querySelector('input').checked));
   rows.forEach(row=>{
     const cb=row.querySelector('.room-checkbox');
     if(mode==='all')cb.checked=true;
     row.classList.toggle('selected',cb.checked);
     row.querySelector('.room-status').textContent=cb.checked?'Included':'Excluded';
     cb.disabled=mode==='all';
   });
   const selected=selectedRooms();
   count.textContent=selected.length;
   const label=mode==='all'?'All Room Types':selected.length===1?selected[0].name:`${selected.length} Selected Rooms`;
   setState({roomTypes:label,roomMode:mode,selectedRooms:selected});
 }
 const savedMode=state.roomMode||'all';
 const modeInput=document.querySelector(`input[name="roomMode"][value="${savedMode}"]`);
 if(modeInput)modeInput.checked=true;
 if(savedMode==='selected'&&Array.isArray(state.selectedRooms)){
   const codes=new Set(state.selectedRooms.map(r=>r.code));
   rows.forEach(r=>r.querySelector('.room-checkbox').checked=codes.has(r.dataset.roomCode));
 }
 modes.forEach(r=>r.addEventListener('change',update));
 rows.forEach(row=>row.querySelector('.room-checkbox').addEventListener('change',update));
 document.getElementById('selectAllRooms')?.addEventListener('click',()=>{rows.forEach(r=>r.querySelector('.room-checkbox').checked=true);update()});
 document.getElementById('clearRooms')?.addEventListener('click',()=>{
   const selectedMode=document.querySelector('input[name="roomMode"][value="selected"]');selectedMode.checked=true;
   rows.forEach(r=>r.querySelector('.room-checkbox').checked=false);update()
 });
 search?.addEventListener('input',()=>{
   const q=search.value.toLowerCase().trim();
   rows.forEach(r=>r.classList.toggle('hidden-room',!(`${r.dataset.roomName} ${r.dataset.roomCode}`.toLowerCase().includes(q))))
 });
 update();
}
document.addEventListener('DOMContentLoaded',initRoomSelection);

function initRatePlanApplication(){
 const radios=[...document.querySelectorAll('input[name="applicationType"]')];
 if(!radios.length)return;
 const badge=document.getElementById('scheduleBadge');
 const dayInputs=[...document.querySelectorAll('#dayPicker input')];
 const state=getState();
 function selectedDays(){return dayInputs.filter(i=>i.checked).map(i=>i.value)}
 function updateBadge(type){
   if(type==='daily')badge.textContent='Every day';
   if(type==='weekdays')badge.textContent=selectedDays().join(' & ')||'Select days';
   if(type==='range')badge.textContent='Date range';
   if(type==='custom')badge.textContent='Custom dates';
 }
 function render(type){
   document.querySelectorAll('.application-option').forEach(x=>x.classList.toggle('selected',x.querySelector('input').value===type));
   document.querySelectorAll('[data-application-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.applicationPanel!==type));
   updateBadge(type);setState({applicationType:type,applicationDays:selectedDays()});
 }
 if(state.applicationType){const saved=document.querySelector(`input[name="applicationType"][value="${state.applicationType}"]`);if(saved)saved.checked=true}
 if(Array.isArray(state.applicationDays)&&state.applicationDays.length)dayInputs.forEach(i=>i.checked=state.applicationDays.includes(i.value));
 radios.forEach(r=>r.addEventListener('change',()=>render(r.value)));
 dayInputs.forEach(i=>i.addEventListener('change',()=>render('weekdays')));
 document.getElementById('weekendPreset')?.addEventListener('click',()=>{dayInputs.forEach(i=>i.checked=['Sat','Sun'].includes(i.value));render('weekdays')});
 document.getElementById('addCustomDate')?.addEventListener('click',()=>{
   const input=document.getElementById('customDate');if(!input.value)return;
   const d=new Date(input.value+'T00:00:00');const label=d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
   const btn=document.createElement('button');btn.type='button';btn.innerHTML=`${label} <span>×</span>`;btn.addEventListener('click',()=>btn.remove());document.getElementById('customDateList').appendChild(btn)
 });
 document.querySelectorAll('#customDateList button').forEach(b=>b.addEventListener('click',()=>b.remove()));
 render(document.querySelector('input[name="applicationType"]:checked').value);
}
document.addEventListener('DOMContentLoaded',initRatePlanApplication);


function initValidityPeriod(){
 const start=document.getElementById('startDate');
 const end=document.getElementById('endDate');
 const noEnd=document.getElementById('noEndDate');
 if(!start||!end||!noEnd)return;
 const state=getState();
 if(state.startDate)start.value=state.startDate;
 if(state.endDate)end.value=state.endDate;
 noEnd.checked=Boolean(state.noEndDate);
  function sync(){
   end.min=start.value;
   if(noEnd.checked)start.removeAttribute('max');else if(end.value)start.max=end.value;
   end.disabled=noEnd.checked;
   end.closest('label')?.classList.toggle('is-disabled',noEnd.checked);
   setState({startDate:start.value,endDate:end.value,noEndDate:noEnd.checked});
 }
 start.addEventListener('change',()=>{if(end.value&&end.value<start.value)end.value=start.value;sync()});
 end.addEventListener('change',sync);
 noEnd.addEventListener('change',sync);
 sync();
}
document.addEventListener('DOMContentLoaded',initValidityPeriod);

document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('footer a.btn.primary[href]').forEach(link=>{
   link.addEventListener('click',e=>{
     if(!validateCurrentStep()){
       e.preventDefault();
       document.querySelector('.field-error')?.scrollIntoView({behavior:'smooth',block:'center'});
       toast('Please complete the required fields');
     }
   });
 });
});

function adjustmentItems(state=getState()){
 return Array.isArray(state.rateAdjustments)?state.rateAdjustments:[];
}
function escapeText(value){
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function adjustmentValue(item){
 const amount=Number(item.value||0).toLocaleString('en-PH');
 if(item.adjustType==='increase_percent')return `Increase ${amount}%`;
 if(item.adjustType==='decrease_percent')return `Discount ${amount}%`;
 if(item.adjustType==='increase_fixed')return `Add ₱${amount}`;
 if(item.adjustType==='decrease_fixed')return `Discount ₱${amount}`;
 return `Fixed at ₱${amount}`;
}
function adjustmentDates(item){
 return `${formatDate(item.start)} – ${formatDate(item.end)}`;
}
function openAdjustmentModal(type='override',id=''){
 const item=adjustmentItems().find(rule=>rule.id===id)||{type,name:'',code:'',adjustType:type==='promo'?'decrease_percent':'increase_percent',value:'',start:'',end:'',scope:'All Room Types',rule:'Always',priority:100,minNights:1,minBooking:0,active:true};
 const label=type==='promo'?'promo rate':'date override';
 document.getElementById('modal').innerHTML=`<div class="modal-bg"><form class="modal adjustment-modal" onsubmit="saveRateAdjustment(event)">
  <div class="modal-heading"><div><h2>${id?'Edit':'Add'} ${label}</h2><p>${type==='promo'?'Set the discount and booking eligibility.':'Set the price change, stay dates and selection priority.'}</p></div><button type="button" class="modal-close" onclick="closeModal()" aria-label="Close">×</button></div>
  <input type="hidden" name="id" value="${escapeText(id)}">
  <input type="hidden" name="type" value="${type}">
  <div class="modal-form">
   <label>${type==='promo'?'Promo name':'Override name'}<input name="name" value="${escapeText(item.name)}" placeholder="${type==='promo'?'e.g. Stay 3, save 10%':'e.g. Holiday peak'}" required></label>
   <label data-promo-field><span class="field-label">Promo code <span class="field-optional">Optional</span></span><input name="code" value="${escapeText(item.code)}" placeholder="e.g. SAVE15"></label>
   <div class="grid2 modal-grid"><label>Price change<select name="adjustType" id="adjustAction" data-value="${escapeText(item.adjustType)}"></select></label><label>Amount<div class="suffix"><input name="value" type="number" min="0" step="0.01" value="${escapeText(item.value)}" required><span id="adjustSuffix">%</span></div></label></div>
   <div class="grid2 modal-grid modal-date-range"><label class="date-field"><span>Start date <small class="field-optional">First eligible stay date</small></span><input name="start" type="date" value="${escapeText(item.start)}" required></label><label class="date-field"><span>End date <small class="field-optional">Last eligible stay date</small></span><input name="end" type="date" value="${escapeText(item.end)}" min="${escapeText(item.start)}" required></label></div>
   <label>Rooms<select name="scope"><option ${item.scope==='All Room Types'?'selected':''}>All Room Types</option><option ${item.scope==='Selected Room Types'?'selected':''}>Selected Room Types</option></select></label>
   <div class="grid2 modal-grid" data-override-fields><label>Applies on<select name="rule"><option ${item.rule==='Always'?'selected':''}>Always</option><option ${item.rule==='Weekend'?'selected':''}>Weekend</option><option ${item.rule==='Weekday'?'selected':''}>Weekday</option></select></label><label><span class="field-label">Priority <span class="field-optional">Smaller number applies first</span></span><input name="priority" type="number" min="1" value="${escapeText(item.priority??100)}"></label></div>
   <div class="grid3 modal-grid" data-promo-fields><label>Minimum nights<input name="minNights" type="number" min="1" value="${escapeText(item.minNights??1)}"></label><label>Minimum booking<input name="minBooking" type="number" min="0" value="${escapeText(item.minBooking??0)}"></label><label><span class="field-label">Priority <span class="field-optional">Smaller number applies first</span></span><input name="promoPriority" type="number" min="1" value="${escapeText(item.priority??100)}"></label></div>
  </div>
  <div class="modal-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" type="submit">${id?'Save changes':'Add'}</button></div>
 </form></div>`;
 syncAdjustmentForm();
}
function syncAdjustmentForm(){
 const form=document.querySelector('.adjustment-modal');if(!form)return;
 const type=form.elements.type.value;
 form.querySelector('[data-promo-field]').hidden=type!=='promo';
 form.querySelector('[data-promo-fields]').hidden=type!=='promo';
 form.querySelector('[data-override-fields]').hidden=type!=='override';
 const action=form.querySelector('#adjustAction');
 const current=action.dataset.value||action.value;
 const options=type==='promo'
  ?[['decrease_percent','Percentage off'],['decrease_fixed','Fixed amount off']]
  :[['increase_percent','Increase by percentage'],['decrease_percent','Decrease by percentage'],['increase_fixed','Add fixed amount'],['decrease_fixed','Subtract fixed amount'],['fixed','Set fixed nightly price']];
 action.innerHTML=options.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');
 action.value=options.some(([value])=>value===current)?current:options[0][0];
 action.dataset.value='';
 const updateSuffix=()=>form.querySelector('#adjustSuffix').textContent=action.value.includes('percent')?'%':'₱';
 action.onchange=updateSuffix;updateSuffix();
 const ruleStart=form.elements.start,ruleEnd=form.elements.end;
 ruleStart.addEventListener('change',()=>{ruleEnd.min=ruleStart.value;if(ruleEnd.value&&ruleEnd.value<ruleStart.value)ruleEnd.value=ruleStart.value});
}
function saveRateAdjustment(event){
 event.preventDefault();
 const data=new FormData(event.currentTarget);
 if(data.get('end')<data.get('start')){toast('End date must be after start date');return}
 const state=getState();
 const items=[...adjustmentItems(state)];
 const id=data.get('id')||`rate-${Date.now()}`;
 const type=data.get('type');
 const item={id,type,name:data.get('name').trim(),code:type==='promo'?data.get('code').trim().toUpperCase():'',adjustType:data.get('adjustType'),value:Number(data.get('value')),start:data.get('start'),end:data.get('end'),scope:data.get('scope'),rule:type==='override'?data.get('rule'):'Always',priority:Number(type==='promo'?data.get('promoPriority'):data.get('priority'))||100,minNights:type==='promo'?Number(data.get('minNights'))||1:1,minBooking:type==='promo'?Number(data.get('minBooking'))||0:0,active:true};
 const index=items.findIndex(rule=>rule.id===id);
 if(index>=0)items[index]=item;else items.push(item);
 setState({rateAdjustments:items});
 closeModal();renderAdjustments();
 toast(index>=0?`${type==='promo'?'Promo':'Override'} updated`:`${type==='promo'?'Promo':'Override'} added`);
}
function saveRatePlanAndExit(){
 if(!validateCurrentStep()){
  document.querySelector('.field-error')?.scrollIntoView({behavior:'smooth',block:'center'});
  toast('Enter a rate plan name');
  return;
 }
 const selectedRooms=getState().selectedRooms;
 if(getState().roomMode==='selected'&&(!Array.isArray(selectedRooms)||selectedRooms.length===0)){
  document.getElementById('roomSelectionPanel')?.scrollIntoView({behavior:'smooth',block:'center'});
  toast('Select at least one room');
  return;
 }
 setState({});toast('Rate plan saved');
 setTimeout(()=>window.location.href='index.html',500);
}
function openRuleDetails(id){
 const item=adjustmentItems().find(rule=>rule.id===id);if(!item)return;
 const isPromo=item.type==='promo';
 const details=[
  ['Price',adjustmentValue(item)],
  [isPromo?'Validity':'Stay dates',adjustmentDates(item)],
  ['Rooms',item.scope||'All Room Types'],
  [isPromo?'Minimum stay':'Applies on',isPromo?`${item.minNights||1} night${Number(item.minNights||1)===1?'':'s'}`:(item.rule||'Always')],
  ['Priority',item.priority||100]
 ];
 if(isPromo)details.splice(1,0,['Promo code',item.code||'Automatic promo'],['Minimum booking',formatMoney(item.minBooking||0)]);
 document.getElementById('modal').innerHTML=`<div class="modal-bg"><div class="modal rule-view-modal">
  <div class="modal-heading"><div><span class="view-rule-type">${isPromo?'Promo rate':'Date override'}</span><h2>${escapeText(item.name)}</h2></div><button type="button" class="modal-close" onclick="closeModal()" aria-label="Close">×</button></div>
  <dl>${details.map(([label,value])=>`<div><dt>${escapeText(label)}</dt><dd>${escapeText(value)}</dd></div>`).join('')}</dl>
  <div class="modal-actions"><button type="button" class="btn" onclick="closeModal()">Close</button><button type="button" class="btn primary" onclick="openAdjustmentModal('${item.type}','${escapeText(item.id)}')">Edit ${isPromo?'promo':'override'}</button></div>
 </div></div>`;
}
function removeRateAdjustment(id){
 if(!window.confirm('Remove this override or promo?'))return;
 const items=adjustmentItems().filter(item=>item.id!==id);
 setState({rateAdjustments:items});renderAdjustments();toast('Rate rule removed');
}
function renderAdjustments(){
 ['override','promo'].forEach(type=>{
  const list=document.getElementById(`${type}List`);if(!list)return;
  const items=adjustmentItems().filter(item=>item.type===type);
  list.innerHTML=items.length?items.map(item=>`<tr>
   <td><div class="table-rule-name"><span class="rule-icon ${type}">${type==='promo'?'%':'↗'}</span><div><b>${escapeText(item.name)}</b>${item.code?`<code>${escapeText(item.code)}</code>`:''}</div></div></td>
   <td><b>${escapeText(adjustmentValue(item))}</b></td>
   <td>${escapeText(adjustmentDates(item))}</td>
   <td><div class="rule-meta"><b>${type==='promo'?`${Number(item.minNights||1)}+ night${Number(item.minNights||1)===1?'':'s'}${Number(item.minBooking||0)>0?` · ${escapeText(formatMoney(item.minBooking))} min`:''}`:escapeText(item.rule||'Always')}</b><small>Priority ${escapeText(item.priority||100)} · ${escapeText(item.scope)}</small></div></td>
   <td><div class="row-actions"><button type="button" onclick="openRuleDetails('${escapeText(item.id)}')">View</button><button type="button" onclick="openAdjustmentModal('${type}','${escapeText(item.id)}')">Edit</button><button type="button" class="danger" onclick="removeRateAdjustment('${escapeText(item.id)}')" aria-label="Remove ${escapeText(item.name)}">Remove</button></div></td>
  </tr>`).join(''):`<tr class="empty-rule-row"><td colspan="5">No ${type==='promo'?'promo rates':'date overrides'} added.</td></tr>`;
 });
 updateSimulatorPresetLabels();
 runRateSimulation();
}
function addRuleSample(type){
 const state=getState();
 const items=adjustmentItems(state);
 const planStart=state.startDate||'0000-01-01';
 const planEnd=state.noEndDate?'9999-12-31':(state.endDate||'9999-12-31');
 const candidates=Object.values(SAMPLE_RULE_LIBRARY)
  .filter(item=>item.type===type&&!items.some(existing=>existing.id===item.id))
  .sort((a,b)=>{
   const aOverlaps=a.end>=planStart&&a.start<=planEnd;
   const bOverlaps=b.end>=planStart&&b.start<=planEnd;
   return Number(bOverlaps)-Number(aOverlaps);
  });
 const sample=candidates[0];
 if(!sample){
  toast(`All sample ${type==='promo'?'promos':'overrides'} are already added`);
  return;
 }
 setState({rateAdjustments:[...items,{...sample}]});
 renderAdjustments();
 toast(`Sample ${type==='promo'?'promo':'override'} added: ${sample.name}`);
}
function initAdjustments(){
 if(!document.getElementById('overrideList'))return;
 document.querySelectorAll('[data-add-rule]').forEach(button=>button.addEventListener('click',()=>openAdjustmentModal(button.dataset.addRule)));
 document.querySelectorAll('[data-add-rule-sample]').forEach(button=>button.addEventListener('click',()=>addRuleSample(button.dataset.addRuleSample)));
 document.querySelector('[data-load-rule-samples]')?.addEventListener('click',()=>{
  setState({rateAdjustments:defaultState.rateAdjustments.map(item=>({...item}))});
  renderAdjustments();toast('Example overrides and promos restored');
 });
 renderAdjustments();
}
document.addEventListener('DOMContentLoaded',initAdjustments);

const SIM_ROOMS={
 'DLX-KING':{name:'Deluxe King Room',rate:5000,maxGuests:2},
 'PRM-TWIN':{name:'Premier Twin Room',rate:5800,maxGuests:2},
 'EXE-SUITE':{name:'Executive Suite',rate:8500,maxGuests:3}
};
function formatMoney(value){
 return `₱${Number(value||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
}
function applyRateRule(rate,item){
 const value=Number(item.value||0);
 if(item.adjustType==='increase_percent')return rate+(rate*value/100);
 if(item.adjustType==='decrease_percent')return Math.max(0,rate-(rate*value/100));
 if(item.adjustType==='increase_fixed')return rate+value;
 if(item.adjustType==='decrease_fixed')return Math.max(0,rate-value);
 return Math.max(0,value);
}
function roomMatchesScope(item,roomCode,state){
 if(!item.scope||item.scope==='All Room Types')return true;
 return Array.isArray(state.selectedRooms)&&state.selectedRooms.some(room=>room.code===roomCode);
}
function dateMatchesRule(item,dateValue){
 if(!dateValue||dateValue<item.start||dateValue>item.end)return false;
 if(!item.rule||item.rule==='Always')return true;
 const day=new Date(`${dateValue}T00:00:00`).getDay();
 if(item.rule==='Weekend')return day===0||day===6;
 if(item.rule==='Weekday')return day>=1&&day<=5;
 return true;
}
function chooseOverride(candidates,resolution,baseRate,manualId){
 if(manualId&&manualId!=='auto')return candidates.find(item=>item.id===manualId)||null;
 const ranked=[...candidates];
 if(resolution==='highest')ranked.sort((a,b)=>applyRateRule(baseRate,b)-applyRateRule(baseRate,a));
 else if(resolution==='lowest')ranked.sort((a,b)=>applyRateRule(baseRate,a)-applyRateRule(baseRate,b));
 else ranked.sort((a,b)=>(Number(a.priority)||100)-(Number(b.priority)||100));
 return ranked[0]||null;
}
function promoDiscountForRate(rate,item){
 if(item.adjustType==='decrease_fixed')return Math.min(rate,Number(item.value)||0);
 return Math.min(rate,rate*(Number(item.value)||0)/100);
}
function choosePromo(candidates,resolution,rate,manualId){
 if(manualId&&manualId!=='auto')return candidates.find(item=>item.id===manualId)||null;
 const ranked=[...candidates];
 if(resolution==='priority')ranked.sort((a,b)=>(Number(a.priority)||100)-(Number(b.priority)||100));
 else ranked.sort((a,b)=>promoDiscountForRate(rate,b)-promoDiscountForRate(rate,a));
 return ranked[0]||null;
}
function evaluatePlanEligibility(state,{roomCode,bookedDate,stayDate,nights},{ignoreStatus=false}={}){
 const reasons=[];
 if(!ignoreStatus&&!['active','scheduled'].includes(state.planStatus))reasons.push(`Status is ${state.planStatus||'draft'}`);
 if(state.startDate&&stayDate<state.startDate)reasons.push('Stay is before the plan start date');
 if(!state.noEndDate&&state.endDate&&stayDate>state.endDate)reasons.push('Stay is after the plan end date');
 const advance=Math.floor((new Date(`${stayDate}T00:00:00`)-new Date(`${bookedDate}T00:00:00`))/86400000);
 if(advance<Number(state.minAdvanceDays||0))reasons.push(`Requires ${state.minAdvanceDays}+ advance days`);
 if(nights<Number(state.planMinNights||1))reasons.push(`Requires ${state.planMinNights}+ nights`);
 if(state.roomMode==='selected'&&!roomMatchesScope({scope:'Selected Room Types'},roomCode,state))reasons.push('Room is not included');
 if(state.applicationType==='weekdays'){
  const labels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const day=labels[new Date(`${stayDate}T00:00:00`).getDay()];
  if(!Array.isArray(state.applicationDays)||!state.applicationDays.includes(day))reasons.push(`${day} is not an eligible stay day`);
 }
 return {eligible:reasons.length===0,reasons,advance};
}
function runRateSimulation(){
 const roomSelect=document.getElementById('simRoom');if(!roomSelect)return;
 const state=getState();
 const roomCode=roomSelect.value;
 const room=SIM_ROOMS[roomCode]||SIM_ROOMS['DLX-KING'];
 const bookedDate=document.getElementById('simBookedDate').value;
 const stayDate=document.getElementById('simDate').value;
 const nights=Math.max(1,Number(document.getElementById('simNights').value)||1);
 const rooms=Math.max(1,Number(document.getElementById('simRooms').value)||1);
 const guests=Math.max(1,Number(document.getElementById('simGuests').value)||1);
 const promoCode=document.getElementById('simPromoCode').value.trim().toUpperCase();
 const eligibility=evaluatePlanEligibility(state,{roomCode,bookedDate,stayDate,nights},{ignoreStatus:true});
 const statusPreviewed=!['active','scheduled'].includes(state.planStatus);
 const rules=eligibility.eligible?adjustmentItems(state).filter(item=>item.active!==false&&roomMatchesScope(item,roomCode,state)):[];
 const eligibleOverrides=rules.filter(item=>item.type==='override'&&dateMatchesRule(item,stayDate));
 const choice=document.getElementById('simOverrideChoice');
 const priorChoice=choice.value||'auto';
 const resolution=state.overrideResolution||document.getElementById('overrideResolution')?.value||'priority';
 const autoOverride=chooseOverride(eligibleOverrides,resolution,room.rate,'auto');
 choice.innerHTML='';
 choice.add(new Option(autoOverride?`Automatic — ${autoOverride.name}`:'Automatic — no match','auto'));
 eligibleOverrides.forEach(item=>choice.add(new Option(item.name,item.id)));
 choice.value=eligibleOverrides.some(item=>item.id===priorChoice)?priorChoice:'auto';
 const appliedOverride=chooseOverride(eligibleOverrides,resolution,room.rate,choice.value);
 const effectiveRate=appliedOverride?applyRateRule(room.rate,appliedOverride):room.rate;
 const beforePromo=effectiveRate*nights*rooms;
 const eligiblePromos=rules.filter(item=>{
  if(item.type!=='promo'||stayDate<item.start||stayDate>item.end)return false;
 if(nights<Number(item.minNights||1)||beforePromo<Number(item.minBooking||0))return false;
  return !item.code||item.code===promoCode;
 });
 const promoChoice=document.getElementById('simPromoChoice');
 const priorPromoChoice=promoChoice.value||'auto';
 const promoResolution=state.promoResolution||document.getElementById('promoResolution')?.value||'best';
 const autoPromo=choosePromo(eligiblePromos,promoResolution,effectiveRate,'auto');
 promoChoice.innerHTML='';
 promoChoice.add(new Option(autoPromo?`Automatic — ${autoPromo.name}`:'Automatic — no match','auto'));
 eligiblePromos.forEach(item=>promoChoice.add(new Option(item.name,item.id)));
 promoChoice.value=eligiblePromos.some(item=>item.id===priorPromoChoice)?priorPromoChoice:'auto';
 const appliedPromo=choosePromo(eligiblePromos,promoResolution,effectiveRate,promoChoice.value);
 const promoPerNight=appliedPromo?promoDiscountForRate(effectiveRate,appliedPromo):0;
 const promoDiscount=promoPerNight*nights*rooms;
 const baseTotal=room.rate*nights*rooms;
 const afterOverride=effectiveRate*nights*rooms;
 const guestTotal=Math.max(0,afterOverride-promoDiscount);
 const vat=guestTotal*12/112;
 const platformFee=guestTotal*(Number(state.platformFee||0)/100);
 document.getElementById('simGuestTotal').textContent=formatMoney(guestTotal);
 document.getElementById('simPlanEligibility').textContent=eligibility.eligible?`${statusPreviewed?'Eligible preview':'Eligible'} · ${state.planRole==='default'?'Fallback':`Priority ${state.planPriority}`}`:'Not eligible';
 document.getElementById('simBaseTotal').textContent=formatMoney(baseTotal);
 document.getElementById('simAppliedOverride').textContent=appliedOverride?`${appliedOverride.name} — ${adjustmentValue(appliedOverride)}`:'None';
 document.getElementById('simAfterOverride').textContent=formatMoney(afterOverride);
 document.getElementById('simAppliedPromo').textContent=appliedPromo?`${appliedPromo.name} — ${adjustmentValue(appliedPromo)} · ${appliedPromo.code?`Code ${appliedPromo.code}`:'Automatic'}`:'None';
 document.getElementById('simPromoDiscount').textContent=`−${formatMoney(promoDiscount)}`;
 document.getElementById('simVat').textContent=formatMoney(vat);
 document.getElementById('simPlatformFee').textContent=formatMoney(platformFee);
 document.getElementById('simResultStatus').textContent=eligibility.eligible?`${eligibleOverrides.length} override${eligibleOverrides.length===1?'':'s'} · ${eligiblePromos.length} promo${eligiblePromos.length===1?'':'s'}`:'Plan not eligible';
 const guestWarning=guests>room.maxGuests?` Guest count exceeds the ${room.maxGuests}-guest room limit.`:'';
 const statusNote=statusPreviewed?` Preview ignores the current ${state.planStatus||'draft'} status; guests cannot book this plan until it is Active or Scheduled.`:'';
 document.getElementById('simDecisionNote').textContent=eligibility.eligible?`This plan matches at ${state.planRole==='default'?'fallback priority':`priority ${state.planPriority}`}. One override maximum and one promo maximum are applied.${statusNote}${guestWarning}`:`This plan does not match: ${eligibility.reasons.join('; ')}.${statusNote}${guestWarning}`;
}
function addDays(dateValue,days){
 const date=new Date(`${dateValue}T00:00:00Z`);date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10);
}
function firstMatchingRuleDate(rule){
 let date=rule.start;
 for(let index=0;index<370&&date<=rule.end;index++,date=addDays(date,1)){
  if(dateMatchesRule(rule,date))return date;
 }
 return rule.start;
}
function firstEligiblePlanDate(state,start,end){
 let date=start;
 for(let index=0;index<370&&date<=end;index++,date=addDays(date,1)){
  if(state.applicationType!=='weekdays')return date;
  const labels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const day=labels[new Date(`${date}T00:00:00`).getDay()];
  if(Array.isArray(state.applicationDays)&&state.applicationDays.includes(day))return date;
 }
 return start;
}
function applySimulatorPreset(name){
 const state=getState();
 const rules=adjustmentItems(state);
 const override=rules.find(item=>item.type==='override');
 const promo=rules.find(item=>item.id==='promo-long-stay')||rules.find(item=>item.type==='promo');
 const room=Array.isArray(state.selectedRooms)&&state.selectedRooms[0]?.code?state.selectedRooms[0].code:'DLX-KING';
 let date=state.startDate||'2026-07-09',nights=Math.max(1,Number(state.planMinNights)||1),code='';
 if(name==='override'&&override)date=firstMatchingRuleDate(override);
 if(name==='promo'&&promo){
  const eligibleStart=[state.startDate,promo.start].filter(Boolean).sort().at(-1);
  const eligibleEnd=[state.noEndDate?'':state.endDate,promo.end].filter(Boolean).sort()[0]||promo.end;
  date=firstEligiblePlanDate(state,eligibleStart,eligibleEnd);
  nights=Math.max(nights,Number(promo.minNights)||1);
  code=promo.code||'';
 }
 if(name==='outside')date=addDays(state.noEndDate?date:(state.endDate||date),14);
 document.getElementById('simRoom').value=SIM_ROOMS[room]?room:'DLX-KING';
 document.getElementById('simBookedDate').value=addDays(date,-Math.max(7,Number(state.minAdvanceDays)||0));
 document.getElementById('simDate').value=date;
 document.getElementById('simNights').value=nights;
 document.getElementById('simRooms').value=1;
 document.getElementById('simGuests').value=2;
 document.getElementById('simPromoCode').value=code;
 document.getElementById('simOverrideChoice').value='auto';
 document.getElementById('simPromoChoice').value='auto';
 runRateSimulation();
 if(name==='promo'&&promo){
  const promoChoice=document.getElementById('simPromoChoice');
  if(Array.from(promoChoice.options).some(option=>option.value===promo.id)){
   promoChoice.value=promo.id;
   runRateSimulation();
  }
 }
}
function updateSimulatorPresetLabels(){
 const rules=adjustmentItems();
 const override=rules.find(item=>item.type==='override');
 const promo=rules.find(item=>item.id==='promo-long-stay')||rules.find(item=>item.type==='promo');
 const overrideButton=document.querySelector('[data-sim-preset="override"]');
 const promoButton=document.querySelector('[data-sim-preset="promo"]');
 if(overrideButton)overrideButton.textContent=override?`Match override: ${override.name}`:'No override sample';
 if(promoButton)promoButton.textContent=promo?`Match promo: ${promo.code||promo.name}`:'No promo sample';
 if(overrideButton)overrideButton.disabled=!override;
 if(promoButton)promoButton.disabled=!promo;
}
function initRateSimulator(){
 if(!document.getElementById('runRateSimulation'))return;
 document.getElementById('runRateSimulation').addEventListener('click',runRateSimulation);
 document.querySelectorAll('#rateSimulator input,#rateSimulator select,#overrideResolution,#promoResolution').forEach(input=>input.addEventListener('change',runRateSimulation));
 document.querySelectorAll('[data-sim-preset]').forEach(button=>button.addEventListener('click',()=>applySimulatorPreset(button.dataset.simPreset)));
 updateSimulatorPresetLabels();
 runRateSimulation();
}
document.addEventListener('DOMContentLoaded',initRateSimulator);
