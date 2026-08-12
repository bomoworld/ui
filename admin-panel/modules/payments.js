import { closeAdminModal, openAdminModal } from "../modal.js";

const initialPayments = [
  { id: "PAY-58392", booking: "BM240821", guest: "John Doe", partner: "Makati Business Suites", amount: 8250, refundable: 8250, method: "GCash", gatewayRef: "gc_8192041", workflow: "Payment failure", state: "Failed", priority: "critical", owner: "Unassigned", category: "failed", created: "14 min ago", sla: "46m left", reason: "Gateway timed out after authorization. Guest reports the wallet was debited.", risk: "Low" },
  { id: "PAY-58345", booking: "BM240822", guest: "Maria Cruz", partner: "Azure Bay Resort", amount: 5800, refundable: 5800, method: "Visa", gatewayRef: "pi_7GH21904", workflow: "Refund review", state: "Refund requested", priority: "high", owner: "Finance Team", category: "refund", created: "38 min ago", sla: "3h left", reason: "Guest requested a full refund under the flexible cancellation policy.", risk: "Low" },
  { id: "PAY-58290", booking: "BM240823", guest: "Alex Ramos", partner: "Boracay Paradise", amount: 12500, refundable: 0, method: "Bank transfer", gatewayRef: "bt_4902218", workflow: "Settlement hold", state: "Paid", priority: "medium", owner: "Accounting", category: "settlement", created: "1 hr ago", sla: "7h left", reason: "Settlement is held until the partner bank-account update is verified.", risk: "Medium" },
  { id: "PAY-58211", booking: "BM240824", guest: "Joseph Lim", partner: "Palm Grove Resort", amount: 7450, refundable: 0, method: "Mastercard", gatewayRef: "dp_7718830", workflow: "Chargeback response", state: "Disputed", priority: "critical", owner: "Risk Team", category: "risk", created: "2 hr ago", sla: "Due today", reason: "Cardholder claims the booking transaction was not authorized.", risk: "High" },
  { id: "PAY-58173", booking: "BM240825", guest: "Anna Santos", partner: "Ocean Pearl", amount: 9120, refundable: 9120, method: "GCash", gatewayRef: "gc_8177442", workflow: "Reconciliation difference", state: "Paid", priority: "medium", owner: "Accounting", category: "reconciliation", created: "3 hr ago", sla: "5h left", reason: "Gateway settlement is ₱120 lower than the internal transaction ledger.", risk: "Low" },
  { id: "PAY-58091", booking: "BM240826", guest: "Paul Cruz", partner: "Crystal Bay", amount: 15300, refundable: 0, method: "Visa", gatewayRef: "pi_7GF11801", workflow: "Fraud review", state: "Paid", priority: "high", owner: "Risk Team", category: "risk", created: "4 hr ago", sla: "2h left", reason: "Card country, account region, and device location do not match.", risk: "High" },
  { id: "PAY-58042", booking: "BM240827", guest: "Kevin Lee", partner: "Bluewater Suites", amount: 6700, refundable: 6700, method: "Maya", gatewayRef: "my_5158033", workflow: "Ready for settlement", state: "Captured", priority: "low", owner: "Finance Team", category: "ready", created: "Today", sla: "Ready", reason: "Payment and compliance checks are complete.", risk: "Low" },
  { id: "PAY-57983", booking: "BM240828", guest: "Mark Tan", partner: "Emerald Resort", amount: 18000, refundable: 0, method: "Visa", gatewayRef: "pi_7GE78190", workflow: "Fraud investigation", state: "Disputed", priority: "critical", owner: "Risk Team", category: "risk", created: "Today", sla: "Escalated", reason: "Multiple payment attempts from linked accounts triggered a velocity rule.", risk: "Critical" },
];

let payments = structuredClone(initialPayments);
let activeQuickFilter = "all";
let currentContent;

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const money = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
const stateClass = (state) => ({ Failed: "bg-rose-50 text-rose-700", "Refund requested": "bg-amber-50 text-amber-700", Disputed: "bg-violet-50 text-violet-700", Paid: "bg-blue-50 text-blue-700", Captured: "bg-emerald-50 text-emerald-700", Resolved: "bg-emerald-50 text-emerald-700" }[state] || "bg-slate-100 text-slate-700");
const workflowClass = (category) => ({ failed: "bg-rose-50 text-rose-700", refund: "bg-amber-50 text-amber-700", settlement: "bg-blue-50 text-blue-700", risk: "bg-violet-50 text-violet-700", reconciliation: "bg-cyan-50 text-cyan-700", ready: "bg-emerald-50 text-emerald-700", resolved: "bg-slate-100 text-slate-700" }[category] || "bg-slate-100 text-slate-700");

