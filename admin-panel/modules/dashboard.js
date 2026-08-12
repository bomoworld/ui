import { closeAdminModal, openAdminModal } from "../modal.js";

const initialQueues = {
  properties: [
    { id: "PR-1048", name: "Makati Business Suites", partner: "Juan Dela Cruz", location: "Makati City", submitted: "Today, 9:20 AM", status: "Pending", rooms: 24, documents: "Complete" },
    { id: "PR-1047", name: "Harbor View Residences", partner: "Thea Lim", location: "Cebu City", submitted: "Yesterday", status: "Pending", rooms: 16, documents: "Complete" },
    { id: "PR-1046", name: "Tagaytay Ridge Villas", partner: "Miguel Ramos", location: "Tagaytay", submitted: "Jul 24, 2026", status: "Changes requested", rooms: 8, documents: "Missing tax certificate" },
  ],
  partners: [
    { id: "PA-203", name: "Maria Santos", business: "Santos Hospitality Group", email: "maria@santoshospitality.ph", submitted: "Today, 8:45 AM", status: "Pending", document: "Government ID verified" },
    { id: "PA-202", name: "Arlo Reyes", business: "Reyes Island Stays", email: "arlo@reyesisland.ph", submitted: "Yesterday", status: "Pending", document: "Business registration uploaded" },
    { id: "PA-201", name: "Carmen Ong", business: "Ong City Suites", email: "carmen@ongsuites.ph", submitted: "Jul 24, 2026", status: "More information needed", document: "Bank account details incomplete" },
  ],
  payouts: [
    { id: "PO-7703", partner: "ABC Resort", amount: "₱124,500", period: "Jul 1–15, 2026", requested: "Today, 10:05 AM", status: "Pending", account: "BPI •••• 4432" },
    { id: "PO-7702", partner: "Cebu Beach Resort", amount: "₱86,240", period: "Jul 1–15, 2026", requested: "Yesterday", status: "Pending", account: "BDO •••• 9016" },
    { id: "PO-7701", partner: "Baguio Suites", amount: "₱51,680", period: "Jul 1–15, 2026", requested: "Jul 24, 2026", status: "On hold", account: "Metrobank •••• 2079" },
  ],
  bookings: [
    { id: "BM240001", property: "Manila Grand Hotel", guest: "John Doe", stay: "2 nights · Jul 28–30", total: "₱5,850", status: "Confirmed" },
    { id: "BM240002", property: "Cebu Beach Resort", guest: "Mia Santos", stay: "3 nights · Aug 2–5", total: "₱8,450", status: "Checked in" },
    { id: "BM240003", property: "Baguio Suites", guest: "Noel Reyes", stay: "1 night · Aug 4–5", total: "₱4,250", status: "Pending review" },
    { id: "BM240004", property: "Boracay Paradise Resort", guest: "Lea Cruz", stay: "4 nights · Aug 10–14", total: "₱12,800", status: "Confirmed" },
  ],
  reviews: [
    { id: "VR-8809", property: "Manila Grand Hotel", guest: "Arielle Cruz", submitted: "18 minutes ago", status: "Pending", duration: "01:42", rating: "5.0" },
    { id: "VR-8808", property: "Boracay Paradise Resort", guest: "Emilio Tan", submitted: "42 minutes ago", status: "Pending", duration: "02:14", rating: "4.0" },
    { id: "VR-8807", property: "Siargao Shore House", guest: "Luz Villanueva", submitted: "Today, 7:20 AM", status: "Flagged", duration: "00:57", rating: "3.0" },
  ],
};

function loadQueues() {
  return structuredClone(initialQueues);
}

let queues = loadQueues();

function saveQueues() {
  // UI-only prototype: queue changes remain available while this admin session is open.
}

function labelForQueue(queue) {
  return {
    properties: "Property approvals",
    partners: "Partner verification",
    payouts: "Payout requests",
    bookings: "Booking management",
    reviews: "Video review moderation",
  }[queue];
}

