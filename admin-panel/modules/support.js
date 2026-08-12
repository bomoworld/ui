import { openAdminModal } from "../modal.js";

let concerns = [
  { id: "CON-1048", subject: "Unable to check in with confirmed booking", requester: "Maria Santos", role: "Guest", booking: "BKG-88421", category: "Booking", priority: "Urgent", status: "Open", age: "12 min", assignee: "Unassigned", description: "The property cannot locate the confirmed reservation and the guest is waiting in the lobby." },
  { id: "CON-1047", subject: "Duplicate charge after payment retry", requester: "Daniel Cruz", role: "Guest", booking: "BKG-88394", category: "Refund", priority: "High", status: "In progress", age: "34 min", assignee: "Ana R.", description: "The guest reports two pending charges after retrying a payment that initially appeared to fail." },
  { id: "CON-1042", subject: "Payout amount does not match statement", requester: "Casa Verde Cebu", role: "Partner", booking: "PAYOUT-7291", category: "Partner", priority: "Normal", status: "Waiting", age: "2 hr", assignee: "Miguel T.", description: "Partner needs a breakdown of commission and adjustments for the latest payout." },
  { id: "CON-1039", subject: "Checkout page remains on loading state", requester: "Lia Mendoza", role: "Guest", booking: "BKG-88211", category: "Technical", priority: "High", status: "Open", age: "3 hr", assignee: "Unassigned", description: "Checkout does not advance after the guest submits their card details on mobile." },
  { id: "CON-1034", subject: "Safety concern reported at property", requester: "Jose Villanueva", role: "Guest", booking: "BKG-87944", category: "Safety", priority: "Urgent", status: "In progress", age: "5 hr", assignee: "Lea M.", description: "Guest reported an unsecured balcony door and requested immediate relocation assistance." },
  { id: "CON-1028", subject: "Refund completed and guest notified", requester: "Nina Ong", role: "Guest", booking: "BKG-87812", category: "Refund", priority: "Normal", status: "Resolved", age: "Yesterday", assignee: "Ana R.", description: "Refund was approved under the flexible cancellation policy." },
];
let activeQuickFilter = "all";

export function initializeSupport() {
  const page = document.getElementById("supportPage");
  if (!page) return;
  const render = () => renderConcerns(page);
  render();

  page.addEventListener("input", (event) => {
    if (event.target.matches("[data-support-search], [data-support-filter]")) render();
  });
  page.addEventListener("change", (event) => {
    if (event.target.matches("[data-support-filter]")) render();
  });
  page.addEventListener("click", (event) => {
    const button = event.target.closest("[data-support-action]");
    if (!button) return;
    const action = button.dataset.supportAction;
    if (action === "new-concern") openNewConcernModal(page);
    if (action === "reset-filters") {
      page.querySelector("[data-support-search]").value = "";
      page.querySelectorAll("[data-support-filter]").forEach((filter) => { filter.value = "all"; });
      activeQuickFilter = "all";
      page.querySelectorAll("[data-support-quick]").forEach((item) => item.classList.toggle("is-active", item.dataset.supportQuick === "all"));
      render();
    }
    if (action === "filter") {
      activeQuickFilter = button.dataset.supportQuick;
      page.querySelectorAll("[data-support-quick]").forEach((item) => item.classList.toggle("is-active", item.dataset.supportQuick === activeQuickFilter));
      render();
    }
    if (action === "open-concern") openConcernModal(page, button.dataset.concernId);
    if (action === "sort") {
      concerns = [...concerns].reverse();
      render();
    }
  });
}

function renderConcerns(page) {
  const search = page.querySelector("[data-support-search]").value.trim().toLowerCase();
  const status = page.querySelector('[data-support-filter="status"]').value;
  const priority = page.querySelector('[data-support-filter="priority"]').value;
  const category = page.querySelector('[data-support-filter="category"]').value;
  const visible = concerns.filter((item) => {
    const haystack = `${item.id} ${item.subject} ${item.requester} ${item.booking}`.toLowerCase();
    const quick = activeQuickFilter === "all"
      || (activeQuickFilter === "mine" && item.assignee === "Ana R.")
      || (activeQuickFilter === "guest" && item.role === "Guest")
      || (activeQuickFilter === "partner" && item.role === "Partner")
      || (activeQuickFilter === "urgent" && item.priority === "Urgent")
      || (activeQuickFilter === "unassigned" && item.assignee === "Unassigned");
    return quick && (!search || haystack.includes(search)) && (status === "all" || item.status === status) && (priority === "all" || item.priority === priority) && (category === "all" || item.category === category);
  });
  page.querySelector("[data-support-result-count]").textContent = visible.length;
  page.querySelector("[data-support-footer-count]").textContent = visible.length;
  page.querySelector("[data-support-list]").innerHTML = visible.map(concernRow).join("");
  page.querySelector("[data-support-empty]").classList.toggle("hidden", visible.length > 0);
  page.querySelector("[data-support-list]").classList.toggle("hidden", visible.length === 0);
  page.querySelector('[data-support-stat="open"]').textContent = concerns.filter((item) => item.status !== "Resolved").length;
  page.querySelector('[data-support-stat="urgent"]').textContent = concerns.filter((item) => item.priority === "Urgent" && item.status !== "Resolved").length;
  page.querySelector('[data-support-stat="resolved"]').textContent = 17 + concerns.filter((item) => item.status === "Resolved").length - 1;
}

