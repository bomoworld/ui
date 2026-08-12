import { openAdminModal } from "../modal.js";

const CATEGORY_META = {
  executive: { label: "Executive", heading: "Company performance", color: "indigo", icon: "fa-gauge-high", chart: "Company performance trend", subtitle: "Indexed performance across the selected period" },
  sales: { label: "Sales", heading: "Booking & revenue performance", color: "blue", icon: "fa-chart-line", chart: "Gross booking value trend", subtitle: "Confirmed booking value compared with the previous period" },
  marketing: { label: "Marketing", heading: "Acquisition & campaign performance", color: "violet", icon: "fa-bullhorn", chart: "Qualified demand trend", subtitle: "Sessions that reached a property or checkout intent" },
  operations: { label: "Operations", heading: "Supply & service performance", color: "amber", icon: "fa-gears", chart: "Operational throughput trend", subtitle: "Completed stays and service activity across the platform" },
  finance: { label: "Finance & Accounting", heading: "Financial control & settlement", color: "emerald", icon: "fa-coins", chart: "Net platform revenue trend", subtitle: "Recognized platform revenue after refunds and adjustments" },
  experience: { label: "Customer Experience", heading: "Guest satisfaction & support", color: "rose", icon: "fa-heart", chart: "Customer satisfaction trend", subtitle: "CSAT performance compared with the previous period" },
  supply: { label: "Partner & Property", heading: "Partner & property performance", color: "cyan", icon: "fa-building-user", chart: "Active supply trend", subtitle: "Bookable properties and inventory growth" },
};

