import { closeAdminModal, openAdminModal } from "../modal.js";

const initialPromotions = [
  { id: "PRM-0421", name: "Summer Escape", code: "SUMMER2026", type: "Platform", status: "active", offerType: "Percentage", value: 15, audience: "All guests", coverage: "421 properties", owner: "Growth Team", start: "2026-07-01", end: "2026-08-31", uses: 2840, limit: 5000, revenue: "₱8.24M", budget: 1200000, description: "Sitewide promotion across eligible verified properties." },
  { id: "PRM-0422", name: "First Booking", code: "FIRSTBOOK", type: "Promo code", status: "active", offerType: "Fixed", value: 500, audience: "New guests", coverage: "All properties", owner: "You", start: "2026-06-01", end: "2026-12-31", uses: 611, limit: 1000, revenue: "₱2.18M", budget: 500000, description: "New-guest offer limited to one redemption per account." },
  { id: "PRM-0423", name: "Weekend Flash Sale", code: "WEEKEND25", type: "Flash sale", status: "scheduled", offerType: "Percentage", value: 25, audience: "Returning guests", coverage: "84 properties", owner: "Growth Team", start: "2026-08-07", end: "2026-08-09", uses: 0, limit: 1200, revenue: "—", budget: 650000, description: "Three-day mobile-first flash sale for selected properties." },
  { id: "PRM-0424", name: "Partner Spotlight", code: "SPOTLIGHT", type: "Property", status: "draft", offerType: "Percentage", value: 12, audience: "All guests", coverage: "18 properties", owner: "Partner Team", start: "2026-09-01", end: "2026-09-30", uses: 0, limit: 800, revenue: "—", budget: 300000, description: "Co-funded promotion for newly verified partner properties." },
  { id: "PRM-0425", name: "Guest Referral Reward", code: "REFER300", type: "Referral", status: "active", offerType: "Fixed", value: 300, audience: "Referral users", coverage: "All properties", owner: "You", start: "2026-01-01", end: "2026-12-31", uses: 1180, limit: 5000, revenue: "₱4.62M", budget: 1500000, description: "Wallet credit for inviter and referred guest after completed stay." },
  { id: "PRM-0426", name: "July City Break", code: "CITYBREAK", type: "Promo code", status: "active", offerType: "Percentage", value: 10, audience: "Metro Manila guests", coverage: "63 properties", owner: "Growth Team", start: "2026-07-15", end: "2026-07-30", uses: 492, limit: 700, revenue: "₱1.94M", budget: 240000, description: "Short city-stay promotion ending within seven days." },
  { id: "PRM-0427", name: "Holiday Mega Sale", code: "HOLIDAY20", type: "Platform", status: "scheduled", offerType: "Percentage", value: 20, audience: "All guests", coverage: "Pending eligibility", owner: "Unassigned", start: "2026-12-01", end: "2026-12-31", uses: 0, limit: 10000, revenue: "—", budget: 4000000, description: "Annual year-end campaign awaiting final property eligibility." },
];

let promotions = structuredClone(initialPromotions);
let activeQuickFilter = "all";
let currentContent;
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const statusLabel = (status) => ({ active: "Active", scheduled: "Scheduled", draft: "Draft", paused: "Paused", expired: "Expired" }[status] || status);
const statusClass = (status) => ({ active: "bg-emerald-50 text-emerald-700", scheduled: "bg-blue-50 text-blue-700", draft: "bg-amber-50 text-amber-700", paused: "bg-slate-100 text-slate-700", expired: "bg-rose-50 text-rose-700" }[status] || "bg-slate-100 text-slate-700");
const typeClass = (type) => ({ Platform: "bg-pink-50 text-pink-700", "Promo code": "bg-blue-50 text-blue-700", Property: "bg-emerald-50 text-emerald-700", "Flash sale": "bg-violet-50 text-violet-700", Referral: "bg-amber-50 text-amber-700" }[type] || "bg-slate-100 text-slate-700");
const isExpiring = (promotion) => promotion.status === "active" && new Date(promotion.end) <= new Date("2026-08-03");
const formatDate = (value) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
const formatOffer = (promotion) => promotion.offerType === "Percentage" ? `${promotion.value}% off` : `₱${Number(promotion.value).toLocaleString()} off`;