function concernRow(item) {
  const priority = {
    Urgent: "bg-red-50 text-red-700 border-red-200",
    High: "bg-amber-50 text-amber-700 border-amber-200",
    Normal: "bg-slate-50 text-slate-600 border-slate-200",
  }[item.priority];
  const status = {
    Open: "bg-blue-50 text-blue-700",
    "In progress": "bg-indigo-50 text-indigo-700",
    Waiting: "bg-amber-50 text-amber-700",
    Resolved: "bg-emerald-50 text-emerald-700",
  }[item.status];
  const icon = { Booking: "fa-calendar-check", Refund: "fa-money-bill-transfer", Partner: "fa-hotel", Technical: "fa-bug", Safety: "fa-shield-halved" }[item.category];
  return `<tr class="property-queue-row">
    <td class="px-5 py-4 sm:px-6"><div class="flex items-start gap-3"><span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.priority === "Urgent" ? "bg-rose-500" : item.priority === "High" ? "bg-amber-500" : "bg-sky-500"}"></span><div class="min-w-0"><p class="font-semibold text-slate-900">${escapeHtml(item.subject)}</p><p class="mt-0.5 text-xs text-slate-500">${item.id} · ${item.booking}</p><p class="mt-1 text-xs text-slate-400">${escapeHtml(item.description)}</p></div></div></td>
    <td class="px-5 py-4"><div class="flex flex-col items-start gap-1.5"><span class="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700"><i class="fa-solid ${icon} mr-1"></i>${item.category}</span><span class="rounded-full border px-2.5 py-1 text-xs font-semibold ${priority}">${item.priority}</span></div></td>
    <td class="px-5 py-4"><p class="font-medium text-slate-700">${escapeHtml(item.requester)}</p><p class="mt-1 text-xs text-slate-400">${item.role}</p></td>
    <td class="px-5 py-4 text-slate-700">${item.assignee}</td>
    <td class="px-5 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${status}">${item.status}</span><p class="mt-2 text-xs text-slate-400">${item.age}</p></td>
    <td class="px-5 py-4 text-right"><button type="button" data-support-action="open-concern" data-concern-id="${item.id}" class="property-button property-button-primary property-row-action">Resolve <i class="fa-solid fa-arrow-right text-xs"></i></button></td>
  </tr>`;
}

function openNewConcernModal(page) {
  const modal = openAdminModal({
    title: "Log a new concern",
    size: "max-w-2xl",
    content: `<form data-new-concern-form class="space-y-5">
      <p class="text-sm text-slate-500">Capture enough context for the next agent to act without asking the requester to repeat themselves.</p>
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="settings-field"><span>Requester name <b>*</b></span><input required name="requester" class="bomo-input w-full" placeholder="Full name or property"></label>
        <label class="settings-field"><span>Requester type <b>*</b></span><select required name="role" class="bomo-input w-full"><option value="Guest">Guest</option><option value="Partner">Property partner</option></select></label>
        <label class="settings-field"><span>Category <b>*</b></span><select required name="category" class="bomo-input w-full"><option value="Booking">Booking</option><option value="Refund">Refund</option><option value="Partner">Partner</option><option value="Technical">Technical</option><option value="Safety">Safety</option></select></label>
        <label class="settings-field"><span>Priority <b>*</b></span><select required name="priority" class="bomo-input w-full"><option value="Normal">Normal</option><option value="High">High</option><option value="Urgent">Urgent</option></select></label>
        <label class="settings-field sm:col-span-2"><span>Booking or reference ID</span><input name="booking" class="bomo-input w-full" placeholder="e.g. BKG-12345"></label>
        <label class="settings-field sm:col-span-2"><span>Subject <b>*</b></span><input required maxlength="100" name="subject" class="bomo-input w-full" placeholder="Short summary of the concern"></label>
        <label class="settings-field sm:col-span-2"><span>Concern details <b>*</b></span><textarea required minlength="20" rows="4" name="description" class="bomo-input w-full" placeholder="What happened, what has been tried, and what outcome is expected?"></textarea></label>
        <label class="settings-field"><span>Channel</span><select name="channel" class="bomo-input w-full"><option>Email</option><option>Phone</option><option>Live chat</option><option>Internal escalation</option></select></label>
        <label class="settings-field"><span>Assign to</span><select name="assignee" class="bomo-input w-full"><option>Unassigned</option><option>Ana R.</option><option>Miguel T.</option><option>Lea M.</option></select></label>
      </div>
      <div class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" data-admin-modal-close class="settings-secondary-button">Cancel</button><button type="submit" class="settings-primary-button"><i class="fa-solid fa-plus"></i> Create concern</button></div>
    </form>`,
  });
  modal.querySelector("[data-new-concern-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const nextId = `CON-${Math.max(...concerns.map((item) => Number(item.id.split("-")[1]))) + 1}`;
    concerns.unshift({ ...data, id: nextId, booking: data.booking || "No reference", status: "Open", age: "Just now" });
    renderConcerns(page);
    form.innerHTML = successState("Concern created", `${nextId} is now in the support queue.`);
  });
}