const DATA = {
  executive: {
    kpis: [
      ["Gross booking value", "₱12.8M", "+12.4%", "vs previous period", "fa-sack-dollar"],
      ["Net platform revenue", "₱2.41M", "+9.8%", "after adjustments", "fa-wallet"],
      ["Confirmed bookings", "18,422", "+7.2%", "82% occupancy", "fa-calendar-check"],
      ["Contribution margin", "18.8%", "+1.4 pts", "above 17% target", "fa-chart-pie"],
    ],
    current: [52, 66, 61, 74, 70, 85, 92], previous: [46, 54, 58, 62, 65, 70, 74],
    insights: [
      ["positive", "Revenue ahead of plan", "Net platform revenue is 6.2% above the monthly target."],
      ["warning", "Refund rate rising", "Refund value increased 0.7 points in Metro Manila."],
      ["info", "Supply growth opportunity", "Search demand exceeds bookable inventory in Cebu."],
    ],
    reports: [
      ["exec-scorecard", "Executive performance scorecard", "Board-ready view of growth, margin, supply, and customer health.", "Strategy & Planning", "Weekly", "Certified", "4 min ago"],
      ["business-review", "Monthly business review", "Company results against plan with function-level variance.", "Office of the CEO", "Monthly", "Certified", "Today"],
      ["market-portfolio", "Market portfolio performance", "Revenue and supply contribution by destination and segment.", "Strategy & Planning", "Weekly", "Certified", "12 min ago"],
      ["forecast", "Business outlook & forecast", "Forward booking pace, revenue forecast, and operational risk.", "FP&A", "Daily", "Monitoring", "18 min ago"],
    ],
  },
  sales: {
    kpis: [
      ["Gross booking value", "₱12.8M", "+12.4%", "confirmed value", "fa-sack-dollar"],
      ["Booking conversion", "8.4%", "+0.8 pts", "search to booking", "fa-filter-circle-dollar"],
      ["Average booking value", "₱6,948", "+4.1%", "per confirmation", "fa-receipt"],
      ["Cancellation rate", "6.2%", "-0.9 pts", "improved vs prior", "fa-calendar-xmark"],
    ],
    current: [48, 62, 58, 72, 78, 82, 94], previous: [51, 55, 61, 63, 68, 72, 79],
    insights: [
      ["positive", "Resort bookings accelerating", "Resorts contributed 31% of incremental booking value."],
      ["warning", "Mobile checkout drop-off", "Conversion is 1.3 points lower on mobile web."],
      ["info", "Weekend demand window", "Friday searches convert best when inventory is above 75%."],
    ],
    reports: [
      ["sales-daily", "Daily booking & sales pulse", "Bookings, gross value, conversion, and cancellations by channel.", "Commercial", "Daily", "Certified", "4 min ago"],
      ["conversion-funnel", "Booking conversion funnel", "Search, property view, checkout, payment, and confirmation stages.", "Growth", "Daily", "Certified", "7 min ago"],
      ["sales-forecast", "Booking pace & sales forecast", "Forward demand, pickup, and expected close by market.", "Revenue Management", "Daily", "Monitoring", "18 min ago"],
    ],
  },
  marketing: {
    kpis: [
      ["Qualified sessions", "284K", "+18.6%", "high-intent traffic", "fa-users-viewfinder"],
      ["Customer acquisition cost", "₱486", "-8.2%", "blended CAC", "fa-bullseye"],
      ["Campaign ROAS", "5.8×", "+0.6×", "attributed return", "fa-chart-column"],
      ["New guest conversion", "6.9%", "+0.4 pts", "first-time visitors", "fa-user-plus"],
    ],
    current: [42, 58, 55, 70, 64, 82, 90], previous: [48, 51, 56, 60, 65, 68, 72],
    insights: [
      ["positive", "Paid search efficiency improved", "Cost per confirmed booking fell 11% week over week."],
      ["warning", "Attribution delay", "Meta campaign data is currently delayed by 12 minutes."],
      ["info", "Creator content outperforming", "Video-review landings convert 1.7× above site average."],
    ],
    reports: [
      ["campaign-performance", "Campaign performance & ROAS", "Spend, revenue, CAC, and return by campaign and channel.", "Performance Marketing", "Daily", "Monitoring", "16 min ago"],
      ["acquisition-funnel", "Guest acquisition funnel", "Reach through first booking, segmented by source and cohort.", "Growth Marketing", "Weekly", "Certified", "Today"],
      ["promotion-impact", "Promotion incrementality", "Discount utilization, lift, margin impact, and cannibalization.", "Commercial Marketing", "Weekly", "Certified", "9 min ago"],
    ],
  },
  operations: {
    kpis: [
      ["Completed stays", "14,906", "+6.8%", "selected period", "fa-bed"],
      ["Average occupancy", "82.1%", "+3.2 pts", "active inventory", "fa-building-circle-check"],
      ["Issue resolution SLA", "93.4%", "+2.1 pts", "within target", "fa-stopwatch"],
      ["Inventory availability", "96.8%", "-0.4 pts", "bookable nights", "fa-calendar-days"],
    ],
    current: [55, 61, 59, 73, 76, 81, 88], previous: [52, 57, 62, 64, 70, 73, 77],
    insights: [
      ["warning", "Availability below target", "Boracay inventory availability declined 2.6 points."],
      ["positive", "Faster issue resolution", "Median resolution time improved by 47 minutes."],
      ["info", "Peak check-in window", "38% of operational concerns arrive between 2–5 PM."],
    ],
    reports: [
      ["ops-control", "Daily operations control tower", "Arrivals, departures, occupancy, incidents, and inventory exceptions.", "Platform Operations", "Daily", "Certified", "3 min ago"],
      ["service-level", "Service level performance", "SLA compliance, queue age, reopen rate, and resolution time.", "Service Operations", "Daily", "Certified", "6 min ago"],
      ["inventory-health", "Inventory & availability health", "Bookable nights, closeouts, sync failures, and oversell risk.", "Supply Operations", "Hourly", "Monitoring", "11 min ago"],
    ],
  },
  finance: {
    kpis: [
      ["Net platform revenue", "₱2.41M", "+9.8%", "recognized revenue", "fa-money-bill-trend-up"],
      ["Partner payables", "₱8.40M", "+6.1%", "approved settlements", "fa-building-columns"],
      ["Refund exposure", "₱312K", "+0.7 pts", "2.4% of GBV", "fa-arrow-rotate-left"],
      ["Reconciliation rate", "99.3%", "+0.2 pts", "matched transactions", "fa-scale-balanced"],
    ],
    current: [48, 57, 62, 69, 73, 84, 91], previous: [44, 52, 59, 63, 69, 74, 80],
    insights: [
      ["warning", "Unreconciled transactions", "42 gateway records require accounting review."],
      ["positive", "Settlement cycle improved", "92% of eligible payouts cleared within two business days."],
      ["info", "Tax filing readiness", "July VAT schedules are 96% complete."],
    ],
    reports: [
      ["finance-pnl", "Platform revenue & margin statement", "Gross value through contribution margin with period variance.", "FP&A", "Monthly", "Certified", "8 min ago"],
      ["settlement-recon", "Payments, payouts & reconciliation", "Gateway collections matched to ledger, refunds, and settlements.", "Accounting", "Daily", "Certified", "5 min ago"],
      ["tax-fees", "Tax, fees & commission ledger", "VAT, service fees, commissions, rewards, and adjustments.", "Finance Operations", "Monthly", "Monitoring", "22 min ago"],
    ],
  },
  experience: {
    kpis: [
      ["Customer satisfaction", "4.71/5", "+0.12", "post-resolution CSAT", "fa-face-smile"],
      ["Open concerns", "184", "-14.8%", "across all queues", "fa-inbox"],
      ["First response time", "8m 24s", "-2m 10s", "median response", "fa-reply"],
      ["Review sentiment", "86%", "+3.1 pts", "positive sentiment", "fa-star"],
    ],
    current: [61, 64, 70, 68, 76, 83, 89], previous: [58, 61, 63, 67, 70, 73, 78],
    insights: [
      ["positive", "Support backlog declining", "Open concerns are down 14.8% after queue rebalancing."],
      ["warning", "Refund CSAT gap", "Refund-related cases score 0.6 below the support average."],
      ["info", "Review response opportunity", "73 high-impact reviews have no partner response."],
    ],
    reports: [
      ["cx-health", "Customer experience health", "CSAT, sentiment, contact rate, and issue drivers.", "Customer Experience", "Daily", "Certified", "5 min ago"],
      ["support-performance", "Support operations performance", "Queue volume, SLA, resolution time, and agent workload.", "Support Operations", "Daily", "Certified", "3 min ago"],
      ["voice-customer", "Voice of customer themes", "Review and concern themes with emerging issue detection.", "Customer Insights", "Weekly", "Monitoring", "14 min ago"],
    ],
  },
  supply: {
    kpis: [
      ["Active properties", "1,284", "+4.7%", "bookable supply", "fa-hotel"],
      ["Active partners", "842", "+3.2%", "verified accounts", "fa-handshake"],
      ["Revenue per property", "₱9,968", "+7.4%", "average contribution", "fa-chart-simple"],
      ["Partner quality score", "92.6", "+1.8 pts", "portfolio average", "fa-award"],
    ],
    current: [50, 57, 63, 70, 74, 83, 90], previous: [47, 53, 58, 62, 68, 72, 78],
    insights: [
      ["info", "Cebu supply gap", "Demand is 22% above available inventory for upcoming weekends."],
      ["positive", "Partner activation improved", "Median time to first bookable listing fell by 1.4 days."],
      ["warning", "Quality score watchlist", "18 properties fell below the 80-point quality threshold."],
    ],
    reports: [
      ["partner-scorecard", "Partner performance scorecard", "Revenue, conversion, quality, cancellations, and response SLA.", "Partner Success", "Weekly", "Certified", "10 min ago"],
      ["property-ranking", "Property portfolio ranking", "Performance distribution by property, market, and segment.", "Supply Strategy", "Weekly", "Certified", "7 min ago"],
      ["supply-growth", "Supply growth & activation", "Partner pipeline, onboarding duration, listings, and live inventory.", "Supply Acquisition", "Weekly", "Monitoring", "19 min ago"],
    ],
  },
};

