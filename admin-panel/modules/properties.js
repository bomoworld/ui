import { closeAdminModal, openAdminModal } from "../modal.js";

const initialProperties = [
  { id: "PR-1048", name: "Azure Bay Resort", city: "El Nido, Palawan", type: "Resort", partner: "Azure Bay Hospitality", review: "Ownership review", category: "ownership", status: "pending", priority: "high", documents: "7 / 8 complete", missingDocuments: true, reviewer: "Unassigned", submitted: "2 hours ago", sla: "18h left", note: "Missing ownership document for the primary land title." },
  { id: "PR-1047", name: "Paradise Suites", city: "Makati City", type: "Hotel", partner: "Paradise Urban Stays", review: "Listing update", category: "listing", status: "pending", priority: "normal", documents: "Complete", missingDocuments: false, reviewer: "You", submitted: "4 hours ago", sla: "20h left", note: "Amenities, room inventory and listing copy were updated." },
  { id: "PR-1046", name: "Ocean Pearl Residences", city: "Cebu City", type: "Serviced residence", partner: "Pearl Residences Inc.", review: "Ownership transfer", category: "ownership", status: "pending", priority: "normal", documents: "8 / 8 complete", missingDocuments: false, reviewer: "Legal Team", submitted: "6 hours ago", sla: "21h left", note: "Ownership transfer request includes updated legal documents." },
  { id: "PR-1045", name: "Palm Grove Resort", city: "Bohol", type: "Resort", partner: "Palm Grove Leisure", review: "Verification review", category: "ownership", status: "changes", priority: "normal", documents: "6 / 8 complete", missingDocuments: true, reviewer: "Unassigned", submitted: "Today", sla: "23h left", note: "Business registration and proof of address need validation." },
  { id: "PR-1044", name: "Seaside Luxury Hotel", city: "Pasay City", type: "Hotel", partner: "Seaside Holdings", review: "Document review", category: "ownership", status: "pending", priority: "normal", documents: "8 / 8 complete", missingDocuments: false, reviewer: "You", submitted: "3 hours ago", sla: "19h left", note: "SEC registration and business permit were uploaded for verification." },
  { id: "PR-1043", name: "Bluewater Serviced Residences", city: "Quezon City", type: "Serviced residence", partner: "Bluewater Living", review: "Initial listing", category: "listing", status: "pending", priority: "normal", documents: "Complete", missingDocuments: false, reviewer: "Unassigned", submitted: "5 hours ago", sla: "20h left", note: "Initial room, amenities and policies submission is awaiting approval." },
  { id: "PR-1042", name: "Sunset Cliff Villas", city: "Tagaytay", type: "Villa", partner: "Sunset Cliff Estates", review: "Compliance review", category: "compliance", status: "escalated", priority: "high", documents: "Permit missing", missingDocuments: true, reviewer: "Compliance Team", submitted: "Today", sla: "Escalated", note: "Mayor's permit was not supplied during the annual compliance review." },
  { id: "PR-1041", name: "Crystal Bay Hotel", city: "Boracay", type: "Hotel", partner: "Crystal Bay Resorts", review: "Final approval", category: "listing", status: "ready", priority: "normal", documents: "Complete", missingDocuments: false, reviewer: "You", submitted: "30 minutes ago", sla: "Ready", note: "All verification checks are complete. The listing can be published." },
];

let properties = structuredClone(initialProperties);
let activeQuickFilter = "all";
let currentContent;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function statusLabel(status) {
  return {
    pending: "Pending review",
    changes: "Changes requested",
    ready: "Ready to publish",
    approved: "Published",
    escalated: "Escalated",
  }[status] || status;
}

function statusClass(status) {
  return {
    pending: "bg-blue-50 text-blue-700",
    changes: "bg-amber-50 text-amber-700",
    ready: "bg-emerald-50 text-emerald-700",
    approved: "bg-emerald-50 text-emerald-700",
    escalated: "bg-rose-50 text-rose-700",
  }[status] || "bg-slate-100 text-slate-700";
}

function reviewClass(category) {
  return {
    ownership: "bg-indigo-50 text-indigo-700",
    listing: "bg-violet-50 text-violet-700",
    compliance: "bg-amber-50 text-amber-700",
  }[category] || "bg-slate-100 text-slate-700";
}

function getFilterValues() {
  return {
    search: currentContent.querySelector("[data-property-search]")?.value.trim().toLowerCase() || "",
    status: currentContent.querySelector("[data-property-status]")?.value || "all",
    type: currentContent.querySelector("[data-property-type]")?.value || "all",
    reviewer: currentContent.querySelector("[data-property-reviewer]")?.value || "all",
  };
}

function filteredProperties() {
  const filters = getFilterValues();
  return properties.filter((property) => {
    const searchSource = `${property.id} ${property.name} ${property.city} ${property.type} ${property.partner} ${property.review}`.toLowerCase();
    const matchesQuickFilter = activeQuickFilter === "all"
      || (activeQuickFilter === "assigned" && property.reviewer === "You")
      || (activeQuickFilter === "high-risk" && property.priority === "high")
      || property.category === activeQuickFilter;
    return matchesQuickFilter
      && (!filters.search || searchSource.includes(filters.search))
      && (filters.status === "all" || property.status === filters.status)
      && (filters.type === "all" || property.type === filters.type)
      && (filters.reviewer === "all" || property.reviewer === filters.reviewer);
  });
}

