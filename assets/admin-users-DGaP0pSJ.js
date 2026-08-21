import{n as e}from"./modulepreload-polyfill-C2xYpwEn.js";import{i as t,n,r}from"./main-BzDkbtwr.js";function i(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function a(){return w}function o(e){w=e}function s(){window.adminUsersInitialized||(window.adminUsersInitialized=!0,document.addEventListener(`click`,c)),l()}function c(e){let t=e.target.closest(`[data-admin-action]`);if(t)switch(t.dataset.adminAction){case`add-user`:x();break;case`create-role`:S();break;case`manage-user`:C(t.dataset.adminUserName);break;case`create-user`:d();break;case`save-role`:p();break;case`save-user`:f();break;case`reset-password`:h();break;case`suspend-user`:g();break;case`confirm-password-reset`:y(`Password reset sent`,`A password-reset email has been sent to ${m()}.`);break;case`confirm-suspension`:if(!document.querySelector(`[data-suspension-reason]`)?.value.trim()){document.querySelector(`[data-suspension-error]`)?.classList.remove(`hidden`),document.querySelector(`[data-suspension-reason]`)?.focus();break}y(`User suspended`,`${m()} can no longer access the BOMO admin panel.`);break;case`audit-logs`:b();break;case`close-modal`:v();break}}function l(){document.querySelectorAll(`[data-admin-action="manage-user"]`).forEach(e=>{let t=e.closest(`.flex.items-center.gap-4`)?.querySelector(`h3`)?.textContent.trim();t&&(e.dataset.adminUserName=t)});let e=document.querySelector(`#adminUsersPage .divide-y.divide-slate-100`);e&&a().forEach(t=>{e.querySelector(`[data-admin-user-id="${t.id}"]`)||e.insertAdjacentHTML(`beforeend`,u(t))})}function u(e){let t=e.name.split(/\s+/).map(e=>e[0]).join(``).slice(0,2).toUpperCase();return`<div data-admin-user-id="${i(e.id)}" class="px-6 py-5 hover:bg-slate-50"><div class="flex items-center gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-700">${i(t)}</div><div class="flex-1"><div class="flex flex-wrap items-center gap-2"><h3 class="font-semibold">${i(e.name)}</h3><span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">${i(e.role)}</span></div><p class="mt-1 text-sm text-slate-500">${i(e.department)} · Invitation sent</p></div><button data-admin-action="manage-user" data-admin-user-name="${i(e.name)}" class="rounded-xl bg-slate-600 px-4 py-2 text-white">Manage</button></div></div>`}function d(){let e=document.querySelector(`[data-admin-modal]`),t=e?.querySelector(`[name="fullName"]`),n=e?.querySelector(`[name="email"]`),r=e?.querySelector(`[name="department"]`),i=e?.querySelector(`[name="role"]`),s=e?.querySelector(`[data-admin-form-error]`);if(!t?.value.trim()||!n?.validity.valid||!i?.value){s?.classList.remove(`hidden`),t?.focus();return}let c={id:`user-${Date.now()}`,name:t.value.trim(),email:n.value.trim(),department:r?.value.trim()||`Unassigned`,role:i.value,status:`Active`},l=a();l.push(c),o(l),E[c.name]=c;let d=document.querySelector(`#adminUsersPage .divide-y.divide-slate-100`);d&&!d.querySelector(`[data-admin-user-id="${c.id}"]`)&&d.insertAdjacentHTML(`beforeend`,u(c)),y(`Admin user created`,`${c.name} was added as ${c.role}. An invitation email is ready to send.`)}function f(){let e=document.querySelector(`[data-admin-modal]`),t=e?.querySelector(`[name="managedName"]`)?.value.trim(),n=e?.querySelector(`[name="managedEmail"]`)?.value.trim(),r=e?.querySelector(`[name="managedRole"]`)?.value,i=e?.querySelector(`[name="managedStatus"]`)?.value;if(!t||!n||!r||!i){y(`Missing required information`,`Enter a name, email, role and account status before saving changes.`);return}E[t]={...E[t]||{},email:n,role:r,status:i},y(`Changes saved`,`${t}'s profile, role and account status have been updated.`)}function p(){let e=document.querySelector(`[data-admin-modal]`),t=e?.querySelector(`[name="roleName"]`)?.value.trim(),n=e?.querySelector(`[name="roleDescription"]`)?.value.trim(),r=e?.querySelector(`[name="roleAccess"]:checked`)?.parentElement?.textContent.trim();if(!t||!n||!r){(e?.querySelector(`[data-admin-role-error]`))?.classList.remove(`hidden`),e?.querySelector(`[name="roleName"]`)?.focus();return}y(`Role created`,`${t} was created with ${r} as its default permission level.`)}function m(){return document.querySelector(`[data-admin-modal] [name="managedName"]`)?.value.trim()||T||`this administrator`}function h(){_(`
    <div class="bg-white p-6 sm:p-8"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Security action</p><h2 class="mt-1 text-2xl font-bold text-slate-900">Reset ${i(m())}'s password</h2><p class="mt-2 text-sm text-slate-500">Choose how the reset link should be issued.</p></div><button data-admin-action="close-modal" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500" aria-label="Close password reset">✕</button></div><div class="mt-6 space-y-4"><label class="block text-sm font-medium text-slate-700">Link validity<select class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>30 minutes</option><option>1 hour</option><option>24 hours</option></select></label><label class="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked> Sign out the user on every active device</label><label class="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked> Require a new password on next sign-in</label></div><div class="mt-6 flex justify-end gap-3"><button data-admin-action="close-modal" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button><button data-admin-action="confirm-password-reset" class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Send reset link</button></div></div>
  `)}function g(){_(`
    <div class="bg-white p-6 sm:p-8"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Access control</p><h2 class="mt-1 text-2xl font-bold text-slate-900">Suspend ${i(m())}</h2><p class="mt-2 text-sm text-slate-500">This prevents access until an administrator reactivates the account.</p></div><button data-admin-action="close-modal" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500" aria-label="Close suspension">✕</button></div><div class="mt-6 space-y-4"><label class="block text-sm font-medium text-slate-700">Suspension reason<textarea data-suspension-reason required class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Record the reason for this administrative action."></textarea></label><p data-suspension-error class="hidden text-sm font-medium text-red-600">A suspension reason is required for the audit trail.</p><label class="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked> Revoke all active sessions immediately</label></div><div class="mt-6 flex justify-end gap-3"><button data-admin-action="close-modal" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button><button data-admin-action="confirm-suspension" class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white">Suspend account</button></div></div>
  `)}function _(e){return t({title:`Admin user management`,content:e,size:`max-w-7xl`,showHeader:!1})}function v(){n()}function y(e,t){_(`
    <div class="p-6 text-center sm:p-10">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <i class="fa-solid fa-check text-xl"></i>
      </div>
      <h2 class="mt-5 text-2xl font-bold text-slate-900">${e}</h2>
      <p class="mx-auto mt-3 max-w-md text-sm text-slate-500">${t}</p>
      <button data-admin-action="close-modal" class="mt-7 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Done</button>
    </div>
  `)}function b(){_(`
    <div class="bg-white">
      <div class="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur-xl sm:px-8">
        <div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">BOMO Administration</p><h2 class="mt-1 text-2xl font-bold text-slate-900">Audit Logs</h2><p class="text-sm text-slate-500">Recent administrator activity and security events.</p></div>
        <button data-admin-action="close-modal" class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Close audit logs">✕</button>
      </div>
      <div class="bg-slate-50/50 p-6 sm:p-8">
        <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table class="min-w-full text-left text-sm"><thead class="bg-slate-50 text-slate-500"><tr><th class="px-4 py-3 font-medium">Time</th><th class="px-4 py-3 font-medium">Administrator</th><th class="px-4 py-3 font-medium">Action</th><th class="px-4 py-3 font-medium">Scope</th></tr></thead><tbody><tr class="border-t border-slate-100"><td class="px-4 py-4 text-slate-500">3 minutes ago</td><td class="px-4 py-4 font-medium text-slate-900">Rick Grimes</td><td class="px-4 py-4">Updated permission set</td><td class="px-4 py-4">Super Administrator</td></tr><tr class="border-t border-slate-100"><td class="px-4 py-4 text-slate-500">24 minutes ago</td><td class="px-4 py-4 font-medium text-slate-900">Finance Administrator</td><td class="px-4 py-4">Exported payout report</td><td class="px-4 py-4">Finance</td></tr><tr class="border-t border-slate-100"><td class="px-4 py-4 text-slate-500">1 hour ago</td><td class="px-4 py-4 font-medium text-slate-900">Operations Manager</td><td class="px-4 py-4">Approved property update</td><td class="px-4 py-4">Properties</td></tr></tbody></table>
        </div>
      </div>
    </div>
  `)}function x(){_(`
    <div class="bg-white">

      <div
        class="
          sticky top-0 z-20
          flex items-center justify-between
          border-b border-slate-100
          bg-white/95
          backdrop-blur-xl
          px-8 py-6
        "
      >
        <div>
          <div
            class="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-blue-600
            "
          >
            BOMO Administration
          </div>

          <h2 class="mt-1 text-2xl font-bold text-slate-900">
            Add Admin User
          </h2>

          <p class="text-sm text-slate-500">
            Create a new administrative account and assign access permissions.
          </p>
        </div>

        <button
          data-admin-action="close-modal"
          class="
            flex h-11 w-11 items-center justify-center
            rounded-2xl
            border border-slate-200
            bg-white
            text-slate-600
            hover:bg-slate-50
          "
        >
          ✕
        </button>
      </div>

      <div class="bg-slate-50/50 p-8 space-y-8">

        <div
          class="
            rounded-3xl
            border border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <h3 class="text-lg font-semibold text-slate-900 mb-6">
            Account Information
          </h3>

          <div class="grid gap-5 md:grid-cols-2">

            <div>
              <label class="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                required
                placeholder="Enter full name"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  px-4
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  outline-none
                "
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required
                placeholder="name@bomo.com"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  px-4
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  outline-none
                "
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Department
              </label>

              <input
                type="text"
                name="department"
                placeholder="Operations"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  px-4
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  outline-none
                "
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Role Template
              </label>

              <select
                name="role"
                required
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  px-4
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  outline-none
                "
              >
                <option value="">Select Role</option>
                <option>Super Administrator</option>
                <option>Operations</option>
                <option>Finance</option>
                <option>Support</option>
                <option>Moderator</option>
                <option>Custom Role</option>
              </select>
            </div>

          </div>
        </div>

        <div
          class="
            rounded-3xl
            border border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <h3 class="text-lg font-semibold text-slate-900 mb-6">
            Security Settings
          </h3>

          <div class="grid gap-5 md:grid-cols-3">

            <label
              class="
                flex items-center gap-3
                rounded-2xl
                border border-slate-200
                p-4
              "
            >
              <input type="checkbox" checked>
              <span>Require Password Reset</span>
            </label>

            <label
              class="
                flex items-center gap-3
                rounded-2xl
                border border-slate-200
                p-4
              "
            >
              <input type="checkbox">
              <span>Enable MFA</span>
            </label>

            <label
              class="
                flex items-center gap-3
                rounded-2xl
                border border-slate-200
                p-4
              "
            >
              <input type="checkbox" checked>
              <span>Account Active</span>
            </label>

          </div>
        </div>

      </div>
      <p data-admin-form-error class="hidden px-8 pb-4 text-sm font-medium text-red-600">Enter a name, valid email address and role to create an administrator.</p>

      <div
        class="
          sticky bottom-0
          flex items-center justify-between
          border-t border-slate-100
          bg-white/95
          backdrop-blur-xl
          px-8 py-6
        "
      >
        <div class="text-sm text-slate-500">
          An invitation email will be sent after account creation.
        </div>

        <div class="flex gap-3">
          <button
            data-admin-action="close-modal"
            class="
              px-5 py-3
              rounded-2xl
              border border-slate-200
              bg-white
            "
          >
            Cancel
          </button>

          <button
            data-admin-action="create-user"
            class="
              px-5 py-3
              rounded-2xl
              bg-slate-900
              text-white
              font-medium
            "
          >
            Create User
          </button>
        </div>
      </div>

    </div>
  `)}function S(){_(`
    <div class="bg-white">

      <div
        class="
          sticky top-0 z-20
          flex items-center justify-between
          border-b border-slate-300
          bg-white/95
          backdrop-blur-xl
          px-8 py-6
        "
      >
        <div>
          <div
            class="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-emerald-600
            "
          >
            BOMO Administration
          </div>

          <h2 class="mt-1 text-2xl font-bold text-slate-900">
            Create Custom Role
          </h2>

          <p class="text-sm text-slate-500">
            Configure reusable permissions and access scopes.
          </p>
        </div>

        <button
          data-admin-action="close-modal"
          class="
            flex h-11 w-11 items-center justify-center
            rounded-2xl
            border border-slate-300
            bg-white
            text-slate-600
            hover:bg-slate-50
          "
        >
          ✕
        </button>
      </div>

      <div class="bg-slate-50/50 p-8 space-y-8">

        <div
          class="
            rounded-3xl
            border border-slate-300
            bg-white
            p-6
          "
        >
          <h3 class="text-lg font-semibold text-slate-900 mb-6">
            Role Information
          </h3>

          <div class="space-y-5">

            <div>
              <label class="block text-sm font-medium mb-2">
                Role Name
              </label>

              <input
                type="text"
                name="roleName"
                required
                placeholder="Operations Manager"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-300
                  px-4
                  outline-none
                  focus:border-emerald-500
                "
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Role Description
              </label>

              <textarea
                name="roleDescription"
                required
                rows="4"
                placeholder="Describe the responsibilities and permissions for this role."
                class="
                  w-full
                  rounded-2xl
                  border border-slate-300
                  p-4
                  outline-none
                  focus:border-emerald-500
                "
              ></textarea>
            </div>

          </div>
        </div>

        <div
          class="
            rounded-3xl
            border border-slate-300
            bg-white
            p-6
          "
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-900">
              Default Permission Level
            </h3>

            <span
              class="
                rounded-full
                border border-slate-300
                px-3 py-1
                text-xs font-medium
              "
            >
              Optional
            </span>
          </div>

          <div class="grid gap-4 md:grid-cols-4">

            <label
              class="
                flex cursor-pointer items-center gap-3
                rounded-2xl
                border border-slate-300
                p-4
              "
            >
              <input type="radio" name="roleAccess">
              <span>View Only</span>
            </label>

            <label
              class="
                flex cursor-pointer items-center gap-3
                rounded-2xl
                border border-slate-300
                p-4
              "
            >
              <input type="radio" name="roleAccess">
              <span>Manage</span>
            </label>

            <label
              class="
                flex cursor-pointer items-center gap-3
                rounded-2xl
                border border-slate-300
                p-4
              "
            >
              <input type="radio" name="roleAccess">
              <span>Approve</span>
            </label>

            <label
              class="
                flex cursor-pointer items-center gap-3
                rounded-2xl
                border border-slate-300
                p-4
              "
            >
              <input type="radio" name="roleAccess">
              <span>Full Access</span>
            </label>

          </div>
        </div>
        <p data-admin-role-error class="hidden text-sm font-medium text-red-600">Enter a role name, description and default permission level.</p>

      </div>

      <div
        class="
          sticky bottom-0
          flex items-center justify-between
          border-t border-slate-300
          bg-white/95
          backdrop-blur-xl
          px-8 py-6
        "
      >
        <div class="text-sm text-slate-500">
          Roles can be assigned to multiple users.
        </div>

        <div class="flex gap-3">

          <button
            data-admin-action="close-modal"
            class="
              px-5 py-3
              rounded-2xl
              border border-slate-300
              bg-white
            "
          >
            Cancel
          </button>

          <button
            data-admin-action="save-role"
            class="
              px-5 py-3
              rounded-2xl
              bg-emerald-600
              text-white
              font-medium
            "
          >
            Create Role
          </button>

        </div>
      </div>

    </div>
  `)}function C(e=`Rick Grimes`){T=e;let t=E[e]||a().find(t=>t.name===e)||E[`Rick Grimes`],n=i(e),r=i(t.email),o=i(t.role);_(`
    <div class="bg-white">

      <div
        class="
          sticky top-0 z-20
          flex items-center justify-between
          border-b border-slate-300
          bg-white/95
          backdrop-blur-xl
          px-8 py-6
        "
      >
        <div>
          <div
            class="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-blue-600
            "
          >
            BOMO Administration
          </div>

          <h2 class="mt-1 text-2xl font-bold text-slate-900">
            Manage User
          </h2>

          <p class="text-sm text-slate-500">
            User profile, permissions, scopes and security controls.
          </p>
        </div>

        <button
          data-admin-action="close-modal"
          class="
            flex h-11 w-11 items-center justify-center
            rounded-2xl
            border border-slate-300
            bg-white
            text-slate-600
          "
        >
          ✕
        </button>
      </div>

      <div class="bg-slate-50/50 p-8 space-y-8">

        <div
          class="
            rounded-3xl
            border border-slate-300
            bg-white
            p-6
          "
        >
          <h3 class="text-lg font-semibold text-slate-900 mb-6">
            User Information
          </h3>

          <div class="grid gap-5 lg:grid-cols-4">

            <div>
              <label class="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="managedName"
                value="${n}"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-300
                  px-4
                  outline-none
                "
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="managedEmail"
                value="${r}"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-300
                  px-4
                  outline-none
                "
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Account Status
              </label>

              <select
                name="managedStatus"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-300
                  px-4
                "
              >
                <option selected>${i(t.status||`Active`)}</option>
                <option>Suspended</option>
                <option>Disabled</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                Role
              </label>

              <select
                name="managedRole"
                class="
                  w-full h-12
                  rounded-2xl
                  border border-slate-300
                  px-4
                "
              >
                <option selected>${o}</option>
                <option>Operations</option>
                <option>Finance</option>
                <option>Support</option>
                <option>Custom Role</option>
              </select>
            </div>

          </div>
        </div>

        <div
          class="
            rounded-3xl
            border border-slate-300
            bg-white
            overflow-hidden
          "
        >
          <div class="border-b border-slate-300 px-6 py-5">
            <h3 class="font-semibold text-slate-900">
              Module Permissions
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[1400px]">

              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-4 text-left">
                    Module
                  </th>

                  <th class="px-6 py-4 text-center">
                    View
                  </th>

                  <th class="px-6 py-4 text-center">
                    Create
                  </th>

                  <th class="px-6 py-4 text-center">
                    Edit
                  </th>

                  <th class="px-6 py-4 text-center">
                    Approve
                  </th>

                  <th class="px-6 py-4 text-center">
                    Delete
                  </th>

                  <th class="px-6 py-4 text-center">
                    Export
                  </th>

                  <th class="px-6 py-4 text-center">
                    Finance
                  </th>
                </tr>
              </thead>

              <tbody>

                ${[`Dashboard`,`Properties`,`Partners`,`Bookings`,`Guests`,`Payments`,`Payouts`,`Reviews`,`Support`,`Promotions`,`Content`,`Analytics`,`Admin Users`].map(e=>`
                  <tr class="border-t border-slate-300">
                    <td class="px-6 py-4 font-medium">
                      ${e}
                    </td>

                    <td class="text-center">
                      <input type="checkbox" checked>
                    </td>

                    <td class="text-center">
                      <input type="checkbox">
                    </td>

                    <td class="text-center">
                      <input type="checkbox" checked>
                    </td>

                    <td class="text-center">
                      <input type="checkbox">
                    </td>

                    <td class="text-center">
                      <input type="checkbox">
                    </td>

                    <td class="text-center">
                      <input type="checkbox" checked>
                    </td>

                    <td class="text-center">
                      <input type="checkbox">
                    </td>
                  </tr>
                `).join(``)}

              </tbody>

            </table>
          </div>
        </div>

        <div
          class="
            rounded-3xl
            border border-slate-300
            bg-white
            p-6
          "
        >
          <div
            class="flex items-center justify-between mb-6"
          >
            <div>
              <h3 class="font-semibold text-slate-900">
                Geographic Access Scope
              </h3>

              <p class="text-sm text-slate-500 mt-1">
                Restrict access by country, region and city.
              </p>
            </div>

            <select
              class="
                h-11
                rounded-xl
                border border-slate-300
                px-4
              "
            >
              <option>Entire Platform</option>
              <option>Restricted Access</option>
            </select>
          </div>

          <div class="grid gap-5 lg:grid-cols-3">

            <div
              class="
                rounded-2xl
                border border-slate-300
                p-5
              "
            >
              <h4 class="font-semibold mb-4">
                Countries
              </h4>

              <div class="space-y-3">

                <label class="flex items-center gap-3">
                  <input type="checkbox" checked />
                  Philippines
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" />
                  Singapore
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" />
                  Thailand
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" />
                  Vietnam
                </label>

              </div>
            </div>

            <div
              class="
                rounded-2xl
                border border-slate-300
                p-5
              "
            >
              <h4 class="font-semibold mb-4">
                Regions
              </h4>

              <div class="space-y-3">

                <label class="flex items-center gap-3">
                  <input type="checkbox" checked />
                  NCR
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" checked />
                  Region IV-A
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" />
                  Region VII
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" />
                  Region XI
                </label>

              </div>
            </div>

            <div
              class="
                rounded-2xl
                border border-slate-300
                p-5
              "
            >
              <h4 class="font-semibold mb-4">
                Cities
              </h4>

              <div class="space-y-3">

                <label class="flex items-center gap-3">
                  <input type="checkbox" checked />
                  Quezon City
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" checked />
                  Makati
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" />
                  Cebu City
                </label>

                <label class="flex items-center gap-3">
                  <input type="checkbox" />
                  Davao City
                </label>

              </div>
            </div>

          </div>

          
        </div> 
          <div
            class="
              rounded-3xl
              border border-slate-300
              bg-white
              p-6
            "
          >
            <h3 class="font-semibold text-slate-900 mb-6">
              Approval & Workflow Controls
            </h3>

            <div class="grid gap-5 lg:grid-cols-2">

              <div
                class="
                  rounded-2xl
                  border border-slate-300
                  p-5
                "
              >
                <h4 class="font-medium mb-4">
                  User Actions Requiring Approval
                </h4>

                <div class="space-y-3">

                  <label class="flex items-center gap-3">
                    <input type="checkbox" checked />
                    Property Approval
                  </label>

                  <label class="flex items-center gap-3">
                    <input type="checkbox" checked />
                    Property Rejection
                  </label>

                  <label class="flex items-center gap-3">
                    <input type="checkbox" checked />
                    Partner Verification
                  </label>

                  <label class="flex items-center gap-3">
                    <input type="checkbox" />
                    Refund Approval
                  </label>

                  <label class="flex items-center gap-3">
                    <input type="checkbox" />
                    Payout Release
                  </label>

                  <label class="flex items-center gap-3">
                    <input type="checkbox" />
                    User Suspension
                  </label>

                </div>
              </div>

              <div
                class="
                  rounded-2xl
                  border border-slate-300
                  p-5
                "
              >
                <h4 class="font-medium mb-4">
                  Secondary Reviewer
                </h4>

                <select
                  class="
                    w-full h-12
                    rounded-xl
                    border border-slate-300
                    px-4 mb-4
                  "
                >
                  <option>Select Reviewer</option>
                  <option>Rick Grimes</option>
                  <option>Finance Administrator</option>
                  <option>Trust & Safety Lead</option>
                  <option>Operations Manager</option>
                </select>

                <div class="space-y-3">

                  <label class="flex items-center gap-3">
                    <input type="checkbox" checked />
                    Require Dual Approval
                  </label>

                  <label class="flex items-center gap-3">
                    <input type="checkbox" checked />
                    Require Review Before Publish
                  </label>

                  <label class="flex items-center gap-3">
                    <input type="checkbox" />
                    Allow Independent Decisions
                  </label>

                </div>
              </div>

            </div>
          </div>
      <div
        class="
          sticky bottom-0
          flex items-center justify-between
          border-t border-slate-300
          bg-white/95
          backdrop-blur-xl
          px-8 py-6
        "
      >
        <div class="text-sm text-slate-500">
          Last updated 5 minutes ago.
        </div>

        <div class="flex gap-3">

          <button
            data-admin-action="suspend-user"
            class="
              px-5 py-3
              rounded-2xl
              bg-red-600
              text-white
            "
          >
            Suspend User
          </button>

          <button
            data-admin-action="reset-password"
            class="
              px-5 py-3
              rounded-2xl
              border border-slate-300
              bg-white
            "
          >
            Reset Password
          </button>

          <button
            data-admin-action="save-user"
            class="
              px-5 py-3
              rounded-2xl
              bg-slate-900
              text-white
            "
          >
            Save Changes
          </button>

        </div>
      </div>

    </div>
  `)}var w,T,E;e((()=>{r(),w=[],T=``,E={"Rick Grimes":{email:`rick@bomo.com`,role:`Super Administrator`,department:`Executive`,status:`Active`},"Operations Manager":{email:`operations@bomo.com`,role:`Operations`,department:`Operations`,status:`Active`},"Finance Administrator":{email:`finance@bomo.com`,role:`Finance`,department:`Finance`,status:`Active`},"Trust & Safety Lead":{email:`safety@bomo.com`,role:`Support`,department:`Trust & Safety`,status:`Active`}}}))();export{s as default};