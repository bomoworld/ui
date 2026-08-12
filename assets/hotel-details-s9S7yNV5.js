import{n as e}from"./modulepreload-polyfill-C2xYpwEn.js";function t(){let e=document.getElementById(`bookingCalendarModal`);if(!e||n)return;n=!0;function t(){document.getElementById(`checkIn`),document.getElementById(`checkOut`),document.getElementById(`calendarContainer`)}function r(){e.classList.remove(`hidden`),document.body.classList.add(`overflow-hidden`),t()}function i(){e.classList.add(`hidden`),document.body.classList.remove(`overflow-hidden`)}document.addEventListener(`click`,t=>{if(t.target.closest(`[data-open-calendar]`)){r();return}if(t.target.closest(`[data-open-booking],#openBookingCalendar,#openBookingCalendar2`)){r();return}if(t.target.closest(`[data-close-calendar],[data-close-booking]`)){i();return}t.target===e&&i()}),document.addEventListener(`keydown`,t=>{t.key===`Escape`&&!e.classList.contains(`hidden`)&&i()})}var n,r=e((()=>{n=!1}));function i(){!document.querySelector(`[data-trip-room]`)||document.getElementById(`tripCartLayer`)||(O=_(),O.reference||(O.reference=b(),v()),k=document.createElement(`div`),k.id=`tripCartLayer`,k.className=`fixed inset-0 z-[99999] hidden`,k.innerHTML=`
    <button type="button" data-close-trip aria-label="Close trip"
      class="absolute inset-0 h-full w-full bg-slate-950/55 opacity-0 backdrop-blur-sm transition-opacity duration-300"></button>
    <aside role="dialog" aria-modal="true" aria-labelledby="tripCartTitle"
      class="absolute inset-y-0 right-0 flex w-full max-w-xl translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300">
      <div class="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <i class="fa-solid fa-suitcase-rolling"></i>
              </span>
              <div>
                <h2 id="tripCartTitle" class="text-xl font-bold text-slate-950">Your Booking</h2>
                <p class="mt-0.5 text-xs text-slate-500">Multiple room types · One booking transaction</p>
              </div>
            </div>
          </div>
          <button type="button" data-close-trip aria-label="Close trip"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="border-b border-slate-100 bg-slate-50 p-5 sm:p-6">
          <div class="mb-4 flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=300"
              alt="Oceanview Beach Resort" class="h-14 w-16 rounded-xl object-cover">
            <div>
              <strong class="text-sm text-slate-900">Oceanview Beach Resort</strong>
              <p class="mt-1 text-xs text-slate-500"><i class="fa-solid fa-location-dot mr-1"></i>Station 1, Boracay Island</p>
            </div>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <label>
              <span class="mb-1.5 block text-xs font-semibold text-slate-600">Check-in</span>
              <input type="date" data-trip-checkin class="bomo-input h-11 w-full">
            </label>
            <label>
              <span class="mb-1.5 block text-xs font-semibold text-slate-600">Check-out</span>
              <input type="date" data-trip-checkout class="bomo-input h-11 w-full">
            </label>
          </div>
          <div class="mt-3 flex items-center justify-between gap-4">
            <label class="flex-1">
              <span class="sr-only">Guests</span>
              <select data-trip-guests class="bomo-input h-11 w-full">
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
                <option value="8">8 Guests</option>
              </select>
            </label>
            <span data-trip-duration class="shrink-0 text-xs font-semibold text-blue-900"></span>
          </div>
        </div>

        <div class="p-5 sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-semibold text-slate-950">Selected rooms</h3>
            <button type="button" data-clear-trip
            class="text-xs font-semibold text-rose-600 transition hover:text-rose-800">Clear booking</button>
          </div>
          <div data-trip-items class="space-y-3"></div>
          <div data-trip-empty class="hidden rounded-2xl border-2 border-dashed border-slate-200 px-6 py-10 text-center">
            <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <i class="fa-solid fa-bed"></i>
            </span>
            <h3 class="mt-4 font-semibold text-slate-900">Your booking is empty</h3>
            <p class="mt-1 text-sm text-slate-500">Add one or more room types to continue.</p>
            <button type="button" data-close-trip class="mt-4 text-sm font-semibold text-blue-900">Browse rooms</button>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200 bg-white p-5 shadow-[0_-12px_35px_rgba(15,23,42,.08)] sm:p-6">
        <div data-trip-pricing class="space-y-2.5 text-sm"></div>
        <button type="button" data-trip-checkout
          class="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">
          Proceed to Booking
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <p class="mt-3 text-center text-xs text-slate-500">All selected rooms use the same stay dates.</p>
      </div>
    </aside>`,document.body.appendChild(k),d(),document.addEventListener(`click`,a),k.querySelector(`[data-trip-checkin]`).addEventListener(`change`,c),k.querySelector(`[data-trip-checkout]`).addEventListener(`change`,c),k.querySelector(`[data-trip-guests]`).addEventListener(`change`,e=>{O.guests=Number(e.target.value),v()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&!k.classList.contains(`hidden`)&&g()}),l())}function a(e){let t=e.target.closest(`[data-add-to-trip]`);if(t){o(t.closest(`[data-trip-room]`));return}if(e.target.closest(`[data-open-trip]`)){h();return}if(e.target.closest(`[data-close-trip]`)){g();return}if(e.target.closest(`[data-close-added-success]`)){p();return}let n=e.target.closest(`[data-trip-quantity]`);if(n){s(n.dataset.roomId,Number(n.dataset.tripQuantity));return}let r=e.target.closest(`[data-remove-trip-room]`);if(r){O.items=O.items.filter(e=>e.id!==r.dataset.removeTripRoom),v(),l();return}if(e.target.closest(`[data-clear-trip]`)){O.items=[],v(),l();return}e.target.closest(`[data-trip-checkout]`)&&O.items.length&&(v(),window.location.href=y())}function o(e){if(!e)return;let t=O.items.find(t=>t.id===e.dataset.roomId);t?t.quantity=Math.min(D,t.quantity+1):O.items.push({id:e.dataset.roomId,name:e.dataset.roomName,price:Number(e.dataset.roomPrice),image:e.dataset.roomImage,details:e.dataset.roomDetails,quantity:1}),v(),l(),m(e),f(e.dataset.roomName)}function s(e,t){let n=O.items.find(t=>t.id===e);n&&(n.quantity=Math.max(1,Math.min(D,n.quantity+t)),v(),l())}function c(){let e=k.querySelector(`[data-trip-checkin]`),t=k.querySelector(`[data-trip-checkout]`);O.checkin=e.value;let n=S(O.checkin,1);t.min=n,(!t.value||t.value<=O.checkin)&&(t.value=n),O.checkout=t.value,v(),l()}function l(){let e=x(O.checkin,O.checkout),t=O.items.reduce((e,t)=>e+t.quantity,0),n=O.items.reduce((t,n)=>t+n.price*n.quantity*e,0),r=Math.round(n*.12),i=n+r;k.querySelector(`[data-trip-checkin]`).value=O.checkin,k.querySelector(`[data-trip-checkout]`).value=O.checkout,k.querySelector(`[data-trip-checkout]`).min=S(O.checkin,1),k.querySelector(`[data-trip-guests]`).value=String(O.guests),k.querySelector(`[data-trip-duration]`).textContent=`${e} night${e===1?``:`s`} · ${t} room${t===1?``:`s`}`;let a=k.querySelector(`[data-trip-items]`),o=k.querySelector(`[data-trip-empty]`);a.classList.toggle(`hidden`,O.items.length===0),o.classList.toggle(`hidden`,O.items.length>0),k.querySelector(`[data-clear-trip]`).classList.toggle(`invisible`,O.items.length===0),a.innerHTML=O.items.map(t=>`
    <article class="rounded-2xl border border-slate-200 p-3.5">
      <div class="flex gap-3">
        <img src="${T(t.image)}" alt="${T(t.name)}" class="h-20 w-20 shrink-0 rounded-xl object-cover">
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <div><h4 class="font-semibold text-slate-900">${T(t.name)}</h4><p class="mt-1 text-xs leading-5 text-slate-500">${T(t.details)}</p></div>
            <button type="button" data-remove-trip-room="${T(t.id)}" aria-label="Remove ${T(t.name)}"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button type="button" data-trip-quantity="-1" data-room-id="${T(t.id)}" aria-label="Decrease quantity"
                class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white"><i class="fa-solid fa-minus text-[10px]"></i></button>
              <span class="min-w-8 text-center text-xs font-bold text-slate-900">${t.quantity}</span>
              <button type="button" data-trip-quantity="1" data-room-id="${T(t.id)}" aria-label="Increase quantity"
                class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 hover:bg-white"><i class="fa-solid fa-plus text-[10px]"></i></button>
            </div>
            <div class="text-right"><strong class="text-sm text-slate-900">${w(t.price*t.quantity*e)}</strong><p class="text-[11px] text-slate-400">${w(t.price)} × ${t.quantity} × ${e} nights</p></div>
          </div>
        </div>
      </div>
    </article>`).join(``),k.querySelector(`[data-trip-pricing]`).innerHTML=`
    <div class="flex justify-between text-slate-600"><span>Room subtotal</span><strong class="text-slate-900">${w(n)}</strong></div>
    <div class="flex justify-between text-slate-600"><span>Taxes & fees</span><strong class="text-slate-900">${w(r)}</strong></div>
    <div class="flex items-end justify-between border-t border-dashed border-slate-300 pt-3"><span class="font-semibold text-slate-900">Estimated total</span><strong class="text-2xl text-blue-900">${w(i)}</strong></div>`,k.querySelector(`[data-trip-checkout]`).disabled=O.items.length===0,document.querySelectorAll(`[data-trip-count]`).forEach(e=>{e.textContent=t}),document.querySelectorAll(`[data-trip-room]`).forEach(e=>{let t=O.items.find(t=>t.id===e.dataset.roomId);e.dataset.tripAdded=t?`true`:`false`;let n=e.querySelector(`[data-add-label]`),r=e.querySelector(`[data-add-to-trip] i`);n&&(n.textContent=t?`Add another (${t.quantity})`:`Add to Booking`),r&&(r.className=`fa-solid ${t?`fa-circle-plus`:`fa-plus`}`)}),u(t,i)}function u(e,t){let n=document.getElementById(`floatingTripButton`);n||(n=document.createElement(`button`),n.id=`floatingTripButton`,n.type=`button`,n.dataset.openTrip=``,n.className=`fixed bottom-5 right-5 z-40 hidden items-center gap-3 rounded-2xl bg-blue-900 px-4 py-3 text-left text-white shadow-[0_18px_45px_rgba(15,23,42,.3)] transition hover:-translate-y-0.5 hover:bg-blue-800 lg:bottom-7 lg:right-7`,document.body.appendChild(n)),n.classList.toggle(`hidden`,e===0),n.classList.toggle(`flex`,e>0),n.innerHTML=`<span class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><i class="fa-solid fa-suitcase-rolling"></i><span class="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold">${e}</span></span><span><strong class="block text-sm">View Booking</strong><small class="text-blue-100">${w(t)} estimated</small></span><i class="fa-solid fa-chevron-right ml-1 text-xs text-blue-200"></i>`}function d(){let e=document.createElement(`div`);e.id=`bookingAddedSuccess`,e.className=`fixed inset-0 z-[100000] hidden items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm`,e.innerHTML=`
    <div role="dialog" aria-modal="true" aria-labelledby="bookingAddedTitle"
      class="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl">
      <div class="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 px-6 pb-8 pt-7 text-white">
        <button type="button" data-close-added-success aria-label="Close"
          class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-xl text-emerald-950 shadow-lg shadow-blue-950/30">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2 id="bookingAddedTitle" class="mt-5 text-2xl font-bold">Added to Booking</h2>
        <p class="mt-2 text-sm leading-6 text-blue-100" data-added-success-copy></p>
      </div>
      <div class="space-y-4 p-6">
        <div class="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <div><span class="text-xs font-medium text-slate-500">Current booking</span><strong data-added-success-count class="mt-1 block text-sm text-slate-900"></strong></div>
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-900"><i class="fa-solid fa-bed"></i></span>
        </div>
        <a href="travel-studio/index.html?pgid=wishlist&view=booking&source=hotel-details" data-proceed-booking
          class="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800">
          Proceed to Booking <i class="fa-solid fa-arrow-right"></i>
        </a>
        <button type="button" data-close-added-success
          class="flex h-13 w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Continue Browsing
        </button>
      </div>
    </div>`,document.body.appendChild(e)}function f(e){let t=document.getElementById(`bookingAddedSuccess`);if(!t)return;let n=O.items.reduce((e,t)=>e+t.quantity,0);t.querySelector(`[data-added-success-copy]`).textContent=`${e} was added. You can add other room types before proceeding.`,t.querySelector(`[data-added-success-count]`).textContent=`${n} room${n===1?``:`s`} · ${O.items.length} room type${O.items.length===1?``:`s`}`,t.querySelector(`[data-proceed-booking]`).href=y(),t.classList.remove(`hidden`),t.classList.add(`flex`),document.body.classList.add(`overflow-hidden`)}function p(){let e=document.getElementById(`bookingAddedSuccess`);e&&(e.classList.add(`hidden`),e.classList.remove(`flex`),document.body.classList.remove(`overflow-hidden`))}function m(e){let t=e.querySelector(`[data-add-to-trip]`);t&&(t.classList.add(`border-emerald-300`,`bg-emerald-50`,`text-emerald-700`),setTimeout(()=>t.classList.remove(`border-emerald-300`,`bg-emerald-50`,`text-emerald-700`),1200))}function h(){k.classList.remove(`hidden`),document.body.classList.add(`overflow-hidden`),requestAnimationFrame(()=>{k.querySelector(`[data-close-trip]`).classList.add(`opacity-100`),k.querySelector(`aside`).classList.remove(`translate-x-full`)})}function g(){k.querySelector(`[data-close-trip]`).classList.remove(`opacity-100`),k.querySelector(`aside`).classList.add(`translate-x-full`),document.body.classList.remove(`overflow-hidden`),setTimeout(()=>k.classList.add(`hidden`),300)}function _(){try{let e=JSON.parse(sessionStorage.getItem(E));if(e&&Array.isArray(e.items))return e}catch{}let e=S(C(new Date),14);return{property:{id:`oceanview-beach-resort`,name:`Oceanview Beach Resort`,location:`Station 1, Boracay Island`,image:`https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=900`},checkin:e,checkout:S(e,3),guests:2,items:[]}}function v(){sessionStorage.setItem(E,JSON.stringify(O))}function y(){return`travel-studio/index.html?${new URLSearchParams({pgid:`wishlist`,view:`booking`,source:`hotel-details`,booking:O.reference}).toString()}`}function b(){return`BOMO-${Date.now().toString(36).toUpperCase()}`}function x(e,t){let n=new Date(`${t}T00:00:00`)-new Date(`${e}T00:00:00`);return Math.max(1,Math.round(n/864e5))}function S(e,t){let n=typeof e==`string`?new Date(`${e}T00:00:00`):new Date(e);return n.setDate(n.getDate()+t),C(n)}function C(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function w(e){return new Intl.NumberFormat(`en-PH`,{style:`currency`,currency:`PHP`,maximumFractionDigits:0}).format(e)}function T(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}var E,D,O,k,A=e((()=>{E=`bomo-trip-cart-v1`,D=5}));async function j(e,t){let n=document.getElementById(e);if(n)try{let e=await fetch(`${t}?v=${Date.now()}`);if(!e.ok)throw Error(`HTTP ${e.status}`);n.innerHTML=await e.text()}catch(e){console.error(`Failed to load ${t}`,e)}}async function M(){await j(`hotel-details-content`,`pages/hotel-details/hotel-details-content.html`),await Promise.all([[`hero-gallery-module`,`pages/hotel-details/modules/hero-gallery.html`],[`hotel-overview-module`,`pages/hotel-details/modules/hotel-overview.html`],[`trust-badges-module`,`pages/hotel-details/modules/trust-badges.html`],[`about-property-module`,`pages/hotel-details/modules/about-property.html`],[`availability-sidebar-module`,`pages/hotel-details/modules/availability-sidebar.html`],[`price-calendar-module`,`pages/hotel-details/modules/price-calendar.html`],[`booking-calendar-modal-module`,`pages/hotel-details/modules/booking-calendar-modal.html`],[`rooms-module`,`pages/hotel-details/modules/rooms.html`],[`amenities-module`,`pages/hotel-details/modules/amenities.html`],[`reviews-module`,`pages/hotel-details/modules/reviews.html`],[`location-module`,`pages/hotel-details/modules/location.html`],[`host-module`,`pages/hotel-details/modules/host.html`]].map(([e,t])=>j(e,t))),N(),P(),t(),i()}function N(){let e=[...document.querySelectorAll(`.gallery-item`)],t=document.getElementById(`galleryLightbox`),n=document.getElementById(`lightboxImage`),r=document.getElementById(`lightboxVideo`),i=document.getElementById(`closeGallery`),a=document.getElementById(`nextGallery`),o=document.getElementById(`prevGallery`);if(!t||!n||!r||!e.length)return;let s=0;function c(i){s=i;let a=e[i];n.classList.add(`hidden`),r.classList.add(`hidden`);let o=a.dataset.type,c=a.dataset.src;o===`video`?(r.src=c,r.classList.remove(`hidden`)):(n.src=c,n.classList.remove(`hidden`)),t.classList.remove(`hidden`),document.body.style.overflow=`hidden`}function l(){t.classList.add(`hidden`),n.src=``,r.src=``,document.body.style.overflow=``}e.forEach((e,t)=>{e.addEventListener(`click`,()=>c(t))}),i?.addEventListener(`click`,l),a?.addEventListener(`click`,()=>{s=(s+1)%e.length,c(s)}),o?.addEventListener(`click`,()=>{s=(s-1+e.length)%e.length,c(s)}),document.addEventListener(`keydown`,e=>{t.classList.contains(`hidden`)||(e.key===`Escape`&&l(),e.key===`ArrowRight`&&a?.click(),e.key===`ArrowLeft`&&o?.click())}),t.addEventListener(`click`,e=>{e.target===t&&l()})}function P(){let e=[...document.querySelectorAll(`.review-media`)],t=document.getElementById(`reviewLightbox`),n=document.getElementById(`reviewImage`),r=document.getElementById(`reviewVideo`),i=document.getElementById(`reviewAuthor`),a=document.getElementById(`reviewRating`),o=document.getElementById(`reviewCaption`),s=document.getElementById(`reviewCounter`),c=document.getElementById(`reviewThumbs`),l=document.getElementById(`closeReviewLightbox`),u=document.getElementById(`reviewPrev`),d=document.getElementById(`reviewNext`);if(!t||!n||!r||!e.length)return;let f=0;function p(){c&&(c.innerHTML=``,e.forEach((e,t)=>{let n=e.dataset.type,r=e.dataset.src,i=document.createElement(`img`);i.src=n===`video`?e.querySelector(`img`)?.src||``:r,i.className=`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 border-transparent hover:border-blue-700 shrink-0`,t===f&&i.classList.add(`border-blue-700`),i.addEventListener(`click`,()=>m(t)),c.appendChild(i)}))}function m(c){f=c;let l=e[c],u=l.dataset.type,d=l.dataset.src;n.classList.add(`hidden`),r.classList.add(`hidden`),r.src=``,u===`video`?(r.src=d,r.classList.remove(`hidden`)):(n.src=d,n.classList.remove(`hidden`)),i.textContent=l.dataset.author||`Guest`,a.textContent=`★ ${l.dataset.rating||`5.0`}`,o.textContent=l.dataset.caption||``,s&&(s.textContent=`Media ${c+1} of ${e.length}`),p(),t.classList.remove(`hidden`),document.body.style.overflow=`hidden`}function h(){t.classList.add(`hidden`),n.src=``,r.src=``,document.body.style.overflow=``}e.forEach((e,t)=>{e.addEventListener(`click`,()=>m(t))}),d?.addEventListener(`click`,()=>{f=(f+1)%e.length,m(f)}),u?.addEventListener(`click`,()=>{f=(f-1+e.length)%e.length,m(f)}),l?.addEventListener(`click`,h),t?.addEventListener(`click`,e=>{e.target===t&&h()}),document.addEventListener(`keydown`,e=>{t.classList.contains(`hidden`)||(e.key===`Escape`&&h(),e.key===`ArrowRight`&&d?.click(),e.key===`ArrowLeft`&&u?.click())})}var F,I;e((()=>{r(),A(),F=document.getElementById(`toggleNearby`),I=document.getElementById(`moreLocations`),F?.addEventListener(`click`,()=>{I.classList.toggle(`hidden`),F.textContent=I.classList.contains(`hidden`)?`View All`:`Show Less`})}))();export{M as initializeHotelDetails};