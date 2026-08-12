function renderRatePlanReport() {
  const state = getState();
  const statusLabels = {
    draft: "Draft",
    active: "Active",
    scheduled: "Scheduled",
    paused: "Paused",
    archived: "Archived",
  };
  const allRooms = Object.values(SAMPLE_ROOMS);
  const rooms =
    state.roomMode === "selected" && Array.isArray(state.selectedRooms)
      ? state.selectedRooms
      : allRooms;
  const days =
    state.applicationType === "daily"
      ? "Every day"
      : Array.isArray(state.applicationDays) && state.applicationDays.length
        ? state.applicationDays.join(", ")
        : "No stay days selected";
  const validity = state.noEndDate
    ? `${formatDate(state.startDate)} onward`
    : `${formatDate(state.startDate)} – ${formatDate(state.endDate)}`;
  const payment =
    state.payment === "Pay at Property"
      ? `Pay at property · ${Number(state.partialPaymentValue) || 20}% deposit`
      : state.payment === "Partial Payment"
        ? `Partial payment · ${Number(state.partialPaymentValue) || 20}% at booking`
        : state.payment;
  const status = document.getElementById("reportStatus");
  status.textContent = statusLabels[state.planStatus] || "Draft";
  status.dataset.status = state.planStatus || "draft";
  document.getElementById("reportName").textContent =
    state.ratePlanName || "Untitled rate plan";
  document.getElementById("reportCode").textContent =
    state.ratePlanCode || "No internal code";
  document.getElementById("reportRole").textContent =
    state.planRole === "default" ? "Default fallback" : "Conditional rate plan";
  document.getElementById("reportPriority").textContent =
    state.planRole === "default"
      ? "Fallback"
      : Number(state.planPriority) || 100;
  document.getElementById("reportValidity").textContent = validity;
  document.getElementById("reportStayDays").textContent = days;
  document.getElementById("reportDescription").innerHTML =
    `<b>${state.planRole === "default" ? "Fallback behavior:" : "Selection behavior:"}</b> ${escapeText(state.description || "No description provided.")} ${state.planRole === "default" ? "This plan applies only when no conditional plan matches." : "Among eligible conditional plans, the smallest priority number applies first."}`;
  document.getElementById("reportRooms").innerHTML = rooms.length
    ? rooms.map((room) => `<span>${escapeText(room.name)}</span>`).join("")
    : "<span>No rooms selected</span>";
  document.getElementById("reportAdvance").textContent =
    Number(state.minAdvanceDays) > 0
      ? `${Number(state.minAdvanceDays)} days before check-in`
      : "No minimum";
  document.getElementById("reportMinStay").textContent =
    `${Number(state.planMinNights) || 1} night${Number(state.planMinNights) === 1 ? "" : "s"}`;
  document.getElementById("reportCancellation").textContent =
    state.cancellation;
  document.getElementById("reportPayment").textContent = payment;
  document.getElementById("reportMeals").textContent = state.meals;
  document.getElementById("reportAddons").textContent =
    Array.isArray(state.addons) && state.addons.length
      ? state.addons.join(", ")
      : "None";
  document.getElementById("editPlanLink").href =
    `form.html?plan=${encodeURIComponent(PLAN_ID)}`;

  const overrides = adjustmentItems(state).filter(
    (item) => item.type === "override",
  );
  document.getElementById("reportOverrides").innerHTML = overrides.length
    ? overrides
        .map(
          (item) =>
            `<tr><td><b>${escapeText(item.name)}</b><small>${escapeText(item.scope || "All Room Types")}</small></td><td>${escapeText(adjustmentValue(item))}</td><td>${escapeText(adjustmentDates(item))}</td><td>${escapeText(item.rule || "Always")}</td><td>${escapeText(item.priority || 100)}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty-report">No date overrides configured.</td></tr>';
  const promos = adjustmentItems(state).filter((item) => item.type === "promo");
  document.getElementById("reportPromos").innerHTML = promos.length
    ? promos
        .map(
          (item) =>
            `<tr><td><b>${escapeText(item.name)}</b><small>${item.code ? `Code ${escapeText(item.code)}` : "Automatic promo"}</small></td><td>${escapeText(adjustmentValue(item))}</td><td>${escapeText(adjustmentDates(item))}</td><td>${Number(item.minNights) || 1}+ night${Number(item.minNights) === 1 ? "" : "s"}</td><td>${escapeText(item.priority || 100)}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty-report">No promo rates configured.</td></tr>';
}
document.addEventListener("DOMContentLoaded", renderRatePlanReport);
