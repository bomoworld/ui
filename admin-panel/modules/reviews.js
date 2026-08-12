import { closeAdminModal, openAdminModal } from "../modal.js";

const VIDEO_REVIEW_STORAGE_KEY = "bomo-video-reviews-v1";
const CREATOR_REVIEW_SOURCE = "creator-video-store";

const initialReviews = [
  { id: "RV-81291", property: "Azure Bay Resort", booking: "BK-70312", guest: "Angela Ramos", type: "Video review", status: "pending", priority: "high", rating: 4, reward: "1 credit", moderator: "Unassigned", submitted: "18 min ago", sla: "42m left", summary: "Verified-stay video requires a final content and privacy check.", content: "The resort staff were wonderful and the sunset view was exactly as shown. The video includes a brief shot of another guest in the lobby." },
  { id: "RV-81288", property: "Paradise Suites", booking: "BK-77034", guest: "Marcus Lee", type: "Text review", status: "ready", priority: "normal", rating: 5, reward: "—", moderator: "You", submitted: "31 min ago", sla: "Ready", summary: "Text review passed automated language and authenticity checks.", content: "Clean room, fast check-in, and a very convenient Makati location." },
  { id: "RW-61192", property: "Ocean Pearl Residences", booking: "BK-54011", guest: "Kara Silva", type: "Reward validation", status: "pending", priority: "normal", rating: 5, reward: "₱4,800", moderator: "Rewards Team", submitted: "1 hr ago", sla: "7h left", summary: "Creator reward requires booking-attribution validation.", content: "Twelve attributed bookings are associated with this approved creator review." },
  { id: "RP-31172", property: "Palm Grove Resort", booking: "BK-61092", guest: "Community report", type: "Reported content", status: "escalated", priority: "high", rating: 2, reward: "—", moderator: "Trust & Safety", submitted: "2 hr ago", sla: "Escalated", summary: "Property reports that the review contains misleading location details.", content: "The beach was described as private, but public access was visible throughout our stay." },
  { id: "RV-81273", property: "Seaside Luxury Hotel", booking: "BK-70142", guest: "Nina Ong", type: "Video review", status: "changes", priority: "normal", rating: 4, reward: "1 credit", moderator: "You", submitted: "3 hr ago", sla: "5h left", summary: "Creator must trim personally identifying information from the clip.", content: "A booking confirmation number is visible briefly near the beginning of the video." },
  { id: "FR-21122", property: "Crystal Bay Hotel", booking: "BK-90011", guest: "Fraud signal", type: "Reported content", status: "escalated", priority: "high", rating: 5, reward: "₱12,600", moderator: "Trust & Safety", submitted: "Today", sla: "Escalated", summary: "Multiple accounts share device and reward-payment attributes.", content: "Automated detection linked four creator accounts to one device and payout destination." },
  { id: "RV-81265", property: "Bluewater Residences", booking: "BK-69931", guest: "Paolo Reyes", type: "Text review", status: "published", priority: "normal", rating: 5, reward: "—", moderator: "You", submitted: "Today", sla: "Complete", summary: "Review published after standard moderation.", content: "Excellent service and a comfortable space for a long business stay." },
  { id: "RV-81254", property: "Sunset Cliff Villas", booking: "BK-69444", guest: "Mia Lim", type: "Video review", status: "pending", priority: "normal", rating: 4, reward: "1 credit", moderator: "Unassigned", submitted: "Today", sla: "9h left", summary: "Video review is queued for content and reward checks.", content: "A detailed room tour covering the view, kitchen, bedroom, and check-in experience." },
];

let reviews = structuredClone(initialReviews);
let activeQuickFilter = "all";
let currentContent;
let storageListenerBound = false;

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const statusLabel = (status) => ({ pending: "Pending review", changes: "Changes requested", ready: "Ready to publish", published: "Published", escalated: "Escalated", rejected: "Rejected" }[status] || status);
const statusClass = (status) => ({ pending: "bg-blue-50 text-blue-700", changes: "bg-amber-50 text-amber-700", ready: "bg-emerald-50 text-emerald-700", published: "bg-emerald-50 text-emerald-700", escalated: "bg-rose-50 text-rose-700", rejected: "bg-slate-100 text-slate-700" }[status] || "bg-slate-100 text-slate-700");
const typeClass = (type) => type.includes("Video") ? "bg-violet-50 text-violet-700" : type.includes("Reward") ? "bg-amber-50 text-amber-700" : type.includes("Reported") ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700";

