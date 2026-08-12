import { closeAdminModal, openAdminModal } from "./modal.js";

const adminPages = new Set([
  "dashboard",
  "properties",
  "partners",
  "bookings",
  "payments",
  "payouts",
  "reviews",
  "support",
  "analytics",
  "promotions",
  "content-management",
  "content-editor",
  "admin-users",
  "system-settings",
]);

const pageTitles = {
  dashboard: "Dashboard",
  properties: "Property Management",
  partners: "Partner Management",
  bookings: "Booking Management",
  payments: "Payment Operations Center",
  payouts: "Payout & Rewards Operations Center",
  reviews: "Review Moderation Operations",
  support: "Concerns & Support",
  analytics: "Analytics & Reporting Center",
  promotions: "Promotions & Discount Management",
  "content-management": "Content Management",
  "content-editor": "Content Editor",
  "admin-users": "Admin Users & Permissions",
  "system-settings": "Platform Administration",
};

export async function initializeAdminPanel() {
  await loadComponents();

  initializeRouter();
  initializeMobileSidebar();
  initializeDropdowns();
  initializeTopbarMenus(); // add here
  initializeGlobalSearch();

  await loadModule();
}

async function loadComponents() {
  await Promise.all([
    loadHTML("./admin-panel/components/sidebar.html", "#admin-sidebar-module"),
    loadHTML("./admin-panel/components/topbar.html", "#admin-topbar-module"),
    loadHTML("./admin-panel/components/footer.html", "#admin-footer-module"),
  ]);
}

async function loadModule() {
  const params = new URLSearchParams(window.location.search);

  const requestedPage = params.get("page") || "dashboard";
  const page = adminPages.has(requestedPage) ? requestedPage : "dashboard";

  if (page !== requestedPage) {
    history.replaceState({ page }, "", "?page=dashboard");
  }

  await loadPage(page);
}

async function loadPage(page) {
  if (!adminPages.has(page)) {
    await loadModule();
    return;
  }

  const container = document.querySelector("#admin-content-module");

  if (!container) return;

  closeAdminModal({ restoreFocus: false });

  container.innerHTML = `
    <div class="flex items-center justify-center h-[60vh]">
      <i class="fa-solid fa-spinner fa-spin text-2xl text-blue-600"></i>
    </div>
  `;

  await loadHTML(`./admin-panel/pages/${page}.html`, "#admin-content-module");

  setActiveSidebar(page);
  updateTopbar(page);

  await initializePageModule(page);
}
export { loadPage };

function initializeRouter() {
  document.addEventListener("click", async (event) => {
    const nav = event.target.closest("[data-admin-link]");

    if (!nav) return;

    event.preventDefault();

    const page = nav.dataset.adminLink;

    history.pushState({ page }, "", `?page=${page}`);

    await loadPage(page);
  });

  window.addEventListener("popstate", async () => {
    await loadModule();
  });
}

async function initializePageModule(page) {
  try {
    const module = await import(`./modules/${page}.js`);

    const initializer =
      module[`initialize${toPascalCase(page)}`] || module.default;

    if (typeof initializer === "function") {
      await initializer();
    }
  } catch (error) {
    if (!String(error?.message).includes("Failed to fetch dynamically imported module")) {
      console.error(`Unable to initialize admin page: ${page}`, error);
    }
  }
}

function toPascalCase(text) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

