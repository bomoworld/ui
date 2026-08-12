import { openAdminModal } from "../modal.js";

const STORAGE_KEY = "bomo-admin-platform-settings";

export function initializeSystemSettings() {
  const page = document.getElementById("systemSettingsPage");
  const form = page?.querySelector("[data-platform-settings-form]");
  if (!page || !form) return;

  const savedValues = readSavedSettings();
  if (savedValues) applyValues(form, savedValues);

  let baseline = serializeForm(form);
  const saveButton = page.querySelector("[data-settings-save]");
  const setSaveState = () => {
    const isDirty = serializeForm(form) !== baseline;
    saveButton.disabled = !isDirty;
    saveButton.innerHTML = isDirty
      ? '<i class="fa-solid fa-floppy-disk"></i> Save changes'
      : '<i class="fa-solid fa-check"></i> Saved';
  };

  page.querySelector("[data-settings-tabs]")?.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-settings-tab]");
    if (!tab) return;
    page.querySelectorAll("[data-settings-tab]").forEach((item) => item.classList.toggle("is-active", item === tab));
    page.querySelectorAll("[data-settings-panel]").forEach((panel) => panel.classList.toggle("hidden", panel.dataset.settingsPanel !== tab.dataset.settingsTab));
  });

  form.addEventListener("input", setSaveState);
  form.addEventListener("change", setSaveState);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    form.querySelectorAll('input[type="checkbox"]').forEach((input) => { values[input.name] = input.checked; });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    baseline = serializeForm(form);
    const timestamp = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date());
    page.querySelector("[data-settings-last-saved]").textContent = timestamp;
    showNotice(page, "success", "Platform settings saved", "Your configuration is updated for this admin session.");
    setSaveState();
  });

  page.addEventListener("click", (event) => {
    const action = event.target.closest("[data-settings-action]")?.dataset.settingsAction;
    if (!action) return;
    if (action === "view-history") openHistoryModal();
    if (action === "brand-preview") openBrandPreview(form);
    if (action === "fee-preview") openFeePreview(form);
    if (action === "manage-provider") openProviderModal();
    if (action === "maintenance") openMaintenanceModal(page);
  });

  setSaveState();
}

function serializeForm(form) {
  return JSON.stringify([...form.elements].filter((el) => el.name).map((el) => [el.name, el.type === "checkbox" ? el.checked : el.value]));
}

function readSavedSettings() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

function applyValues(form, values) {
  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (!field) return;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else field.value = value;
  });
}

function showNotice(page, type, title, message) {
  const notice = page.querySelector("[data-settings-notice]");
  const success = type === "success";
  notice.className = `flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`;
  notice.innerHTML = `<i class="fa-solid ${success ? "fa-circle-check text-emerald-600" : "fa-triangle-exclamation text-amber-600"} mt-0.5"></i><div><strong class="block">${title}</strong><span>${message}</span></div>`;
  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => notice.classList.add("hidden"), 5000);
}

function openHistoryModal() {
  openAdminModal({
    title: "Platform change history",
    content: `<div class="space-y-5">
      <p class="text-sm text-slate-500">Recent configuration activity in the production environment.</p>
      <div class="space-y-0">
        ${[
          ["Today, 8:42 PM", "Administrator", "Updated support contact details", "fa-address-card"],
          ["Jul 24, 3:18 PM", "M. Santos", "Changed cancellation window from 48 to 24 hours", "fa-calendar-xmark"],
          ["Jul 21, 10:06 AM", "A. Reyes", "Enabled partner identity verification", "fa-user-shield"],
        ].map(([time, user, action, icon]) => `<div class="flex gap-4 border-l-2 border-slate-200 pb-6 pl-5 last:pb-0"><span class="-ml-[31px] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-500"><i class="fa-solid ${icon}"></i></span><div><p class="font-medium text-slate-900">${action}</p><p class="mt-1 text-xs text-slate-500">${time} · ${user}</p></div></div>`).join("")}
      </div>
    </div>`,
  });
}