function statusClass(status) {
  if (/(approved|released|verified)/i.test(status)) return "bg-emerald-100 text-emerald-700";
  if (/(hold|changes|more information|flagged)/i.test(status)) return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function pendingRecords(queue) {
  return queues[queue].filter((record) => !/(approved|released|verified)/i.test(record.status));
}

function getRecord(queue, id) {
  return queues[queue].find((record) => record.id === id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function queueRows(queue) {
  const rows = pendingRecords(queue);

  if (!rows.length) {
    return `<tr><td colspan="5" class="px-4 py-10 text-center text-sm text-slate-500">No records currently need attention.</td></tr>`;
  }

  return rows.map((record) => {
    if (queue === "properties") {
      return `<tr class="border-t border-slate-100"><td class="px-4 py-4"><p class="font-medium text-slate-900">${escapeHtml(record.name)}</p><p class="text-xs text-slate-500">${escapeHtml(record.location)} · ${record.rooms} rooms</p></td><td class="px-4 py-4 text-slate-600">${escapeHtml(record.partner)}</td><td class="px-4 py-4 text-slate-600">${escapeHtml(record.submitted)}</td><td class="px-4 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td><td class="px-4 py-4 text-right"><button type="button" data-dashboard-record="${record.id}" class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Review</button></td></tr>`;
    }
    if (queue === "partners") {
      return `<tr class="border-t border-slate-100"><td class="px-4 py-4"><p class="font-medium text-slate-900">${escapeHtml(record.name)}</p><p class="text-xs text-slate-500">${escapeHtml(record.business)}</p></td><td class="px-4 py-4 text-slate-600">${escapeHtml(record.document)}</td><td class="px-4 py-4 text-slate-600">${escapeHtml(record.submitted)}</td><td class="px-4 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td><td class="px-4 py-4 text-right"><button type="button" data-dashboard-record="${record.id}" class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Verify</button></td></tr>`;
    }
    if (queue === "payouts") {
      return `<tr class="border-t border-slate-100"><td class="px-4 py-4"><p class="font-medium text-slate-900">${escapeHtml(record.partner)}</p><p class="text-xs text-slate-500">${escapeHtml(record.period)}</p></td><td class="px-4 py-4 font-medium text-slate-900">${escapeHtml(record.amount)}</td><td class="px-4 py-4 text-slate-600">${escapeHtml(record.requested)}</td><td class="px-4 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td><td class="px-4 py-4 text-right"><button type="button" data-dashboard-record="${record.id}" class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Inspect</button></td></tr>`;
    }
    if (queue === "bookings") {
      return `<tr class="border-t border-slate-100"><td class="px-4 py-4"><p class="font-medium text-slate-900">${escapeHtml(record.id)}</p><p class="text-xs text-slate-500">${escapeHtml(record.guest)}</p></td><td class="px-4 py-4"><p class="font-medium text-slate-900">${escapeHtml(record.property)}</p><p class="text-xs text-slate-500">${escapeHtml(record.stay)}</p></td><td class="px-4 py-4 font-medium text-slate-900">${escapeHtml(record.total)}</td><td class="px-4 py-4"><span class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">${escapeHtml(record.status)}</span></td><td class="px-4 py-4 text-right"><button type="button" data-dashboard-record="${record.id}" class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Manage</button></td></tr>`;
    }
    return `<tr class="border-t border-slate-100"><td class="px-4 py-4"><p class="font-medium text-slate-900">${escapeHtml(record.property)}</p><p class="text-xs text-slate-500">Guest: ${escapeHtml(record.guest)}</p></td><td class="px-4 py-4 text-slate-600">${escapeHtml(record.duration)} · ${escapeHtml(record.rating)} stars</td><td class="px-4 py-4 text-slate-600">${escapeHtml(record.submitted)}</td><td class="px-4 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td><td class="px-4 py-4 text-right"><button type="button" data-dashboard-record="${record.id}" class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Moderate</button></td></tr>`;
  }).join("");
}

function recordLabel(queue, record) {
  if (queue === "properties") return record.name;
  if (queue === "partners") return `${record.name} — ${record.business}`;
  if (queue === "payouts") return `${record.partner} — ${record.amount}`;
  if (queue === "bookings") return `${record.id} — ${record.property}`;
  return `${record.property} — ${record.guest}`;
}

function recordSelector(queue) {
  const label = {
    properties: "Select property to review",
    partners: "Select partner to verify",
    payouts: "Select partner payout",
    bookings: "Select booking to manage",
    reviews: "Select review to moderate",
  }[queue];

  return `<label class="block text-sm font-medium text-slate-700">${label}<select data-dashboard-record-select class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="">Choose a record…</option>${pendingRecords(queue).map((record) => `<option value="${escapeHtml(record.id)}">${escapeHtml(recordLabel(queue, record))}</option>`).join("")}</select></label>`;
}

function openQueue(queue) {
  const config = {
    properties: { route: "properties", headings: ["Property", "Partner", "Submitted", "Status"], description: "Review property details and supporting documents before publishing a listing." },
    partners: { route: "partners", headings: ["Partner", "Documents", "Submitted", "Status"], description: "Verify partner identity and business registration before granting portal access." },
    payouts: { route: "payouts", headings: ["Partner", "Amount", "Requested", "Status"], description: "Inspect settlement totals and payout destinations before releasing funds." },
    bookings: { route: "bookings", headings: ["Booking", "Stay", "Total", "Status"], description: "Manage booking details, status and internal operational notes." },
    reviews: { route: "reviews", headings: ["Review", "Media", "Submitted", "Status"], description: "Moderate guest video reviews to keep the marketplace trustworthy." },
  }[queue];
  const title = `${labelForQueue(queue)} · ${pendingRecords(queue).length} open`;
  const modal = openAdminModal({
    title,
    size: "max-w-5xl",
    content: `
      <div class="space-y-5">
        <p class="text-sm text-slate-500">${config.description}</p>
        ${recordSelector(queue)}
        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600"><tr>${config.headings.map((heading) => `<th class="px-4 py-3 font-medium">${heading}</th>`).join("")}<th class="px-4 py-3"><span class="sr-only">Actions</span></th></tr></thead>
            <tbody>${queueRows(queue)}</tbody>
          </table>
        </div>
        <div class="flex flex-wrap justify-end gap-3"><button type="button" data-dashboard-route="${config.route}" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Open ${escapeHtml(labelForQueue(queue))}</button></div>
      </div>`,
  });

  modal.addEventListener("click", (event) => {
    const recordId = event.target.closest("[data-dashboard-record]")?.dataset.dashboardRecord;
    const route = event.target.closest("[data-dashboard-route]")?.dataset.dashboardRoute;

    if (recordId) openRecord(queue, recordId);
    if (route) {
      closeAdminModal();
      document.querySelector(`[data-admin-link="${route}"]`)?.click();
    }
  });

  modal.querySelector("[data-dashboard-record-select]")?.addEventListener("change", (event) => {
    if (event.target.value) openRecord(queue, event.target.value);
  });
}

function recordDetails(queue, record) {
  const fields = queue === "properties"
    ? [["Property", record.name], ["Partner", record.partner], ["Location", record.location], ["Rooms", record.rooms], ["Documents", record.documents], ["Submitted", record.submitted]]
    : queue === "partners"
      ? [["Partner", record.name], ["Business", record.business], ["Email", record.email], ["Documents", record.document], ["Submitted", record.submitted]]
    : queue === "payouts"
      ? [["Partner", record.partner], ["Amount", record.amount], ["Settlement period", record.period], ["Destination", record.account], ["Requested", record.requested]]
      : queue === "bookings"
        ? [["Booking ID", record.id], ["Guest", record.guest], ["Property", record.property], ["Stay", record.stay], ["Total", record.total], ["Current status", record.status]]
        : [["Property", record.property], ["Guest", record.guest], ["Video duration", record.duration], ["Guest rating", `${record.rating} stars`], ["Submitted", record.submitted]];

  return fields.map(([label, value]) => `<div class="rounded-xl border border-slate-200 bg-slate-50/70 p-3"><dt class="text-xs font-medium uppercase tracking-wide text-slate-500">${escapeHtml(label)}</dt><dd class="mt-1 text-sm font-medium text-slate-900">${escapeHtml(value)}</dd></div>`).join("");
}

function managementFields(queue, record) {
  if (queue === "properties") {
    return `<div class="grid gap-4 sm:grid-cols-2"><label class="block text-sm font-medium text-slate-700">Review outcome<select data-dashboard-status class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="Approved">Approve listing</option><option value="Changes requested">Request changes</option></select></label><label class="block text-sm font-medium text-slate-700">Assigned reviewer<select data-dashboard-assignee class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Operations Manager</option><option>Trust & Safety Lead</option><option>Rick Grimes</option></select></label><label class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 sm:col-span-2"><input type="checkbox" checked> Publish the listing immediately after approval</label></div>`;
  }
  if (queue === "partners") {
    return `<div class="grid gap-4 sm:grid-cols-2"><label class="block text-sm font-medium text-slate-700">Verification outcome<select data-dashboard-status class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="Verified">Verify partner</option><option value="More information needed">Request additional documents</option></select></label><label class="block text-sm font-medium text-slate-700">Risk review<select data-dashboard-assignee class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Standard review</option><option>Enhanced review</option><option>Escalate to compliance</option></select></label><label class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 sm:col-span-2"><input type="checkbox" checked> Enable partner portal access after verification</label></div>`;
  }
  if (queue === "payouts") {
    return `<div class="grid gap-4 sm:grid-cols-2"><label class="block text-sm font-medium text-slate-700">Payout decision<select data-dashboard-status class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="Released">Release payout</option><option value="On hold">Place payout on hold</option></select></label><label class="block text-sm font-medium text-slate-700">Release date<input type="date" class="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"></label><label class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 sm:col-span-2"><input type="checkbox" checked> Send the partner a payout confirmation email</label></div>`;
  }
  if (queue === "bookings") {
    return `<div class="grid gap-4 sm:grid-cols-2"><label class="block text-sm font-medium text-slate-700">Booking status<select data-dashboard-status class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="Confirmed">Confirmed</option><option value="Flagged">Flag for review</option><option value="Cancelled">Cancel booking</option></select></label><label class="block text-sm font-medium text-slate-700">Assigned operations lead<select data-dashboard-assignee class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Operations Manager</option><option>Guest Support Lead</option><option>Finance Administrator</option></select></label><label class="block text-sm font-medium text-slate-700 sm:col-span-2">Check-in instruction<textarea class="mt-2 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm" placeholder="Add an internal note for check-in or escalation."></textarea></label></div>`;
  }
  return `<div class="grid gap-4 sm:grid-cols-2"><label class="block text-sm font-medium text-slate-700">Moderation decision<select data-dashboard-status class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="Approved">Approve review</option><option value="Flagged">Flag for investigation</option></select></label><label class="block text-sm font-medium text-slate-700">Visibility<select data-dashboard-assignee class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Publish to property page</option><option>Keep private</option></select></label><label class="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 sm:col-span-2"><input type="checkbox"> Escalate potential policy violation to Trust & Safety</label></div>`;
}

function openRecord(queue, id) {
  const record = getRecord(queue, id);
  if (!record) return;

  const action = {
    properties: ["Approve property", "Request changes"],
    partners: ["Verify partner", "Request documents"],
    payouts: ["Release payout", "Place on hold"],
    bookings: ["Confirm booking", "Flag booking"],
    reviews: ["Approve review", "Flag review"],
  }[queue];
  const title = queue === "properties" ? record.name : queue === "partners" ? record.name : queue === "payouts" ? record.partner : queue === "bookings" ? record.id : record.property;
  const modal = openAdminModal({
    title,
    size: "max-w-3xl",
    content: `
      <div class="space-y-5">
        <dl class="grid gap-3 sm:grid-cols-2">${recordDetails(queue, record)}</dl>
        <div class="rounded-2xl border border-slate-200 p-4"><p class="text-sm font-semibold text-slate-900">Administration controls</p><div class="mt-4">${managementFields(queue, record)}</div></div>
        <div class="rounded-2xl bg-slate-50 p-4"><p class="text-sm font-medium text-slate-900">Decision note</p><textarea data-dashboard-note class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Add an internal note for the audit trail (optional)"></textarea></div>
        <div class="flex flex-wrap justify-end gap-3"><button type="button" data-dashboard-route="${({ properties: "properties", partners: "partners", payouts: "payouts", bookings: "bookings", reviews: "reviews" }[queue])}" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Open management page</button><button type="button" data-dashboard-decision="secondary" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">${action[1]}</button><button type="button" data-dashboard-decision="primary" class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">${action[0]}</button></div>
      </div>`,
  });

  modal.addEventListener("click", (event) => {
    const decision = event.target.closest("[data-dashboard-decision]")?.dataset.dashboardDecision;
    const route = event.target.closest("[data-dashboard-route]")?.dataset.dashboardRoute;

    if (route) {
      closeAdminModal();
      document.querySelector(`[data-admin-link="${route}"]`)?.click();
      return;
    }

    if (!decision) return;

    const note = modal.querySelector("[data-dashboard-note]")?.value.trim();
    const selectedStatus = modal.querySelector("[data-dashboard-status]")?.value;
    const nextStatus = decision === "primary"
      ? (selectedStatus || ({ properties: "Approved", partners: "Verified", payouts: "Released", bookings: "Confirmed", reviews: "Approved" }[queue]))
      : ({ properties: "Changes requested", partners: "More information needed", payouts: "On hold", bookings: "Flagged", reviews: "Flagged" }[queue]);

    record.status = nextStatus;
    record.lastNote = note || "No internal note added.";
    saveQueues();
    updateQueueCounts();
    showDecisionConfirmation(queue, nextStatus, record.lastNote);
  });
}

function showDecisionConfirmation(queue, status, note) {
  openAdminModal({
    title: "Decision recorded",
    content: `<div class="py-4 text-center"><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><i class="fa-solid fa-check"></i></div><p class="mt-4 font-semibold text-slate-900">${escapeHtml(status)}</p><p class="mx-auto mt-2 max-w-md text-sm text-slate-500">${escapeHtml(note)}</p><div class="mt-6 flex justify-center gap-3"><button type="button" data-dashboard-reopen="${queue}" class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Back to queue</button><button type="button" data-admin-modal-close class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700">Done</button></div></div>`,
  }).addEventListener("click", (event) => {
    const reopenQueue = event.target.closest("[data-dashboard-reopen]")?.dataset.dashboardReopen;
    if (reopenQueue) openQueue(reopenQueue);
  });
}

function updateQueueCounts() {
  document.querySelectorAll("[data-dashboard-count]").forEach((count) => {
    const queue = count.dataset.dashboardCount;
    const total = queues[queue] ? pendingRecords(queue).length : 0;
    count.textContent = `${total} pending`;
  });
}

export default function initializeDashboard() {
  const content = document.getElementById("admin-content-module");
  if (!content) return;

  content.querySelectorAll("[data-dashboard-queue]").forEach((button) => {
    button.addEventListener("click", () => {
      const queue = button.dataset.dashboardQueue;
      if (queues[queue]) openQueue(queue);
    });
  });

  content.querySelector("[data-dashboard-bookings]")?.addEventListener("click", () => openQueue("bookings"));
  content.querySelectorAll("[data-dashboard-booking]").forEach((button) => {
    button.addEventListener("click", () => openRecord("bookings", button.dataset.dashboardBooking));
  });

  updateQueueCounts();
}