function readCreatorVideoReviews() {
  try {
    const value = JSON.parse(localStorage.getItem(VIDEO_REVIEW_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((record) => record && typeof record === "object") : [];
  } catch {
    return [];
  }
}

function creatorStatusToAdminStatus(status) {
  return {
    pending: "pending",
    approved: "published",
    changes_requested: "changes",
    rejected: "rejected",
  }[status] || null;
}

function creatorReviewSummary(record, adminStatus) {
  const moderationReason = String(record.moderationReason || "").trim();
  if (adminStatus === "changes") return moderationReason || "The creator must update this video before resubmitting.";
  if (adminStatus === "rejected") return moderationReason || "This creator submission did not pass moderation.";
  if (adminStatus === "published") return "Creator video approved and published to travelers.";
  return "Creator video is awaiting system content, privacy, and authenticity approval.";
}

function creatorReviewSla(adminStatus) {
  if (adminStatus === "published" || adminStatus === "rejected") return "Complete";
  if (adminStatus === "changes") return "Creator action";
  return "Awaiting review";
}

function mapCreatorVideoReview(record) {
  const status = creatorStatusToAdminStatus(record.status);
  if (!status) return null;
  const rating = Math.max(1, Math.min(5, Math.round(Number(record.rating) || 5)));
  const title = String(record.title || "Untitled video review");
  const fileName = String(record.fileName || "").trim();
  const description = String(record.description || "").trim();

  return {
    id: String(record.id || ""),
    property: String(record.property || "BOMO stay"),
    booking: String(record.bookingId || "No booking ID"),
    guest: title,
    type: "Video review",
    status,
    priority: "normal",
    rating,
    reward: "1 credit",
    moderator: status === "pending" ? "Unassigned" : "You",
    submitted: String(record.submittedAt || record.updatedAt || ""),
    sla: creatorReviewSla(status),
    summary: creatorReviewSummary(record, status),
    content: description || (fileName ? `Uploaded video: ${fileName}` : title),
    source: CREATOR_REVIEW_SOURCE,
    creatorRecordId: String(record.id || ""),
  };
}

function syncCreatorVideoReviews() {
  const creatorReviews = readCreatorVideoReviews()
    .map(mapCreatorVideoReview)
    .filter((review) => review?.id)
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return Date.parse(b.submitted) - Date.parse(a.submitted);
    });
  reviews = [
    ...creatorReviews,
    ...reviews.filter((review) => review.source !== CREATOR_REVIEW_SOURCE),
  ];
}

function saveCreatorModerationDecision(review, adminStatus, moderationReason) {
  const creatorStatus = {
    pending: "pending",
    changes: "changes_requested",
    published: "approved",
    rejected: "rejected",
  }[adminStatus];
  if (!creatorStatus) {
    throw new Error("Creator videos can be kept in review, approved, returned for changes, or rejected.");
  }

  const records = readCreatorVideoReviews();
  const index = records.findIndex((record) => String(record.id) === review.creatorRecordId);
  if (index < 0) throw new Error("This creator submission is no longer available.");

  const now = new Date().toISOString();
  records[index] = {
    ...records[index],
    status: creatorStatus,
    moderationReason: ["changes_requested", "rejected"].includes(creatorStatus)
      ? moderationReason
      : "",
    updatedAt: now,
    decidedAt: creatorStatus === "pending" ? "" : now,
    publishedAt: creatorStatus === "approved" ? now : "",
  };

  localStorage.setItem(VIDEO_REVIEW_STORAGE_KEY, JSON.stringify(records));
}

function handleCreatorStorageChange(event) {
  if (
    event.key !== VIDEO_REVIEW_STORAGE_KEY
    || !currentContent?.querySelector("#reviewsPage")
  ) return;
  syncCreatorVideoReviews();
  updateSummary();
  renderRows();
}