let page;
let activeCategory = "executive";
let schedules = [
  { name: "Weekly executive scorecard", timing: "Mondays · 8:00 AM", format: "PDF + Excel", recipients: 6 },
  { name: "Daily finance reconciliation", timing: "Daily · 7:30 AM", format: "Excel", recipients: 3 },
];

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export default function initializeAnalytics() {
  page = document.getElementById("analyticsPage");
  if (!page) return;

  page.addEventListener("click", handleClick);
  page.querySelector("[data-analytics-search]")?.addEventListener("input", renderReports);
  page.querySelector("[data-analytics-status]")?.addEventListener("change", renderReports);
  renderWorkspace();
  renderSchedules();
}

function handleClick(event) {
  const category = event.target.closest("[data-analytics-category]");
  if (category) {
    activeCategory = category.dataset.analyticsCategory;
    renderWorkspace();
    page.querySelector("[data-analytics-heading]")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const control = event.target.closest("[data-analytics-action]");
  if (!control) return;
  const action = control.dataset.analyticsAction;
  if (action === "apply-filters") applyFilters();
  if (action === "create-report") openReportBuilder();
  if (action === "schedule") openSchedule();
  if (action === "open-report") openReport(control.dataset.reportId);
  if (action === "export-chart") openExport("Current dashboard view");
  if (action === "view-digest") openDigest();
  if (action === "metric-dictionary") openMetricDictionary();
  if (action === "data-health") openDataHealth();
  if (action === "manage-schedule") openSchedule(control.dataset.scheduleIndex);
}

function renderWorkspace() {
  const meta = CATEGORY_META[activeCategory];
  const data = DATA[activeCategory];
  page.querySelector("[data-analytics-eyebrow]").textContent = `${meta.label} workspace`;
  page.querySelector("[data-analytics-heading]").textContent = meta.heading;
  page.querySelector("[data-analytics-chart-title]").textContent = meta.chart;
  page.querySelector("[data-analytics-chart-subtitle]").textContent = meta.subtitle;
  page.querySelector("[data-analytics-legend-primary]").textContent = `${meta.label} · current period`;

  page.querySelectorAll("[data-analytics-category]").forEach((button) => {
    const isActive = button.dataset.analyticsCategory === activeCategory;
    button.classList.toggle("bg-slate-950", isActive);
    button.classList.toggle("text-white", isActive);
    button.querySelector("strong")?.classList.toggle("!text-white", isActive);
    button.querySelector("small")?.classList.toggle("!text-slate-300", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  page.querySelector("[data-analytics-kpis]").innerHTML = data.kpis.map(([label, value, change, note, icon], index) => `
    <article class="rounded-2xl border ${index === 0 ? "border-indigo-200 bg-indigo-50/40" : "border-slate-200 bg-white"} p-5 shadow-sm">
      <div class="flex items-start justify-between gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl ${index === 0 ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}"><i class="fa-solid ${icon}"></i></span>
        <span class="rounded-full ${change.startsWith("-") && !label.toLowerCase().includes("cancellation") && !label.toLowerCase().includes("response") && !label.toLowerCase().includes("concerns") && !label.toLowerCase().includes("cost") ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"} px-2.5 py-1 text-xs font-semibold">${escapeHtml(change)}</span>
      </div>
      <p class="mt-5 text-sm font-medium text-slate-500">${escapeHtml(label)}</p>
      <p class="mt-1 text-3xl font-semibold tracking-tight text-slate-950">${escapeHtml(value)}</p>
      <p class="mt-2 text-xs text-slate-400">${escapeHtml(note)}</p>
    </article>`).join("");

  page.querySelector("[data-analytics-chart]").innerHTML = data.current.map((value, index) => `
    <div class="flex h-full flex-1 items-end justify-center gap-1 sm:gap-2">
      <span class="w-2.5 rounded-t bg-slate-300 sm:w-4" style="height:${data.previous[index]}%" title="Previous: ${data.previous[index]}"></span>
      <span class="w-2.5 rounded-t bg-indigo-600 shadow-sm sm:w-4" style="height:${value}%" title="Current: ${value}"></span>
    </div>`).join("");
  page.querySelector("[data-analytics-chart-labels]").innerHTML = ["W1", "W2", "W3", "W4", "W5", "W6", "Now"].map((label) => `<span>${label}</span>`).join("");

  page.querySelector("[data-analytics-insights]").innerHTML = data.insights.map(([type, title, detail]) => {
    const styles = type === "positive" ? ["fa-arrow-trend-up", "bg-emerald-50 text-emerald-600"] : type === "warning" ? ["fa-triangle-exclamation", "bg-amber-50 text-amber-600"] : ["fa-lightbulb", "bg-blue-50 text-blue-600"];
    return `<article class="flex gap-3 px-5 py-4"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles[1]}"><i class="fa-solid ${styles[0]}"></i></span><div><h3 class="text-sm font-semibold text-slate-900">${escapeHtml(title)}</h3><p class="mt-1 text-xs leading-5 text-slate-500">${escapeHtml(detail)}</p></div></article>`;
  }).join("");
  page.querySelector("[data-analytics-signal-count]").textContent = `${data.insights.length} signals`;
  renderReports();
}

function renderReports() {
  const search = page.querySelector("[data-analytics-search]")?.value.trim().toLowerCase() || "";
  const status = page.querySelector("[data-analytics-status]")?.value || "all";
  const reports = DATA[activeCategory].reports.filter((report) => {
    const matchesText = `${report[1]} ${report[2]} ${report[3]}`.toLowerCase().includes(search);
    return matchesText && (status === "all" || report[5] === status);
  });
  page.querySelector("[data-analytics-report-count]").textContent = `${reports.length} report${reports.length === 1 ? "" : "s"}`;
  page.querySelector("[data-analytics-empty]").classList.toggle("hidden", reports.length > 0);
  page.querySelector("[data-analytics-reports]").innerHTML = reports.map(([id, title, description, owner, cadence, statusValue, updated]) => `
    <tr class="hover:bg-slate-50/80">
      <td class="px-5 py-4 sm:px-6"><div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><i class="fa-regular fa-file-lines"></i></span><div><strong class="font-semibold text-slate-900">${escapeHtml(title)}</strong><p class="mt-1 max-w-md text-xs leading-5 text-slate-500">${escapeHtml(description)}</p></div></div></td>
      <td class="px-5 py-4 font-medium text-slate-700">${escapeHtml(owner)}</td>
      <td class="px-5 py-4 text-slate-500">${escapeHtml(cadence)}</td>
      <td class="px-5 py-4"><span class="inline-flex items-center gap-1.5 rounded-full ${statusValue === "Certified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"} px-2.5 py-1 text-xs font-semibold"><i class="fa-solid ${statusValue === "Certified" ? "fa-circle-check" : "fa-clock"}"></i>${statusValue}</span></td>
      <td class="px-5 py-4 text-slate-500">${escapeHtml(updated)}</td>
      <td class="px-5 py-4 text-right"><button type="button" data-analytics-action="open-report" data-report-id="${id}" class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700">Open report</button></td>
    </tr>`).join("");
}

function applyFilters() {
  const period = page.querySelector('[data-analytics-filter="period"]');
  const scope = page.querySelector('[data-analytics-filter="scope"]');
  const notice = page.querySelector("[data-analytics-notice]");
  const periodLabel = period.options[period.selectedIndex].text;
  notice.className = "mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800";
  notice.innerHTML = `<i class="fa-solid fa-circle-check mt-0.5 text-emerald-600"></i><div><strong class="block">Dashboard filters applied</strong><span>${escapeHtml(periodLabel)} · ${escapeHtml(scope.value)} · ${escapeHtml(page.querySelector('[data-analytics-filter="segment"]').value)}.</span></div>`;
  page.querySelector("[data-analytics-freshness]").textContent = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date());
  clearTimeout(applyFilters.timer);
  applyFilters.timer = setTimeout(() => notice.classList.add("hidden"), 5000);
}

function findReport(id) {
  return Object.values(DATA).flatMap((item) => item.reports).find((report) => report[0] === id);
}

function openReport(id) {
  const report = findReport(id);
  if (!report) return;
  const [reportId, title, description, owner, cadence, status, updated] = report;
  const meta = CATEGORY_META[activeCategory];
  const modal = openAdminModal({
    title: escapeHtml(title),
    size: "max-w-4xl",
    content: `<div class="space-y-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div><span class="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm"><i class="fa-solid ${meta.icon} text-indigo-600"></i>${escapeHtml(meta.label)}</span><p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">${escapeHtml(description)}</p></div>
        <span class="shrink-0 rounded-full ${status === "Certified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} px-3 py-1.5 text-xs font-semibold">${escapeHtml(status)}</span>
      </div>
      <dl class="grid gap-3 sm:grid-cols-4">${[["Business owner", owner], ["Refresh cadence", cadence], ["Last updated", updated], ["Report ID", reportId.toUpperCase()]].map(([label, value]) => `<div class="rounded-xl border border-slate-200 p-4"><dt class="text-xs text-slate-400">${escapeHtml(label)}</dt><dd class="mt-1 text-sm font-semibold text-slate-900">${escapeHtml(value)}</dd></div>`).join("")}</dl>
      <form data-analytics-report-form class="space-y-5">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label class="settings-field"><span>Date range</span><select name="period" class="bomo-input w-full"><option>Current dashboard period</option><option>Last 7 days</option><option>Month to date</option><option>Quarter to date</option></select></label>
          <label class="settings-field"><span>Group by</span><select name="group" class="bomo-input w-full"><option>Week</option><option>Day</option><option>Market</option><option>Property</option><option>Channel</option></select></label>
          <label class="settings-field"><span>Market</span><select name="market" class="bomo-input w-full"><option>All markets</option><option>Philippines</option><option>Metro Manila</option><option>Visayas</option></select></label>
          <label class="settings-field"><span>Comparison</span><select name="comparison" class="bomo-input w-full"><option>Previous period</option><option>Previous year</option><option>None</option></select></label>
        </div>
        <div class="rounded-2xl border border-slate-200 p-5"><div class="flex items-center justify-between gap-3"><div><strong class="text-sm text-slate-900">Included output</strong><p class="mt-1 text-xs text-slate-500">Select how this report should be presented.</p></div><span class="text-xs font-semibold text-emerald-700"><i class="fa-solid fa-circle text-[6px] mr-1"></i> Live data</span></div><div class="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"><label class="flex items-center gap-2"><input type="checkbox" checked> KPI summary</label><label class="flex items-center gap-2"><input type="checkbox" checked> Period trend</label><label class="flex items-center gap-2"><input type="checkbox" checked> Detailed records</label><label class="flex items-center gap-2"><input type="checkbox"> Variance commentary</label></div></div>
        <div class="flex flex-wrap justify-end gap-3"><button type="button" data-export-report class="property-button property-button-secondary"><i class="fa-solid fa-download"></i> Export</button><button type="button" data-schedule-report class="property-button property-button-secondary"><i class="fa-regular fa-calendar"></i> Schedule</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-arrows-rotate"></i> Run report</button></div>
      </form>
    </div>`,
  });
  modal.querySelector("[data-export-report]")?.addEventListener("click", () => openExport(title));
  modal.querySelector("[data-schedule-report]")?.addEventListener("click", () => openSchedule(undefined, title));
  modal.querySelector("[data-analytics-report-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = successState("Report is ready", `${title} has been refreshed with the selected controls.`);
  });
}

function openReportBuilder() {
  const categoryOptions = Object.entries(CATEGORY_META).map(([key, item]) => `<option value="${key}" ${key === activeCategory ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("");
  const modal = openAdminModal({
    title: "Build a custom report",
    size: "max-w-3xl",
    content: `<form data-report-builder class="space-y-6">
      <div class="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800"><i class="fa-solid fa-wand-magic-sparkles mr-2"></i>Combine governed metrics and dimensions into a reusable report view.</div>
      <div class="grid gap-4 sm:grid-cols-2"><label class="settings-field sm:col-span-2"><span>Report name <b>*</b></span><input required name="name" class="bomo-input w-full" placeholder="e.g. Weekly regional booking health"></label><label class="settings-field"><span>Business function <b>*</b></span><select required name="category" class="bomo-input w-full">${categoryOptions}</select></label><label class="settings-field"><span>Primary data source <b>*</b></span><select required name="source" class="bomo-input w-full"><option>Bookings & inventory</option><option>Payments & accounting ledger</option><option>Marketing attribution</option><option>Support & reviews</option><option>Partner and property registry</option></select></label><label class="settings-field"><span>Primary measure <b>*</b></span><select required name="measure" class="bomo-input w-full"><option>Gross booking value</option><option>Confirmed bookings</option><option>Net platform revenue</option><option>Conversion rate</option><option>Customer satisfaction</option></select></label><label class="settings-field"><span>Break down by <b>*</b></span><select required name="dimension" class="bomo-input w-full"><option>Market</option><option>Property</option><option>Partner</option><option>Channel</option><option>Week</option></select></label><label class="settings-field"><span>Default period</span><select name="period" class="bomo-input w-full"><option>Last 30 days</option><option>Month to date</option><option>Quarter to date</option><option>Year to date</option></select></label><label class="settings-field"><span>Visibility</span><select name="visibility" class="bomo-input w-full"><option>My reports</option><option>My team</option><option>All administrators</option></select></label></div>
      <fieldset><legend class="text-sm font-semibold text-slate-700">Output sections</legend><div class="mt-3 grid gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 sm:grid-cols-2"><label class="flex items-center gap-2"><input type="checkbox" checked> KPI summary</label><label class="flex items-center gap-2"><input type="checkbox" checked> Trend visualization</label><label class="flex items-center gap-2"><input type="checkbox" checked> Detail table</label><label class="flex items-center gap-2"><input type="checkbox"> Decision signals</label></div></fieldset>
      <div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-chart-simple"></i> Create report</button></div>
    </form>`,
  });
  modal.querySelector("[data-report-builder]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const name = new FormData(event.currentTarget).get("name");
    event.currentTarget.innerHTML = successState("Custom report created", `${escapeHtml(name)} is now available in your report workspace.`);
  });
}

function openExport(scope) {
  const modal = openAdminModal({
    title: "Export analytics",
    size: "max-w-xl",
    content: `<form data-analytics-export class="space-y-5"><div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Report scope</p><p class="mt-1 font-semibold text-slate-900">${escapeHtml(scope)}</p></div><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>File format <b>*</b></span><select required class="bomo-input w-full"><option>Excel workbook (.xlsx)</option><option>PDF report</option><option>CSV data</option></select></label><label class="settings-field"><span>Data detail</span><select class="bomo-input w-full"><option>Summary + detailed records</option><option>Summary only</option><option>Detailed records only</option></select></label></div><label class="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600"><input type="checkbox" checked class="mt-0.5"><span>Include active filters, metric definitions, and generated timestamp.</span></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-download"></i> Prepare export</button></div></form>`,
  });
  modal.querySelector("[data-analytics-export]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = successState("Export prepared", "Your analytics file is ready for this UI session.");
  });
}

