 
import { closeAdminModal, openAdminModal } from "../modal.js";

let createdUsers = [];
let selectedAdminName = "";
const defaultUsers = {
  "Rick Grimes": { email: "rick@bomo.com", role: "Super Administrator", department: "Executive", status: "Active" },
  "Operations Manager": { email: "operations@bomo.com", role: "Operations", department: "Operations", status: "Active" },
  "Finance Administrator": { email: "finance@bomo.com", role: "Finance", department: "Finance", status: "Active" },
  "Trust & Safety Lead": { email: "safety@bomo.com", role: "Support", department: "Trust & Safety", status: "Active" },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function savedUsers() {
  return createdUsers;
}

function persistUsers(users) {
  createdUsers = users;
}

export default function initializeAdminUsers() {
  if (!window.adminUsersInitialized) {
    window.adminUsersInitialized = true;
    document.addEventListener("click", handleAdminUsersClick);
  }

  hydrateAdminUsersPage();
}

function handleAdminUsersClick(event) {
  const button = event.target.closest(
    "[data-admin-action]"
  );

  if (!button) return;

  const action =
    button.dataset.adminAction;

  switch (action) {
    case "add-user":
      openAddUserModal();
      break;

    case "create-role":
      openCreateRoleModal();
      break;

    case "manage-user":
      openManageUserModal(button.dataset.adminUserName);
      break;

    case "create-user":
      createAdminUser();
      break;

    case "save-role":
      createAdminRole();
      break;

    case "save-user":
      saveAdminUser();
      break;

    case "reset-password":
      openResetPasswordModal();
      break;

    case "suspend-user":
      openSuspendUserModal();
      break;

    case "confirm-password-reset":
      showSuccess("Password reset sent", `A password-reset email has been sent to ${managedUserName()}.`);
      break;

    case "confirm-suspension":
      if (!document.querySelector("[data-suspension-reason]")?.value.trim()) {
        document.querySelector("[data-suspension-error]")?.classList.remove("hidden");
        document.querySelector("[data-suspension-reason]")?.focus();
        break;
      }
      showSuccess("User suspended", `${managedUserName()} can no longer access the BOMO admin panel.`);
      break;

    case "audit-logs":
      openAuditLogModal();
      break;

    case "close-modal":
      closeModal();
      break;
  }
}

function hydrateAdminUsersPage() {
  document.querySelectorAll('[data-admin-action="manage-user"]').forEach((button) => {
    const name = button.closest(".flex.items-center.gap-4")?.querySelector("h3")?.textContent.trim();
    if (name) button.dataset.adminUserName = name;
  });

  const list = document.querySelector("#adminUsersPage .divide-y.divide-slate-100");
  if (!list) return;

  savedUsers().forEach((user) => {
    if (!list.querySelector(`[data-admin-user-id="${user.id}"]`)) {
      list.insertAdjacentHTML("beforeend", adminUserRow(user));
    }
  });
}

function adminUserRow(user) {
  const initials = user.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return `<div data-admin-user-id="${escapeHtml(user.id)}" class="px-6 py-5 hover:bg-slate-50"><div class="flex items-center gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-700">${escapeHtml(initials)}</div><div class="flex-1"><div class="flex flex-wrap items-center gap-2"><h3 class="font-semibold">${escapeHtml(user.name)}</h3><span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">${escapeHtml(user.role)}</span></div><p class="mt-1 text-sm text-slate-500">${escapeHtml(user.department)} · Invitation sent</p></div><button data-admin-action="manage-user" data-admin-user-name="${escapeHtml(user.name)}" class="rounded-xl bg-slate-600 px-4 py-2 text-white">Manage</button></div></div>`;
}

function createAdminUser() {
  const modal = document.querySelector("[data-admin-modal]");
  const nameInput = modal?.querySelector('[name="fullName"]');
  const emailInput = modal?.querySelector('[name="email"]');
  const departmentInput = modal?.querySelector('[name="department"]');
  const roleInput = modal?.querySelector('[name="role"]');
  const error = modal?.querySelector("[data-admin-form-error]");

  if (!nameInput?.value.trim() || !emailInput?.validity.valid || !roleInput?.value) {
    error?.classList.remove("hidden");
    nameInput?.focus();
    return;
  }

  const user = {
    id: `user-${Date.now()}`,
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    department: departmentInput?.value.trim() || "Unassigned",
    role: roleInput.value,
    status: "Active",
  };
  const users = savedUsers();
  users.push(user);
  persistUsers(users);
  defaultUsers[user.name] = user;
  const list = document.querySelector("#adminUsersPage .divide-y.divide-slate-100");
  if (list && !list.querySelector(`[data-admin-user-id="${user.id}"]`)) {
    list.insertAdjacentHTML("beforeend", adminUserRow(user));
  }
  showSuccess("Admin user created", `${user.name} was added as ${user.role}. An invitation email is ready to send.`);
}

function saveAdminUser() {
  const modal = document.querySelector("[data-admin-modal]");
  const name = modal?.querySelector('[name="managedName"]')?.value.trim();
  const email = modal?.querySelector('[name="managedEmail"]')?.value.trim();
  const role = modal?.querySelector('[name="managedRole"]')?.value;
  const status = modal?.querySelector('[name="managedStatus"]')?.value;

  if (!name || !email || !role || !status) {
    showSuccess("Missing required information", "Enter a name, email, role and account status before saving changes.");
    return;
  }

  defaultUsers[name] = { ...(defaultUsers[name] || {}), email, role, status };
  showSuccess("Changes saved", `${name}'s profile, role and account status have been updated.`);
}

function createAdminRole() {
  const modal = document.querySelector("[data-admin-modal]");
  const name = modal?.querySelector('[name="roleName"]')?.value.trim();
  const description = modal?.querySelector('[name="roleDescription"]')?.value.trim();
  const permission = modal?.querySelector('[name="roleAccess"]:checked')?.parentElement?.textContent.trim();

  if (!name || !description || !permission) {
    const error = modal?.querySelector("[data-admin-role-error]");
    error?.classList.remove("hidden");
    modal?.querySelector('[name="roleName"]')?.focus();
    return;
  }

  showSuccess("Role created", `${name} was created with ${permission} as its default permission level.`);
}

function managedUserName() {
  return document.querySelector('[data-admin-modal] [name="managedName"]')?.value.trim() || selectedAdminName || "this administrator";
}

function openResetPasswordModal() {
  const name = escapeHtml(managedUserName());
  openModal(`
    <div class="bg-white p-6 sm:p-8"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Security action</p><h2 class="mt-1 text-2xl font-bold text-slate-900">Reset ${name}'s password</h2><p class="mt-2 text-sm text-slate-500">Choose how the reset link should be issued.</p></div><button data-admin-action="close-modal" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500" aria-label="Close password reset">✕</button></div><div class="mt-6 space-y-4"><label class="block text-sm font-medium text-slate-700">Link validity<select class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>30 minutes</option><option>1 hour</option><option>24 hours</option></select></label><label class="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked> Sign out the user on every active device</label><label class="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked> Require a new password on next sign-in</label></div><div class="mt-6 flex justify-end gap-3"><button data-admin-action="close-modal" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button><button data-admin-action="confirm-password-reset" class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Send reset link</button></div></div>
  `);
}

function openSuspendUserModal() {
  const name = escapeHtml(managedUserName());
  openModal(`
    <div class="bg-white p-6 sm:p-8"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Access control</p><h2 class="mt-1 text-2xl font-bold text-slate-900">Suspend ${name}</h2><p class="mt-2 text-sm text-slate-500">This prevents access until an administrator reactivates the account.</p></div><button data-admin-action="close-modal" class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500" aria-label="Close suspension">✕</button></div><div class="mt-6 space-y-4"><label class="block text-sm font-medium text-slate-700">Suspension reason<textarea data-suspension-reason required class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Record the reason for this administrative action."></textarea></label><p data-suspension-error class="hidden text-sm font-medium text-red-600">A suspension reason is required for the audit trail.</p><label class="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700"><input type="checkbox" checked> Revoke all active sessions immediately</label></div><div class="mt-6 flex justify-end gap-3"><button data-admin-action="close-modal" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button><button data-admin-action="confirm-suspension" class="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white">Suspend account</button></div></div>
  `);
}

function openModal(content) {
  return openAdminModal({
    title: "Admin user management",
    content,
    size: "max-w-7xl",
    showHeader: false,
  });
}

function closeModal() {
  closeAdminModal();
}

function showSuccess(title, message) {
  openModal(`
    <div class="p-6 text-center sm:p-10">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <i class="fa-solid fa-check text-xl"></i>
      </div>
      <h2 class="mt-5 text-2xl font-bold text-slate-900">${title}</h2>
      <p class="mx-auto mt-3 max-w-md text-sm text-slate-500">${message}</p>
      <button data-admin-action="close-modal" class="mt-7 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Done</button>
    </div>
  `);
}

function openAuditLogModal() {
  openModal(`
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
  `);
}
function openAddUserModal() {
  openModal(`
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
  `);
}

function openCreateRoleModal() {
  openModal(`
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
  `);
}

function openManageUserModal(userName = "Rick Grimes") {
  selectedAdminName = userName;
  const user = defaultUsers[userName] || savedUsers().find((item) => item.name === userName) || defaultUsers["Rick Grimes"];
  const safeName = escapeHtml(userName);
  const safeEmail = escapeHtml(user.email);
  const safeRole = escapeHtml(user.role);
  const safeStatus = escapeHtml(user.status || "Active");

  openModal(`
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
                value="${safeName}"
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
                value="${safeEmail}"
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
                <option selected>${safeStatus}</option>
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
                <option selected>${safeRole}</option>
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

                ${[
                  "Dashboard",
                  "Properties",
                  "Partners",
                  "Bookings",
                  "Guests",
                  "Payments",
                  "Payouts",
                  "Reviews",
                  "Support",
                  "Promotions",
                  "Content",
                  "Analytics",
                  "Admin Users"
                ]
                  .map(
                    (module) => `
                  <tr class="border-t border-slate-300">
                    <td class="px-6 py-4 font-medium">
                      ${module}
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
                `
                  )
                  .join("")}

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
  `);
}