function filteredPayments() {
  const search = currentContent.querySelector("[data-payment-search]")?.value.trim().toLowerCase() || "";
  const state = currentContent.querySelector("[data-payment-status]")?.value || "all";
  const method = currentContent.querySelector("[data-payment-method]")?.value || "all";
  const owner = currentContent.querySelector("[data-payment-owner]")?.value || "all";
  return payments.filter((payment) => {
    const source = `${payment.id} ${payment.booking} ${payment.guest} ${payment.partner} ${payment.gatewayRef} ${payment.workflow}`.toLowerCase();
    const quick = activeQuickFilter === "all"
      || (activeQuickFilter === "mine" && payment.owner === "You")
      || (activeQuickFilter === "failed" && payment.category === "failed")
      || (activeQuickFilter === "refund" && payment.category === "refund")
      || (activeQuickFilter === "risk" && payment.category === "risk")
      || (activeQuickFilter === "settlement" && payment.category === "settlement")
      || (activeQuickFilter === "reconciliation" && payment.category === "reconciliation");
    return quick && (!search || source.includes(search)) && (state === "all" || payment.state === state) && (method === "all" || payment.method === method) && (owner === "all" || payment.owner === owner);
  });
}

function renderRows() {
  const visible = filteredPayments();
  currentContent.querySelector("[data-payment-visible-count]").textContent = `${visible.length} ${visible.length === 1 ? "record" : "records"}`;
  currentContent.querySelector("[data-payment-footer-count]").textContent = visible.length;
  const list = currentContent.querySelector("[data-payment-list]");
  if (!visible.length) {
    list.innerHTML = `<tr><td colspan="6" class="px-6 py-14 text-center"><div class="mx-auto flex max-w-sm flex-col items-center"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><i class="fa-solid fa-filter-circle-xmark"></i></span><p class="mt-3 font-semibold text-slate-800">No payment cases match these filters</p><p class="mt-1 text-sm text-slate-500">Clear the filters or choose another finance queue.</p><button type="button" class="mt-4 property-button property-button-secondary" data-payment-action="clear-filters">Clear filters</button></div></td></tr>`;
    return;
  }
  list.innerHTML = visible.map((payment) => `<tr class="property-queue-row">
    <td class="px-5 py-4 sm:px-6"><div class="flex items-start gap-3"><span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${["critical", "high"].includes(payment.priority) ? "bg-rose-500" : "bg-emerald-500"}"></span><div class="min-w-0"><p class="font-semibold text-slate-900">${payment.id}</p><p class="mt-0.5 text-xs text-slate-500">${payment.booking} · ${payment.gatewayRef}</p><p class="mt-1 text-xs text-slate-400">Created ${payment.created}</p></div></div></td>
    <td class="px-5 py-4"><div class="flex flex-col items-start gap-1.5"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${workflowClass(payment.category)}">${escapeHtml(payment.workflow)}</span><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${stateClass(payment.state)}">${payment.state}</span></div></td>
    <td class="px-5 py-4"><p class="font-medium text-slate-700">${escapeHtml(payment.guest)}</p><p class="mt-1 text-xs text-slate-400">${escapeHtml(payment.partner)}</p></td>
    <td class="px-5 py-4"><p class="font-semibold text-slate-900">${money(payment.amount)}</p><p class="mt-1 text-xs text-slate-400">${payment.method}</p></td>
    <td class="px-5 py-4"><p class="font-medium text-slate-700">${payment.owner}</p><p class="mt-1 text-xs font-semibold ${["critical", "high"].includes(payment.priority) ? "text-rose-600" : "text-slate-400"}">${payment.sla}</p></td>
    <td class="px-5 py-4 text-right"><button type="button" class="property-button property-button-primary property-row-action" data-payment-action="review" data-payment-id="${payment.id}">Review <i class="fa-solid fa-arrow-right text-xs"></i></button></td>
  </tr>`).join("");
}