function openConcernModal(page, id) {
  const concern = concerns.find((item) => item.id === id);
  if (!concern) return;
  const modal = openAdminModal({
    title: `${concern.id} · ${escapeHtml(concern.subject)}`,
    size: "max-w-4xl",
    content: `<form data-resolution-form class="space-y-6">
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div class="space-y-5">
          <div class="rounded-2xl bg-slate-50 p-5"><div class="flex flex-wrap gap-2"><span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">${concern.category}</span><span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">${concern.priority} priority</span></div><p class="mt-4 text-sm leading-6 text-slate-700">${escapeHtml(concern.description)}</p></div>
          <div><h3 class="text-sm font-semibold text-slate-900">Activity</h3><div class="mt-4 border-l-2 border-slate-200 pl-5"><div class="relative pb-5"><span class="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600"></span><p class="text-sm font-medium text-slate-800">Concern received</p><p class="mt-1 text-xs text-slate-500">${concern.age} · Support queue</p></div><div class="relative"><span class="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-slate-300"></span><p class="text-sm font-medium text-slate-800">${concern.assignee === "Unassigned" ? "Awaiting assignment" : `Assigned to ${concern.assignee}`}</p></div></div></div>
        </div>
        <aside class="space-y-4 rounded-2xl border border-slate-200 p-4">
          <div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Requester</span><p class="mt-1 text-sm font-semibold text-slate-900">${escapeHtml(concern.requester)}</p><p class="text-xs text-slate-500">${concern.role}</p></div>
          <div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Reference</span><p class="mt-1 text-sm font-semibold text-blue-700">${concern.booking}</p></div>
          <label class="settings-field"><span>Owner</span><select name="assignee" class="bomo-input w-full"><option ${concern.assignee === "Unassigned" ? "selected" : ""}>Unassigned</option><option ${concern.assignee === "Ana R." ? "selected" : ""}>Ana R.</option><option ${concern.assignee === "Miguel T." ? "selected" : ""}>Miguel T.</option><option ${concern.assignee === "Lea M." ? "selected" : ""}>Lea M.</option></select></label>
          <label class="settings-field"><span>Status</span><select name="status" class="bomo-input w-full"><option ${concern.status === "Open" ? "selected" : ""}>Open</option><option ${concern.status === "In progress" ? "selected" : ""}>In progress</option><option ${concern.status === "Waiting" ? "selected" : ""}>Waiting</option><option ${concern.status === "Resolved" ? "selected" : ""}>Resolved</option></select></label>
        </aside>
      </div>
      <div class="rounded-2xl border border-slate-200 p-5">
        <h3 class="font-semibold text-slate-900">Resolution update</h3>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <label class="settings-field"><span>Outcome</span><select name="outcome" class="bomo-input w-full"><option value="">Select when resolved</option><option>Information provided</option><option>Refund approved</option><option>Booking restored</option><option>Partner action required</option><option>Technical fix applied</option><option>Escalated to management</option></select></label>
          <label class="settings-field"><span>Follow-up date</span><input type="date" name="followUp" class="bomo-input w-full"></label>
          <label class="settings-field sm:col-span-2"><span>Internal note <b>*</b></span><textarea required rows="3" name="note" class="bomo-input w-full" placeholder="Record what was checked, decided, or communicated."></textarea></label>
          <label class="flex items-start gap-3 text-sm text-slate-600 sm:col-span-2"><input type="checkbox" name="notify" checked class="mt-1 h-4 w-4 rounded border-slate-300"><span>Notify the requester about this update</span></label>
        </div>
      </div>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" data-admin-modal-close class="settings-secondary-button">Cancel</button><button type="submit" class="settings-primary-button">Save update</button></div>
    </form>`,
  });
  const form = modal.querySelector("[data-resolution-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    concern.assignee = data.assignee;
    concern.status = data.status;
    renderConcerns(page);
    form.innerHTML = successState(data.status === "Resolved" ? "Concern resolved" : "Concern updated", `${concern.id} is now marked ${data.status.toLowerCase()}.`);
  });
}

function successState(title, message) {
  return `<div class="py-8 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">${title}</h3><p class="mt-2 text-sm text-slate-500">${message}</p><button type="button" data-admin-modal-close class="settings-primary-button mt-6">Done</button></div>`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