async function loadHTML(url, selector) {
  const container = document.querySelector(selector);

  if (!container) return;

  try {
    const response = await fetch(`${url}?t=${Date.now()}`);

    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <div class="rounded-xl border border-red-200 bg-red-50 p-6">
        Failed to load ${url}
      </div>
    `;
  }
}

function setActiveSidebar(page) {
  document.querySelectorAll("[data-admin-link]").forEach((link) => {
    link.classList.remove("bg-blue-50", "text-blue-600", "font-semibold");

    if (link.dataset.adminLink === page) {
      link.classList.add("bg-blue-50", "text-blue-600", "font-semibold");
    }
  });
}

function updateTopbar(page) {
  const title = document.getElementById("adminPageTitle");

  if (title) {
    title.textContent = pageTitles[page] || "Admin Panel";
  }
}

function initializeMobileSidebar() {
  document.addEventListener("click", (event) => {
    const menuButton = event.target.closest("#mobile-menu-button");

    const closeButton = event.target.closest("#adminSidebarClose");

    const backdrop = event.target.closest("#adminSidebarBackdrop");

    const sidebar = document.getElementById("adminSidebar");

    const overlay = document.getElementById("adminSidebarBackdrop");

    if (menuButton) {
      sidebar?.classList.remove("-translate-x-full");

      overlay?.classList.remove("hidden");
    }

    if (closeButton || backdrop) {
      sidebar?.classList.add("-translate-x-full");

      overlay?.classList.add("hidden");
    }
  });
}

function initializeDropdowns() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-dropdown-trigger]");

    if (!trigger) {
      document
        .querySelectorAll("[data-dropdown-menu]")
        .forEach((menu) => menu.classList.add("hidden"));

      return;
    }

    const dropdown = trigger.closest("[data-dropdown]");

    const menu = dropdown?.querySelector("[data-dropdown-menu]");

    if (!menu) return;

    event.stopPropagation();

    document.querySelectorAll("[data-dropdown-menu]").forEach((item) => {
      if (item !== menu) {
        item.classList.add("hidden");
      }
    });

    menu.classList.toggle("hidden");
  });
}

function initializeGlobalSearch() {
  document.addEventListener("input", (event) => {
    if (event.target.id !== "global-search") return;

    console.log("Search:", event.target.value);
  });
}
function initializeTopbarMenus() {
  document.addEventListener("click", (event) => {
    const globalAction = event.target.closest("[data-admin-global-action]")?.dataset.adminGlobalAction;
    const userBtn = event.target.closest("#adminUserButton");

    const userPanel = document.getElementById("adminUserPanel");

    if (userBtn) {
      event.stopPropagation();
      userPanel?.classList.toggle("hidden");
      return;
    }

    userPanel?.classList.add("hidden");

    if (globalAction === "account") {
      event.preventDefault();
      openAdminAccountModal();
    }

    if (globalAction === "sign-out") {
      event.preventDefault();
      openAdminSignOutModal();
    }
  });
}

function openAdminAccountModal() {
  const modal = openAdminModal({
    title: "Administrator account",
    size: "max-w-xl",
    content: `<form data-admin-account-form class="space-y-5">
      <div class="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><img src="https://i.pravatar.cc/100?img=12" alt="" class="h-14 w-14 rounded-xl object-cover"><div><p class="font-semibold text-slate-900">Administrator</p><p class="text-sm text-slate-500">Super administrator · Production</p></div></div>
      <div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Display name <b>*</b></span><input required name="name" value="Administrator" class="bomo-input w-full"></label><label class="settings-field"><span>Email address <b>*</b></span><input required type="email" name="email" value="admin@bomo.world" class="bomo-input w-full"></label><label class="settings-field"><span>Time zone</span><select name="timezone" class="bomo-input w-full"><option>Asia/Manila (GMT+8)</option><option>UTC</option></select></label><label class="settings-field"><span>Notification digest</span><select name="digest" class="bomo-input w-full"><option>Daily operations digest</option><option>Weekly digest</option><option>Disabled</option></select></label></div>
      <div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> Save account</button></div>
    </form>`,
  });
  modal.querySelector("[data-admin-account-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.innerHTML = modalSuccess("Account updated", "Your administrator preferences were saved for this UI session.");
  });
}

function openAdminSignOutModal() {
  const modal = openAdminModal({
    title: "Sign out of admin panel",
    size: "max-w-lg",
    content: `<form data-admin-signout-form class="space-y-5"><div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><i class="fa-solid fa-shield-halved mr-2"></i><strong>End this administrator session?</strong><p class="mt-1 pl-6 text-amber-800">Any unsaved page changes will be discarded.</p></div><label class="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" name="allDevices" class="mt-1 h-4 w-4 rounded border-slate-300"><span>Also sign out other active admin sessions</span></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Stay signed in</button><button type="submit" class="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"><i class="fa-solid fa-right-from-bracket mr-2"></i> Sign out</button></div></form>`,
  });
  modal.querySelector("[data-admin-signout-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = modalSuccess("Session ended", "The production sign-out is represented in this UI session.");
  });
}

function modalSuccess(title, message) {
  return `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">${title}</h3><p class="mt-2 text-sm text-slate-500">${message}</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
}
