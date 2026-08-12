import { closeAdminModal, openAdminModal } from "../modal.js";

const initialPayouts = [
  { id: "PAYOUT-91452", title: "Azure Bay Resort settlement", recipient: "Azure Bay Hospitality", recipientType: "Property partner", reference: "SET-2026-07192", type: "Settlement", status: "Ready", method: "Bank", account: "BDO •••• 1842", owner: "Unassigned", gross: 124500, fees: 12450, net: 112050, priority: "high", created: "24 min ago", sla: "Ready", reason: "Completed stays and refund adjustments have been reconciled.", compliance: "Verified" },
  { id: "REWARD-81291", title: "Video review earnings", recipient: "Kara Silva", recipientType: "BOMO creator", reference: "RV-81291", type: "Reward", status: "Pending", method: "GCash", account: "GCash •••• 2281", owner: "You", gross: 4800, fees: 0, net: 4800, priority: "medium", created: "52 min ago", sla: "3h left", reason: "Twelve attributed bookings require final reward validation.", compliance: "Verified" },
  { id: "WITHDRAWAL-71288", title: "Creator earnings withdrawal", recipient: "Miguel Santos", recipientType: "BOMO creator", reference: "WDR-71288", type: "Withdrawal", status: "Pending", method: "GCash", account: "GCash •••• 9014", owner: "Rewards Team", gross: 7250, fees: 50, net: 7200, priority: "high", created: "1 hr ago", sla: "2h left", reason: "Creator requested withdrawal of available verified earnings.", compliance: "Verified" },
  { id: "AFFILIATE-41182", title: "Travel ambassador commission", recipient: "Isla Travel Media", recipientType: "Affiliate partner", reference: "AFF-JUL-1182", type: "Affiliate", status: "Pending", method: "Bank", account: "BPI •••• 3308", owner: "Unassigned", gross: 6300, fees: 126, net: 6174, priority: "medium", created: "2 hr ago", sla: "6h left", reason: "Monthly commission requires traffic-quality approval.", compliance: "Verified" },
  { id: "PAYOUT-91342", title: "Sunrise Villas transfer", recipient: "Sunrise Leisure Inc.", recipientType: "Property partner", reference: "SET-2026-07188", type: "Settlement", status: "Failed", method: "Bank", account: "UnionBank •••• 7731", owner: "Risk Team", gross: 87000, fees: 8700, net: 78300, priority: "critical", created: "3 hr ago", sla: "Due today", reason: "Recipient bank rejected the transfer because the account name did not match.", compliance: "Needs update" },
  { id: "FRAUD-22117", title: "Suspicious creator earnings", recipient: "Creator account #1184", recipientType: "BOMO creator", reference: "RISK-22117", type: "Reward", status: "Hold", method: "Maya", account: "Maya •••• 6629", owner: "Risk Team", gross: 12600, fees: 0, net: 12600, priority: "critical", created: "Today", sla: "Escalated", reason: "Linked accounts share device and payout-destination signals.", compliance: "Under review" },
  { id: "PAYOUT-91294", title: "Bluewater Suites settlement", recipient: "Bluewater Living", recipientType: "Property partner", reference: "SET-2026-07177", type: "Settlement", status: "Released", method: "Bank", account: "BDO •••• 4491", owner: "Finance Team", gross: 94600, fees: 9460, net: 85140, priority: "low", created: "Yesterday", sla: "Complete", reason: "Payout released in batch PB-2026-0711.", compliance: "Verified" },
  { id: "REWARD-81274", title: "Creator review reward", recipient: "Lea Mendoza", recipientType: "BOMO creator", reference: "RV-81274", type: "Reward", status: "Ready", method: "Maya", account: "Maya •••• 0941", owner: "Rewards Team", gross: 2250, fees: 0, net: 2250, priority: "low", created: "Today", sla: "Ready", reason: "Review and engagement-quality checks are complete.", compliance: "Verified" },
];

let payouts = structuredClone(initialPayouts);
let activeQuickFilter = "all";
let currentContent;
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const money = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
const statusClass = (status) => ({ Pending: "bg-amber-50 text-amber-700", Ready: "bg-emerald-50 text-emerald-700", Released: "bg-blue-50 text-blue-700", Failed: "bg-rose-50 text-rose-700", Hold: "bg-rose-50 text-rose-700", Rejected: "bg-slate-100 text-slate-700" }[status] || "bg-slate-100 text-slate-700");
const typeClass = (type) => ({ Settlement: "bg-blue-50 text-blue-700", Reward: "bg-violet-50 text-violet-700", Withdrawal: "bg-cyan-50 text-cyan-700", Affiliate: "bg-amber-50 text-amber-700" }[type] || "bg-slate-100 text-slate-700");