function updateSummary() {
  const values = {
    open: payments.filter((item) => item.state !== "Resolved").length,
    refunds: payments.filter((item) => item.category === "refund" && item.state !== "Resolved").length,
    risk: payments.filter((item) => item.category === "risk" && item.state !== "Resolved").length,
    ready: payments.filter((item) => item.category === "ready" && item.state !== "Resolved").length,
  };
  Object.entries(values).forEach(([key, value]) => { currentContent.querySelector(`[data-payment-summary="${key}"]`).textContent = value; });
}

function setQuickFilter(filter) {
  activeQuickFilter = filter;
  currentContent.querySelectorAll("[data-payment-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.paymentFilter === filter));
  renderRows();
}

function clearFilters() {
  currentContent.querySelector("[data-payment-search]").value = "";
  currentContent.querySelector("[data-payment-status]").value = "all";
  currentContent.querySelector("[data-payment-method]").value = "all";
  currentContent.querySelector("[data-payment-owner]").value = "all";
  setQuickFilter("all");
}

function showNotice(message, tone = "success") {
  const notice = currentContent.querySelector("#paymentNotice");
  notice.textContent = message;
  notice.className = `rounded-lg px-3 py-2 text-sm font-medium ${tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`;
  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => notice.classList.add("hidden"), 5000);
}

function openPaymentReview(id) {
  const payment = payments.find((item) => item.id === id);
  if (!payment) return;
  const modal = openAdminModal({ title: `Review · ${payment.id}`, size: "max-w-4xl", content: `<form data-payment-review-form class="space-y-6">
    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div class="flex flex-wrap items-center gap-2"><span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">${payment.booking}</span><span class="rounded-full px-3 py-1 text-xs font-semibold ${stateClass(payment.state)}">${payment.state}</span></div><h3 class="mt-5 text-lg font-semibold text-slate-950">${escapeHtml(payment.workflow)}</h3><p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(payment.reason)}</p><div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="rounded-xl bg-white p-4"><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Guest</span><p class="mt-1 text-sm font-semibold text-slate-900">${escapeHtml(payment.guest)}</p></div><div class="rounded-xl bg-white p-4"><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Partner</span><p class="mt-1 text-sm font-semibold text-slate-900">${escapeHtml(payment.partner)}</p></div></div></div>
      <aside class="space-y-4 rounded-2xl border border-slate-200 p-4"><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Transaction amount</span><p class="mt-1 text-xl font-semibold text-slate-950">${money(payment.amount)}</p></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Payment method</span><p class="mt-1 text-sm font-semibold text-slate-900">${payment.method}</p></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Gateway reference</span><p class="mt-1 break-all font-mono text-xs text-slate-700">${payment.gatewayRef}</p></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Risk level</span><p class="mt-1 text-sm font-semibold ${["High", "Critical"].includes(payment.risk) ? "text-rose-600" : "text-slate-900"}">${payment.risk}</p></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">SLA</span><p class="mt-1 text-sm font-semibold ${["critical", "high"].includes(payment.priority) ? "text-rose-600" : "text-slate-900"}">${payment.sla}</p></div></aside>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="settings-field"><span>Finance action <b>*</b></span><select required name="decision" class="bomo-input w-full"><option value="investigating">Continue investigation</option><option value="retry">Request payment retry</option><option value="refund">Approve refund</option><option value="reject-refund">Reject refund</option><option value="release">Release settlement</option><option value="reconciled">Mark reconciled</option><option value="risk">Escalate to Risk Team</option><option value="resolved">Close as resolved</option></select></label>
      <label class="settings-field"><span>Finance owner <b>*</b></span><select required name="owner" class="bomo-input w-full"><option value="You" ${payment.owner === "You" ? "selected" : ""}>You — Finance Operations</option><option value="Finance Team" ${payment.owner === "Finance Team" ? "selected" : ""}>Finance Team</option><option value="Accounting" ${payment.owner === "Accounting" ? "selected" : ""}>Accounting</option><option value="Risk Team" ${payment.owner === "Risk Team" ? "selected" : ""}>Risk Team</option><option value="Unassigned" ${payment.owner === "Unassigned" ? "selected" : ""}>Unassigned</option></select></label>
      <label class="settings-field"><span>Refund amount</span><input type="number" min="0" max="${payment.refundable}" step="0.01" name="refundAmount" value="${payment.category === "refund" ? payment.refundable : 0}" class="bomo-input w-full"><small>Maximum refundable: ${money(payment.refundable)}</small></label>
      <label class="settings-field"><span>Outcome reason</span><select name="reasonCode" class="bomo-input w-full"><option>Payment processor issue</option><option>Eligible cancellation</option><option>Duplicate charge</option><option>Fraud or unauthorized payment</option><option>Settlement adjustment</option><option>Ledger mismatch corrected</option><option>Other</option></select></label>
      <label class="settings-field sm:col-span-2"><span>Internal decision note <b>*</b></span><textarea required rows="4" name="note" class="bomo-input w-full" placeholder="Record evidence checked, calculations, and the next step.">${escapeHtml(payment.reason)}</textarea></label>
    </div>
    <div class="grid gap-3 sm:grid-cols-2"><label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input name="notifyGuest" type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300"><span><strong class="text-slate-800">Notify the guest</strong><br>Send the payment outcome and timeline.</span></label><label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input name="notifyPartner" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300"><span><strong class="text-slate-800">Notify the partner</strong><br>Share settlement-impacting changes.</span></label></div>
    <div class="flex flex-wrap justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> Save finance decision</button></div>
  </form>` });

  const form = modal.querySelector("[data-payment-review-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const refundField = form.elements.refundAmount;
    refundField.setCustomValidity("");
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.decision === "refund" && Number(data.refundAmount) <= 0) { refundField.setCustomValidity("Enter the approved refund amount."); refundField.reportValidity(); return; }
    const mapping = {
      investigating: ["Under investigation", payment.category, payment.workflow],
      retry: ["Failed", "failed", "Payment retry requested"],
      refund: ["Resolved", "resolved", `Refund approved · ${money(data.refundAmount)}`],
      "reject-refund": ["Resolved", "resolved", "Refund request declined"],
      release: ["Captured", "ready", "Ready for settlement"],
      reconciled: ["Resolved", "resolved", "Reconciliation completed"],
      risk: ["Disputed", "risk", "Risk escalation"],
      resolved: ["Resolved", "resolved", "Finance case closed"],
    };
    [payment.state, payment.category, payment.workflow] = mapping[data.decision];
    payment.owner = data.owner;
    payment.reason = data.note.trim();
    payment.sla = payment.state === "Resolved" ? "Complete" : payment.category === "risk" ? "Escalated" : payment.sla;
    closeAdminModal(); updateSummary(); renderRows(); showNotice(`${payment.id} was updated to “${payment.workflow}”.`);
  });
}

