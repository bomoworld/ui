import{t as e}from"./modulepreload-polyfill-C2xYpwEn.js";import{n as t,r as n,t as r}from"./video-reviews-DOlpHCGW.js";var i=e((()=>{r();var e=`bomo-video-reviews-v1`,n=`https://youtu.be/m6kYdPKhig8`,i=`https://www.youtube.com/embed/m6kYdPKhig8?rel=0`,a=document.querySelector(`[data-public-video-grid]`),o=document.querySelector(`[data-public-sort]`),s=document.getElementById(`publicVideoModal`),c=null;l();function l(){u(),f(o?.value||`newest`),o?.addEventListener(`change`,()=>{f(o.value)}),document.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-public-video] .public-video-button`);if(t){p(t.closest(`[data-public-video]`));return}if(e.target.closest(`[data-share-profile]`)){await h();return}(e.target.closest(`[data-modal-close="publicVideoModal"]`)||e.target===s)&&m()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&m()}),window.addEventListener(`storage`,t=>{t.key===e&&(u(),f(o?.value||`newest`))})}function u(){if(!a)return;a.querySelectorAll(`[data-stored-review]`).forEach(e=>e.remove());let e=new Set([...a.querySelectorAll(`[data-public-video]`)].map(e=>g(e.dataset.title))),n=t.all().filter(t=>t.status===`approved`&&!e.has(g(t.title)));n.length&&a.insertAdjacentHTML(`afterbegin`,n.map(d).join(``));let r=document.querySelector(`[data-public-review-count]`);if(r){let e=Number(r.dataset.baseCount)||0;r.textContent=new Intl.NumberFormat(`en-PH`).format(e+n.length)}}function d(e,t){let n=Math.max(1,Math.min(5,Number(e.rating)||5)),r=Math.max(0,Number(e.views)||0),i=`t${t%6+1}`,a=e.publishedAt||e.updatedAt||e.createdAt;return`<article
    class="public-video"
    data-public-video
    data-stored-review
    data-title="${b(e.title)}"
    data-rating="${n}"
    data-views="${r}"
    data-duration="${b(e.duration||`Preview`)}"
    data-date="${b(a)}"
    data-description="${b(e.description||`Verified BOMO stay video review.`)}"
  >
    <button type="button" class="public-video-button">
      <span class="thumb ${i}">
        <span class="public-review-badge">
          <i class="fa-solid fa-circle-check"></i>
          Verified stay
        </span>
        <span class="play"><i class="fa-solid fa-play"></i></span>
        <span class="duration">${b(e.duration||`Preview`)}</span>
      </span>
      <span class="public-video-copy">
        <strong>${b(e.title)}</strong>
        <span class="public-card-meta">
          <span class="public-rating" aria-label="${n} out of 5 stars">
            <i class="fa-solid fa-star"></i>
            ${n.toFixed(1)}
          </span>
          <small><i class="fa-regular fa-eye"></i> ${y(r)} views</small>
        </span>
      </span>
    </button>
  </article>`}function f(e){if(!a)return;let t=[...a.querySelectorAll(`[data-public-video]`)];t.sort((t,n)=>e===`views`?_(n.dataset.views)-_(t.dataset.views):e===`rating`?_(n.dataset.rating)-_(t.dataset.rating):v(n.dataset.date)-v(t.dataset.date)),t.forEach(e=>a.appendChild(e))}function p(e){if(!e||!s)return;c=e.querySelector(`.public-video-button`);let t=e.dataset.title||`Video review`,r=Math.max(1,Math.min(5,_(e.dataset.rating)||5)),a=Math.max(0,_(e.dataset.views)),o=document.getElementById(`publicVideoTitle`);o&&(o.textContent=t);let l=s.querySelector(`[data-public-modal-rating]`);l&&(l.textContent=`${r.toFixed(1)} ★`);let u=s.querySelector(`[data-public-modal-views]`);u&&(u.textContent=y(a));let d=s.querySelector(`[data-public-modal-description]`);d&&(d.textContent=e.dataset.description||`Verified BOMO stay video review.`);let f=s.querySelector(`[data-public-video-frame]`);f&&(f.src=i,f.dataset.videoSource=n),window.BomoAccountUI?.openModal(`publicVideoModal`)}function m(){let e=s?.querySelector(`[data-public-video-frame]`);e&&(e.src=``),c?.focus({preventScroll:!0}),c=null}async function h(){let e={title:document.title,text:`Explore Juan Dela Cruz's verified BOMO travel reviews.`,url:window.location.href};try{if(navigator.share){await navigator.share(e);return}await navigator.clipboard.writeText(e.url),window.BomoAccountUI?.notify(`Profile link copied`)}catch(t){if(t?.name===`AbortError`)return;window.prompt(`Copy this profile link:`,e.url)}}function g(e){return String(e||``).trim().toLowerCase()}function _(e){return Number(String(e||``).replace(/[^\d.]/g,``))||0}function v(e){let t=new Date(e||0);return Number.isNaN(t.getTime())?0:t.getTime()}function y(e){return new Intl.NumberFormat(`en-PH`).format(Number(e)||0)}function b(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}}));n(),i();