function filteredPayouts() {
  const search = currentContent.querySelector("[data-payout-search]")?.value.trim().toLowerCase() || "";
  const status = currentContent.querySelector("[data-payout-status]")?.value || "all";
  const type = currentContent.querySelector("[data-payout-type]")?.value || "all";
  const owner = currentContent.querySelector("[data-payout-owner]")?.value || "all";
  return payouts.filter((payout) => {
    const source = `${payout.id} ${payout.title} ${payout.recipient} ${payout.reference} ${payout.type} ${payout.owner}`.toLowerCase();
    const quick = activeQuickFilter === "all"
      || (activeQuickFilter === "mine" && payout.owner === "You")
      || (activeQuickFilter === "settlement" && payout.type === "Settlement")
      || (activeQuickFilter === "reward" && payout.type === "Reward")
      || (activeQuickFilter === "withdrawal" && payout.type === "Withdrawal")
      || (activeQuickFilter === "failed" && ["Failed", "Hold"].includes(payout.status))
      || (activeQuickFilter === "ready" && payout.status === "Ready");
    return quick && (!search || source.includes(search)) && (status === "all" || payout.status === status) && (type === "all" || payout.type === type) && (owner === "all" || payout.owner === owner);
  });
}

function renderRows() {
  const visible = filteredPayouts();
  currentContent.querySelector("[data-payout-visible-count]").textContent = `${visible.length} ${visible.length === 1 ? "record" : "records"}`;
  currentContent.querySelector("[data-payout-footer-count]").textContent = visible.length;
  const list = currentContent.querySelector("[data-payout-list]");
  if (!visible.length) {
    list.innerHTML = `<tr><td colspan="6" class="px-6 py-14 text-center"><div class="mx-auto flex max-w-sm flex-col items-center"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><i class="fa-solid fa-filter-circle-xmark"></i></span><p class="mt-3 font-semibold text-slate-800">No payout cases match these filters</p><p class="mt-1 text-sm text-slate-500">Clear the filters or choose another disbursement queue.</p><button type="button" class="mt-4 property-button property-button-secondary" data-payout-action="clear-filters">Clear filters</button></div></td></tr>`;
    return;
  }
  list.innerHTML = visible.map((payout) => `<tr class="property-queue-row">
    <td class="px-5 py-4 sm:px-6"><div class="flex items-start gap-3"><span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${["critical", "high"].includes(payout.priority) ? "bg-rose-500" : "bg-violet-500"}"></span><div class="min-w-0"><p class="font-semibold text-slate-900">${escapeHtml(payout.title)}</p><p class="mt-0.5 text-xs text-slate-500">${payout.id} · ${payout.reference}</p><p class="mt-1 text-xs text-slate-400">Created ${payout.created}</p></div></div></td>
    <td class="px-5 py-4"><div class="flex flex-col items-start gap-1.5"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${typeClass(payout.type)}">${payout.type}</span><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(payout.status)}">${payout.status}</span></div></td>
    <td class="px-5 py-4"><p class="font-medium text-slate-700">${escapeHtml(payout.recipient)}</p><p class="mt-1 text-xs text-slate-400">${payout.recipientType}</p></td>
    <td class="px-5 py-4"><p class="font-semibold text-slate-900">${money(payout.net)}</p><p class="mt-1 text-xs text-slate-400">${payout.method} · gross ${money(payout.gross)}</p></td>
    <td class="px-5 py-4"><p class="font-medium text-slate-700">${payout.owner}</p><p class="mt-1 text-xs font-semibold ${["critical", "high"].includes(payout.priority) ? "text-rose-600" : "text-slate-400"}">${payout.sla}</p></td>
    <td class="px-5 py-4 text-right"><button type="button" class="property-button property-button-primary property-row-action" data-payout-action="review" data-payout-id="${payout.id}">Review <i class="fa-solid fa-arrow-right text-xs"></i></button></td>
  </tr>`).join("");
}