function filteredPromotions() {
  const search = currentContent.querySelector("[data-promotion-search]")?.value.trim().toLowerCase() || "";
  const status = currentContent.querySelector("[data-promotion-status]")?.value || "all";
  const type = currentContent.querySelector("[data-promotion-type]")?.value || "all";
  const owner = currentContent.querySelector("[data-promotion-owner]")?.value || "all";
  return promotions.filter((promotion) => {
    const source = `${promotion.id} ${promotion.name} ${promotion.code} ${promotion.type} ${promotion.audience} ${promotion.owner}`.toLowerCase();
    const quick = activeQuickFilter === "all" || (activeQuickFilter === "mine" && promotion.owner === "You") || (activeQuickFilter === "platform" && promotion.type === "Platform") || (activeQuickFilter === "codes" && promotion.type === "Promo code") || (activeQuickFilter === "draft" && promotion.status === "draft") || (activeQuickFilter === "expiring" && isExpiring(promotion));
    return quick && (!search || source.includes(search)) && (status === "all" || promotion.status === status) && (type === "all" || promotion.type === type) && (owner === "all" || promotion.owner === owner);
  });
}

function renderRows() {
  const visible = filteredPromotions();
  currentContent.querySelector("[data-promotion-visible-count]").textContent = `${visible.length} ${visible.length === 1 ? "record" : "records"}`;
  currentContent.querySelector("[data-promotion-footer-count]").textContent = visible.length;
  const list = currentContent.querySelector("[data-promotion-list]");
  if (!visible.length) {
    list.innerHTML = `<tr><td colspan="6" class="px-6 py-14 text-center"><div class="mx-auto flex max-w-sm flex-col items-center"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><i class="fa-solid fa-filter-circle-xmark"></i></span><p class="mt-3 font-semibold text-slate-800">No campaigns match these filters</p><p class="mt-1 text-sm text-slate-500">Clear the filters or create a new promotion.</p><button type="button" class="mt-4 property-button property-button-secondary" data-promotion-action="clear-filters">Clear filters</button></div></td></tr>`;
    return;
  }
  list.innerHTML = visible.map((promotion) => {
    const percent = promotion.limit ? Math.min(100, Math.round(promotion.uses / promotion.limit * 100)) : 0;
    return `<tr class="property-queue-row"><td class="px-5 py-4 sm:px-6"><div class="flex items-start gap-3"><span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${isExpiring(promotion) ? "bg-rose-500" : promotion.status === "active" ? "bg-emerald-500" : "bg-pink-500"}"></span><div class="min-w-0"><p class="font-semibold text-slate-900">${escapeHtml(promotion.name)}</p><p class="mt-0.5 text-xs text-slate-500">${promotion.id} · <span class="font-mono">${escapeHtml(promotion.code)}</span></p><p class="mt-1 text-xs text-slate-400">${escapeHtml(promotion.description)}</p></div></div></td>
      <td class="px-5 py-4"><div class="flex flex-col items-start gap-1.5"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${typeClass(promotion.type)}">${promotion.type} · ${formatOffer(promotion)}</span><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(promotion.status)}">${statusLabel(promotion.status)}</span></div></td>
      <td class="px-5 py-4"><p class="font-medium text-slate-700">${escapeHtml(promotion.audience)}</p><p class="mt-1 text-xs text-slate-400">${escapeHtml(promotion.coverage)}</p></td>
      <td class="px-5 py-4"><p class="font-semibold text-slate-800">${promotion.uses.toLocaleString()} uses · ${percent}%</p><div class="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-pink-500" style="width:${percent}%"></div></div><p class="mt-1 text-xs text-slate-400">${promotion.revenue} revenue</p></td>
      <td class="px-5 py-4"><p class="font-medium ${isExpiring(promotion) ? "text-rose-600" : "text-slate-700"}">${formatDate(promotion.end)}</p><p class="mt-1 text-xs text-slate-400">${escapeHtml(promotion.owner)}</p></td>
      <td class="px-5 py-4 text-right"><button type="button" class="property-button property-button-primary property-row-action" data-promotion-action="manage" data-promotion-id="${promotion.id}">Manage <i class="fa-solid fa-arrow-right text-xs"></i></button></td></tr>`;
  }).join("");
}