function openAssignOfficer() {
  const visible = filteredPayments().filter((item) => item.owner === "Unassigned" && item.state !== "Resolved");
  const modal = openAdminModal({ title: "Assign finance officer", content: `<form data-payment-assign-form class="space-y-5"><div class="rounded-2xl bg-slate-50 p-4"><p class="font-semibold text-slate-900">Assign unowned cases in the current queue</p><p class="mt-1 text-sm text-slate-500">${visible.length} ${visible.length === 1 ? "case is" : "cases are"} ready to assign. Current filters are respected.</p></div><label class="settings-field"><span>Finance owner <b>*</b></span><select required name="owner" class="bomo-input w-full"><option value="You">You — Finance Operations</option><option value="Finance Team">Finance Team</option><option value="Accounting">Accounting</option><option value="Risk Team">Risk Team</option></select></label><label class="settings-field"><span>Assignment note</span><textarea rows="3" name="note" class="bomo-input w-full" placeholder="Optional handoff context"></textarea></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-user-check"></i> Assign officer</button></div></form>` });
  modal.querySelector("[data-payment-assign-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const owner = new FormData(event.currentTarget).get("owner");
    visible.forEach((payment) => { payment.owner = owner; });
    closeAdminModal(); renderRows(); showNotice(`${visible.length} finance ${visible.length === 1 ? "case was" : "cases were"} assigned to ${owner}.`);
  });
}