function filteredReviews() {
  const search = currentContent.querySelector("[data-review-search]")?.value.trim().toLowerCase() || "";
  const status = currentContent.querySelector("[data-review-status]")?.value || "all";
  const type = currentContent.querySelector("[data-review-type]")?.value || "all";
  const moderator = currentContent.querySelector("[data-review-moderator]")?.value || "all";
  return reviews.filter((review) => {
    const source = `${review.id} ${review.property} ${review.booking} ${review.guest} ${review.type} ${review.summary}`.toLowerCase();
    const quick = activeQuickFilter === "all"
      || (activeQuickFilter === "assigned" && review.moderator === "You")
      || (activeQuickFilter === "video" && review.type === "Video review")
      || (activeQuickFilter === "reported" && review.type === "Reported content")
      || (activeQuickFilter === "rewards" && review.type === "Reward validation")
      || (activeQuickFilter === "escalated" && review.status === "escalated");
    return quick && (!search || source.includes(search)) && (status === "all" || review.status === status) && (type === "all" || review.type === type) && (moderator === "all" || review.moderator === moderator);
  });
}

function renderRows() {
  const visible = filteredReviews();
  currentContent.querySelector("[data-review-visible-count]").textContent = `${visible.length} ${visible.length === 1 ? "record" : "records"}`;
  currentContent.querySelector("[data-review-footer-count]").textContent = visible.length;
  const list = currentContent.querySelector("[data-review-list]");
  if (!visible.length) {
    list.innerHTML = `<tr><td colspan="6" class="px-6 py-14 text-center"><div class="mx-auto flex max-w-sm flex-col items-center"><span class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><i class="fa-solid fa-filter-circle-xmark"></i></span><p class="mt-3 font-semibold text-slate-800">No reviews match these filters</p><p class="mt-1 text-sm text-slate-500">Clear the filters or choose another moderation queue.</p><button type="button" class="mt-4 property-button property-button-secondary" data-review-action="clear-filters">Clear filters</button></div></td></tr>`;
    return;
  }
  list.innerHTML = visible.map((review) => `<tr class="property-queue-row">
    <td class="px-5 py-4 sm:px-6"><div class="flex items-start gap-3"><span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${review.priority === "high" ? "bg-rose-500" : "bg-violet-500"}"></span><div class="min-w-0"><p class="font-semibold text-slate-900">${escapeHtml(review.property)}</p><p class="mt-0.5 text-xs text-slate-500">${escapeHtml(review.id)} · ${escapeHtml(review.booking)} · ${escapeHtml(review.guest)}</p><p class="mt-1 text-xs text-slate-400">${escapeHtml(review.summary)}</p></div></div></td>
    <td class="px-5 py-4"><div class="flex flex-col items-start gap-1.5"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${typeClass(review.type)}">${escapeHtml(review.type)}</span><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(review.status)}">${escapeHtml(statusLabel(review.status))}</span></div></td>
    <td class="px-5 py-4"><p class="font-medium text-amber-500" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}<span class="text-slate-200">${"★".repeat(5 - review.rating)}</span></p><p class="mt-1 text-xs text-slate-500">${escapeHtml(review.reward)}</p></td>
    <td class="px-5 py-4 text-slate-700">${escapeHtml(review.moderator)}</td>
    <td class="px-5 py-4"><span class="font-semibold ${review.priority === "high" ? "text-rose-600" : "text-slate-700"}">${escapeHtml(review.sla)}</span></td>
    <td class="px-5 py-4 text-right"><button type="button" class="property-button property-button-primary property-row-action" data-review-action="review" data-review-id="${escapeHtml(review.id)}">Review <i class="fa-solid fa-arrow-right text-xs"></i></button></td>
  </tr>`).join("");
}