function openBrandPreview(form) {
  const name = escapeHtml(form.elements.platformName.value || "BOMO");
  const url = escapeHtml(form.elements.platformUrl.value || "bomo.world");
  openAdminModal({
    title: "Brand preview",
    size: "max-w-2xl",
    content: `<div class="overflow-hidden rounded-2xl border border-slate-200">
      <div class="bg-slate-950 px-6 py-5 text-white"><div class="flex items-center justify-between"><strong class="text-xl tracking-tight">${name}</strong><span class="text-xs text-slate-400">${url}</span></div></div>
      <div class="bg-slate-50 p-6"><span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Booking confirmed</span><h3 class="mt-4 text-xl font-semibold text-slate-950">Your stay is all set.</h3><p class="mt-2 text-sm text-slate-500">This is how the platform name and primary styling appear in a typical customer message.</p><button class="mt-5 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">View booking</button></div>
    </div>`,
  });
}

function openFeePreview(form) {
  const room = 5000;
  const fee = room * Number(form.elements.serviceFee.value || 0) / 100;
  const vat = (room + fee) * Number(form.elements.vat.value || 0) / 100;
  const money = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);
  openAdminModal({
    title: "Fee calculation preview",
    size: "max-w-lg",
    content: `<div class="space-y-4"><p class="text-sm text-slate-500">Example guest total for a ${money(room)} room charge.</p><dl class="space-y-3 rounded-2xl bg-slate-50 p-5 text-sm"><div class="flex justify-between"><dt>Room subtotal</dt><dd class="font-semibold">${money(room)}</dd></div><div class="flex justify-between"><dt>Service fee</dt><dd class="font-semibold">${money(fee)}</dd></div><div class="flex justify-between"><dt>VAT</dt><dd class="font-semibold">${money(vat)}</dd></div><div class="flex justify-between border-t border-slate-200 pt-3 text-base"><dt class="font-semibold">Guest total</dt><dd class="font-bold">${money(room + fee + vat)}</dd></div></dl><p class="text-xs leading-5 text-slate-500">Preview only. Property-specific taxes and discounts may affect the final total.</p></div>`,
  });
}

function openProviderModal() {
  const modal = openAdminModal({
    title: "Manage payment provider",
    size: "max-w-xl",
    content: `<form data-provider-form class="space-y-5">
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><i class="fa-solid fa-circle-check mr-2"></i><strong>Stripe is connected</strong><p class="mt-1 pl-6 text-emerald-700">Payments and refunds are processing normally.</p></div>
      <label class="settings-field"><span>Statement descriptor</span><input required maxlength="22" value="BOMO TRAVEL" class="bomo-input w-full"><small>Appears on the guest’s card statement.</small></label>
      <label class="settings-field"><span>Capture method</span><select class="bomo-input w-full"><option>Automatic at confirmation</option><option>Manual within 7 days</option></select></label>
      <div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="settings-secondary-button">Cancel</button><button type="submit" class="settings-primary-button">Save provider settings</button></div>
    </form>`,
  });
  modal.querySelector("[data-provider-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = successState("Provider settings updated", "The updated payment display settings are ready for this session.");
  });
}

function openMaintenanceModal(page) {
  const modal = openAdminModal({
    title: "Configure maintenance mode",
    size: "max-w-xl",
    content: `<form data-maintenance-form class="space-y-5">
      <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Guest bookings will be paused</strong><p class="mt-1 text-amber-800">Existing reservations, admin access, and partner access remain available.</p></div>
      <label class="settings-field"><span>Customer message <b>*</b></span><textarea required rows="4" class="bomo-input w-full">We’re making a few improvements. New bookings will be available again shortly.</textarea></label>
      <label class="settings-field"><span>Expected end time <b>*</b></span><input required type="datetime-local" class="bomo-input w-full"></label>
      <label class="flex items-start gap-3 text-sm text-slate-600"><input required type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-300"> <span>I understand this pauses new bookings across the platform.</span></label>
      <div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="settings-secondary-button">Cancel</button><button type="submit" class="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700">Schedule maintenance</button></div>
    </form>`,
  });
  modal.querySelector("[data-maintenance-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.innerHTML = successState("Maintenance scheduled", "The customer notice and booking pause are staged for the selected time.");
    showNotice(page, "warning", "Maintenance mode scheduled", "Review the schedule in change history before it begins.");
  });
}

function successState(title, message) {
  return `<div class="py-6 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">${title}</h3><p class="mx-auto mt-2 max-w-sm text-sm text-slate-500">${message}</p><button type="button" data-admin-modal-close class="settings-primary-button mt-6">Done</button></div>`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