function openReconciliation() {
  const unresolved = payments.filter((item) => item.category === "reconciliation" && item.state !== "Resolved");
  const modal = openAdminModal({ title: "Run payment reconciliation", size: "max-w-2xl", content: `<form data-reconciliation-form class="space-y-5">
    <div class="grid gap-3 sm:grid-cols-3"><div class="rounded-2xl bg-slate-50 p-4"><span class="text-xs text-slate-500">Internal ledger</span><p class="mt-1 font-semibold text-slate-900">${money(892470)}</p></div><div class="rounded-2xl bg-slate-50 p-4"><span class="text-xs text-slate-500">Gateway total</span><p class="mt-1 font-semibold text-slate-900">${money(892350)}</p></div><div class="rounded-2xl bg-amber-50 p-4"><span class="text-xs text-amber-700">Difference</span><p class="mt-1 font-semibold text-amber-900">${money(120)}</p></div></div>
    <div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Settlement date <b>*</b></span><input required type="date" name="date" value="2026-07-27" class="bomo-input w-full"></label><label class="settings-field"><span>Payment provider <b>*</b></span><select required name="provider" class="bomo-input w-full"><option>All providers</option><option>Stripe</option><option>GCash</option><option>Maya</option><option>Bank transfers</option></select></label><label class="settings-field"><span>Reconciliation scope</span><select name="scope" class="bomo-input w-full"><option>Transactions and fees</option><option>Transactions only</option><option>Refunds only</option><option>Settlements only</option></select></label><label class="settings-field"><span>Difference treatment</span><select name="treatment" class="bomo-input w-full"><option>Open exception cases</option><option>Post approved adjustment</option><option>Hold for accounting review</option></select></label><label class="settings-field sm:col-span-2"><span>Reconciliation note <b>*</b></span><textarea required rows="3" name="note" class="bomo-input w-full" placeholder="Document source files and any known variance.">Compare the daily gateway settlement with the BOMO transaction ledger.</textarea></label></div>
    <div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-play"></i> Run reconciliation</button></div>
  </form>` });
  modal.querySelector("[data-reconciliation-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.innerHTML = `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">Reconciliation completed</h3><p class="mx-auto mt-2 max-w-md text-sm text-slate-500">${unresolved.length} exception ${unresolved.length === 1 ? "case remains" : "cases remain"} in the operations queue. The ₱120 difference is ready for accounting review.</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
    showNotice("Daily reconciliation completed. One ledger difference remains open.", "info");
  });
}

function openExport() {
  const modal = openAdminModal({ title: "Export payment operations report", size: "max-w-xl", content: `<form data-payment-export-form class="space-y-5"><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Date range <b>*</b></span><select required name="range" class="bomo-input w-full"><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>Current month</option></select></label><label class="settings-field"><span>File format <b>*</b></span><select required name="format" class="bomo-input w-full"><option>CSV</option><option>Excel workbook</option><option>PDF summary</option></select></label><label class="settings-field sm:col-span-2"><span>Report scope</span><select name="scope" class="bomo-input w-full"><option>Current filtered queue</option><option>All payment transactions</option><option>Exceptions only</option><option>Refunds and disputes</option></select></label></div><fieldset class="rounded-2xl border border-slate-200 p-4"><legend class="px-1 text-xs font-semibold text-slate-700">Include fields</legend><div class="mt-2 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><label class="flex items-center gap-2"><input type="checkbox" checked> Transaction details</label><label class="flex items-center gap-2"><input type="checkbox" checked> Guest and partner</label><label class="flex items-center gap-2"><input type="checkbox" checked> Gateway references</label><label class="flex items-center gap-2"><input type="checkbox" checked> Internal notes</label></div></fieldset><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-download"></i> Prepare export</button></div></form>` });
  modal.querySelector("[data-payment-export-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700"><i class="fa-solid fa-file-arrow-down"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">Report prepared</h3><p class="mt-2 text-sm text-slate-500">The payment operations export is ready for this UI session.</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
  });
}

function handleClick(event) {
  const control = event.target.closest("[data-payment-action]");
  if (!control || !currentContent.contains(control)) return;
  const { paymentAction: action, paymentFilter: filter, paymentId: id } = control.dataset;
  if (action === "filter") setQuickFilter(filter);
  if (action === "clear-filters") clearFilters();
  if (action === "review") openPaymentReview(id);
  if (action === "assign-officer") openAssignOfficer();
  if (action === "reconcile") openReconciliation();
  if (action === "export") openExport();
}

export default function initializePayments() {
  currentContent = document.getElementById("admin-content-module");
  if (!currentContent) return;
  currentContent.addEventListener("click", handleClick);
  currentContent.querySelector("[data-payment-search]")?.addEventListener("input", renderRows);
  currentContent.querySelectorAll("[data-payment-status], [data-payment-method], [data-payment-owner]").forEach((control) => control.addEventListener("change", renderRows));
  updateSummary(); renderRows();
}