function updateSummary() {
  const values = {
    open: payouts.filter((item) => !["Released", "Rejected"].includes(item.status)).length,
    pending: payouts.filter((item) => item.status === "Pending").length,
    holds: payouts.filter((item) => ["Failed", "Hold"].includes(item.status)).length,
    ready: payouts.filter((item) => item.status === "Ready").length,
  };
  Object.entries(values).forEach(([key, value]) => { currentContent.querySelector(`[data-payout-summary="${key}"]`).textContent = value; });
}

function setQuickFilter(filter) {
  activeQuickFilter = filter;
  currentContent.querySelectorAll("[data-payout-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.payoutFilter === filter));
  renderRows();
}

function clearFilters() {
  currentContent.querySelector("[data-payout-search]").value = "";
  currentContent.querySelector("[data-payout-status]").value = "all";
  currentContent.querySelector("[data-payout-type]").value = "all";
  currentContent.querySelector("[data-payout-owner]").value = "all";
  setQuickFilter("all");
}

function showNotice(message, tone = "success") {
  const notice = currentContent.querySelector("#payoutNotice");
  notice.textContent = message;
  notice.className = `rounded-lg px-3 py-2 text-sm font-medium ${tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`;
  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => notice.classList.add("hidden"), 5000);
}

function openPayoutReview(id) {
  const payout = payouts.find((item) => item.id === id);
  if (!payout) return;
  const modal = openAdminModal({ title: `Review · ${payout.id}`, size: "max-w-4xl", content: `<form data-payout-review-form class="space-y-6">
    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div class="flex flex-wrap items-center gap-2"><span class="rounded-full px-3 py-1 text-xs font-semibold ${typeClass(payout.type)}">${payout.type}</span><span class="rounded-full px-3 py-1 text-xs font-semibold ${statusClass(payout.status)}">${payout.status}</span></div><h3 class="mt-5 text-lg font-semibold text-slate-950">${escapeHtml(payout.title)}</h3><p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(payout.reason)}</p><div class="mt-5 grid gap-3 sm:grid-cols-2"><div class="rounded-xl bg-white p-4"><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Recipient</span><p class="mt-1 text-sm font-semibold text-slate-900">${escapeHtml(payout.recipient)}</p><p class="mt-1 text-xs text-slate-500">${payout.recipientType}</p></div><div class="rounded-xl bg-white p-4"><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Destination</span><p class="mt-1 text-sm font-semibold text-slate-900">${payout.account}</p><p class="mt-1 text-xs text-slate-500">${payout.method}</p></div></div></div>
      <aside class="space-y-3 rounded-2xl border border-slate-200 p-4"><div class="flex justify-between text-sm"><span class="text-slate-500">Gross amount</span><strong>${money(payout.gross)}</strong></div><div class="flex justify-between text-sm"><span class="text-slate-500">Fees / commission</span><strong>−${money(payout.fees)}</strong></div><div class="flex justify-between border-t border-slate-200 pt-3"><span class="font-semibold text-slate-700">Net payout</span><strong class="text-lg text-slate-950">${money(payout.net)}</strong></div><div class="mt-2 rounded-xl ${payout.compliance === "Verified" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"} p-3 text-xs"><i class="fa-solid ${payout.compliance === "Verified" ? "fa-circle-check" : "fa-triangle-exclamation"} mr-1"></i> Compliance: <strong>${payout.compliance}</strong></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">SLA</span><p class="mt-1 text-sm font-semibold ${["critical", "high"].includes(payout.priority) ? "text-rose-600" : "text-slate-900"}">${payout.sla}</p></div></aside>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="settings-field"><span>Payout decision <b>*</b></span><select required name="decision" class="bomo-input w-full"><option value="pending">Continue validation</option><option value="ready">Approve for release</option><option value="release">Release payout now</option><option value="hold">Place on hold</option><option value="details">Request recipient details</option><option value="retry">Retry failed transfer</option><option value="risk">Escalate to Risk Team</option><option value="reject">Reject payout</option></select></label>
      <label class="settings-field"><span>Payout owner <b>*</b></span><select required name="owner" class="bomo-input w-full"><option value="You" ${payout.owner === "You" ? "selected" : ""}>You — Payout Operations</option><option value="Finance Team" ${payout.owner === "Finance Team" ? "selected" : ""}>Finance Team</option><option value="Rewards Team" ${payout.owner === "Rewards Team" ? "selected" : ""}>Rewards Team</option><option value="Risk Team" ${payout.owner === "Risk Team" ? "selected" : ""}>Risk Team</option><option value="Unassigned" ${payout.owner === "Unassigned" ? "selected" : ""}>Unassigned</option></select></label>
      <label class="settings-field"><span>Release date</span><input type="date" name="releaseDate" value="2026-07-28" class="bomo-input w-full"></label>
      <label class="settings-field"><span>Reason code</span><select name="reasonCode" class="bomo-input w-full"><option>Eligibility confirmed</option><option>Documents required</option><option>Destination account issue</option><option>Reward attribution issue</option><option>Compliance review</option><option>Transfer retry</option><option>Other</option></select></label>
      <label class="settings-field sm:col-span-2"><span>Internal decision note <b>*</b></span><textarea required rows="4" name="note" class="bomo-input w-full" placeholder="Document checks, calculations, and the next step.">${escapeHtml(payout.reason)}</textarea></label>
    </div>
    <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input name="notify" type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300"><span><strong class="text-slate-800">Notify the recipient</strong><br>Send the payout status, amount, and expected timeline.</span></label>
    <div class="flex flex-wrap justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> Save payout decision</button></div>
  </form>` });
  modal.querySelector("[data-payout-review-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const mapping = {
      pending: ["Pending", payout.reason],
      ready: ["Ready", "Eligibility and payout checks approved."],
      release: ["Released", `Released to ${payout.account}.`],
      hold: ["Hold", "Payout placed on hold pending additional review."],
      details: ["Pending", "Recipient must update or confirm payout details."],
      retry: ["Pending", "Failed transfer queued for retry."],
      risk: ["Hold", "Payout escalated for enhanced risk review."],
      reject: ["Rejected", "Payout request rejected after operations review."],
    };
    [payout.status, payout.reason] = mapping[data.decision];
    payout.owner = data.decision === "risk" ? "Risk Team" : data.owner;
    payout.sla = ["Released", "Rejected"].includes(payout.status) ? "Complete" : payout.status === "Ready" ? "Ready" : payout.status === "Hold" ? "On hold" : payout.sla;
    closeAdminModal(); updateSummary(); renderRows(); showNotice(`${payout.id} was updated to “${payout.status}”.`);
  });
}