function updateSummary() {
  const values = {
    open: reviews.filter((review) => !["published", "rejected"].includes(review.status)).length,
    risk: reviews.filter((review) => review.priority === "high" && !["published", "rejected"].includes(review.status)).length,
    rewards: reviews.filter((review) => review.type === "Reward validation" && review.status !== "published").length,
    published: 42 + reviews.filter((review) => review.status === "published").length - initialReviews.filter((review) => review.status === "published").length,
  };
  Object.entries(values).forEach(([key, value]) => { currentContent.querySelector(`[data-review-summary="${key}"]`).textContent = value; });
}

function setQuickFilter(filter) {
  activeQuickFilter = filter;
  currentContent.querySelectorAll("[data-review-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.reviewFilter === filter));
  renderRows();
}

function clearFilters() {
  currentContent.querySelector("[data-review-search]").value = "";
  currentContent.querySelector("[data-review-status]").value = "all";
  currentContent.querySelector("[data-review-type]").value = "all";
  currentContent.querySelector("[data-review-moderator]").value = "all";
  setQuickFilter("all");
}

function showNotice(message, tone = "success") {
  const notice = currentContent.querySelector("#reviewNotice");
  if (!notice) return;
  notice.textContent = message;
  notice.className = tone === "error"
    ? "rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
    : "rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700";
  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => notice.classList.add("hidden"), 5000);
}

function openAssignModerator() {
  const visible = filteredReviews().filter((review) => review.moderator === "Unassigned" && !["published", "rejected"].includes(review.status));
  const modal = openAdminModal({ title: "Assign review moderator", content: `<form data-review-assign-form class="space-y-5"><div class="rounded-2xl bg-slate-50 p-4"><p class="font-semibold text-slate-900">Assign the current unassigned queue</p><p class="mt-1 text-sm text-slate-500">${visible.length} ${visible.length === 1 ? "record is" : "records are"} ready to assign. Current filters are respected.</p></div><label class="settings-field"><span>Moderator <b>*</b></span><select required name="moderator" class="bomo-input w-full"><option value="You">You — Community Operations</option><option value="Trust & Safety">Trust & Safety</option><option value="Rewards Team">Rewards Team</option></select></label><label class="settings-field"><span>Assignment note</span><textarea name="note" rows="3" class="bomo-input w-full" placeholder="Optional context for the moderator"></textarea></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-user-check"></i> Assign moderator</button></div></form>` });
  modal.querySelector("[data-review-assign-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const moderator = new FormData(event.currentTarget).get("moderator");
    visible.forEach((review) => { review.moderator = moderator; });
    closeAdminModal(); renderRows(); showNotice(`${visible.length} review ${visible.length === 1 ? "was" : "records were"} assigned to ${moderator}.`);
  });
}