function openSchedule(index, reportName = "") {
  const existing = index !== undefined ? schedules[Number(index)] : null;
  const modal = openAdminModal({
    title: existing ? "Manage scheduled report" : "Schedule a report",
    size: "max-w-2xl",
    content: `<form data-analytics-schedule class="space-y-5">
      <div class="grid gap-4 sm:grid-cols-2"><label class="settings-field sm:col-span-2"><span>Schedule name <b>*</b></span><input required name="name" class="bomo-input w-full" value="${escapeHtml(existing?.name || reportName || `${CATEGORY_META[activeCategory].label} performance report`)}"></label><label class="settings-field"><span>Business function</span><select name="category" class="bomo-input w-full">${Object.values(CATEGORY_META).map((item) => `<option ${item.label === CATEGORY_META[activeCategory].label ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}</select></label><label class="settings-field"><span>Frequency <b>*</b></span><select required name="frequency" class="bomo-input w-full"><option>Daily</option><option selected>Weekly</option><option>Monthly</option><option>Quarterly</option></select></label><label class="settings-field"><span>Delivery day</span><select name="day" class="bomo-input w-full"><option>Monday</option><option>Friday</option><option>First day of month</option></select></label><label class="settings-field"><span>Delivery time</span><input type="time" name="time" value="08:00" class="bomo-input w-full"></label><label class="settings-field"><span>File format</span><select name="format" class="bomo-input w-full"><option>PDF + Excel</option><option>PDF</option><option>Excel</option><option>CSV</option></select></label><label class="settings-field sm:col-span-2"><span>Recipients <b>*</b></span><input required type="email" name="recipients" class="bomo-input w-full" value="admin@bomo.world"><small>Add a verified administrator or team distribution address.</small></label></div>
      <div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-regular fa-calendar-check"></i> ${existing ? "Update schedule" : "Save schedule"}</button></div>
    </form>`,
  });
  modal.querySelector("[data-analytics-schedule]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const formData = new FormData(event.currentTarget);
    const record = { name: formData.get("name"), timing: `${formData.get("frequency")} · ${formData.get("time")}`, format: formData.get("format"), recipients: 1 };
    if (existing) schedules[Number(index)] = record;
    else schedules.push(record);
    renderSchedules();
    event.currentTarget.innerHTML = successState(existing ? "Schedule updated" : "Report scheduled", "Delivery settings are saved for this admin session.");
  });
}

function renderSchedules() {
  page.querySelector("[data-analytics-schedules]").innerHTML = schedules.slice(0, 3).map((item, index) => `<button type="button" data-analytics-action="manage-schedule" data-schedule-index="${index}" class="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/30"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><i class="fa-regular fa-clock"></i></span><span class="min-w-0 flex-1"><strong class="block truncate text-sm text-slate-900">${escapeHtml(item.name)}</strong><small class="mt-1 block text-xs text-slate-500">${escapeHtml(item.timing)} · ${escapeHtml(item.format)}</small></span><span class="text-xs font-medium text-slate-400">${item.recipients} recipient${item.recipients === 1 ? "" : "s"}</span><i class="fa-solid fa-chevron-right text-xs text-slate-300"></i></button>`).join("");
}

function openDigest() {
  const meta = CATEGORY_META[activeCategory];
  const insights = DATA[activeCategory].insights;
  openAdminModal({
    title: `${escapeHtml(meta.label)} decision digest`,
    size: "max-w-2xl",
    content: `<div class="space-y-5"><div class="rounded-2xl bg-slate-950 p-5 text-white"><p class="text-xs font-semibold uppercase tracking-[.14em] text-indigo-300">Admin briefing</p><h3 class="mt-2 text-xl font-semibold">${escapeHtml(meta.heading)}</h3><p class="mt-2 text-sm text-slate-300">Signals are generated from the currently selected dashboard period and scope.</p></div><div class="space-y-3">${insights.map(([type, title, detail], index) => `<div class="rounded-2xl border border-slate-200 p-4"><div class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${type === "warning" ? "bg-amber-100 text-amber-700" : type === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"} text-xs font-bold">${index + 1}</span><div><h4 class="font-semibold text-slate-900">${escapeHtml(title)}</h4><p class="mt-1 text-sm leading-6 text-slate-500">${escapeHtml(detail)}</p></div></div></div>`).join("")}</div><div class="flex justify-end"><button type="button" data-admin-modal-close class="property-button property-button-primary">Done</button></div></div>`,
  });
}

function openMetricDictionary() {
  const metrics = DATA[activeCategory].kpis;
  openAdminModal({
    title: "Governed metric dictionary",
    size: "max-w-3xl",
    content: `<div class="space-y-5"><p class="text-sm leading-6 text-slate-500">Approved definitions used by the ${escapeHtml(CATEGORY_META[activeCategory].label)} workspace. Definitions keep dashboards and exported reports consistent.</p><div class="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">${metrics.map(([label], index) => `<div class="grid gap-2 p-4 sm:grid-cols-[1fr_1.6fr_auto] sm:items-center"><strong class="text-sm text-slate-900">${escapeHtml(label)}</strong><span class="text-xs leading-5 text-slate-500">${index === 0 ? "Calculated from confirmed platform records, excluding test and voided transactions." : "Calculated using the approved business rule for the selected reporting period and scope."}</span><span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Certified</span></div>`).join("")}</div></div>`,
  });
}

function openDataHealth() {
  openAdminModal({
    title: "Data source health & lineage",
    size: "max-w-3xl",
    content: `<div class="space-y-5"><div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><i class="fa-solid fa-circle-check mr-2"></i><strong>Core reporting pipelines are operational.</strong> One non-critical source is delayed.</div><div class="overflow-hidden rounded-2xl border border-slate-200"><div class="grid grid-cols-[1fr_auto_auto] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"><span>Source</span><span>Freshness</span><span>Status</span></div>${[["Bookings & inventory", "3 minutes", "Healthy"], ["Payments & accounting ledger", "5 minutes", "Healthy"], ["Marketing attribution", "12 minutes", "Delayed"], ["Support & reviews", "4 minutes", "Healthy"], ["Partner & property registry", "8 minutes", "Healthy"]].map(([source, freshness, status]) => `<div class="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-slate-100 px-4 py-4 text-sm"><span class="font-medium text-slate-800">${source}</span><span class="text-slate-500">${freshness}</span><span class="w-20 rounded-full ${status === "Healthy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"} px-2 py-1 text-center text-xs font-semibold">${status}</span></div>`).join("")}</div><p class="text-xs leading-5 text-slate-500"><i class="fa-solid fa-diagram-project mr-1 text-indigo-500"></i> Report lineage connects operational sources to governed measures before they are displayed in this workspace.</p></div>`,
  });
}

function successState(title, message) {
  return `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">${escapeHtml(title)}</h3><p class="mx-auto mt-2 max-w-md text-sm text-slate-500">${message}</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
}