function openAssignOfficer() {
  const visible = filteredPayouts().filter((item) => item.owner === "Unassigned" && !["Released", "Rejected"].includes(item.status));
  const modal = openAdminModal({ title: "Assign payout officer", content: `<form data-payout-assign-form class="space-y-5"><div class="rounded-2xl bg-slate-50 p-4"><p class="font-semibold text-slate-900">Assign unowned cases in the current queue</p><p class="mt-1 text-sm text-slate-500">${visible.length} ${visible.length === 1 ? "case is" : "cases are"} ready to assign. Current filters are respected.</p></div><label class="settings-field"><span>Payout owner <b>*</b></span><select required name="owner" class="bomo-input w-full"><option value="You">You — Payout Operations</option><option value="Finance Team">Finance Team</option><option value="Rewards Team">Rewards Team</option><option value="Risk Team">Risk Team</option></select></label><label class="settings-field"><span>Assignment note</span><textarea rows="3" class="bomo-input w-full" placeholder="Optional handoff context"></textarea></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-user-check"></i> Assign officer</button></div></form>` });
  modal.querySelector("[data-payout-assign-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const owner = new FormData(event.currentTarget).get("owner");
    visible.forEach((payout) => { payout.owner = owner; });
    closeAdminModal(); renderRows(); showNotice(`${visible.length} payout ${visible.length === 1 ? "case was" : "cases were"} assigned to ${owner}.`);
  });
}

