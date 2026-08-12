import{n as e}from"./modulepreload-polyfill-C2xYpwEn.js";import{i as t,n,r}from"./main-Bwwzfsjp.js";function i(){return{search:Y.querySelector(`[data-partner-search]`)?.value.trim().toLowerCase()||``,status:Y.querySelector(`[data-partner-status]`)?.value||`all`,type:Y.querySelector(`[data-partner-type]`)?.value||`all`,country:Y.querySelector(`[data-partner-country]`)?.value||`all`}}function a(){let e=i();return K.filter(t=>{let n=`${t.id} ${t.name} ${t.company} ${t.email} ${t.country} ${t.review}`.toLowerCase();return(J===`all`||J===`assigned`&&t.reviewer===`You`||J===`high-risk`&&t.priority===`high`||t.category===J)&&(!e.search||n.includes(e.search))&&(e.status===`all`||t.status===e.status)&&(e.type===`all`||t.type===e.type)&&(e.country===`all`||t.country===e.country)})}function o(){let e=Y.querySelector(`[data-partner-list]`),t=a(),n=Y.querySelector(`[data-partner-visible-count]`),r=Y.querySelector(`[data-partner-footer-count]`);if(n&&(n.textContent=`${t.length} ${t.length===1?`record`:`records`}`),r&&(r.textContent=t.length),e){if(!t.length){e.innerHTML=`
      <tr>
        <td colspan="6" class="px-6 py-14 text-center">
          <div class="mx-auto flex max-w-sm flex-col items-center">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <i class="fa-solid fa-filter-circle-xmark"></i>
            </span>
            <p class="mt-3 font-semibold text-slate-800">No partner records match these filters</p>
            <p class="mt-1 text-sm text-slate-500">Clear the filters or choose a different queue.</p>
            <button type="button" class="mt-4 partner-button partner-button-secondary" data-partner-action="clear-filters">
              Clear filters
            </button>
          </div>
        </td>
      </tr>
    `;return}e.innerHTML=t.map(e=>`
        <tr class="partner-queue-row">
          <td class="px-5 py-4 sm:px-6">
            <div class="flex items-start gap-3">
              <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${e.priority===`high`?`bg-rose-500`:`bg-indigo-500`}"></span>
              <div class="min-w-0">
                <p class="font-semibold text-slate-900">${X(e.name)}</p>
                <p class="mt-0.5 text-xs text-slate-500">${X(e.company)} · ${X(e.type)}</p>
                <p class="mt-1 text-xs text-slate-400">${X(e.id)} · ${X(e.email)} · ${X(e.submitted)}</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-4">
            <div class="flex flex-col items-start gap-1.5">
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${$(e.category)}">${X(e.review)}</span>
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${Q(e.status)}">${X(Z(e.status))}</span>
            </div>
          </td>
          <td class="px-5 py-4">
            <span class="font-medium ${e.missingEvidence?`text-rose-600`:`text-emerald-600`}">${X(e.evidence)}</span>
          </td>
          <td class="px-5 py-4"><span class="text-slate-700">${X(e.reviewer)}</span></td>
          <td class="px-5 py-4">
            <span class="font-semibold ${e.priority===`high`?`text-rose-600`:`text-slate-700`}">${X(e.risk)}</span>
          </td>
          <td class="px-5 py-4 text-right">
            <button type="button" class="partner-button partner-button-primary partner-row-action" data-partner-action="review" data-partner-id="${X(e.id)}">
              Review <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </td>
        </tr>
      `).join(``)}}function s(){let e={open:K.filter(e=>e.status!==`verified`).length,risk:K.filter(e=>e.priority===`high`&&e.status!==`verified`).length,documents:K.filter(e=>e.missingEvidence&&e.status!==`verified`).length,ready:K.filter(e=>e.status===`ready`).length};Object.entries(e).forEach(([e,t])=>{let n=Y.querySelector(`[data-partner-summary="${e}"]`);n&&(n.textContent=t)})}function c(e){J=e,Y.querySelectorAll(`[data-partner-filter]`).forEach(t=>{t.classList.toggle(`is-active`,t.dataset.partnerFilter===e)}),o()}function l(){let e=Y.querySelector(`[data-partner-search]`),t=Y.querySelector(`[data-partner-status]`),n=Y.querySelector(`[data-partner-type]`),r=Y.querySelector(`[data-partner-country]`);e&&(e.value=``),t&&(t.value=`all`),n&&(n.value=`all`),r&&(r.value=`all`),c(`all`)}function u(e,t=`success`){let n=Y.querySelector(`#partnerNotice`);if(!n)return;let r=t===`error`?`bg-rose-50 text-rose-700`:`bg-emerald-50 text-emerald-700`;n.textContent=e,n.className=`rounded-lg px-3 py-2 text-sm font-medium ${r}`,window.clearTimeout(u.timer),u.timer=window.setTimeout(()=>{n.classList.add(`hidden`)},5e3)}function d(){let e=a().filter(e=>e.reviewer===`Unassigned`&&e.status!==`verified`);t({title:`Assign partner reviewer`,content:`
      <form data-partner-assign-form class="space-y-5">
        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="font-semibold text-slate-900">Assign unassigned records in the current view</p>
          <p class="mt-1 text-sm text-slate-500">
            ${e.length} ${e.length===1?`record is`:`records are`} ready to be assigned. Current filters are respected.
          </p>
        </div>

        <label class="block text-sm font-medium text-slate-700">
          Reviewer
          <select name="reviewer" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            <option value="You">You — Partner Operations</option>
            <option value="Legal Team">Legal Team</option>
            <option value="Compliance Team">Compliance Team</option>
            <option value="Finance Team">Finance Team</option>
          </select>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Assignment note
          <textarea name="note" class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Optional internal assignment note"></textarea>
        </label>

        <div class="flex justify-end gap-3">
          <button type="button" data-admin-modal-close class="partner-button partner-button-secondary">Cancel</button>
          <button type="submit" class="partner-button partner-button-primary">
            <i class="fa-solid fa-user-check"></i> Assign reviewer
          </button>
        </div>
      </form>
    `}).querySelector(`[data-partner-assign-form]`)?.addEventListener(`submit`,t=>{t.preventDefault();let r=new FormData(t.currentTarget).get(`reviewer`);e.forEach(e=>{e.reviewer=r}),n(),o(),u(`${e.length} ${e.length===1?`record was`:`records were`} assigned to ${r}.`)})}function f(e){let r=K.find(t=>t.id===e);r&&t({title:`Review · ${X(r.name)}`,size:`max-w-4xl`,content:`
      <form data-partner-review-form class="space-y-6">
        <div class="grid gap-3 sm:grid-cols-2">
          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Partner</dt>
            <dd class="mt-1 font-semibold text-slate-900">${X(r.name)}</dd>
            <dd class="mt-1 text-sm text-slate-500">${X(r.company)}</dd>
          </dl>

          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</dt>
            <dd class="mt-1 font-semibold text-slate-900">${X(r.email)}</dd>
            <dd class="mt-1 text-sm text-slate-500">${X(r.country)} · ${X(r.id)}</dd>
          </dl>

          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Review requirement</dt>
            <dd class="mt-1 font-semibold text-slate-900">${X(r.review)}</dd>
            <dd class="mt-1 text-sm text-slate-500">${X(r.note)}</dd>
          </dl>

          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Evidence</dt>
            <dd class="mt-1 font-semibold ${r.missingEvidence?`text-rose-600`:`text-emerald-600`}">${X(r.evidence)}</dd>
            <dd class="mt-1 text-sm text-slate-500">Assigned to ${X(r.reviewer)}</dd>
          </dl>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Admin decision
            <select name="status" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
              <option value="pending" ${r.status===`pending`?`selected`:``}>Keep in review</option>
              <option value="documents" ${r.status===`documents`?`selected`:``}>Request documents</option>
              <option value="ready" ${r.status===`ready`?`selected`:``}>Approve for verification</option>
              <option value="verified" ${r.status===`verified`?`selected`:``}>Verify and enable access</option>
              <option value="restricted" ${r.status===`restricted`?`selected`:``}>Restrict account access</option>
              <option value="escalated" ${r.status===`escalated`?`selected`:``}>Escalate to compliance</option>
            </select>
          </label>

          <label class="block text-sm font-medium text-slate-700">
            Assign reviewer
            <select name="reviewer" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
              <option value="You" ${r.reviewer===`You`?`selected`:``}>You — Partner Operations</option>
              <option value="Unassigned" ${r.reviewer===`Unassigned`?`selected`:``}>Unassigned</option>
              <option value="Legal Team" ${r.reviewer===`Legal Team`?`selected`:``}>Legal Team</option>
              <option value="Compliance Team" ${r.reviewer===`Compliance Team`?`selected`:``}>Compliance Team</option>
              <option value="Finance Team" ${r.reviewer===`Finance Team`?`selected`:``}>Finance Team</option>
            </select>
          </label>
        </div>

        <label class="block text-sm font-medium text-slate-700">
          Internal decision note
          <textarea name="note" required class="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Record the evidence reviewed and the decision rationale.">${X(r.note)}</textarea>
        </label>

        <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <input name="notify" type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="text-slate-800">Notify the partner</strong><br>
            Send the verification decision and required next steps to the partner contact.
          </span>
        </label>

        <div class="flex flex-wrap justify-end gap-3">
          <button type="button" data-admin-modal-close class="partner-button partner-button-secondary">Cancel</button>
          <button type="submit" class="partner-button partner-button-primary">
            <i class="fa-solid fa-floppy-disk"></i> Save decision
          </button>
        </div>
      </form>
    `}).querySelector(`[data-partner-review-form]`)?.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(e.currentTarget);r.status=t.get(`status`),r.reviewer=t.get(`reviewer`),r.note=t.get(`note`).trim(),r.missingEvidence=![`verified`,`ready`].includes(r.status)&&r.evidence!==`Complete`&&r.evidence!==`Account verified`,n(),s(),o(),u(`${r.name} was updated to “${Z(r.status)}”.`)})}function p(e){return String(e||``).trim().toLowerCase().replace(/[^a-z0-9]+/g,`_`).replace(/^_+|_+$/g,``)}function m(){let e=q.reduce((e,t)=>{let n=Number(String(t.id||``).replace(/\D/g,``));return Number.isFinite(n)?Math.max(e,n):e},0);return`REQ-${String(e+1).padStart(3,`0`)}`}function h(e){return V.find(t=>t.value===e)?.label||e}function g(e){return H.find(t=>t.value===e)||{value:e,label:e,icon:`fa-clipboard-check`}}function _(e){let t=Array.isArray(e.partnerProfiles)?e.partnerProfiles:Array.isArray(e.partner_profiles)?e.partner_profiles:e.profile||e.partner_profile?[e.profile||e.partner_profile]:[],n=Array.isArray(e.acceptedTypes)?e.acceptedTypes:Array.isArray(e.accepted_file_types)?e.accepted_file_types:[],r=Array.isArray(e.selectOptions)?e.selectOptions:Array.isArray(e.select_options)?e.select_options:[];return{id:String(e.id||m()),code:e.code||e.requirement_code||``,name:e.name||e.requirement_name||``,category:e.category||`Other`,inputType:e.inputType||e.input_type||`file`,partnerProfiles:t,country:e.country||`Philippines`,description:e.description||``,placeholder:e.placeholder||``,required:!!(e.required??e.is_required??!0),conditional:!!(e.conditional??e.is_conditional??!1),acceptedTypes:n,maximumFiles:Number(e.maximumFiles??e.maximum_files??1),maximumSizeMb:Number(e.maximumSizeMb??e.maximum_file_size_mb??10),hasExpiration:!!(e.hasExpiration??e.requires_expiration_date??!1),minimumLength:e.minimumLength??e.minimum_length??null,maximumLength:e.maximumLength??e.maximum_length??null,minimumValue:e.minimumValue??e.minimum_value??null,maximumValue:e.maximumValue??e.maximum_value??null,selectOptions:r,status:e.status||`active`,sortOrder:Number(e.sortOrder??e.sort_order??1)}}function v(){try{let e=window.localStorage.getItem(z);if(!e)return structuredClone(G);let t=JSON.parse(e);return Array.isArray(t)?t.map(_):structuredClone(G)}catch(e){return console.warn(`Unable to read local partner requirements.`,e),structuredClone(G)}}function y(){try{window.localStorage.setItem(z,JSON.stringify(q))}catch(e){console.warn(`Unable to save local partner requirements.`,e)}}async function b(){try{let e=await fetch(R,{method:`GET`,headers:{Accept:`application/json`},credentials:`same-origin`});if(!e.ok)throw Error(`Requirements request failed with ${e.status}.`);let t=await e.json(),n=t?.data?.requirements||t?.data||t?.requirements||t;if(!Array.isArray(n))throw Error(`Requirements response is not an array.`);return q=n.map(_),y(),{source:`api`}}catch(e){return console.warn(`Using locally stored partner requirement configurations.`,e),q=v(),{source:`local`}}}function x(e){return{code:e.code,name:e.name,category:e.category,inputType:e.inputType,partnerProfiles:e.partnerProfiles,country:e.country,description:e.description,placeholder:e.placeholder,required:e.required,conditional:e.conditional,acceptedTypes:e.acceptedTypes,maximumFiles:e.maximumFiles,maximumSizeMb:e.maximumSizeMb,hasExpiration:e.hasExpiration,minimumLength:e.minimumLength,maximumLength:e.maximumLength,minimumValue:e.minimumValue,maximumValue:e.maximumValue,selectOptions:e.selectOptions,status:e.status,sortOrder:e.sortOrder}}async function S(e,t){let n=e.id;try{let r=await fetch(t?`${R}/${encodeURIComponent(e.id)}`:R,{method:t?`PUT`:`POST`,headers:{Accept:`application/json`,"Content-Type":`application/json`},credentials:`same-origin`,body:JSON.stringify(x(e))});if(!r.ok)throw Error(`Requirement save failed with ${r.status}.`);let i={};r.status!==204&&(i=await r.json());let a=i?.data||i;return _({...e,...a&&typeof a==`object`?a:{},id:a?.id||n})}catch(t){return console.warn(`Requirement saved in browser storage only.`,t),e}}async function ee(e){try{let t=await fetch(`${R}/${encodeURIComponent(e)}`,{method:`DELETE`,headers:{Accept:`application/json`},credentials:`same-origin`});if(!t.ok)throw Error(`Requirement delete failed with ${t.status}.`)}catch(e){console.warn(`Requirement removed from browser storage only.`,e)}}function te(e){return e===`active`?`bg-emerald-50 text-emerald-700`:`bg-slate-100 text-slate-600`}function C(e){let t=e.partnerProfiles.map(h);return t.length?t.length===V.length?`All partner profiles`:t.length===1?t[0]:`${t[0]} +${t.length-1}`:`No profile selected`}function w(e){let t=e.querySelector(`[data-requirement-list]`),n=e.querySelector(`[data-requirement-count]`),r=e.querySelector(`[data-requirement-empty]`),i=e.querySelector(`[data-requirement-search]`)?.value.trim().toLowerCase()||``,a=e.querySelector(`[data-requirement-filter-profile]`)?.value||`all`,o=e.querySelector(`[data-requirement-filter-input]`)?.value||`all`,s=e.querySelector(`[data-requirement-filter-status]`)?.value||`all`;if(!t)return;let c=q.filter(e=>{let t=[e.name,e.code,e.category,e.description,e.country,...e.partnerProfiles.map(h)].join(` `).toLowerCase();return(!i||t.includes(i))&&(a===`all`||e.partnerProfiles.includes(a))&&(o===`all`||e.inputType===o)&&(s===`all`||e.status===s)}).sort((e,t)=>Number(e.sortOrder||0)-Number(t.sortOrder||0)||e.name.localeCompare(t.name));n&&(n.textContent=`${c.length} ${c.length===1?`configuration`:`configurations`}`),r&&r.classList.toggle(`hidden`,c.length>0),t.innerHTML=c.map(e=>{let t=g(e.inputType);return`
        <tr class="border-b border-slate-100 last:border-0">
          <td class="px-4 py-4">
            <div class="flex items-start gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <i class="fa-solid ${X(t.icon)}"></i>
              </span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="font-semibold text-slate-900">${X(e.name)}</p>
                  ${e.required?`<span class="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">Required</span>`:`<span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">Optional</span>`}
                  ${e.conditional?`<span class="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Conditional</span>`:``}
                </div>
                <p class="mt-1 font-mono text-xs text-slate-400">${X(e.code)}</p>
                <p class="mt-1 max-w-xl text-xs leading-5 text-slate-500">${X(e.description||`No partner instructions provided.`)}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-4">
            <p class="font-medium text-slate-700">${X(C(e))}</p>
            <p class="mt-1 text-xs text-slate-400">${X(e.country)}</p>
          </td>
          <td class="px-4 py-4">
            <p class="font-medium text-slate-700">${X(t.label)}</p>
            <p class="mt-1 text-xs text-slate-400">${X(e.category)}</p>
          </td>
          <td class="px-4 py-4">
            <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${te(e.status)}">
              ${e.status===`active`?`Active`:`Inactive`}
            </span>
          </td>
          <td class="px-4 py-4 text-right">
            <div class="flex justify-end gap-2">
              <button type="button" class="partner-button partner-button-secondary" data-requirement-action="edit" data-requirement-id="${X(e.id)}">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
              <button type="button" class="partner-button partner-button-secondary text-rose-600" data-requirement-action="delete" data-requirement-id="${X(e.id)}" aria-label="Delete ${X(e.name)}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join(``)}function T(){return W.map(e=>`
        <tr class="border-b border-slate-100 last:border-0">
          <td class="px-4 py-3.5">
            <p class="font-semibold text-slate-800">${X(e.name)}</p>
            <p class="mt-1 text-xs text-slate-400">${X(e.category)}</p>
          </td>
          <td class="px-4 py-3.5 text-slate-600">${X(g(e.inputType).label)}</td>
          <td class="px-4 py-3.5 text-slate-600">${X(e.profiles.map(h).join(`, `))}</td>
          <td class="px-4 py-3.5">
            <div class="flex flex-wrap gap-1.5">
              <span class="rounded-full ${e.required?`bg-rose-50 text-rose-600`:`bg-slate-100 text-slate-500`} px-2 py-0.5 text-[11px] font-semibold">
                ${e.required?`Usually required`:`Conditional`}
              </span>
              ${e.hasExpiration?`<span class="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Expiration date</span>`:``}
            </div>
          </td>
          <td class="px-4 py-3.5 text-right">
            <button type="button" class="partner-button partner-button-secondary" data-requirement-action="use-sample" data-sample-key="${X(e.key)}">
              <i class="fa-solid fa-plus"></i> Use sample
            </button>
          </td>
        </tr>
      `).join(``)}function E(e){return V.map(t=>`
        <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <input
            type="checkbox"
            name="partnerProfiles"
            value="${X(t.value)}"
            ${e.includes(t.value)?`checked`:``}
            class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span class="text-sm font-medium text-slate-700">${X(t.label)}</span>
        </label>
      `).join(``)}function D(e=null){let t=e||{id:``,code:``,name:``,category:`Local permit`,inputType:`file`,partnerProfiles:[`business_property_partner`],country:`Philippines`,description:``,placeholder:``,required:!0,conditional:!1,acceptedTypes:[`pdf`,`jpg`,`jpeg`,`png`],maximumFiles:1,maximumSizeMb:10,hasExpiration:!1,minimumLength:null,maximumLength:null,minimumValue:null,maximumValue:null,selectOptions:[],status:`active`,sortOrder:q.length+1};return`
    <form data-requirement-editor-form class="space-y-6">
      <input type="hidden" name="id" value="${X(t.id)}">

      <section class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
        <div class="flex items-start gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <i class="fa-solid fa-sliders"></i>
          </span>
          <div>
            <h3 class="font-semibold text-slate-900">Define a verification input</h3>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Configure the field that BOMO will display to the partner. This screen does not collect or upload the actual document.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="font-semibold text-slate-900">Applicable partner profiles</h3>
            <p class="mt-1 text-sm text-slate-500">Select one or more profiles that must see this input.</p>
          </div>
        </div>
        <div class="mt-3 grid gap-3 md:grid-cols-3">
          ${E(t.partnerProfiles)}
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <label class="block text-sm font-medium text-slate-700">
          Country or ruleset
          <select name="country" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            <option value="Philippines" ${t.country===`Philippines`?`selected`:``}>Philippines</option>
            <option value="Singapore" ${t.country===`Singapore`?`selected`:``}>Singapore</option>
            <option value="Australia" ${t.country===`Australia`?`selected`:``}>Australia</option>
            <option value="All countries" ${t.country===`All countries`?`selected`:``}>All countries</option>
          </select>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Category
          <select name="category" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            ${U.map(e=>`
                  <option value="${X(e)}" ${t.category===e?`selected`:``}>${X(e)}</option>
                `).join(``)}
          </select>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Input type
          <select name="inputType" required data-requirement-input-type class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            ${H.map(e=>`
                  <option value="${X(e.value)}" ${t.inputType===e.value?`selected`:``}>${X(e.label)}</option>
                `).join(``)}
          </select>
        </label>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <label class="block text-sm font-medium text-slate-700">
          Field or document name
          <input type="text" name="name" required value="${X(t.name)}" placeholder="Example: DOT Accreditation" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
        </label>

        <label class="block text-sm font-medium text-slate-700">
          System code
          <input type="text" name="code" required value="${X(t.code)}" placeholder="dot_accreditation" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          <span class="mt-1 block text-xs text-slate-400">Unique lowercase code. Spaces become underscores.</span>
        </label>
      </section>

      <label class="block text-sm font-medium text-slate-700">
        Instructions shown to partner
        <textarea name="description" class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Example: Upload the current certificate issued by the Department of Tourism.">${X(t.description)}</textarea>
      </label>

      <label data-setting="placeholder" class="block text-sm font-medium text-slate-700">
        Placeholder or example
        <input type="text" name="placeholder" value="${X(t.placeholder)}" placeholder="Example value shown inside the input" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
      </label>

      <section data-setting="file" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 class="font-semibold text-slate-900">File input settings</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Maximum files
            <input type="number" name="maximumFiles" min="1" max="20" value="${X(t.maximumFiles)}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Maximum size per file
            <div class="relative mt-2">
              <input type="number" name="maximumSizeMb" min="1" max="100" value="${X(t.maximumSizeMb)}" class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">MB</span>
            </div>
          </label>
        </div>

        <fieldset class="mt-4">
          <legend class="text-sm font-medium text-slate-700">Accepted file formats</legend>
          <div class="mt-3 flex flex-wrap gap-3">
            ${[`pdf`,`jpg`,`jpeg`,`png`].map(e=>`
                  <label class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <input type="checkbox" name="acceptedTypes" value="${e}" ${t.acceptedTypes.includes(e)?`checked`:``} class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    ${e.toUpperCase()}
                  </label>
                `).join(``)}
          </div>
        </fieldset>

        <label class="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <input type="checkbox" name="hasExpiration" ${t.hasExpiration?`checked`:``} class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="block text-sm text-slate-800">Also ask for expiration date</strong>
            <span class="mt-1 block text-xs leading-5 text-slate-500">The generated partner form will add an expiration-date input beside this file.</span>
          </span>
        </label>
      </section>

      <section data-setting="text" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 class="font-semibold text-slate-900">Text validation</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Minimum characters
            <input type="number" name="minimumLength" min="0" value="${X(t.minimumLength??``)}" placeholder="0" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Maximum characters
            <input type="number" name="maximumLength" min="1" value="${X(t.maximumLength??``)}" placeholder="255" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
        </div>
      </section>

      <section data-setting="number" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 class="font-semibold text-slate-900">Number validation</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Minimum value
            <input type="number" name="minimumValue" value="${X(t.minimumValue??``)}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Maximum value
            <input type="number" name="maximumValue" value="${X(t.maximumValue??``)}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
        </div>
      </section>

      <label data-setting="select" class="block text-sm font-medium text-slate-700">
        Dropdown options
        <textarea name="selectOptions" class="mt-2 min-h-32 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Enter one option per line">${X(t.selectOptions.join(`
`))}</textarea>
        <span class="mt-1 block text-xs text-slate-400">Enter one option per line.</span>
      </label>

      <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label class="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
          <input type="checkbox" name="required" ${t.required?`checked`:``} class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="block text-sm text-slate-800">Required</strong>
            <span class="mt-1 block text-xs leading-5 text-slate-500">Partner cannot complete verification without this input.</span>
          </span>
        </label>

        <label class="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
          <input type="checkbox" name="conditional" ${t.conditional?`checked`:``} class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="block text-sm text-slate-800">Conditional</strong>
            <span class="mt-1 block text-xs leading-5 text-slate-500">Displayed only when applicable to the partner or property.</span>
          </span>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Display order
          <input type="number" name="sortOrder" required min="1" value="${X(t.sortOrder)}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Status
          <select name="status" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            <option value="active" ${t.status===`active`?`selected`:``}>Active</option>
            <option value="inactive" ${t.status===`inactive`?`selected`:``}>Inactive</option>
          </select>
        </label>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="font-semibold text-slate-900">Partner form preview</h3>
            <p class="mt-1 text-sm text-slate-500">Preview of the input generated from this configuration.</p>
          </div>
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Preview only</span>
        </div>
        <div data-requirement-preview class="mt-4"></div>
      </section>

      <div data-requirement-form-error class="hidden rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"></div>

      <div class="flex flex-wrap justify-end gap-3">
        <button type="button" data-requirement-editor-cancel class="partner-button partner-button-secondary">Cancel</button>
        <button type="submit" data-requirement-save class="partner-button partner-button-primary">
          <i class="fa-solid fa-floppy-disk"></i> Save input configuration
        </button>
      </div>
    </form>
  `}function O(e){let t=e.querySelector(`[data-requirement-input-type]`)?.value;e.querySelector(`[data-setting="file"]`)?.classList.toggle(`hidden`,t!==`file`),e.querySelector(`[data-setting="text"]`)?.classList.toggle(`hidden`,![`text`,`textarea`].includes(t)),e.querySelector(`[data-setting="number"]`)?.classList.toggle(`hidden`,t!==`number`),e.querySelector(`[data-setting="select"]`)?.classList.toggle(`hidden`,t!==`select`),e.querySelector(`[data-setting="placeholder"]`)?.classList.toggle(`hidden`,t===`checkbox`)}function k(e){let t=new FormData(e),n=t.get(`inputType`)||`file`;return{name:t.get(`name`)?.trim()||`Verification requirement`,description:t.get(`description`)?.trim()||``,placeholder:t.get(`placeholder`)?.trim()||``,inputType:n,required:t.has(`required`),acceptedTypes:t.getAll(`acceptedTypes`),maximumFiles:Number(t.get(`maximumFiles`)||1),hasExpiration:t.has(`hasExpiration`),selectOptions:String(t.get(`selectOptions`)||``).split(`
`).map(e=>e.trim()).filter(Boolean)}}function A(e){let t=e.querySelector(`[data-requirement-preview]`);if(!t)return;let n=k(e),r=n.required?`<span class="ml-1 text-rose-500">*</span>`:`<span class="ml-2 text-xs font-normal text-slate-400">Optional</span>`,i=``;i=n.inputType===`file`?`
      <div class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <div class="flex items-center gap-3">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
            <i class="fa-solid fa-cloud-arrow-up"></i>
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-700">Choose ${n.maximumFiles>1?`up to ${n.maximumFiles} files`:`a file`}</p>
            <p class="mt-0.5 text-xs text-slate-400">${X((n.acceptedTypes.length?n.acceptedTypes:[`pdf`,`jpg`,`png`]).join(`, `).toUpperCase())}</p>
          </div>
        </div>
      </div>
      ${n.hasExpiration?`<input type="date" disabled class="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">`:``}
    `:n.inputType===`textarea`?`<textarea disabled class="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm" placeholder="${X(n.placeholder)}"></textarea>`:n.inputType===`select`?`
      <select disabled class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
        <option>${n.selectOptions.length?`Select an option`:`No options configured`}</option>
        ${n.selectOptions.map(e=>`<option>${X(e)}</option>`).join(``)}
      </select>
    `:n.inputType===`checkbox`?`
      <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <input type="checkbox" disabled class="mt-0.5 h-4 w-4 rounded border-slate-300">
        <span>${X(n.description||n.name)}</span>
      </label>
    `:`<input type="${X(n.inputType)}" disabled class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" placeholder="${X(n.placeholder)}">`,t.innerHTML=`
    <label class="block text-sm font-medium text-slate-700">
      ${X(n.name)}${r}
      ${n.inputType===`checkbox`?``:`<div class="mt-2">${i}</div>`}
    </label>
    ${n.inputType===`checkbox`?`<div class="mt-2">${i}</div>`:``}
    ${n.description&&n.inputType!==`checkbox`?`<p class="mt-2 text-xs leading-5 text-slate-400">${X(n.description)}</p>`:``}
  `}function ne(e){let t=new FormData(e),n=t.get(`inputType`),r=t.get(`id`)||m(),i=t.getAll(`partnerProfiles`);return{id:r,code:p(t.get(`code`)),name:t.get(`name`)?.trim()||``,category:t.get(`category`),inputType:n,partnerProfiles:i,country:t.get(`country`),description:t.get(`description`)?.trim()||``,placeholder:t.get(`placeholder`)?.trim()||``,required:t.has(`required`),conditional:t.has(`conditional`),acceptedTypes:n===`file`?t.getAll(`acceptedTypes`):[],maximumFiles:n===`file`?Number(t.get(`maximumFiles`)||1):null,maximumSizeMb:n===`file`?Number(t.get(`maximumSizeMb`)||10):null,hasExpiration:n===`file`&&t.has(`hasExpiration`),minimumLength:[`text`,`textarea`].includes(n)&&t.get(`minimumLength`)!==``?Number(t.get(`minimumLength`)):null,maximumLength:[`text`,`textarea`].includes(n)&&t.get(`maximumLength`)!==``?Number(t.get(`maximumLength`)):null,minimumValue:n===`number`&&t.get(`minimumValue`)!==``?Number(t.get(`minimumValue`)):null,maximumValue:n===`number`&&t.get(`maximumValue`)!==``?Number(t.get(`maximumValue`)):null,selectOptions:n===`select`?String(t.get(`selectOptions`)||``).split(`
`).map(e=>e.trim()).filter(Boolean):[],status:t.get(`status`),sortOrder:Number(t.get(`sortOrder`)||1)}}function j(e){return e.partnerProfiles.length?e.name?e.code?q.find(t=>t.code===e.code&&t.country===e.country&&t.id!==e.id)?`This system code already exists for the selected country or ruleset.`:e.inputType===`file`&&!e.acceptedTypes.length?`Select at least one accepted file format.`:e.inputType===`select`&&!e.selectOptions.length?`Enter at least one dropdown option.`:e.minimumLength!==null&&e.maximumLength!==null&&e.minimumLength>e.maximumLength?`Minimum characters cannot exceed maximum characters.`:e.minimumValue!==null&&e.maximumValue!==null&&e.minimumValue>e.maximumValue?`Minimum value cannot exceed maximum value.`:``:`Enter a valid system code.`:`Enter a field or document name.`:`Select at least one applicable partner profile.`}function M(e,t=null){let n=e.querySelector(`[data-requirement-manager-panel]`),r=e.querySelector(`[data-requirement-editor-panel]`);if(!n||!r)return;n.classList.add(`hidden`),r.classList.remove(`hidden`),r.innerHTML=D(t);let i=r.querySelector(`[data-requirement-editor-form]`),a=i?.querySelector(`[name="name"]`),o=i?.querySelector(`[name="code"]`),s=i?.querySelector(`[data-requirement-input-type]`),c=i?.querySelector(`[data-requirement-editor-cancel]`);if(!i)return;let l=!!t?.code;o?.addEventListener(`input`,()=>{l=!0,o.value=p(o.value)}),a?.addEventListener(`input`,()=>{!l&&o&&(o.value=p(a.value))}),s?.addEventListener(`change`,()=>{O(i),A(i)}),i.addEventListener(`input`,()=>A(i)),i.addEventListener(`change`,()=>A(i)),c?.addEventListener(`click`,()=>{r.classList.add(`hidden`),r.innerHTML=``,n.classList.remove(`hidden`)}),i.addEventListener(`submit`,async t=>{t.preventDefault();let a=i.querySelector(`[data-requirement-form-error]`),o=i.querySelector(`[data-requirement-save]`),s=ne(i),c=j(s);if(a?.classList.add(`hidden`),c){a&&(a.textContent=c,a.classList.remove(`hidden`));return}let l=q.findIndex(e=>e.id===s.id),d=l>=0;o&&(o.disabled=!0,o.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...`);let f=await S(s,d);d?q[l]=f:q.push(f),y(),r.classList.add(`hidden`),r.innerHTML=``,n.classList.remove(`hidden`),w(e),u(`${f.name} was saved as a verification input.`)}),O(i),A(i)}function N(e){return{id:``,code:e.key,name:e.name,category:e.category,inputType:e.inputType,partnerProfiles:[...e.profiles],country:`Philippines`,description:e.description,placeholder:``,required:e.required,conditional:!e.required,acceptedTypes:[`pdf`,`jpg`,`jpeg`,`png`],maximumFiles:e.key===`valid_government_id`?2:1,maximumSizeMb:10,hasExpiration:e.hasExpiration,minimumLength:null,maximumLength:null,minimumValue:null,maximumValue:null,selectOptions:[],status:`active`,sortOrder:q.length+1}}async function P(){let e=t({title:`Partner verification inputs`,size:`max-w-7xl`,content:`
      <div data-requirement-manager-panel class="space-y-6">
        <section class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-start gap-3">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <i class="fa-solid fa-list-check"></i>
              </span>
              <div>
                <h3 class="font-semibold text-slate-900">Verification form configuration</h3>
                <p class="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Define the fields and document uploads that partners must complete. These configurations generate the partner-facing verification form; this screen does not collect partner submissions.
                </p>
              </div>
            </div>
            <button type="button" class="partner-button partner-button-primary" data-requirement-action="add">
              <i class="fa-solid fa-plus"></i> Add input
            </button>
          </div>
        </section>

        <details class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 bg-slate-50 px-5 py-4">
            <div>
              <h3 class="font-semibold text-slate-900">Sample Philippine document inputs</h3>
              <p class="mt-1 text-sm text-slate-500">Reference examples only. Select Use sample to prefill a new configuration.</p>
            </div>
            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </summary>
          <div class="overflow-x-auto border-t border-slate-100">
            <table class="min-w-[1050px] w-full text-left text-sm">
              <thead class="border-b border-slate-100 bg-white text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th class="px-4 py-3.5">Sample document</th>
                  <th class="px-4 py-3.5">Input</th>
                  <th class="px-4 py-3.5">Applicable partner</th>
                  <th class="px-4 py-3.5">Suggested rule</th>
                  <th class="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>${T()}</tbody>
            </table>
          </div>
        </details>

        <section class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_15rem_13rem_10rem]">
          <label class="relative block">
            <span class="sr-only">Search requirement configurations</span>
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
            <input type="search" data-requirement-search class="bomo-input h-11 w-full pl-10" placeholder="Search field, document, code, or category...">
          </label>

          <label>
            <span class="sr-only">Filter by partner profile</span>
            <select data-requirement-filter-profile class="bomo-input h-11 w-full">
              <option value="all">All partner profiles</option>
              ${V.map(e=>`<option value="${X(e.value)}">${X(e.label)}</option>`).join(``)}
            </select>
          </label>

          <label>
            <span class="sr-only">Filter by input type</span>
            <select data-requirement-filter-input class="bomo-input h-11 w-full">
              <option value="all">All input types</option>
              ${H.map(e=>`<option value="${X(e.value)}">${X(e.label)}</option>`).join(``)}
            </select>
          </label>

          <label>
            <span class="sr-only">Filter by status</span>
            <select data-requirement-filter-status class="bomo-input h-11 w-full">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </section>

        <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div class="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-semibold text-slate-900">Configured partner inputs</h3>
              <p class="mt-1 text-sm text-slate-500">Active records are used to build the partner verification requirements form.</p>
            </div>
            <span data-requirement-count class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">0 configurations</span>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-[1050px] w-full text-left text-sm">
              <thead class="border-b border-slate-100 bg-white text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th class="px-4 py-3.5">Requirement input</th>
                  <th class="px-4 py-3.5">Partner profile</th>
                  <th class="px-4 py-3.5">Input needed</th>
                  <th class="px-4 py-3.5">Status</th>
                  <th class="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody data-requirement-list>
                <tr>
                  <td colspan="5" class="px-6 py-14 text-center">
                    <i class="fa-solid fa-circle-notch fa-spin text-xl text-indigo-600"></i>
                    <p class="mt-3 text-sm font-medium text-slate-600">Loading input configurations...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div data-requirement-empty class="hidden px-6 py-14 text-center">
            <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <i class="fa-solid fa-folder-open"></i>
            </span>
            <p class="mt-3 font-semibold text-slate-800">No configurations found</p>
            <p class="mt-1 text-sm text-slate-500">Add an input or change the selected filters.</p>
          </div>
        </section>

        <div class="flex justify-end">
          <button type="button" data-admin-modal-close class="partner-button partner-button-secondary">Close</button>
        </div>
      </div>

      <div data-requirement-editor-panel class="hidden"></div>
    `}),n=e.querySelectorAll(`[data-requirement-search], [data-requirement-filter-profile], [data-requirement-filter-input], [data-requirement-filter-status]`),r=await b();w(e);let i=r.source===`api`?`Requirements loaded from the database.`:`Requirements API was unavailable. Browser storage is being used for this session.`;r.source!==`api`&&u(i,`error`),n.forEach(t=>{let n=t.matches(`input[type="search"]`)?`input`:`change`;t.addEventListener(n,()=>w(e))}),e.addEventListener(`click`,async t=>{let n=t.target.closest(`[data-requirement-action]`);if(!n||!e.contains(n))return;let r=n.dataset.requirementAction;if(r===`add`){M(e);return}if(r===`use-sample`){let t=W.find(e=>e.key===n.dataset.sampleKey);t&&M(e,N(t));return}let i=q.find(e=>e.id===n.dataset.requirementId);if(i){if(r===`edit`){M(e,i);return}if(r===`delete`){if(!window.confirm(`Delete “${i.name}”? It will no longer be used to generate new partner verification forms.`))return;await ee(i.id),q=q.filter(e=>e.id!==i.id),y(),w(e),u(`${i.name} was deleted.`)}}})}function F(){if(Y.querySelector(`[data-partner-action="requirements"]`))return;let e=Array.from(Y.querySelectorAll(`button`)).find(e=>e.textContent.trim().toLowerCase().includes(`requirements`));e&&(e.dataset.partnerAction=`requirements`)}function I(e){let t=e.target.closest(`[data-partner-action]`);if(!t||!Y.contains(t))return;let{partnerAction:n,partnerFilter:r,partnerId:i}=t.dataset;n===`filter`&&c(r),n===`clear-filters`&&l(),n===`assign-reviewer`&&d(),n===`review`&&f(i),n===`requirements`&&P()}function L(){Y=document.getElementById(`admin-content-module`),Y&&(F(),Y.addEventListener(`click`,I),Y.querySelector(`[data-partner-search]`)?.addEventListener(`input`,o),Y.querySelectorAll(`[data-partner-status], [data-partner-type], [data-partner-country]`).forEach(e=>e.addEventListener(`change`,o)),s(),o())}var R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{r(),R=`/api/admin/partner-requirements`,z=`BOMO_PARTNER_REQUIREMENT_CONFIGURATIONS`,B=[{id:`PA-203`,name:`Maria Santos`,company:`Santos Hospitality Group`,email:`maria@santoshospitality.ph`,type:`Hospitality group`,country:`Philippines`,review:`Identity verification`,category:`verification`,status:`pending`,priority:`high`,evidence:`Government ID pending`,missingEvidence:!0,reviewer:`Unassigned`,submitted:`32 minutes ago`,risk:`Enhanced review`,note:`Legal name on government ID does not yet match the business registration.`},{id:`PA-202`,name:`Arlo Reyes`,company:`Reyes Island Stays`,email:`arlo@reyesisland.ph`,type:`Property partner`,country:`Philippines`,review:`Business compliance`,category:`business`,status:`documents`,priority:`normal`,evidence:`2 documents missing`,missingEvidence:!0,reviewer:`You`,submitted:`2 hours ago`,risk:`Standard`,note:`Business registration is uploaded; municipal permit and proof of address are required.`},{id:`PA-201`,name:`Carmen Ong`,company:`Ong City Suites`,email:`carmen@ongsuites.ph`,type:`Property manager`,country:`Philippines`,review:`Payout account`,category:`payout`,status:`pending`,priority:`normal`,evidence:`Bank letter uploaded`,missingEvidence:!1,reviewer:`Finance Team`,submitted:`4 hours ago`,risk:`Standard`,note:`Validate account holder name against the partner business registration.`},{id:`PA-200`,name:`Daniel Lim`,company:`Coastal Key Management`,email:`daniel@coastalkey.sg`,type:`Property manager`,country:`Singapore`,review:`Identity verification`,category:`verification`,status:`pending`,priority:`normal`,evidence:`Complete`,missingEvidence:!1,reviewer:`Unassigned`,submitted:`Today`,risk:`Standard`,note:`Director identification and authorised representative forms are ready for review.`},{id:`PA-199`,name:`Lea Villanueva`,company:`Luna Villa Collection`,email:`lea@lunavillas.ph`,type:`Property partner`,country:`Philippines`,review:`Payout account`,category:`payout`,status:`ready`,priority:`normal`,evidence:`Account verified`,missingEvidence:!1,reviewer:`You`,submitted:`5 hours ago`,risk:`Low`,note:`Identity, business registration and account information align. Ready for verification.`},{id:`PA-198`,name:`Kai Tan`,company:`Pacific House Group`,email:`kai@pacifichouse.au`,type:`Hospitality group`,country:`Australia`,review:`Business compliance`,category:`business`,status:`escalated`,priority:`high`,evidence:`Registration conflict`,missingEvidence:!0,reviewer:`Compliance Team`,submitted:`Yesterday`,risk:`Sanctions screening`,note:`Business registration contains conflicting director information and requires compliance review.`},{id:`PA-197`,name:`Noel Garcia`,company:`Garcia Boutique Hotels`,email:`noel@garciahotels.ph`,type:`Hospitality group`,country:`Philippines`,review:`Business compliance`,category:`business`,status:`pending`,priority:`normal`,evidence:`Permit expires in 14 days`,missingEvidence:!1,reviewer:`Legal Team`,submitted:`Yesterday`,risk:`Standard`,note:`Request current local business permit before enabling additional properties.`},{id:`PA-196`,name:`Tessa Wong`,company:`Harbor View Homes`,email:`tessa@harborview.sg`,type:`Property partner`,country:`Singapore`,review:`Payout account`,category:`payout`,status:`restricted`,priority:`normal`,evidence:`Account name mismatch`,missingEvidence:!0,reviewer:`Finance Team`,submitted:`Jul 24`,risk:`Restricted`,note:`Payout account access remains restricted until the account holder name is corrected.`}],V=[{value:`individual_property_partner`,label:`Individual property partner`},{value:`business_property_partner`,label:`Business property partner`},{value:`property_manager_authorized_representative`,label:`Property manager / authorized representative`}],H=[{value:`file`,label:`File upload`,icon:`fa-file-arrow-up`},{value:`text`,label:`Text input`,icon:`fa-font`},{value:`textarea`,label:`Long text`,icon:`fa-align-left`},{value:`date`,label:`Date input`,icon:`fa-calendar-days`},{value:`number`,label:`Number input`,icon:`fa-hashtag`},{value:`select`,label:`Dropdown selection`,icon:`fa-list`},{value:`checkbox`,label:`Confirmation checkbox`,icon:`fa-square-check`}],U=[`Identity`,`Business registration`,`Tax registration`,`Property ownership`,`Authorization`,`Local permit`,`Tourism compliance`,`Health and safety`,`Payout`,`Other`],W=[{key:`valid_government_id`,name:`Valid government-issued ID`,category:`Identity`,profiles:[`individual_property_partner`,`property_manager_authorized_representative`],inputType:`file`,required:!0,hasExpiration:!0,description:`Upload a clear front and back copy of a current government-issued photo ID.`},{key:`dti_sec_cda_registration`,name:`DTI, SEC, or CDA registration`,category:`Business registration`,profiles:[`business_property_partner`],inputType:`file`,required:!0,hasExpiration:!1,description:`Upload the applicable certificate of business or entity registration.`},{key:`bir_certificate_2303`,name:`BIR Certificate of Registration`,category:`Tax registration`,profiles:[`business_property_partner`],inputType:`file`,required:!0,hasExpiration:!1,description:`Upload the BIR Certificate of Registration, commonly BIR Form 2303.`},{key:`mayors_business_permit`,name:`Mayor's or business permit`,category:`Local permit`,profiles:[`business_property_partner`],inputType:`file`,required:!0,hasExpiration:!0,description:`Upload the current permit issued by the applicable local government unit.`},{key:`sanitary_permit`,name:`Sanitary permit`,category:`Health and safety`,profiles:[`business_property_partner`],inputType:`file`,required:!0,hasExpiration:!0,description:`Upload the current sanitary permit for the accommodation establishment, when applicable.`},{key:`dot_accreditation`,name:`DOT accreditation`,category:`Tourism compliance`,profiles:[`business_property_partner`],inputType:`file`,required:!1,hasExpiration:!0,description:`Upload the current Department of Tourism accreditation certificate, when applicable.`},{key:`fire_safety_inspection_certificate`,name:`Fire Safety Inspection Certificate`,category:`Health and safety`,profiles:[`business_property_partner`],inputType:`file`,required:!1,hasExpiration:!0,description:`Upload the current fire safety inspection certificate, when applicable.`},{key:`proof_of_property_ownership`,name:`Proof of property ownership`,category:`Property ownership`,profiles:[`individual_property_partner`,`business_property_partner`],inputType:`file`,required:!0,hasExpiration:!1,description:`Upload a title, tax declaration, deed of sale, contract to sell, or equivalent ownership document.`},{key:`condominium_admin_approval`,name:`Condominium or building approval`,category:`Authorization`,profiles:[`individual_property_partner`,`business_property_partner`,`property_manager_authorized_representative`],inputType:`file`,required:!1,hasExpiration:!0,description:`Upload building administration approval when the property requires permission for rental or transient use.`},{key:`property_management_agreement`,name:`Property management agreement`,category:`Authorization`,profiles:[`property_manager_authorized_representative`],inputType:`file`,required:!0,hasExpiration:!0,description:`Upload the signed agreement between the property owner and property manager.`},{key:`owner_authorization_or_spa`,name:`Owner authorization letter or SPA`,category:`Authorization`,profiles:[`property_manager_authorized_representative`],inputType:`file`,required:!0,hasExpiration:!0,description:`Upload an authorization letter or Special Power of Attorney showing authority to list or manage the property.`},{key:`bank_account_proof`,name:`Bank account proof`,category:`Payout`,profiles:[`individual_property_partner`,`business_property_partner`,`property_manager_authorized_representative`],inputType:`file`,required:!0,hasExpiration:!1,description:`Upload a bank certificate, statement, or account confirmation showing the payout account name.`}],G=[{id:`REQ-001`,code:`valid_government_id`,name:`Valid government-issued ID`,category:`Identity`,inputType:`file`,partnerProfiles:[`individual_property_partner`,`property_manager_authorized_representative`],country:`Philippines`,description:`Upload a clear front and back copy of a current government-issued photo ID.`,placeholder:``,required:!0,conditional:!1,acceptedTypes:[`pdf`,`jpg`,`jpeg`,`png`],maximumFiles:2,maximumSizeMb:10,hasExpiration:!0,minimumLength:null,maximumLength:null,minimumValue:null,maximumValue:null,selectOptions:[],status:`active`,sortOrder:1},{id:`REQ-002`,code:`business_registration_certificate`,name:`DTI, SEC, or CDA registration`,category:`Business registration`,inputType:`file`,partnerProfiles:[`business_property_partner`],country:`Philippines`,description:`Upload the applicable certificate of business or entity registration.`,placeholder:``,required:!0,conditional:!1,acceptedTypes:[`pdf`,`jpg`,`jpeg`,`png`],maximumFiles:1,maximumSizeMb:10,hasExpiration:!1,minimumLength:null,maximumLength:null,minimumValue:null,maximumValue:null,selectOptions:[],status:`active`,sortOrder:2},{id:`REQ-003`,code:`bir_certificate_2303`,name:`BIR Certificate of Registration`,category:`Tax registration`,inputType:`file`,partnerProfiles:[`business_property_partner`],country:`Philippines`,description:`Upload the BIR Certificate of Registration, commonly BIR Form 2303.`,placeholder:``,required:!0,conditional:!1,acceptedTypes:[`pdf`,`jpg`,`jpeg`,`png`],maximumFiles:1,maximumSizeMb:10,hasExpiration:!1,minimumLength:null,maximumLength:null,minimumValue:null,maximumValue:null,selectOptions:[],status:`active`,sortOrder:3},{id:`REQ-004`,code:`sanitary_permit`,name:`Sanitary permit`,category:`Health and safety`,inputType:`file`,partnerProfiles:[`business_property_partner`],country:`Philippines`,description:`Upload the current sanitary permit for the accommodation establishment, when applicable.`,placeholder:``,required:!0,conditional:!0,acceptedTypes:[`pdf`,`jpg`,`jpeg`,`png`],maximumFiles:1,maximumSizeMb:10,hasExpiration:!0,minimumLength:null,maximumLength:null,minimumValue:null,maximumValue:null,selectOptions:[],status:`active`,sortOrder:4},{id:`REQ-005`,code:`dot_accreditation`,name:`DOT accreditation`,category:`Tourism compliance`,inputType:`file`,partnerProfiles:[`business_property_partner`],country:`Philippines`,description:`Upload the current Department of Tourism accreditation certificate, when applicable.`,placeholder:``,required:!1,conditional:!0,acceptedTypes:[`pdf`,`jpg`,`jpeg`,`png`],maximumFiles:1,maximumSizeMb:10,hasExpiration:!0,minimumLength:null,maximumLength:null,minimumValue:null,maximumValue:null,selectOptions:[],status:`active`,sortOrder:5}],K=structuredClone(B),q=[],J=`all`,X=e=>String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`),Z=e=>({pending:`Pending review`,documents:`Documents requested`,ready:`Ready to verify`,verified:`Verified`,restricted:`Restricted`,escalated:`Escalated`})[e]||e,Q=e=>({pending:`bg-blue-50 text-blue-700`,documents:`bg-amber-50 text-amber-700`,ready:`bg-emerald-50 text-emerald-700`,verified:`bg-emerald-50 text-emerald-700`,restricted:`bg-rose-50 text-rose-700`,escalated:`bg-rose-50 text-rose-700`})[e]||`bg-slate-100 text-slate-700`,$=e=>({verification:`bg-indigo-50 text-indigo-700`,business:`bg-amber-50 text-amber-700`,payout:`bg-emerald-50 text-emerald-700`})[e]||`bg-slate-100 text-slate-700`}))();export{L as default};