function renderRows() {
  const list = currentContent.querySelector("[data-property-list]");
  const visible = filteredProperties();
  const visibleCount = currentContent.querySelector("[data-property-visible-count]");
  const footerCount = currentContent.querySelector("[data-property-footer-count]");

  if (visibleCount) visibleCount.textContent = `${visible.length} ${visible.length === 1 ? "record" : "records"}`;
  if (footerCount) footerCount.textContent = visible.length;

  if (!list) return;
  if (!visible.length) {
    list.innerHTML = `<tr><td colspan="6" class="px-6 py-14 text-center"><div class="mx-auto flex max-w-sm flex-col items-center"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><i class="fa-solid fa-filter-circle-xmark"></i></span><p class="mt-3 font-semibold text-slate-800">No property records match these filters</p><p class="mt-1 text-sm text-slate-500">Clear the filters or choose a different queue.</p><button type="button" class="mt-4 property-button property-button-secondary" data-property-action="clear-filters">Clear filters</button></div></td></tr>`;
    return;
  }

  list.innerHTML = visible.map((property) => `
    <tr class="property-queue-row">
      <td class="px-5 py-4 sm:px-6">
        <div class="flex items-start gap-3">
          <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${property.priority === "high" ? "bg-rose-500" : "bg-blue-500"}" aria-hidden="true"></span>
          <div class="min-w-0"><p class="font-semibold text-slate-900">${escapeHtml(property.name)}</p><p class="mt-0.5 text-xs text-slate-500">${escapeHtml(property.id)} · ${escapeHtml(property.type)} · ${escapeHtml(property.city)}</p><p class="mt-1 text-xs text-slate-400">${escapeHtml(property.partner)} · submitted ${escapeHtml(property.submitted)}</p></div>
        </div>
      </td>
      <td class="px-5 py-4"><div class="flex flex-col items-start gap-1.5"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${reviewClass(property.category)}">${escapeHtml(property.review)}</span><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(property.status)}">${statusLabel(property.status)}</span></div></td>
      <td class="px-5 py-4"><span class="font-medium ${property.missingDocuments ? "text-rose-600" : "text-emerald-600"}">${escapeHtml(property.documents)}</span></td>
      <td class="px-5 py-4"><span class="text-slate-700">${escapeHtml(property.reviewer)}</span></td>
      <td class="px-5 py-4"><span class="font-semibold ${property.priority === "high" ? "text-rose-600" : "text-slate-700"}">${escapeHtml(property.sla)}</span></td>
      <td class="px-5 py-4 text-right"><button type="button" class="property-button property-button-primary property-row-action" data-property-action="review" data-property-id="${escapeHtml(property.id)}">Review <i class="fa-solid fa-arrow-right text-xs"></i></button></td>
    </tr>`).join("");
}

function updateSummary() {
  const totals = {
    open: properties.filter((property) => !["approved"].includes(property.status)).length,
    risk: properties.filter((property) => property.priority === "high" && property.status !== "approved").length,
    documents: properties.filter((property) => property.missingDocuments && property.status !== "approved").length,
    ready: properties.filter((property) => property.status === "ready").length,
  };
  Object.entries(totals).forEach(([key, value]) => {
    const element = currentContent.querySelector(`[data-property-summary="${key}"]`);
    if (element) element.textContent = value;
  });
}

function setQuickFilter(filter) {
  activeQuickFilter = filter;
  currentContent.querySelectorAll("[data-property-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.propertyFilter === filter);
  });
  renderRows();
}

function clearFilters() {
  currentContent.querySelector("[data-property-search]").value = "";
  currentContent.querySelector("[data-property-status]").value = "all";
  currentContent.querySelector("[data-property-type]").value = "all";
  currentContent.querySelector("[data-property-reviewer]").value = "all";
  setQuickFilter("all");
}

function showNotice(message, tone = "success") {
  const notice = currentContent.querySelector("#propertyNotice");
  if (!notice) return;
  notice.textContent = message;
  notice.className = `rounded-lg px-3 py-2 text-sm font-medium ${tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`;
  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => notice.classList.add("hidden"), 5000);
}