function openBatch() {
  const ready = payouts.filter((item) => item.status === "Ready");
  const total = ready.reduce((sum, item) => sum + item.net, 0);
  const modal = openAdminModal({ title: "Process payout batch", size: "max-w-2xl", content: `<form data-payout-batch-form class="space-y-5"><div class="grid gap-3 sm:grid-cols-3"><div class="rounded-2xl bg-slate-50 p-4"><span class="text-xs text-slate-500">Ready payouts</span><p class="mt-1 text-xl font-semibold text-slate-900">${ready.length}</p></div><div class="rounded-2xl bg-slate-50 p-4"><span class="text-xs text-slate-500">Net disbursement</span><p class="mt-1 text-xl font-semibold text-slate-900">${money(total)}</p></div><div class="rounded-2xl bg-emerald-50 p-4"><span class="text-xs text-emerald-700">Compliance</span><p class="mt-1 font-semibold text-emerald-900">Cleared</p></div></div><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Release date <b>*</b></span><input required type="date" name="date" value="2026-07-28" class="bomo-input w-full"></label><label class="settings-field"><span>Batch scope <b>*</b></span><select required name="scope" class="bomo-input w-full"><option>All ready payouts</option><option>Partner settlements only</option><option>Creator rewards only</option><option>Withdrawals only</option></select></label><label class="settings-field"><span>Funding account</span><select name="account" class="bomo-input w-full"><option>BOMO Disbursements •••• 4821</option><option>BOMO Rewards •••• 7730</option></select></label><label class="settings-field"><span>Transfer speed</span><select name="speed" class="bomo-input w-full"><option>Standard</option><option>Same day</option></select></label><label class="settings-field sm:col-span-2"><span>Batch note <b>*</b></span><textarea required rows="3" class="bomo-input w-full">Release all eligible, verified payouts in the current ready queue.</textarea></label></div><label class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><input required type="checkbox" class="mt-0.5 h-4 w-4 rounded border-amber-300"><span>I confirm the recipient accounts, eligibility checks, and payout totals have been reviewed.</span></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-money-bill-transfer"></i> Release ${money(total)}</button></div></form>` });
  modal.querySelector("[data-payout-batch-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    ready.forEach((payout) => { payout.status = "Released"; payout.sla = "Complete"; payout.reason = "Released in the current payout batch."; });
    updateSummary(); renderRows();
    event.currentTarget.innerHTML = `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">Payout batch released</h3><p class="mx-auto mt-2 max-w-md text-sm text-slate-500">${ready.length} payouts totaling ${money(total)} were released in this admin session.</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
  });
}

function openExport() {
  const modal = openAdminModal({ title: "Export payout operations report", size: "max-w-xl", content: `<form data-payout-export-form class="space-y-5"><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Date range <b>*</b></span><select required class="bomo-input w-full"><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>Current payout cycle</option></select></label><label class="settings-field"><span>File format <b>*</b></span><select required class="bomo-input w-full"><option>CSV</option><option>Excel workbook</option><option>PDF summary</option></select></label><label class="settings-field sm:col-span-2"><span>Report scope</span><select class="bomo-input w-full"><option>Current filtered queue</option><option>All payouts and rewards</option><option>Released payouts only</option><option>Held and failed cases</option></select></label></div><fieldset class="rounded-2xl border border-slate-200 p-4"><legend class="px-1 text-xs font-semibold text-slate-700">Include fields</legend><div class="mt-2 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><label class="flex items-center gap-2"><input type="checkbox" checked> Recipient details</label><label class="flex items-center gap-2"><input type="checkbox" checked> Gross, fees, and net</label><label class="flex items-center gap-2"><input type="checkbox" checked> Destination references</label><label class="flex items-center gap-2"><input type="checkbox" checked> Decision history</label></div></fieldset><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-download"></i> Prepare export</button></div></form>` });
  modal.querySelector("[data-payout-export-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-700"><i class="fa-solid fa-file-arrow-down"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">Report prepared</h3><p class="mt-2 text-sm text-slate-500">The payout and rewards export is ready for this UI session.</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
  });
}

function handleClick(event) {
  const control = event.target.closest("[data-payout-action]");
  if (!control || !currentContent.contains(control)) return;
  const { payoutAction: action, payoutFilter: filter, payoutId: id } = control.dataset;
  if (action === "filter") setQuickFilter(filter);
  if (action === "clear-filters") clearFilters();
  if (action === "review") openPayoutReview(id);
  if (action === "assign-officer") openAssignOfficer();
  if (action === "process-batch") openBatch();
  if (action === "export") openExport();
}

export default function initializePayouts() {
  currentContent = document.getElementById("admin-content-module");
  if (!currentContent) return;
  currentContent.addEventListener("click", handleClick);
  currentContent.querySelector("[data-payout-search]")?.addEventListener("input", renderRows);
  currentContent.querySelectorAll("[data-payout-status], [data-payout-type], [data-payout-owner]").forEach((control) => control.addEventListener("change", renderRows));
  updateSummary(); renderRows();
}