function openReview(id) {
  const review = reviews.find((item) => item.id === id);
  if (!review) return;
  const isCreatorSubmission = review.source === CREATOR_REVIEW_SOURCE;
  const escalationOption = isCreatorSubmission
    ? ""
    : `<option value="escalated" ${review.status === "escalated" ? "selected" : ""}>Escalate to Trust & Safety</option>`;
  const modal = openAdminModal({ title: `Moderate · ${escapeHtml(review.property)}`, size: "max-w-4xl", content: `<form data-review-decision-form class="space-y-6">
    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]"><div class="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div class="flex flex-wrap gap-2"><span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700">${escapeHtml(review.type)}</span><span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">${escapeHtml(review.booking)}</span>${isCreatorSubmission ? '<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Creator submission</span>' : ""}</div><div class="mt-5 rounded-xl bg-white p-4"><p class="text-sm leading-6 text-slate-700">“${escapeHtml(review.content)}”</p></div><p class="mt-4 text-xs text-slate-500">${escapeHtml(review.id)} · ${escapeHtml(review.guest)} · verified stay</p></div><aside class="space-y-4 rounded-2xl border border-slate-200 p-4"><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Rating</span><p class="mt-1 text-amber-500">${"★".repeat(review.rating)}<span class="text-slate-200">${"★".repeat(5 - review.rating)}</span></p></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Reward</span><p class="mt-1 text-sm font-semibold text-slate-900">${escapeHtml(review.reward)}</p></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Current owner</span><p class="mt-1 text-sm font-semibold text-slate-900">${escapeHtml(review.moderator)}</p></div><div><span class="text-[10px] font-bold uppercase tracking-wide text-slate-400">SLA</span><p class="mt-1 text-sm font-semibold ${review.priority === "high" ? "text-rose-600" : "text-slate-900"}">${escapeHtml(review.sla)}</p></div></aside></div>
    <div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Moderation decision <b>*</b></span><select required name="status" class="bomo-input w-full"><option value="pending" ${review.status === "pending" ? "selected" : ""}>Keep in review</option><option value="changes" ${review.status === "changes" ? "selected" : ""}>Request changes</option><option value="published" ${review.status === "published" ? "selected" : ""}>Approve and publish</option><option value="rejected" ${review.status === "rejected" ? "selected" : ""}>Reject content</option>${escalationOption}</select></label><label class="settings-field"><span>Moderator <b>*</b></span><select required name="moderator" class="bomo-input w-full"><option value="You" ${review.moderator === "You" ? "selected" : ""}>You — Community Operations</option><option value="Trust & Safety" ${review.moderator === "Trust & Safety" ? "selected" : ""}>Trust & Safety</option><option value="Rewards Team" ${review.moderator === "Rewards Team" ? "selected" : ""}>Rewards Team</option><option value="Unassigned" ${review.moderator === "Unassigned" ? "selected" : ""}>Unassigned</option></select></label><label class="settings-field sm:col-span-2"><span>Decision note <b>*</b></span><textarea required rows="4" name="note" class="bomo-input w-full" placeholder="Record policy findings and any required next step.">${escapeHtml(review.summary)}</textarea></label></div>
    <div class="grid gap-3 sm:grid-cols-2"><label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input name="notify" type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300"><span><strong class="text-slate-800">Notify the guest</strong><br>Send the moderation outcome.</span></label><label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input name="rewardApproved" type="checkbox" ${review.reward !== "—" ? "checked" : ""} class="mt-0.5 h-4 w-4 rounded border-slate-300"><span><strong class="text-slate-800">Approve reward</strong><br>Confirm creator eligibility.</span></label></div>
    <div class="flex flex-wrap justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> Save decision</button></div>
  </form>` });
  modal.querySelector("[data-review-decision-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const nextStatus = String(data.get("status"));
    const moderationReason = String(data.get("note")).trim();
    try {
      if (isCreatorSubmission) {
        saveCreatorModerationDecision(review, nextStatus, moderationReason);
      }
      review.status = nextStatus;
      review.moderator = String(data.get("moderator"));
      review.summary = moderationReason;
      review.sla = ["published", "rejected"].includes(review.status) ? "Complete" : review.status === "escalated" ? "Escalated" : review.status === "changes" ? "Creator action" : review.sla;
      const reviewId = review.id;
      if (isCreatorSubmission) syncCreatorVideoReviews();
      closeAdminModal();
      updateSummary();
      renderRows();
      showNotice(`${reviewId} was updated to “${statusLabel(nextStatus)}”.`);
    } catch (error) {
      closeAdminModal();
      showNotice(error?.message || "The moderation decision could not be saved.", "error");
    }
  });
}

function handleClick(event) {
  const control = event.target.closest("[data-review-action]");
  if (!control || !currentContent.contains(control)) return;
  const { reviewAction: action, reviewFilter: filter, reviewId: id } = control.dataset;
  if (action === "filter") setQuickFilter(filter);
  if (action === "clear-filters") clearFilters();
  if (action === "assign-moderator") openAssignModerator();
  if (action === "review") openReview(id);
}

export default function initializeReviews() {
  currentContent = document.getElementById("admin-content-module");
  if (!currentContent) return;
  syncCreatorVideoReviews();
  if (!storageListenerBound) {
    window.addEventListener("storage", handleCreatorStorageChange);
    storageListenerBound = true;
  }
  currentContent.addEventListener("click", handleClick);
  currentContent.querySelector("[data-review-search]")?.addEventListener("input", renderRows);
  currentContent.querySelectorAll("[data-review-status], [data-review-type], [data-review-moderator]").forEach((control) => control.addEventListener("change", renderRows));
  updateSummary(); renderRows();
}