function updateSummary() {
  const values = { active: promotions.filter((item) => item.status === "active").length, scheduled: promotions.filter((item) => item.status === "scheduled").length, draft: promotions.filter((item) => item.status === "draft").length, expiring: promotions.filter(isExpiring).length };
  Object.entries(values).forEach(([key, value]) => { currentContent.querySelector(`[data-promotion-summary="${key}"]`).textContent = value; });
}

function setQuickFilter(filter) {
  activeQuickFilter = filter;
  currentContent.querySelectorAll("[data-promotion-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.promotionFilter === filter));
  renderRows();
}

function clearFilters() {
  currentContent.querySelector("[data-promotion-search]").value = "";
  currentContent.querySelector("[data-promotion-status]").value = "all";
  currentContent.querySelector("[data-promotion-type]").value = "all";
  currentContent.querySelector("[data-promotion-owner]").value = "all";
  setQuickFilter("all");
}

function showNotice(message) {
  const notice = currentContent.querySelector("#promotionNotice");
  notice.textContent = message; notice.className = "rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700";
  clearTimeout(showNotice.timer); showNotice.timer = setTimeout(() => notice.classList.add("hidden"), 5000);
}

function promotionForm(promotion = {}) {
  const editing = Boolean(promotion.id);
  return `<form data-promotion-form class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2"><label class="settings-field sm:col-span-2"><span>Campaign name <b>*</b></span><input required name="name" value="${escapeHtml(promotion.name || "")}" class="bomo-input w-full" placeholder="e.g. Summer Escape"></label><label class="settings-field"><span>Promotion code <b>*</b></span><input required name="code" value="${escapeHtml(promotion.code || "")}" class="bomo-input w-full font-mono uppercase" maxlength="20" placeholder="SUMMER2026"></label><label class="settings-field"><span>Promotion type <b>*</b></span><select required name="type" class="bomo-input w-full">${["Platform", "Promo code", "Property", "Flash sale", "Referral"].map((value) => `<option ${promotion.type === value ? "selected" : ""}>${value}</option>`).join("")}</select></label><label class="settings-field"><span>Offer type <b>*</b></span><select required name="offerType" class="bomo-input w-full"><option ${promotion.offerType === "Percentage" ? "selected" : ""}>Percentage</option><option ${promotion.offerType === "Fixed" ? "selected" : ""}>Fixed</option></select></label><label class="settings-field"><span>Discount value <b>*</b></span><input required type="number" min="1" name="value" value="${promotion.value || 10}" class="bomo-input w-full"></label><label class="settings-field"><span>Start date <b>*</b></span><input required type="date" name="start" value="${promotion.start || ""}" class="bomo-input w-full"></label><label class="settings-field"><span>End date <b>*</b></span><input required type="date" name="end" value="${promotion.end || ""}" class="bomo-input w-full"></label><label class="settings-field"><span>Target audience <b>*</b></span><select required name="audience" class="bomo-input w-full">${["All guests", "New guests", "Returning guests", "Referral users", "Metro Manila guests"].map((value) => `<option ${promotion.audience === value ? "selected" : ""}>${value}</option>`).join("")}</select></label><label class="settings-field"><span>Owner <b>*</b></span><select required name="owner" class="bomo-input w-full">${["You", "Growth Team", "Partner Team", "Unassigned"].map((value) => `<option ${promotion.owner === value ? "selected" : ""}>${value}</option>`).join("")}</select></label><label class="settings-field"><span>Redemption limit <b>*</b></span><input required type="number" min="1" name="limit" value="${promotion.limit || 1000}" class="bomo-input w-full"></label><label class="settings-field"><span>Campaign budget (PHP) <b>*</b></span><input required type="number" min="0" name="budget" value="${promotion.budget || 100000}" class="bomo-input w-full"></label><label class="settings-field sm:col-span-2"><span>Campaign description <b>*</b></span><textarea required rows="3" name="description" class="bomo-input w-full" placeholder="Purpose, eligibility, and important conditions">${escapeHtml(promotion.description || "")}</textarea></label><label class="settings-field sm:col-span-2"><span>Publishing state <b>*</b></span><select required name="status" class="bomo-input w-full"><option value="draft" ${!editing || promotion.status === "draft" ? "selected" : ""}>Save as draft</option><option value="scheduled" ${promotion.status === "scheduled" ? "selected" : ""}>Schedule</option><option value="active" ${promotion.status === "active" ? "selected" : ""}>Publish now</option><option value="paused" ${promotion.status === "paused" ? "selected" : ""}>Pause</option></select></label></div>
    <div class="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs leading-5 text-blue-800"><i class="fa-solid fa-circle-info mr-1"></i> Discounts over 50% or budgets over ₱5M require additional approval before publishing.</div>
    <div class="flex flex-wrap justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> ${editing ? "Save campaign" : "Create campaign"}</button></div>
  </form>`;
}

function openPromotion(promotion) {
  const modal = openAdminModal({ title: promotion ? `Manage · ${escapeHtml(promotion.name)}` : "Create promotion", size: "max-w-3xl", content: promotionForm(promotion) });
  modal.querySelector("[data-promotion-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const endField = event.currentTarget.querySelector('[name="end"]');
    const valueField = event.currentTarget.querySelector('[name="value"]');
    endField.setCustomValidity("");
    valueField.setCustomValidity("");
    if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (new Date(data.end) < new Date(data.start)) { endField.setCustomValidity("End date must be after the start date."); endField.reportValidity(); return; }
    if (data.offerType === "Percentage" && Number(data.value) > 100) { valueField.setCustomValidity("Percentage discounts cannot exceed 100%."); valueField.reportValidity(); return; }
    const numeric = { value: Number(data.value), limit: Number(data.limit), budget: Number(data.budget) };
    if (promotion) Object.assign(promotion, data, numeric);
    else {
      const nextId = Math.max(...promotions.map((item) => Number(item.id.split("-")[1]))) + 1;
      promotions.unshift({ ...data, ...numeric, id: `PRM-${String(nextId).padStart(4, "0")}`, coverage: "Pending eligibility", uses: 0, revenue: "—" });
    }
    closeAdminModal(); updateSummary(); renderRows(); showNotice(`${data.name} was ${promotion ? "updated" : "created"}.`);
  });
}

function handleClick(event) {
  const control = event.target.closest("[data-promotion-action]");
  if (!control || !currentContent.contains(control)) return;
  const { promotionAction: action, promotionFilter: filter, promotionId: id } = control.dataset;
  if (action === "filter") setQuickFilter(filter);
  if (action === "clear-filters") clearFilters();
  if (action === "create") openPromotion();
  if (action === "manage") openPromotion(promotions.find((item) => item.id === id));
}

export default function initializePromotions() {
  currentContent = document.getElementById("admin-content-module");
  if (!currentContent) return;
  currentContent.addEventListener("click", handleClick);
  currentContent.querySelector("[data-promotion-search]")?.addEventListener("input", renderRows);
  currentContent.querySelectorAll("[data-promotion-status], [data-promotion-type], [data-promotion-owner]").forEach((control) => control.addEventListener("change", renderRows));
  updateSummary(); renderRows();
}
