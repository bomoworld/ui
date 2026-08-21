import{t as e}from"./modulepreload-polyfill-C2xYpwEn.js";import{a as t,o as n,t as r}from"./main-BzDkbtwr.js";var i=e((()=>{n(),t();var e={"about-bomo":{title:`About BOMO`,description:`Learn about BOMO, our mission, vision and platform ecosystem.`,icon:`fa-building`},"how-bomo-works":{title:`How BOMO Works`,description:`Understand the BOMO journey from booking to rewards.`,icon:`fa-compass`},"contact-us":{title:`Contact Us`,description:`Reach our support, partnership and corporate teams.`,icon:`fa-envelope`},careers:{title:`Careers`,description:`Explore opportunities to join the BOMO team.`,icon:`fa-briefcase`},"press-media":{title:`Press & Media`,description:`Company announcements and media inquiries.`,icon:`fa-newspaper`},"help-center":{title:`Help Center`,description:`Find answers and support resources.`,icon:`fa-circle-question`},faq:{title:`Frequently Asked Questions`,description:`Common questions from guests and partners.`,icon:`fa-comments`},"booking-guide":{title:`Booking Guide`,description:`Learn how bookings and stays work.`,icon:`fa-calendar-check`},"payment-guide":{title:`Payment Guide`,description:`Payment methods, charges and transactions.`,icon:`fa-credit-card`},"video-review-guide":{title:`Video Review Guide`,description:`Guidelines for submitting video reviews.`,icon:`fa-video`},"terms-and-conditions":{title:`Terms & Conditions`,description:`Terms governing use of the BOMO platform.`,icon:`fa-file-contract`},"privacy-policy":{title:`Privacy Policy`,description:`How BOMO collects and protects data.`,icon:`fa-user-shield`},"cookie-policy":{title:`Cookie Policy`,description:`Cookie usage and tracking technologies.`,icon:`fa-cookie-bite`},"cancellation-policy":{title:`Cancellation Policy`,description:`Booking cancellation guidelines.`,icon:`fa-ban`},"refund-policy":{title:`Refund Policy`,description:`Refund eligibility and procedures.`,icon:`fa-receipt`},"become-a-partner":{title:`Become a Partner`,description:`List your property and grow with BOMO.`,icon:`fa-handshake`},"partner-guidelines":{title:`Partner Guidelines`,description:`Requirements and best practices.`,icon:`fa-book-open`},"partner-agreement":{title:`Partner Agreement`,description:`Terms applicable to accommodation partners.`,icon:`fa-file-signature`},"commission-structure":{title:`Commission Structure`,description:`Partner fees and commissions.`,icon:`fa-percent`},"trust-center":{title:`Trust Center`,description:`Safety, verification and trust resources.`,icon:`fa-shield-halved`},"verification-process":{title:`Verification Process`,description:`Guest and partner verification procedures.`,icon:`fa-id-card`},"community-guidelines":{title:`Community Guidelines`,description:`Expected conduct for all users.`,icon:`fa-users`},"content-policy":{title:`Content Policy`,description:`Rules governing uploaded content.`,icon:`fa-file-lines`},"fraud-prevention":{title:`Fraud Prevention`,description:`Measures used to protect users and partners.`,icon:`fa-lock`}},r={Company:[`about-bomo`,`how-bomo-works`,`contact-us`,`careers`,`press-media`],Support:[`help-center`,`faq`,`booking-guide`,`payment-guide`,`video-review-guide`],Policies:[`terms-and-conditions`,`privacy-policy`,`cookie-policy`,`cancellation-policy`,`refund-policy`],Partners:[`become-a-partner`,`partner-guidelines`,`partner-agreement`,`commission-structure`],"Trust & Safety":[`trust-center`,`verification-process`,`community-guidelines`,`content-policy`,`fraud-prevention`]};document.addEventListener(`DOMContentLoaded`,async()=>{await s(`subpages/header.html`,`#subpage-header`),await s(`subpages/sidenav.html`,`#subpage-sidenav`),await i(),await s(`subpages/footer.html`,`#subpage-footer`),c()});async function i(){let t=new URLSearchParams(window.location.search).get(`page`)||`about-bomo`,n=e[t]||e[`about-bomo`];document.title=`${n.title} | BOMO`;let r=document.getElementById(`page-title`),i=document.getElementById(`page-description`),s=document.getElementById(`page-breadcrumb`);r&&(r.textContent=n.title),i&&(i.textContent=n.description),s&&(s.innerHTML=`       Home /
      Information Center /
      ${n.title}
    `),a(t),await o(t)}function a(t){let n=document.getElementById(`subpage-nav`);n&&(n.innerHTML=Object.entries(r).map(([n,r])=>` <div class="mb-8">


      <div
        class="
          px-3
          mb-3
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-slate-400
        "
      >
        ${n}
      </div>

      <div class="space-y-1">

        ${r.map(n=>{let r=e[n];return r?`
              <a
                href="?page=${n}"
                data-page="${n}"
                class="
                  flex items-center gap-3
                  px-3 py-3
                  rounded-xl
                  transition-all
                  ${n===t?`bg-slate-900 text-white`:`text-slate-700 hover:bg-slate-100`}
                "
              >

                <i
                  class="
                    fa-solid
                    ${r.icon}
                    w-5
                  "
                ></i>

                <span
                  class="
                    text-sm
                    font-medium
                  "
                >
                  ${r.title}
                </span>

              </a>
            `:``}).join(``)}

      </div>

    </div>
  `).join(``))}async function o(e){let t=document.getElementById(`subpage-content`);if(t)try{t.innerHTML=`
  <div
    class="
      flex justify-center
      py-20
    "
  >
    <div
      class="
        w-10 h-10
        border-4
        border-slate-200
        border-t-slate-900
        rounded-full
        animate-spin
      "
    ></div>
  </div>
`;let n=await fetch(`subpages/${e}.html?v=${Date.now()}`);if(!n.ok)throw Error(`Page not found`);t.innerHTML=await n.text(),document.dispatchEvent(new CustomEvent(`subpageLoaded`,{detail:{page:e}})),window.scrollTo({top:0,behavior:`smooth`})}catch{t.innerHTML=`
  <div class="text-center py-20">

    <i
      class="
        fa-solid
        fa-triangle-exclamation
        text-5xl
        text-amber-500
      "
    ></i>

    <h3
      class="
        mt-4
        text-2xl
        font-bold
      "
    >
      Page Not Found
    </h3>

    <p
      class="
        mt-2
        text-slate-500
      "
    >
      The requested page
      could not be loaded.
    </p>

  </div>
`}}async function s(e,t){try{let n=await fetch(`${e}?v=${Date.now()}`);if(!n.ok)throw Error();let r=await n.text(),i=document.querySelector(t);i&&(i.innerHTML=r)}catch(e){console.error(e)}}function c(){document.addEventListener(`click`,async e=>{let t=e.target.closest(`[data-page]`);if(!t)return;e.preventDefault();let n=t.dataset.page;history.pushState({},``,`${window.location.pathname}?page=${n}`),await i()}),window.addEventListener(`popstate`,async()=>{await i()})}}));r(),i();