function openAssignReviewer() {
  const visible = filteredProperties().filter((property) => property.reviewer === "Unassigned" && property.status !== "approved");
  const modal = openAdminModal({
    title: "Assign property reviewer",
    content: `<form data-property-assign-form class="space-y-5"><div class="rounded-2xl bg-slate-50 p-4"><p class="font-semibold text-slate-900">Assign unassigned records in the current view</p><p class="mt-1 text-sm text-slate-500">${visible.length} ${visible.length === 1 ? "record is" : "records are"} ready to be assigned. Current filters are respected.</p></div><label class="block text-sm font-medium text-slate-700">Reviewer<select name="reviewer" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="You">You — Property Operations</option><option value="Legal Team">Legal Team</option><option value="Compliance Team">Compliance Team</option></select></label><label class="block text-sm font-medium text-slate-700">Assignment note<textarea name="note" class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Optional note for the internal audit trail"></textarea></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-user-check"></i> Assign reviewer</button></div></form>`,
  });
  modal.querySelector("[data-property-assign-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const reviewer = form.get("reviewer");
    visible.forEach((property) => { property.reviewer = reviewer; });
    closeAdminModal();
    renderRows();
    showNotice(`${visible.length} ${visible.length === 1 ? "record was" : "records were"} assigned to ${reviewer}.`);
  });
}

function openReview(id) {
  const property = properties.find((item) => item.id === id);
  if (!property) return;
  const modal = openAdminModal({
    title: `Review · ${escapeHtml(property.name)}`,
    size: "max-w-4xl",
    content: `<form data-property-review-form class="space-y-6"><div class="grid gap-3 sm:grid-cols-2"><dl class="rounded-2xl border border-slate-200 p-4"><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Property</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(property.name)}</dd><dd class="mt-1 text-sm text-slate-500">${escapeHtml(property.type)} · ${escapeHtml(property.city)}</dd></dl><dl class="rounded-2xl border border-slate-200 p-4"><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Partner</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(property.partner)}</dd><dd class="mt-1 text-sm text-slate-500">Reference ${escapeHtml(property.id)}</dd></dl><dl class="rounded-2xl border border-slate-200 p-4"><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Review requirement</dt><dd class="mt-1 font-semibold text-slate-900">${escapeHtml(property.review)}</dd><dd class="mt-1 text-sm text-slate-500">${escapeHtml(property.note)}</dd></dl><dl class="rounded-2xl border border-slate-200 p-4"><dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Evidence</dt><dd class="mt-1 font-semibold ${property.missingDocuments ? "text-rose-600" : "text-emerald-600"}">${escapeHtml(property.documents)}</dd><dd class="mt-1 text-sm text-slate-500">Assigned to ${escapeHtml(property.reviewer)}</dd></dl></div><div class="grid gap-4 sm:grid-cols-2"><label class="block text-sm font-medium text-slate-700">Admin decision<select name="status" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="pending" ${property.status === "pending" ? "selected" : ""}>Keep in review</option><option value="changes" ${property.status === "changes" ? "selected" : ""}>Request changes or documents</option><option value="ready" ${property.status === "ready" ? "selected" : ""}>Approve for publishing</option><option value="approved" ${property.status === "approved" ? "selected" : ""}>Publish property</option><option value="escalated" ${property.status === "escalated" ? "selected" : ""}>Escalate case</option></select></label><label class="block text-sm font-medium text-slate-700">Assign reviewer<select name="reviewer" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="You" ${property.reviewer === "You" ? "selected" : ""}>You — Property Operations</option><option value="Unassigned" ${property.reviewer === "Unassigned" ? "selected" : ""}>Unassigned</option><option value="Legal Team" ${property.reviewer === "Legal Team" ? "selected" : ""}>Legal Team</option><option value="Compliance Team" ${property.reviewer === "Compliance Team" ? "selected" : ""}>Compliance Team</option></select></label></div><label class="block text-sm font-medium text-slate-700">Internal decision note<textarea name="note" required class="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Record the evidence reviewed and the next action.">${escapeHtml(property.note)}</textarea></label><label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input name="notify" type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"><span><strong class="text-slate-800">Notify the partner</strong><br>Send the decision and any required next steps to the partner contact.</span></label><div class="flex flex-wrap justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> Save decision</button></div></form>`,
  });

  modal.querySelector("[data-property-review-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    property.status = form.get("status");
    property.reviewer = form.get("reviewer");
    property.note = form.get("note").trim();
    property.missingDocuments = property.status !== "approved" && property.status !== "ready" && property.documents !== "Complete" && !property.documents.includes("8 / 8");
    closeAdminModal();
    updateSummary();
    renderRows();
    showNotice(`${property.name} was updated to “${statusLabel(property.status)}”.`);
  });
}

function handleClick(event) {
  const control = event.target.closest("[data-property-action]");
  if (!control || !currentContent.contains(control)) return;
  const { propertyAction: action, propertyFilter: filter, propertyId: id } = control.dataset;
  if (action === "filter") setQuickFilter(filter);
  if (action === "clear-filters") clearFilters();
  if (action === "assign-reviewer") openAssignReviewer();
  if (action === "review") openReview(id);
}

export default function initializeProperties() {
  currentContent = document.getElementById("admin-content-module");
  if (!currentContent) return;
  currentContent.addEventListener("click", handleClick);
  currentContent.querySelector("[data-property-search]")?.addEventListener("input", renderRows);
  currentContent.querySelectorAll("[data-property-status], [data-property-type], [data-property-reviewer]").forEach((control) => control.addEventListener("change", renderRows));
  updateSummary();
  renderRows();
}
