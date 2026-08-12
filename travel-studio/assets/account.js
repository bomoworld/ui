import { videoReviewStore } from "./video-reviews.js";

const ACCOUNT_PAGES = Object.freeze({
  dashboard: accountPage("./pages/guest/dashboard.html", "Dashboard"),
  bookings: accountPage("./pages/guest/guest-bookings.html", "Trips"),
  "booking-details": accountPage(
    "./pages/guest/guest-booking-details.html",
    "Trip details",
  ),
  reviews: accountPage("./pages/guest/guest-reviews.html", "Reviews"),
  messages: accountPage("./pages/guest/guest-messages.html", "Messages"),
  "message-thread": accountPage(
    "./pages/guest/guest-message-thread.html",
    "Conversation",
  ),
  wishlist: accountPage("./pages/guest/guest-wishlist.html", "Saved stays"),
  profile: accountPage(
    "./pages/guest/guest-profile.html",
    "Profile & payments",
  ),
  overview: studioPage("./pages/studio/overview.html", "Creator studio"),
  videos: studioPage("./videos.html", "Video reviews"),
  upload: studioPage("./upload.html", "Upload video review"),
  analytics: studioPage("./analytics.html", "Analytics"),
  earnings: studioPage("./earnings.html", "Earnings"),
  credits: studioPage("./credits.html", "Review credits"),
  "profile-settings": studioPage(
    "./profile-settings.html",
    "Creator profile settings",
  ),
  settings: studioPage("./settings.html", "Settings"),
  help: studioPage("./help-center.html", "Help center"),
  contact: studioPage("./contact-support.html", "Contact support"),
});

const STUDIO_FILE_ROUTES = Object.freeze({
  "index.html": "overview",
  "videos.html": "videos",
  "upload.html": "upload",
  "analytics.html": "analytics",
  "earnings.html": "earnings",
  "credits.html": "credits",
  "profile-settings.html": "profile-settings",
  "settings.html": "settings",
  "help-center.html": "help",
  "contact-support.html": "contact",
});

const GUEST_PAGE_INITIALIZERS = Object.freeze({
  dashboard: initializeDashboardSummary,
  wishlist: initializeWishlist,
  profile: initializePaymentMethods,
  reviews: initializeGuestReviewSummary,
  messages: initializeMessagesInbox,
  "message-thread": initializeMessageThread,
  videos: initializeVideoLibrary,
  upload: initializeVideoUpload,
  help: initializeHelpCenter,
});

const BOOKING_STORAGE_KEY = "bomo-trip-cart-v1";
const MESSAGE_READ_STORAGE_KEY = "bomo-read-message-threads-v1";
const DEMO_VIDEO_URL = "https://youtu.be/m6kYdPKhig8";
const DEMO_VIDEO_EMBED_URL =
  "https://www.youtube.com/embed/m6kYdPKhig8?rel=0";
const MESSAGE_THREADS = Object.freeze({
  1: {
    name: "BOMO Beach Resort",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    bookingId: "BMO-2026-10001",
    bookingLabel: "Booking #BMO-2026-10001",
    period: "Jul 15–18, 2026",
    status: "Confirmed",
    statusClass: "confirmed",
    online: true,
    messages: [
      {
        day: "July 10, 2026",
        direction: "incoming",
        text: "Welcome to BOMO Beach Resort. Please let us know if you have any questions before your arrival.",
        time: "10:15 AM",
      },
      {
        day: "July 10, 2026",
        direction: "outgoing",
        text: "Hi. Is early check-in available?",
        time: "10:22 AM",
      },
      {
        day: "July 10, 2026",
        direction: "incoming",
        text: "Early check-in is subject to room availability. We will confirm on your arrival date.",
        time: "10:28 AM",
      },
      {
        day: "July 15, 2026",
        direction: "incoming",
        text: "Your room is ready. Check-in starts at 2:00 PM. Present your booking confirmation at reception.",
        time: "12:05 PM",
      },
    ],
  },
  2: {
    name: "Palm Grove Hotel",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    bookingId: "BMO-2026-10112",
    bookingLabel: "Booking #BMO-2026-10112",
    period: "Aug 04–07, 2026",
    status: "Upcoming",
    statusClass: "upcoming",
    online: false,
    messages: [
      {
        day: "Today",
        direction: "incoming",
        text: "We can arrange your airport transfer. Please confirm your flight number and arrival time.",
        time: "8:42 AM",
      },
      {
        day: "Today",
        direction: "outgoing",
        text: "My flight is PR 2863 and lands at 3:20 PM.",
        time: "8:55 AM",
      },
      {
        day: "Today",
        direction: "incoming",
        text: "Thank you. Your driver will meet you at the arrivals area with a Palm Grove Hotel sign.",
        time: "9:10 AM",
      },
    ],
  },
  3: {
    name: "Skyline Suites",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    bookingId: "BMO-2026-09901",
    bookingLabel: "Booking #BMO-2026-09901",
    period: "Jun 21–24, 2026",
    status: "Completed",
    statusClass: "completed",
    online: false,
    messages: [
      {
        day: "June 24, 2026",
        direction: "incoming",
        text: "Thank you for staying at Skyline Suites. We hope you had a comfortable visit.",
        time: "11:08 AM",
      },
      {
        day: "June 24, 2026",
        direction: "outgoing",
        text: "Thank you. The room and service were excellent.",
        time: "11:26 AM",
      },
      {
        day: "Yesterday",
        direction: "system",
        text: "Your completed stay is now eligible for a verified review.",
        time: "Review credit issued",
      },
    ],
  },
  4: {
    name: "Ocean View Villas",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
    bookingId: "",
    bookingLabel: "Booking inquiry",
    period: "Requested Aug 12–15",
    status: "Inquiry",
    statusClass: "inquiry",
    online: true,
    messages: [
      {
        day: "June 10, 2026",
        direction: "outgoing",
        text: "Do you have a two-bedroom villa available for August 12 to 15?",
        time: "2:14 PM",
      },
      {
        day: "June 10, 2026",
        direction: "incoming",
        text: "Yes. Our available villa rates start at ₱6,500 per night for those dates.",
        time: "2:36 PM",
      },
    ],
  },
  5: {
    name: "Mountain Escape Resort",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
    bookingId: "",
    bookingLabel: "Booking inquiry",
    period: "Weekend stay",
    status: "Inquiry",
    statusClass: "inquiry",
    online: false,
    messages: [
      {
        day: "June 08, 2026",
        direction: "outgoing",
        text: "Is a family room available for the first weekend of August?",
        time: "4:10 PM",
      },
      {
        day: "June 08, 2026",
        direction: "incoming",
        text: "We received your request and will confirm weekend availability shortly.",
        time: "4:28 PM",
      },
    ],
  },
});

let dashboardInitialized = false;
let navigationInitialized = false;
let latestPageRequest = 0;
let activeVideoRecord = null;
const videoLibraryRecords = new Map();
const videoObjectUrls = new Map();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGuestDashboard, {
    once: true,
  });
} else {
  initializeGuestDashboard();
}

async function initializeGuestDashboard() {
  if (dashboardInitialized) return;
  dashboardInitialized = true;

  initializeGuestNavigation();
  initializeAccountActions();
  window.BomoAccountUI?.initialize(document);
  await renderCurrentGuestRoute();
}

function initializeGuestNavigation() {
  if (navigationInitialized) return;
  navigationInitialized = true;

  document.addEventListener("click", async (event) => {
    const link = event.target.closest("a[data-page]");
    if (!link) return;

    const targetUrl = new URL(link.href, window.location.href);
    const page = normalizeGuestPageName(
      targetUrl.searchParams.get("pgid") || link.dataset.page,
    );

    event.preventDefault();
    targetUrl.searchParams.set("pgid", page);

    history.pushState(
      {
        pgid: page,
        params: Object.fromEntries(targetUrl.searchParams),
      },
      "",
      `${window.location.pathname}?${targetUrl.searchParams.toString()}${targetUrl.hash}`,
    );

    await renderCurrentGuestRoute();
  });

  window.addEventListener("popstate", renderCurrentGuestRoute);
}

async function renderCurrentGuestRoute() {
  const requestedPage = getRequestedGuestPage();
  if (requestedPage === "public-profile") {
    window.location.replace("./public-profile.html");
    return;
  }
  if (!ACCOUNT_PAGES[requestedPage]) {
    latestPageRequest += 1;
    renderUnavailablePage(requestedPage);
    setActiveMenu("");
    return;
  }

  const page = requestedPage;
  await loadGuestPage(page);
  setActiveMenu(page);
}

function getRequestedGuestPage() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("pgid")) return "dashboard";
  return normalizeGuestPageName(params.get("pgid"));
}

function normalizeGuestPageName(page) {
  return String(page || "dashboard")
    .trim()
    .toLowerCase();
}

async function loadGuestPage(page) {
  const container = document.getElementById("guestDashboardContent");
  if (!container) return;

  const resolvedPage = normalizeGuestPageName(page);
  const config = ACCOUNT_PAGES[resolvedPage];
  if (!config) {
    renderUnavailablePage(resolvedPage);
    return;
  }
  const requestId = ++latestPageRequest;

  container.innerHTML = `
    <div class="route-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading ${escapeHtml(config.title.toLowerCase())}…</p>
    </div>`;
  window.BomoAccountUI?.updatePage(
    resolvedPage,
    config.title,
    config.type === "studio" ? "BOMO TRAVEL STUDIO" : "TRAVEL STUDIO",
  );

  try {
    const requestUrl = new URL(config.path, window.location.href);
    requestUrl.searchParams.set("v", Date.now().toString());

    const response = await fetch(requestUrl.href, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    if (!html.trim()) throw new Error("The page returned no content.");
    if (requestId !== latestPageRequest) return;

    if (config.type === "studio") {
      mountStudioPage(container, html, requestUrl);
    } else {
      container.innerHTML = html;
      resetRouteModals();
    }
    container.dataset.currentPage = resolvedPage;

    GUEST_PAGE_INITIALIZERS[resolvedPage]?.();
    window.BomoAccountUI?.initialize(container);
    syncVideoReviewNotifications();
    scrollToGuestRouteTarget();
  } catch (error) {
    if (requestId !== latestPageRequest) return;
    console.error(`Failed to load account page "${resolvedPage}":`, error);
    container.innerHTML = `
      <section class="panel route-error" role="alert">
        <div class="route-error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <h2>We couldn’t open this page</h2>
        <p>Please check your connection and try again. Your account data is safe.</p>
        <button type="button" class="primary" data-retry-guest-page="${escapeHtml(resolvedPage)}">Try again</button>
      </section>`;
    container
      .querySelector("[data-retry-guest-page]")
      ?.addEventListener("click", () => loadGuestPage(resolvedPage));
  }
}

function renderUnavailablePage(requestedPage) {
  const container = document.getElementById("guestDashboardContent");
  if (!container) return;

  container.dataset.currentPage = "unavailable";
  container.innerHTML = `
    <div class="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
      <section role="alert" aria-live="assertive"
        class="w-full overflow-hidden rounded-[28px] border border-rose-200 bg-white text-center shadow-xl shadow-rose-950/5 dark:border-rose-500/30 dark:bg-slate-900 dark:shadow-black/30">
        <div class="border-b border-rose-100 bg-rose-50 px-6 py-8 dark:border-rose-500/20 dark:bg-rose-500/10">
          <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-2xl text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
            <i class="fa-solid fa-file-circle-xmark"></i>
          </span>
          <h1 class="mt-5 text-2xl font-bold text-slate-950 dark:text-white">Page not available</h1>
          <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            The account page “${escapeHtml(requestedPage || "unknown")}” does not exist or is currently unavailable.
          </p>
        </div>
        <div class="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center">
          <a href="?pgid=dashboard" data-page="dashboard"
            class="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 text-sm font-semibold text-white transition hover:bg-blue-800">
            <i class="fa-solid fa-house"></i> Return to Dashboard
          </a>
          <button type="button" data-guest-go-back
            class="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <i class="fa-solid fa-arrow-left"></i> Go Back
          </button>
        </div>
      </section>
    </div>`;

  container
    .querySelector("[data-guest-go-back]")
    ?.addEventListener("click", () => window.history.back());
}

function setActiveMenu(activePage) {
  const parentRoute = {
    "booking-details": "bookings",
    "message-thread": "messages",
  }[activePage];
  const creatorPages = new Set([
    "overview",
    "videos",
    "upload",
    "analytics",
    "earnings",
    "credits",
    "profile-settings",
  ]);
  const morePages = new Set([
    "messages",
    "message-thread",
    "wishlist",
    "reviews",
    "settings",
    "help",
  ]);

  document
    .querySelectorAll(
      ".account-app [data-page], .mobile-bottom-nav [data-page], .mobile-bottom-nav [data-section]",
    )
    .forEach((item) => {
      const isActive =
        item.dataset.page === activePage ||
        item.dataset.page === parentRoute ||
        (item.dataset.section === "creator" && creatorPages.has(activePage)) ||
        (item.dataset.section === "more" && morePages.has(activePage));
      item.classList.toggle("active", isActive);
      if (isActive) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
}

function scrollToGuestRouteTarget() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  const target = hash ? document.getElementById(hash) : null;
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function accountPage(path, title) {
  return Object.freeze({ path, title, type: "guest" });
}

function studioPage(path, title) {
  return Object.freeze({ path, title, type: "studio" });
}

function mountStudioPage(container, html, sourceUrl) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const sourceContent = parsed.querySelector(".content");
  if (!sourceContent) throw new Error("Travel Studio content was not found.");

  rewriteStudioLinks(sourceContent, sourceUrl);
  container.innerHTML = sourceContent.innerHTML;

  const modalContainer = document.getElementById("modalContainer");
  const referencedModalIds = new Set(
    [...sourceContent.querySelectorAll("[data-modal-open]")]
      .map((trigger) => trigger.dataset.modalOpen)
      .filter(Boolean),
  );
  const modals = [...parsed.querySelectorAll("body > .modal-backdrop")].filter(
    (modal) =>
      modal.id !== "notificationsModal" && referencedModalIds.has(modal.id),
  );
  if (modalContainer && modals.length) {
    modals.forEach((modal) => rewriteStudioLinks(modal, sourceUrl));
    modalContainer.innerHTML =
      getShellModalMarkup(modalContainer) +
      modals.map((modal) => modal.outerHTML).join("");
  } else {
    resetRouteModals();
  }
}

function resetRouteModals() {
  const modalContainer = document.getElementById("modalContainer");
  if (!modalContainer) return;
  modalContainer.innerHTML = getShellModalMarkup(modalContainer);
}

function getShellModalMarkup(modalContainer) {
  return [...modalContainer.querySelectorAll("[data-shell-modal]")]
    .map((modal) => modal.outerHTML)
    .join("");
}

function rewriteStudioLinks(root, sourceUrl) {
  root.querySelectorAll("a[href]").forEach((link) => {
    const rawHref = link.getAttribute("href");
    if (
      !rawHref ||
      rawHref.startsWith("#") ||
      rawHref.startsWith("mailto:") ||
      rawHref.startsWith("tel:")
    ) {
      return;
    }

    const resolved = new URL(rawHref, sourceUrl);
    const fileName = resolved.pathname.split("/").pop().toLowerCase();
    const route = STUDIO_FILE_ROUTES[fileName];
    if (!route) return;

    link.href = `?pgid=${encodeURIComponent(route)}${resolved.hash}`;
    link.dataset.page = route;
  });
}

function initializeVideoUpload() {
  const host = document.getElementById("guestDashboardContent");
  const titleInput = document.querySelector("[data-video-title]");
  if (!host || !titleInput) return;

  const params = new URLSearchParams(window.location.search);
  const editingId = params.get("video_id");
  const record = editingId ? videoReviewStore.get(editingId) : null;
  host.dataset.editingVideoId = record?.id || "";

  document.querySelectorAll('input[name="stay"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".stay-card").forEach((card) => {
        card.classList.toggle(
          "selected",
          Boolean(card.querySelector('input[name="stay"]:checked')),
        );
      });
    });
  });

  if (record) {
    titleInput.value = record.title;
    const description = document.querySelector("[data-video-description]");
    if (description) description.value = record.description;
    const visibility = document.querySelector("[data-video-visibility]");
    if (visibility) visibility.value = record.visibility;
    const matchingStay = [
      ...document.querySelectorAll('input[name="stay"]'),
    ].find((input) => input.value === record.property);
    if (matchingStay) {
      matchingStay.checked = true;
      matchingStay.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const rating = document.querySelector(
      `.star-rating input[name="rating"][value="${record.rating}"]`,
    );
    if (rating) rating.checked = true;
    const ratingText = document.getElementById("ratingText");
    if (ratingText) {
      ratingText.textContent =
        record.rating === 1 ? "1 star" : `${record.rating} stars`;
    }
    const preview = document.getElementById("filePreview");
    if (preview && record.fileName) {
      preview.textContent = `Saved video: ${record.fileName}`;
      preview.classList.remove("hidden");
    }
    document
      .querySelectorAll("[data-upload-action='draft']")
      .forEach((button) => {
        button.textContent = "Save changes";
      });
    document
      .querySelectorAll("[data-upload-action='submit']")
      .forEach((button) => {
        button.textContent =
          record.status === "changes_requested"
            ? "Resubmit for Approval"
            : "Submit for Approval";
      });
  }
}

function initializeGuestReviewSummary() {
  updateReviewSummary("data-review-summary");
}

function initializeDashboardSummary() {
  updateReviewSummary("data-dashboard-summary");
}

function initializeMessagesInbox() {
  const root = document.querySelector('[data-guest-page="messages"]');
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const rows = [...root.querySelectorAll("[data-message-thread]")];
  const search = root.querySelector("[data-message-search]");
  const clearSearch = root.querySelector("[data-message-clear-search]");
  const filters = [...root.querySelectorAll("[data-message-filter]")];
  const empty = root.querySelector("[data-message-empty]");
  const results = root.querySelector("[data-message-results]");
  const readThreads = readMessageReadThreads();
  let activeFilter = "all";

  rows.forEach((row) => {
    if (!readThreads.has(row.dataset.messageThreadId)) return;
    markMessageRowRead(row);
  });

  const render = () => {
    const query = search?.value.trim().toLowerCase() || "";
    let visibleCount = 0;

    rows.forEach((row) => {
      const unread = Number(row.dataset.messageUnread) > 0;
      const type = row.dataset.messageType;
      const matchesSearch =
        !query || row.textContent.toLowerCase().includes(query);
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "unread" && unread) ||
        (activeFilter === "bookings" &&
          ["booking", "completed"].includes(type)) ||
        (activeFilter === "inquiries" && type === "inquiry");
      const visible = matchesSearch && matchesFilter;
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    const unreadTotal = rows.reduce(
      (total, row) => total + Number(row.dataset.messageUnread || 0),
      0,
    );
    const unreadTarget = root.querySelector("[data-message-unread-total]");
    const totalTarget = root.querySelector("[data-message-total]");
    if (unreadTarget) unreadTarget.textContent = unreadTotal;
    if (totalTarget) totalTarget.textContent = rows.length;
    if (results) {
      results.textContent =
        visibleCount === rows.length && !query && activeFilter === "all"
          ? `${rows.length} conversations`
          : `${visibleCount} of ${rows.length} conversations`;
    }
    if (empty) empty.hidden = visibleCount > 0;
    if (clearSearch) clearSearch.hidden = !query;
  };

  search?.addEventListener("input", render);
  clearSearch?.addEventListener("click", () => {
    if (!search) return;
    search.value = "";
    search.focus();
    render();
  });

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeFilter = filter.dataset.messageFilter || "all";
      filters.forEach((button) => {
        const active = button === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  root
    .querySelector("[data-message-reset-filters]")
    ?.addEventListener("click", () => {
      activeFilter = "all";
      if (search) search.value = "";
      filters.forEach((button) => {
        const active = button.dataset.messageFilter === "all";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      render();
      search?.focus();
    });

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const id = row.dataset.messageThreadId;
      if (!id) return;
      readThreads.add(id);
      saveMessageReadThreads(readThreads);
      markMessageRowRead(row);
    });
  });

  render();
}

function initializeMessageThread() {
  const root = document.querySelector("[data-message-thread-view]");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const requestedThreadId =
    new URLSearchParams(window.location.search).get("thread_id") || "1";
  const threadId = MESSAGE_THREADS[requestedThreadId] ? requestedThreadId : "1";
  const thread = MESSAGE_THREADS[threadId];
  root.dataset.messageThreadId = threadId;

  const name = root.querySelector("[data-thread-name]");
  const image = root.querySelector("[data-thread-image]");
  const booking = root.querySelector("[data-thread-booking]");
  const period = root.querySelector("[data-thread-period]");
  const status = root.querySelector("[data-thread-status]");
  const online = root.querySelector("[data-thread-online]");
  const bookingLink = root.querySelector("[data-thread-booking-link]");
  const threadActions = root.querySelector(".message-thread-actions");
  const feed = root.querySelector("[data-message-list]");
  const composer = root.querySelector("[data-message-composer]");
  const input = root.querySelector("[data-message-input]");

  if (name) name.textContent = thread.name;
  if (image) {
    image.src = thread.image;
    image.alt = thread.name;
  }
  if (booking) booking.textContent = thread.bookingLabel;
  if (period) period.textContent = thread.period;
  if (status) {
    status.textContent = thread.status;
    status.className = `thread-status ${thread.statusClass}`;
  }
  if (online) online.hidden = !thread.online;
  if (bookingLink) {
    bookingLink.hidden = !thread.bookingId;
    if (thread.bookingId) {
      bookingLink.href = `?pgid=booking-details&booking_id=${encodeURIComponent(thread.bookingId)}`;
    }
  }
  if (threadActions) threadActions.hidden = !thread.bookingId;
  if (input) {
    input.placeholder = `Message ${thread.name}`;
    const error = root.querySelector("[data-message-error]");
    const resize = () => {
      input.style.height = "auto";
      input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
    };
    input.addEventListener("input", () => {
      resize();
      input.removeAttribute("aria-invalid");
      if (error) {
        error.textContent = "";
        error.hidden = true;
      }
    });
    resize();
  }
  if (composer) composer.dataset.messageThreadId = threadId;
  if (feed) {
    feed.innerHTML = renderMessageThreadMessages(thread);
    requestAnimationFrame(() => {
      feed.scrollTop = feed.scrollHeight;
    });
  }

  const readThreads = readMessageReadThreads();
  readThreads.add(threadId);
  saveMessageReadThreads(readThreads);
}

function renderMessageThreadMessages(thread) {
  let previousDay = "";
  return thread.messages
    .map((message) => {
      const divider =
        message.day !== previousDay
          ? `<div class="message-day-divider"><span>${escapeHtml(message.day)}</span></div>`
          : "";
      previousDay = message.day;

      if (message.direction === "system") {
        return `${divider}<div class="message-row message-row-system">
          <div class="message-system-event">
            <span><i class="fa-solid fa-ticket" aria-hidden="true"></i></span>
            <div><strong>${escapeHtml(message.time)}</strong><p>${escapeHtml(message.text)}</p></div>
          </div>
        </div>`;
      }

      const incoming = message.direction === "incoming";
      return `${divider}<div class="message-row ${incoming ? "message-row-incoming" : "message-row-outgoing"}">
        <div class="message-bubble">
          ${incoming ? `<strong>${escapeHtml(thread.name)}</strong>` : ""}
          <p>${escapeHtml(message.text)}</p>
          <time>${escapeHtml(message.time)}${incoming ? "" : " · Sent"}</time>
        </div>
      </div>`;
    })
    .join("");
}

function readMessageReadThreads() {
  try {
    const value = JSON.parse(
      localStorage.getItem(MESSAGE_READ_STORAGE_KEY) || "[]",
    );
    return new Set(Array.isArray(value) ? value.map(String) : []);
  } catch {
    return new Set();
  }
}

function saveMessageReadThreads(readThreads) {
  try {
    localStorage.setItem(
      MESSAGE_READ_STORAGE_KEY,
      JSON.stringify([...readThreads]),
    );
  } catch {
    // The inbox still works for the current page when storage is unavailable.
  }
}

function markMessageRowRead(row) {
  row.dataset.messageUnread = "0";
  row.classList.remove("unread");
  row.querySelector(".conversation-unread-count")?.remove();
  const property = row.querySelector(".conversation-title strong")?.textContent;
  if (property)
    row.setAttribute("aria-label", `Open conversation with ${property}`);
}

function updateReviewSummary(attributeName) {
  const records = videoReviewStore.all();
  const pending = records.filter(
    (record) => record.status === "pending",
  ).length;
  const approved = records.filter(
    (record) => record.status === "approved",
  ).length;
  const creditsUsed = records.filter((record) =>
    ["pending", "approved"].includes(record.status),
  ).length;
  const values = {
    credits: Math.max(0, 3 - creditsUsed),
    pending: 1 + pending,
    approved: 8 + approved,
  };
  Object.entries(values).forEach(([key, value]) => {
    const target = document.querySelector(`[${attributeName}="${key}"]`);
    if (target) target.textContent = value;
  });
}

function syncVideoReviewNotifications() {
  const list = document.querySelector("#notificationsModal .notification-list");
  if (!list) return;
  const records = videoReviewStore
    .all()
    .filter((record) => record.status !== "draft")
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
    .slice(0, 3);
  if (!records.length) return;
  list.innerHTML = records
    .map((record) => {
      const messages = {
        pending: {
          title: "Video pending system approval",
          text: `${record.title} is private while BOMO checks it.`,
        },
        approved: {
          title: "Your video was approved",
          text: `${record.title} is now public and eligible for rewards.`,
        },
        changes_requested: {
          title: "Changes requested",
          text:
            record.moderationReason ||
            `${record.title} needs an update before it can be approved.`,
        },
        rejected: {
          title: "Video was not approved",
          text:
            record.moderationReason ||
            `${record.title} did not meet the current review guidelines.`,
        },
      };
      const message = messages[record.status];
      return message
        ? `<div><b>${escapeHtml(message.title)}</b><p>${escapeHtml(message.text)}</p></div>`
        : "";
    })
    .join("");
}

function initializeHelpCenter() {
  const input = document.querySelector("[data-help-query]");
  const button = document.querySelector("[data-help-search]");
  const result = document.querySelector("[data-help-results]");
  if (!input || !button || button.dataset.bound === "true") return;
  button.dataset.bound = "true";

  const search = () => {
    const query = input.value.trim().toLowerCase();
    const items = [
      ...document.querySelectorAll(
        ".help-categories [data-help-article], .article-list [data-help-article]",
      ),
    ];
    let visible = 0;
    items.forEach((item) => {
      const matches = !query || item.textContent.toLowerCase().includes(query);
      item.classList.toggle("hidden", !matches);
      if (matches) visible += 1;
    });
    if (result) {
      result.textContent = query
        ? `${visible} help result${visible === 1 ? "" : "s"} for “${input.value.trim()}”.`
        : "Showing all help topics.";
    }
  };

  button.addEventListener("click", search);
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    search();
  });
}

function initializeVideoLibrary() {
  const list = document.getElementById("videoList");
  if (!list || list.hasAttribute("data-enhanced-video-library")) return;
  list.setAttribute("data-enhanced-video-library", "");
  videoLibraryRecords.clear();

  const stored = videoReviewStore.all();
  if (stored.length) {
    list.insertAdjacentHTML(
      "afterbegin",
      stored.map(renderUserVideoCard).join(""),
    );
  }

  const cards = [...list.querySelectorAll(".video-card.searchable")];
  cards.forEach((card, index) => {
    const storedId = card.dataset.videoId;
    const record = storedId
      ? videoReviewStore.get(storedId)
      : recordFromCatalogCard(card, index);
    if (!record) return;
    videoLibraryRecords.set(record.id, record);
    card.dataset.videoId = record.id;
    card.dataset.videoStatus = record.status;
    card.dataset.createdAt = record.createdAt;
    card.dataset.views = String(record.views);
    card.dataset.earnings = String(record.earnings);

    const status = card.querySelector(".status");
    if (status) {
      const meta = getVideoStatusMeta(record.status);
      status.textContent = meta.label;
      status.className = `status ${meta.className}`;
    }

    card
      .querySelectorAll('[data-modal-open="videoModal"]')
      .forEach((trigger) => {
        trigger.removeAttribute("data-modal-open");
        trigger.dataset.videoAction = "view";
        if (trigger.tagName === "SPAN") {
          trigger.setAttribute("role", "button");
          trigger.setAttribute("tabindex", "0");
          trigger.setAttribute("aria-label", `Preview ${record.title}`);
        }
      });
    card
      .querySelector(".more")
      ?.setAttribute("aria-label", `Manage ${record.title}`);
  });

  const controls = {
    query: "",
    status: "all",
    sort: "newest",
    page: 1,
    perPage: 5,
  };
  const search = document.getElementById("videoSearch");
  const statusSelect = document.querySelector("[data-video-status-filter]");
  const sortSelect = document.querySelector("[data-video-sort]");
  const tabs = document.querySelector("[data-video-tabs]");

  search?.addEventListener("input", () => {
    controls.query = search.value.trim().toLowerCase();
    controls.page = 1;
    render();
  });
  statusSelect?.addEventListener("change", () => {
    controls.status = statusSelect.value || "all";
    controls.page = 1;
    syncActiveVideoTab(controls.status);
    render();
  });
  sortSelect?.addEventListener("change", () => {
    controls.sort = sortSelect.value || "newest";
    controls.page = 1;
    render();
  });
  tabs?.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-video-filter]");
    if (!tab) return;
    controls.status = tab.dataset.videoFilter;
    controls.page = 1;
    if (statusSelect) statusSelect.value = controls.status;
    syncActiveVideoTab(controls.status);
    render();
  });

  updateVideoCounts(cards);
  render();

  function syncActiveVideoTab(status) {
    tabs?.querySelectorAll("[data-video-filter]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.videoFilter === status);
    });
  }

  function render() {
    const ordered = [...cards].sort((left, right) => {
      if (controls.sort === "views") {
        return Number(right.dataset.views) - Number(left.dataset.views);
      }
      if (controls.sort === "earnings") {
        return Number(right.dataset.earnings) - Number(left.dataset.earnings);
      }
      return (
        new Date(right.dataset.createdAt) - new Date(left.dataset.createdAt)
      );
    });
    ordered.forEach((card) => list.appendChild(card));

    const filtered = ordered.filter((card) => {
      const record = videoLibraryRecords.get(card.dataset.videoId);
      const matchesQuery =
        !controls.query ||
        card.textContent.toLowerCase().includes(controls.query);
      return (
        matchesQuery && videoStatusMatches(record?.status, controls.status)
      );
    });
    const totalPages = Math.max(
      1,
      Math.ceil(filtered.length / controls.perPage),
    );
    controls.page = Math.min(controls.page, totalPages);
    const visible = new Set(
      filtered
        .slice(
          (controls.page - 1) * controls.perPage,
          controls.page * controls.perPage,
        )
        .map((card) => card.dataset.videoId),
    );
    cards.forEach((card) => {
      card.style.display = visible.has(card.dataset.videoId) ? "grid" : "none";
    });
    renderVideoPagination(filtered.length, totalPages, controls, render);

    let empty = list.querySelector(".empty-video-state");
    if (!filtered.length) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "empty-video-state";
        empty.innerHTML =
          '<i class="fa-regular fa-folder-open"></i><b>No matching video reviews</b><p>Try another search or approval status.</p>';
        list.appendChild(empty);
      }
    } else {
      empty?.remove();
    }
  }
}

function renderUserVideoCard(record) {
  const status = getVideoStatusMeta(record.status);
  const stars = "★".repeat(record.rating) + "☆".repeat(5 - record.rating);
  const views = record.status === "approved" ? formatNumber(record.views) : "—";
  const earnings =
    record.status === "approved" ? formatCurrency(record.earnings) : "—";
  return `
    <article class="video-card searchable user-video" data-video-id="${escapeHtml(record.id)}">
      <div class="thumb t4">
        <button type="button" class="play" data-video-action="view" aria-label="Preview ${escapeHtml(record.title)}">▶</button>
        <span class="duration">${escapeHtml(record.duration)}</span>
      </div>
      <div class="video-info">
        <span class="status ${status.className}">${status.label}</span>
        <h3><button type="button" class="video-title-button" data-video-action="view">${escapeHtml(record.title)}</button></h3>
        <div class="stars" aria-label="${record.rating} out of 5 stars">${stars}</div>
        <p>${escapeHtml(record.description || "Video review details have not been added yet.")}</p>
        <small>${escapeHtml(record.property)} · Updated ${formatShortDate(record.updatedAt)}</small>
      </div>
      <div class="metric"><small>Views</small><b>${views}</b></div>
      <div class="metric"><small>Earnings</small><b>${earnings}</b></div>
      <button type="button" class="more" data-video-action="view" aria-label="Manage ${escapeHtml(record.title)}">•••</button>
    </article>`;
}

function recordFromCatalogCard(card, index) {
  const title =
    card.querySelector(".video-info h3")?.textContent.trim() ||
    card.dataset.title ||
    "Video review";
  const statusText =
    card.querySelector(".status")?.textContent.toLowerCase() || "";
  const approved = !statusText.includes("review");
  const metrics = card.querySelectorAll(".metric b");
  const stars = card.querySelector(".stars")?.textContent || "★★★★★";
  return {
    id: `catalog-video-${index + 1}`,
    title,
    property: title,
    bookingId: "",
    rating: Math.max(1, (stars.match(/★/g) || []).length),
    description: card.querySelector(".video-info p")?.textContent.trim() || "",
    visibility: "Public after approval",
    fileName: "",
    status: approved ? "approved" : "pending",
    views: parseMetric(metrics[0]?.textContent),
    uniqueViewers: Math.round(parseMetric(metrics[0]?.textContent) * 0.72),
    earnings: parseMetric(metrics[1]?.textContent),
    duration: card.querySelector(".duration")?.textContent.trim() || "Preview",
    moderationReason: "",
    createdAt: new Date(2026, 4, Math.max(1, 28 - index)).toISOString(),
    updatedAt: new Date(2026, 4, Math.max(1, 28 - index)).toISOString(),
    submittedAt: new Date(2026, 4, Math.max(1, 27 - index)).toISOString(),
    decidedAt: approved
      ? new Date(2026, 4, Math.max(1, 28 - index)).toISOString()
      : "",
    publishedAt: approved
      ? new Date(2026, 4, Math.max(1, 28 - index)).toISOString()
      : "",
    catalog: true,
  };
}

function updateVideoCounts(cards) {
  const totals = {
    all: cards.length,
    approved: 0,
    pending: 0,
    draft: 0,
    attention: 0,
  };
  cards.forEach((card) => {
    const status = videoLibraryRecords.get(card.dataset.videoId)?.status;
    if (status === "approved") totals.approved += 1;
    else if (status === "pending") totals.pending += 1;
    else if (status === "draft") totals.draft += 1;
    else if (status === "changes_requested" || status === "rejected") {
      totals.attention += 1;
    }
  });
  Object.entries(totals).forEach(([key, value]) => {
    const target = document.querySelector(`[data-video-count="${key}"]`);
    if (target) target.textContent = value;
  });
}

function videoStatusMatches(status, filter) {
  if (!filter || filter === "all") return true;
  if (filter === "attention") {
    return status === "changes_requested" || status === "rejected";
  }
  return status === filter;
}

function renderVideoPagination(total, totalPages, controls, rerender) {
  const numbers = document.getElementById("pageNumbers");
  const previous = document.getElementById("prevPage");
  const next = document.getElementById("nextPage");
  const info = document.getElementById("pageInfo");
  if (numbers) {
    numbers.innerHTML = "";
    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = page;
      button.className = page === controls.page ? "active" : "";
      button.addEventListener("click", () => {
        controls.page = page;
        rerender();
      });
      numbers.appendChild(button);
    }
  }
  if (previous) {
    previous.disabled = controls.page === 1;
    previous.onclick = () => {
      if (controls.page > 1) {
        controls.page -= 1;
        rerender();
      }
    };
  }
  if (next) {
    next.disabled = controls.page === totalPages;
    next.onclick = () => {
      if (controls.page < totalPages) {
        controls.page += 1;
        rerender();
      }
    };
  }
  if (info) {
    const first = total ? (controls.page - 1) * controls.perPage + 1 : 0;
    const last = Math.min(controls.page * controls.perPage, total);
    info.textContent = `Showing ${first}–${last} of ${total}`;
  }
}

function openVideoViewer(record) {
  activeVideoRecord = record;
  const modal = document.getElementById("videoModal");
  if (!modal) return;
  const status = getVideoStatusMeta(record.status);
  const canManage = !record.catalog;
  const uploadedVideoSource = videoObjectUrls.get(record.id);
  const videoMarkup = uploadedVideoSource
    ? `<video controls playsinline preload="metadata" src="${escapeHtml(uploadedVideoSource)}"></video>`
    : `<iframe
        src="${escapeHtml(DEMO_VIDEO_EMBED_URL)}"
        data-video-source="${escapeHtml(DEMO_VIDEO_URL)}"
        title="${escapeHtml(record.title)} video review"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>`;
  modal.innerHTML = `
    <div class="modal modal-lg">
      <div class="modal-head">
        <div>
          <span class="eyebrow">${escapeHtml(status.label.toUpperCase())}</span>
          <h2>${escapeHtml(record.title)}</h2>
        </div>
        <button type="button" class="modal-close" data-modal-close="videoModal" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        <div class="video-preview">
          ${videoMarkup}
        </div>
        <div class="detail-grid viewer-metrics">
          <div><small>Status</small><b>${escapeHtml(status.label)}</b></div>
          <div><small>Views</small><b>${record.status === "approved" ? formatNumber(record.views) : "—"}</b></div>
          <div><small>Unique viewers</small><b>${record.status === "approved" ? formatNumber(record.uniqueViewers) : "—"}</b></div>
          <div><small>Earnings</small><b>${record.status === "approved" ? formatCurrency(record.earnings) : "—"}</b></div>
          <div><small>Stay rating</small><b>${record.rating}.0 ★</b></div>
        </div>
        <p class="viewer-description">${escapeHtml(record.description || "No description added.")}</p>
        ${renderModerationTimeline(record)}
      </div>
      <div class="modal-foot">
        ${renderVideoViewerActions(record, canManage)}
      </div>
    </div>`;
  window.BomoAccountUI?.openModal("videoModal");
}

function renderVideoViewerActions(record, canManage) {
  if (!canManage) {
    return `<button type="button" class="secondary" data-modal-close="videoModal">Close</button>
      ${record.status === "approved" ? '<button type="button" class="primary" data-video-action="public">View public video</button>' : ""}`;
  }
  if (record.status === "pending") {
    return `<button type="button" class="secondary" data-modal-close="videoModal">Close</button>
      <button type="button" class="danger" data-video-action="withdraw">Withdraw submission</button>`;
  }
  if (record.status === "approved") {
    return `<button type="button" class="secondary" data-modal-close="videoModal">Close</button>
      <button type="button" class="primary" data-video-action="public">View public video</button>`;
  }
  return `<button type="button" class="danger" data-video-action="delete">Delete</button>
    <span class="spacer"></span>
    <button type="button" class="secondary" data-video-action="edit">Edit details</button>
    <button type="button" class="primary" data-video-action="submit">Submit for approval</button>`;
}

function renderModerationTimeline(record) {
  const status = getVideoStatusMeta(record.status);
  const pending =
    record.status === "pending"
      ? `<div class="moderation-step pending-step"><i class="fa-solid fa-hourglass-half"></i><div><b>System approval in progress</b><small>Your video remains private while BOMO checks it.</small></div></div>`
      : "";
  const decision =
    record.status === "approved"
      ? `<div class="moderation-step"><i class="fa-solid fa-check"></i><div><b>Approved and published</b><small>${formatShortDate(record.publishedAt || record.updatedAt)}</small></div></div>`
      : record.status === "changes_requested" || record.status === "rejected"
        ? `<div class="moderation-step pending-step"><i class="fa-solid fa-exclamation"></i><div><b>${escapeHtml(status.label)}</b><small>${escapeHtml(record.moderationReason || "Review the guidelines before resubmitting.")}</small></div></div>`
        : "";
  return `<div class="moderation-timeline">
    <div class="moderation-step"><i class="fa-solid fa-file-video"></i><div><b>${record.status === "draft" ? "Draft saved" : "Submission received"}</b><small>${formatShortDate(record.submittedAt || record.updatedAt)}</small></div></div>
    ${pending}${decision}
  </div>`;
}

function getVideoStatusMeta(status) {
  return (
    {
      approved: { label: "Approved", className: "published" },
      pending: { label: "Pending system approval", className: "pending" },
      draft: { label: "Draft", className: "draft" },
      changes_requested: { label: "Changes requested", className: "changes" },
      rejected: { label: "Rejected", className: "changes" },
    }[status] || { label: "Draft", className: "draft" }
  );
}

function collectVideoReviewForm(file, existing) {
  const rating = Number(
    document.querySelector('.star-rating input[name="rating"]:checked')?.value,
  );
  const ratingText = document.getElementById("ratingText");
  if (ratingText) {
    ratingText.textContent = rating === 1 ? "1 star" : `${rating || 0} stars`;
    ratingText.classList.toggle("rating-error", !rating);
  }
  const selectedStay = document.querySelector('input[name="stay"]:checked');
  return {
    title: document.querySelector("[data-video-title]")?.value.trim() || "",
    property: selectedStay?.value || existing?.property || "BOMO stay",
    bookingId:
      new URLSearchParams(window.location.search).get("booking_id") ||
      existing?.bookingId ||
      "",
    rating,
    description:
      document.querySelector("[data-video-description]")?.value.trim() || "",
    visibility:
      document.querySelector("[data-video-visibility]")?.value ||
      "Public after approval",
    fileName: file?.name || existing?.fileName || "",
    duration: existing?.duration || "Preview",
  };
}

function rememberVideoObjectUrl(id, file) {
  if (!file || !globalThis.URL?.createObjectURL) return;
  const previous = videoObjectUrls.get(id);
  if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
  videoObjectUrls.set(id, URL.createObjectURL(file));
}

function parseMetric(value) {
  const normalized = String(value || "")
    .replaceAll(",", "")
    .replace(/[^\d.]/g, "");
  return Number(normalized) || 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-PH").format(Number(value) || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatShortDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function initializeAccountActions() {
  document.addEventListener("click", async (event) => {
    const logout = event.target.closest("[data-logout]");
    if (logout) {
      showConfirmModal({
        title: "Log out of BOMO?",
        message:
          "You can sign back in anytime to manage your trips and reviews.",
        confirmLabel: "Log out",
        onConfirm: () => {
          window.location.href = "../auth.html?page=login";
        },
      });
      return;
    }

    const reviewButton = event.target.closest("[data-review-type]");
    if (reviewButton) {
      const type = reviewButton.dataset.reviewType;
      if (type === "video") {
        const url = new URL(window.location.href);
        url.searchParams.set("pgid", "upload");
        url.searchParams.set(
          "booking_id",
          reviewButton.dataset.bookingId || "",
        );
        history.pushState(
          { pgid: "upload" },
          "",
          `${url.pathname}${url.search}`,
        );
        await renderCurrentGuestRoute();
      } else {
        showReviewModal(type, reviewButton.dataset.bookingId);
      }
      return;
    }

    if (event.target.closest("[data-view-review]")) {
      showInfoModal(
        "Review under moderation",
        "Your Skyline Suites photo review is being checked. We’ll notify you when it is published.",
      );
      return;
    }

    if (event.target.closest("[data-mark-notifications-read]")) {
      document.querySelectorAll(".notify").forEach((badge) => {
        badge.hidden = true;
      });
      window.BomoAccountUI?.notify("Notifications marked as read");
      window.BomoAccountUI?.closeModal("notificationsModal");
      return;
    }

    if (event.target.closest("[data-go-upload]")) {
      await window.loadGuestPage("upload");
      return;
    }

    const helpArticle = event.target.closest("[data-help-article]");
    if (helpArticle) {
      event.preventDefault();
      const articles = {
        "video-reviews":
          "Choose a completed stay, upload an MP4, MOV, or WebM video, add a rating and details, then submit it. Videos remain private until system approval.",
        "review-credits":
          "One Review Credit is reserved when you submit a video. Drafts do not use a credit, and rejected or withdrawn submissions release it.",
        payouts:
          "Approved public videos can earn rewards from qualified views. Available balances can be sent to the payout method saved in Profile & payments.",
        account:
          "Use Settings for appearance, notifications, privacy, and security. Use Profile & payments for your public details and payout methods.",
        upload:
          "Open Upload video, select an eligible completed stay, choose a supported file, set the stay rating, and submit for approval.",
        moderation:
          "A pending video is private while BOMO checks stay eligibility, video quality, and policy compliance. You’ll be notified when it is approved or needs changes.",
        earnings:
          "Earnings are based on qualified views from approved public videos. Analytics shows viewers and performance; Earnings shows available and pending balances.",
        "public-profile":
          "Open Profile & payments to update creator details. Only approved videos appear on your public creator profile.",
      };
      showInfoModal(
        helpArticle.textContent.trim().replace(/\s+/g, " "),
        articles[helpArticle.dataset.helpArticle] ||
          "Contact BOMO support if you need help with this topic.",
      );
      return;
    }

    const videoAction = event.target.closest("[data-video-action]");
    if (videoAction) {
      event.preventDefault();
      const action = videoAction.dataset.videoAction;
      const card = videoAction.closest("[data-video-id]");
      const record = card
        ? videoLibraryRecords.get(card.dataset.videoId)
        : activeVideoRecord;
      if (!record) return;

      if (action === "view") {
        openVideoViewer(record);
      } else if (action === "public") {
        const video = document.querySelector("#videoModal video");
        const videoFrame = document.querySelector("#videoModal iframe");
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
          window.BomoAccountUI?.notify("Playing the approved public preview");
        } else if (videoFrame) {
          videoFrame.src = `${DEMO_VIDEO_EMBED_URL}&autoplay=1`;
          window.BomoAccountUI?.notify("Playing the approved public preview");
        }
      } else if (action === "edit") {
        window.BomoAccountUI?.closeModal("videoModal");
        const url = new URL(window.location.href);
        url.searchParams.set("pgid", "upload");
        url.searchParams.set("video_id", record.id);
        history.pushState(
          { pgid: "upload" },
          "",
          `${url.pathname}${url.search}`,
        );
        await renderCurrentGuestRoute();
      } else if (action === "delete") {
        showConfirmModal({
          title: "Delete this video review?",
          message:
            "This removes the draft and its saved details from this browser.",
          confirmLabel: "Delete video",
          onConfirm: () => {
            try {
              videoReviewStore.remove(record.id);
              videoObjectUrls.delete(record.id);
              window.BomoAccountUI?.closeModal("accountConfirmModal");
              window.BomoAccountUI?.closeModal("videoModal");
              window.BomoAccountUI?.notify("Video review deleted");
              window.loadGuestPage("videos");
            } catch (error) {
              window.BomoAccountUI?.notify(error.message, "error");
            }
          },
        });
      } else if (action === "withdraw") {
        showConfirmModal({
          title: "Withdraw from system approval?",
          message:
            "The submission will return to Draft so you can edit or delete it.",
          confirmLabel: "Withdraw submission",
          onConfirm: () => {
            try {
              videoReviewStore.withdraw(record.id);
              window.BomoAccountUI?.closeModal("accountConfirmModal");
              window.BomoAccountUI?.closeModal("videoModal");
              window.BomoAccountUI?.notify("Submission returned to Draft");
              window.loadGuestPage("videos");
            } catch (error) {
              window.BomoAccountUI?.notify(error.message, "error");
            }
          },
        });
      } else if (action === "submit") {
        showConfirmModal({
          title: "Submit for system approval?",
          message: "The review will stay private until BOMO approves it.",
          confirmLabel: "Submit review",
          onConfirm: () => {
            try {
              videoReviewStore.submit(record, record.id);
              window.BomoAccountUI?.closeModal("accountConfirmModal");
              window.BomoAccountUI?.closeModal("videoModal");
              window.BomoAccountUI?.notify("Video sent for system approval");
              window.loadGuestPage("videos");
            } catch (error) {
              window.BomoAccountUI?.notify(error.message, "error");
            }
          },
        });
      }
      return;
    }

    const uploadAction = event.target.closest("[data-upload-action]");
    if (uploadAction) {
      const isDraft = uploadAction.dataset.uploadAction === "draft";
      const file = document.getElementById("fileInput")?.files?.[0];
      const editingId =
        document.getElementById("guestDashboardContent")?.dataset
          .editingVideoId || null;
      const existing = editingId ? videoReviewStore.get(editingId) : null;
      const input = collectVideoReviewForm(file, existing);
      if (!input.title) {
        window.BomoAccountUI?.notify(
          "Add a title for your video review",
          "error",
        );
        document.querySelector("[data-video-title]")?.focus();
        return;
      }
      if (
        !Number.isInteger(input.rating) ||
        input.rating < 1 ||
        input.rating > 5
      ) {
        window.BomoAccountUI?.notify(
          "Choose a star rating for your stay",
          "error",
        );
        document.querySelector('.star-rating input[name="rating"]')?.focus();
        return;
      }
      if (isDraft) {
        try {
          const record = videoReviewStore.saveDraft(input, editingId);
          rememberVideoObjectUrl(record.id, file);
          document.getElementById(
            "guestDashboardContent",
          ).dataset.editingVideoId = record.id;
          const url = new URL(window.location.href);
          url.searchParams.set("video_id", record.id);
          history.replaceState(
            history.state,
            "",
            `${url.pathname}${url.search}`,
          );
          window.BomoAccountUI?.notify("Video review saved as a draft");
        } catch (error) {
          window.BomoAccountUI?.notify(error.message, "error");
        }
      } else if (!input.fileName) {
        showInfoModal(
          "Add your video first",
          "Choose an MP4, MOV, or WebM file before submitting your review.",
        );
      } else if (!input.description) {
        window.BomoAccountUI?.notify(
          "Tell travelers a little about your stay before submitting",
          "error",
        );
        document.querySelector("[data-video-description]")?.focus();
      } else {
        showConfirmModal({
          title: "Submit for system approval?",
          message:
            "BOMO will reserve one Review Credit. Your video stays private until the system approves it.",
          confirmLabel: "Submit for approval",
          onConfirm: () => {
            try {
              const record = videoReviewStore.submit(input, editingId);
              rememberVideoObjectUrl(record.id, file);
              window.BomoAccountUI?.closeModal("accountConfirmModal");
              window.BomoAccountUI?.notify("Video sent for system approval");
              window.setTimeout(() => window.loadGuestPage("videos"), 350);
            } catch (error) {
              window.BomoAccountUI?.notify(error.message, "error");
            }
          },
        });
      }
      return;
    }

    const payoutAction = event.target.closest("[data-payout-action]");
    if (payoutAction?.dataset.payoutAction === "request") {
      showConfirmModal({
        title: "Request a ₱4,820 payout?",
        message:
          "The payout will be sent to your primary GCash account ending in 4567.",
        confirmLabel: "Request payout",
        onConfirm: () => {
          window.BomoAccountUI?.closeModal("accountConfirmModal");
          window.BomoAccountUI?.notify("Payout request received");
        },
      });
      return;
    }
    if (payoutAction?.dataset.payoutAction === "manage") {
      await window.loadGuestPage("profile");
      window.openPaymentMethodModal?.();
      return;
    }

    if (event.target.closest("[data-contact-property]")) {
      await window.loadGuestPage("message-thread");
      return;
    }

    const removeAttachment = event.target.closest(
      "[data-remove-message-attachment]",
    );
    if (removeAttachment) {
      const composer = removeAttachment.closest("[data-message-composer]");
      clearMessageAttachment(composer);
      return;
    }

    const attachMessage = event.target.closest("[data-attach-message]");
    if (attachMessage) {
      const composer = attachMessage.closest("[data-message-composer]");
      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = "image/*,.pdf";
      picker.addEventListener("change", () => {
        const file = picker.files[0];
        if (!file || !composer) return;
        if (file.size > 10 * 1024 * 1024) {
          window.BomoAccountUI?.notify(
            "Attachments must be 10 MB or smaller",
            "error",
          );
          return;
        }
        composer.dataset.messageAttachment = file.name;
        const preview = composer.querySelector(
          "[data-message-attachment-preview]",
        );
        const name = composer.querySelector("[data-message-attachment-name]");
        if (name) name.textContent = file.name;
        if (preview) preview.hidden = false;
      });
      picker.click();
      return;
    }

    const sendMessage = event.target.closest("[data-send-message]");
    if (sendMessage && !sendMessage.closest("form")) {
      sendCurrentMessage();
    }
  });

  document.addEventListener("submit", (event) => {
    const composer = event.target.closest("[data-message-composer]");
    if (!composer) return;
    event.preventDefault();
    sendCurrentMessage(composer);
  });

  document.addEventListener("keydown", (event) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target.matches('[role="button"][data-video-action]')
    ) {
      event.preventDefault();
      event.target.click();
      return;
    }
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      event.target.matches("[data-message-input]")
    ) {
      event.preventDefault();
      sendCurrentMessage(event.target.closest("[data-message-composer]"));
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== "bomo-video-reviews-v1") return;
    window.BomoAccountUI?.notify("A video review status was updated");
    if (getRequestedGuestPage() === "videos") {
      renderCurrentGuestRoute();
    }
  });
}

function sendCurrentMessage(
  composer = document.querySelector("[data-message-composer]"),
) {
  const input = composer?.querySelector("[data-message-input]");
  const message = input?.value.trim();
  const attachment = composer?.dataset.messageAttachment || "";
  if (!message && !attachment) {
    window.BomoAccountUI?.notify(
      "Write a message or attach a file before sending",
      "error",
    );
    input?.focus();
    return;
  }

  const restrictedContent = getRestrictedMessageContent(message);
  if (restrictedContent) {
    const error = composer.querySelector("[data-message-error]");
    const errorMessage = `Message not sent. ${restrictedContent} are not allowed in BOMO messages.`;
    input?.setAttribute("aria-invalid", "true");
    if (error) {
      error.textContent = `${errorMessage} Keep communication inside BOMO for your safety.`;
      error.hidden = false;
    }
    window.BomoAccountUI?.notify(errorMessage, "error");
    input?.focus();
    return;
  }

  const thread = composer.closest("[data-message-thread-view]");
  const feed = thread?.querySelector("[data-message-list]");
  const sentAt = new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
  feed?.insertAdjacentHTML(
    "beforeend",
    `<div class="message-row message-row-outgoing">
      <div class="message-bubble">
        ${message ? `<p>${escapeHtml(message)}</p>` : ""}
        ${
          attachment
            ? `<span class="message-sent-attachment"><i class="fa-solid fa-paperclip" aria-hidden="true"></i>${escapeHtml(attachment)}</span>`
            : ""
        }
        <time>${escapeHtml(sentAt)} · Sent</time>
      </div>
    </div>`,
  );
  if (input) {
    input.value = "";
    input.style.height = "auto";
    input.focus();
  }
  clearMessageAttachment(composer);
  if (feed) {
    requestAnimationFrame(() => {
      feed.scrollTo({ top: feed.scrollHeight, behavior: "smooth" });
    });
  }
}

function getRestrictedMessageContent(message) {
  if (!message) return "";

  const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}\b/i;
  if (emailPattern.test(message)) return "Email addresses";

  const linkPattern =
    /\b(?:(?:https?|ftp):\/\/|www\.)[^\s]+|\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}(?:\/[^\s]*)?|\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/[^\s]*)?/i;
  if (linkPattern.test(message)) return "Web links";

  const numberCandidates = message.match(/\+?\d[\d\s().-]{5,}\d/g) || [];
  const hasPhoneNumber = numberCandidates.some((candidate) => {
    const digits = candidate.replace(/\D/g, "");
    const formatted = candidate.trim();
    if (digits.length < 7 || digits.length > 16) return false;
    return (
      digits.length >= 10 ||
      formatted.startsWith("+") ||
      (digits.length >= 7 && /[\s()]/.test(formatted)) ||
      (digits.length >= 8 && /^8/.test(digits))
    );
  });
  const contextualPhoneNumber =
    /\b(?:call|text|phone|mobile|contact|whatsapp|viber)\b[^.\n]{0,24}\+?\d(?:[\d\s().-]*\d){6,}/i.test(
      message,
    );
  if (hasPhoneNumber || contextualPhoneNumber) return "Phone numbers";

  return "";
}

function clearMessageAttachment(composer) {
  if (!composer) return;
  delete composer.dataset.messageAttachment;
  const preview = composer.querySelector("[data-message-attachment-preview]");
  const name = composer.querySelector("[data-message-attachment-name]");
  if (name) name.textContent = "";
  if (preview) preview.hidden = true;
}

function showReviewModal(type, bookingId) {
  const typeLabel = type === "photo" ? "Photo review" : "Text review";
  const photoField =
    type === "photo"
      ? `<label>Photos<input type="file" accept="image/*" multiple required></label>`
      : "";
  showActionModal({
    title: typeLabel,
    body: `<div class="review-modal-options">
      <p>Booking ${escapeHtml(bookingId || "")} · BOMO Beach Resort</p>
      <fieldset class="rating-field" data-guest-review-rating>
        <legend>Stay rating</legend>
        <div
          class="star-rating"
          data-star-rating
          data-rating-name="guest-review-rating"
          data-rating-prefix="guest-review-rating"
          data-rating-value="5"
          role="radiogroup"
          aria-label="Rate your stay"
          aria-describedby="guestReviewRatingText"
        ></div>
        <output id="guestReviewRatingText" data-rating-text aria-live="polite">5 stars</output>
      </fieldset>
      ${photoField}
      <label>Your experience<textarea rows="5" placeholder="What should future travelers know?" required></textarea></label>
    </div>`,
    confirmLabel: "Submit review",
    onConfirm: () => {
      const rating = Number(
        document.querySelector(
          '#accountActionModal input[name="guest-review-rating"]:checked',
        )?.value,
      );
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        window.BomoAccountUI?.notify(
          "Choose a star rating for your stay",
          "error",
        );
        document
          .querySelector(
            '#accountActionModal input[name="guest-review-rating"]',
          )
          ?.focus();
        return;
      }
      const text = document
        .querySelector("#accountActionModal textarea")
        ?.value.trim();
      if (!text) {
        window.BomoAccountUI?.notify(
          "Add a few details about your stay",
          "error",
        );
        return;
      }
      window.BomoAccountUI?.closeModal("accountActionModal");
      window.BomoAccountUI?.notify(
        `${rating}-star ${typeLabel.toLowerCase()} submitted for moderation`,
      );
    },
  });
}

function showInfoModal(title, message) {
  showActionModal({
    title,
    body: `<p>${escapeHtml(message)}</p>`,
    confirmLabel: "Got it",
    onConfirm: () => window.BomoAccountUI?.closeModal("accountActionModal"),
    cancel: false,
  });
}

function showActionModal({
  title,
  body,
  confirmLabel,
  onConfirm,
  cancel = true,
}) {
  document.getElementById("accountActionModal")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="modal-backdrop" id="accountActionModal" role="dialog" aria-modal="true" aria-labelledby="actionModalTitle">
      <div class="modal">
        <div class="modal-head">
          <h2 id="actionModalTitle">${escapeHtml(title)}</h2>
          <button type="button" class="modal-close" data-modal-close="accountActionModal" aria-label="Close">×</button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-foot">
          ${cancel ? '<button type="button" class="secondary" data-modal-close="accountActionModal">Cancel</button>' : ""}
          <button type="button" class="primary" data-action-confirm>${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    </div>`,
  );
  document
    .querySelector("#accountActionModal [data-action-confirm]")
    ?.addEventListener("click", onConfirm);
  window.BomoAccountUI?.initialize(
    document.getElementById("accountActionModal"),
  );
  window.BomoAccountUI?.openModal("accountActionModal");
}

function showConfirmModal({ title, message, confirmLabel, onConfirm }) {
  const existing = document.getElementById("accountConfirmModal");
  existing?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="modal-backdrop" id="accountConfirmModal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
      <div class="modal">
        <div class="modal-head">
          <h2 id="confirmModalTitle">${escapeHtml(title)}</h2>
          <button type="button" class="modal-close" data-modal-close="accountConfirmModal" aria-label="Close">×</button>
        </div>
        <div class="modal-body"><p>${escapeHtml(message)}</p></div>
        <div class="modal-foot">
          <button type="button" class="secondary" data-modal-close="accountConfirmModal">Cancel</button>
          <button type="button" class="danger" data-confirm-action>${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    </div>`,
  );
  const modal = document.getElementById("accountConfirmModal");
  modal
    .querySelector("[data-confirm-action]")
    ?.addEventListener("click", onConfirm, {
      once: true,
    });
  window.BomoAccountUI?.openModal("accountConfirmModal");
}

function initializeWishlist() {
  const page = document.querySelector('[data-guest-page="wishlist"]');
  if (!page || page.dataset.initialized === "true") return;
  page.dataset.initialized = "true";
  initializeSavedStayBrowser(page);

  const host = page.querySelector("[data-booking-basket-host]");
  if (!host) return;

  let booking = readBooking();
  if (!booking?.items?.length) {
    host.classList.add("hidden");
    return;
  }

  const liveStatus = document.createElement("p");
  liveStatus.className = "sr-only";
  liveStatus.setAttribute("aria-live", "polite");
  liveStatus.setAttribute("aria-atomic", "true");
  host.insertAdjacentElement("afterend", liveStatus);

  host.addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-wishlist-quantity]");
    if (quantityButton) {
      const item = booking.items.find(
        (room) => room.id === quantityButton.dataset.roomId,
      );
      if (!item) return;
      const direction = Number(quantityButton.dataset.wishlistQuantity);
      const nextQuantity = Math.max(
        1,
        Math.min(5, item.quantity + direction),
      );
      if (nextQuantity === item.quantity) return;
      item.quantity = nextQuantity;
      const estimatedTotal = render();
      announceBookingChange(
        `${item.name} quantity changed to ${nextQuantity}. Estimated total ${money(estimatedTotal)}.`,
      );
      restoreQuantityFocus(item.id, direction);
      return;
    }

    const removeButton = event.target.closest("[data-wishlist-remove]");
    if (removeButton) {
      const removedIndex = booking.items.findIndex(
        (room) => room.id === removeButton.dataset.wishlistRemove,
      );
      const removedItem = booking.items[removedIndex];
      booking.items = booking.items.filter(
        (room) => room.id !== removeButton.dataset.wishlistRemove,
      );
      const estimatedTotal = render();
      announceBookingChange(
        booking.items.length
          ? `${removedItem?.name || "Room"} removed. Estimated total ${money(estimatedTotal)}.`
          : `${removedItem?.name || "Room"} removed. Booking selection is empty.`,
      );
      restoreFocusAfterRemoval(removedIndex);
      return;
    }

    if (event.target.closest("[data-wishlist-clear-booking]")) {
      booking.items = [];
      render();
      window.BomoAccountUI?.notify("Booking selection cleared");
      announceBookingChange("Booking selection cleared.");
      requestAnimationFrame(() => {
        const list = document.querySelector("[data-wishlist-list]");
        list?.scrollIntoView({ behavior: "smooth", block: "start" });
        list
          ?.querySelector("[data-wishlist-select]")
          ?.focus({ preventScroll: true });
      });
    }
  });

  render();

  function announceBookingChange(message) {
    liveStatus.textContent = "";
    requestAnimationFrame(() => {
      liveStatus.textContent = message;
    });
  }

  function restoreQuantityFocus(roomId, direction) {
    requestAnimationFrame(() => {
      const controls = [
        ...host.querySelectorAll("[data-wishlist-quantity]"),
      ].filter((button) => button.dataset.roomId === roomId);
      const sameAction = controls.find(
        (button) =>
          Number(button.dataset.wishlistQuantity) === direction &&
          !button.disabled,
      );
      const focusTarget = sameAction || controls.find((button) => !button.disabled);
      focusTarget?.focus();
    });
  }

  function restoreFocusAfterRemoval(removedIndex) {
    requestAnimationFrame(() => {
      const roomCards = [...host.querySelectorAll(".wishlist-booking-item")];
      const nextCard =
        roomCards[Math.min(Math.max(removedIndex, 0), roomCards.length - 1)];
      const focusTarget =
        nextCard?.querySelector("button:not(:disabled)") ||
        host.querySelector(".wishlist-booking-actions :is(a,button)") ||
        page.querySelector("[data-wishlist-list] [data-wishlist-select]");
      focusTarget?.focus();
    });
  }

  function render() {
    if (!booking.items.length) {
      sessionStorage.removeItem(BOOKING_STORAGE_KEY);
      host.classList.add("hidden");
      host.innerHTML = "";
      return;
    }

    sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));

    const nights = getNights(booking.checkin, booking.checkout);
    const roomCount = booking.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const subtotal = booking.items.reduce(
      (total, item) => total + item.price * item.quantity * nights,
      0,
    );
    const fees = Math.round(subtotal * 0.12);
    const total = subtotal + fees;
    const route = new URLSearchParams(window.location.search);
    const routeReference = route.get("booking");
    const reference = booking.reference || "Current booking";
    const routeNote =
      routeReference && routeReference !== booking.reference
        ? "Showing the active booking saved in this browser."
        : `Booking reference ${reference}`;
    const isWishlistBooking = booking.source === "wishlist";
    const bookingEyebrow = isWishlistBooking
      ? "Saved stay selected"
      : "Booking in progress";
    const bookingTitle = isWishlistBooking
      ? "Your selected stay"
      : roomCount > 1
        ? "Your multi-room booking"
        : "Your room selection";
    const roomLabel = `${roomCount} room${roomCount === 1 ? "" : "s"}`;
    const secondaryAction = isWishlistBooking
      ? `<button type="button" class="secondary" data-wishlist-clear-booking>
          Choose another stay
        </button>`
      : `<a href="../hotel-details.html#rooms" class="secondary">
          Edit rooms
        </a>`;

    host.classList.remove("hidden");
    host.innerHTML = `
      <section class="wishlist-booking-card" data-wishlist-active-booking aria-labelledby="activeWishlistBookingTitle">
        <header class="wishlist-booking-head">
          <div class="wishlist-booking-identity">
            <span class="wishlist-booking-icon" aria-hidden="true">
              <i class="fa-solid ${isWishlistBooking ? "fa-calendar-check" : "fa-suitcase-rolling"}"></i>
            </span>
            <div>
              <span class="wishlist-booking-eyebrow">${escapeHtml(bookingEyebrow)}</span>
              <h2 id="activeWishlistBookingTitle">${escapeHtml(bookingTitle)}</h2>
              <p>${escapeHtml(booking.property.name)} · ${escapeHtml(roomLabel)} · ${nights} night${nights === 1 ? "" : "s"}</p>
              <small>${escapeHtml(routeNote)}</small>
            </div>
          </div>
          <div class="wishlist-booking-actions">
            ${secondaryAction}
            <a href="../hotel-booking.html?trip=1" class="primary">
              Continue booking
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </header>
        <div class="wishlist-booking-content">
          <div class="wishlist-booking-items">
            ${booking.items
              .map(
                (item) => `
              <article class="wishlist-booking-item">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                <div class="wishlist-booking-item-copy">
                  <h3>${escapeHtml(item.name)}</h3>
                  <p>${escapeHtml(item.details)}</p>
                  <small>${money(item.price)} per room/night</small>
                </div>
                <div class="wishlist-booking-item-tools">
                  <strong>${money(item.price * item.quantity * nights)}</strong>
                  <div class="wishlist-booking-quantity" role="group" aria-label="Room quantity">
                    <button type="button" data-wishlist-quantity="-1" data-room-id="${escapeHtml(item.id)}" aria-label="Decrease room quantity" ${item.quantity <= 1 ? "disabled" : ""}><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
                    <span aria-label="${item.quantity} room${item.quantity === 1 ? "" : "s"}">${item.quantity}</span>
                    <button type="button" data-wishlist-quantity="1" data-room-id="${escapeHtml(item.id)}" aria-label="Increase room quantity" ${item.quantity >= 5 ? "disabled" : ""}><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
                    <button type="button" class="wishlist-booking-remove" data-wishlist-remove="${escapeHtml(item.id)}" aria-label="Remove room"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
                  </div>
                </div>
              </article>`,
              )
              .join("")}
          </div>
          <aside class="wishlist-booking-summary">
            <div class="wishlist-booking-summary-title">
              <h3>Booking summary</h3>
              <span>${escapeHtml(roomLabel)}</span>
            </div>
            <dl>
              <div><dt>Check-in</dt><dd>${formatDate(booking.checkin)}</dd></div>
              <div><dt>Check-out</dt><dd>${formatDate(booking.checkout)}</dd></div>
              <div><dt>Guests</dt><dd>${booking.guests}</dd></div>
              <div><dt>Room subtotal</dt><dd>${money(subtotal)}</dd></div>
              <div><dt>Taxes & fees</dt><dd>${money(fees)}</dd></div>
              <div class="wishlist-booking-total"><dt>Estimated total</dt><dd>${money(total)}</dd></div>
            </dl>
          </aside>
        </div>
      </section>`;
    return total;
  }
}

function initializeSavedStayBrowser(page) {
  const cards = [...page.querySelectorAll("[data-wishlist-card]")];
  page.querySelectorAll("[data-wishlist-total]").forEach((element) => {
    element.textContent = String(cards.length);
  });
  const search = page.querySelector("[data-wishlist-search]");
  const clearSearch = page.querySelector("[data-wishlist-clear-search]");
  const filterButtons = [...page.querySelectorAll("[data-wishlist-filter]")];
  const resultCount = page.querySelector("[data-wishlist-results]");
  const emptyState = page.querySelector("[data-wishlist-empty]");
  const selectedTotals = page.querySelectorAll(
    "[data-wishlist-selected-total], [data-wishlist-bar-count]",
  );
  const selectionBar = page.querySelector("[data-wishlist-selection-bar]");
  const bookSelected = page.querySelector("[data-wishlist-book-selected]");
  const bookingForm = page.querySelector("[data-wishlist-booking-form]");
  const checkin = page.querySelector("[data-wishlist-checkin]");
  const checkout = page.querySelector("[data-wishlist-checkout]");
  const guests = page.querySelector("[data-wishlist-guests]");
  const bookingError = page.querySelector("[data-wishlist-booking-error]");
  const modalSummary = page.querySelector("[data-wishlist-modal-summary]");
  let activeFilter = "all";

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const defaultCheckin = addLocalDays(today, 14);
  const defaultCheckout = addLocalDays(today, 17);
  if (checkin) {
    checkin.min = toDateInputValue(today);
    checkin.value = toDateInputValue(defaultCheckin);
  }
  if (checkout) {
    checkout.min = toDateInputValue(addLocalDays(today, 1));
    checkout.value = toDateInputValue(defaultCheckout);
  }

  const selectedCards = () =>
    cards.filter((card) => card.querySelector("[data-wishlist-select]")?.checked);

  const syncSelection = () => {
    const selected = selectedCards();
    const count = selected.length;
    cards.forEach((card) => {
      const isSelected = card.querySelector("[data-wishlist-select]")?.checked;
      card.classList.toggle("selected", Boolean(isSelected));
    });
    selectedTotals.forEach((element) => {
      element.textContent = String(count);
    });
    page
      .querySelectorAll("[data-wishlist-clear-selection]")
      .forEach((button) => {
        button.hidden = count === 0;
      });
    if (selectionBar) selectionBar.hidden = count === 0;
    if (bookSelected) bookSelected.disabled = count === 0;
  };

  const applyFilters = () => {
    const query = search?.value.trim().toLowerCase() || "";
    let visible = 0;
    cards.forEach((card) => {
      const matchesQuery =
        !query || card.textContent.toLowerCase().includes(query);
      const matchesType =
        activeFilter === "all" || card.dataset.type === activeFilter;
      card.hidden = !(matchesQuery && matchesType);
      if (!card.hidden) visible += 1;
    });
    if (resultCount) {
      resultCount.textContent = `${visible} ${visible === 1 ? "stay" : "stays"} available`;
    }
    if (clearSearch) clearSearch.hidden = !query;
    if (emptyState) emptyState.hidden = visible > 0;
  };

  const clearSelection = () => {
    cards.forEach((card) => {
      const checkbox = card.querySelector("[data-wishlist-select]");
      if (checkbox) checkbox.checked = false;
    });
    syncSelection();
  };

  const showBookingError = (message) => {
    if (bookingError) {
      bookingError.textContent = message;
      bookingError.hidden = !message;
    }
    if (message) window.BomoAccountUI?.notify(message, "error");
  };

  const openBookingDialog = () => {
    const selected = selectedCards();
    if (!selected.length) {
      window.BomoAccountUI?.notify(
        "Select at least one saved stay before booking.",
        "error",
      );
      return;
    }
    showBookingError("");
    if (modalSummary) {
      const activeBooking = readBooking();
      modalSummary.textContent = activeBooking?.items?.length
        ? `Booking ${selected[0].dataset.name}. Continuing will replace the active booking in this browser.`
        : `Booking ${selected[0].dataset.name}.`;
    }
    window.BomoAccountUI?.openModal("wishlistBookingModal");
  };

  cards.forEach((card) => {
    const select = card.querySelector("[data-wishlist-select]");
    select?.addEventListener("change", () => {
      if (select.checked) {
        cards.forEach((otherCard) => {
          if (otherCard === card) return;
          const otherSelect = otherCard.querySelector("[data-wishlist-select]");
          if (otherSelect) otherSelect.checked = false;
        });
      }
      syncSelection();
    });
    card
      .querySelector("[data-wishlist-book-one]")
      ?.addEventListener("click", () => {
        clearSelection();
        const checkbox = card.querySelector("[data-wishlist-select]");
        if (checkbox) checkbox.checked = true;
        syncSelection();
        openBookingDialog();
      });
  });

  search?.addEventListener("input", applyFilters);
  clearSearch?.addEventListener("click", () => {
    if (!search) return;
    search.value = "";
    search.focus();
    applyFilters();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.wishlistFilter || "all";
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      applyFilters();
    });
  });

  page.querySelector("[data-wishlist-reset]")?.addEventListener("click", () => {
    activeFilter = "all";
    if (search) search.value = "";
    filterButtons.forEach((button) => {
      const isActive = button.dataset.wishlistFilter === "all";
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    applyFilters();
    search?.focus();
  });

  page
    .querySelectorAll("[data-wishlist-clear-selection]")
    .forEach((button) => button.addEventListener("click", clearSelection));
  bookSelected?.addEventListener("click", openBookingDialog);

  checkin?.addEventListener("change", () => {
    if (!checkin.value) return;
    const nextDay = addLocalDays(
      new Date(`${checkin.value}T12:00:00`),
      1,
    );
    const minimumCheckout = toDateInputValue(nextDay);
    if (checkout) {
      checkout.min = minimumCheckout;
      if (!checkout.value || checkout.value <= checkin.value) {
        checkout.value = minimumCheckout;
      }
    }
    showBookingError("");
  });
  checkout?.addEventListener("change", () => showBookingError(""));

  bookingForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = selectedCards();
    if (!selected.length) {
      showBookingError("Select at least one saved stay before continuing.");
      return;
    }
    if (!checkin?.value || !checkout?.value) {
      showBookingError("Choose both check-in and check-out dates.");
      return;
    }
    if (checkout.value <= checkin.value) {
      showBookingError("Check-out must be after check-in.");
      checkout.focus();
      return;
    }

    const first = selected[0];
    const room = {
      id: `wishlist-${first.dataset.id}-flexible-room`,
      name: "Best available room",
      details: `${capitalize(first.dataset.type)} · Flexible stay at ${first.dataset.name}`,
      price: Number(first.dataset.price) || 0,
      image: first.dataset.image,
      quantity: 1,
    };
    const trip = {
      property: {
        id: first.dataset.id,
        name: first.dataset.name,
        location: first.dataset.location,
        image: first.dataset.image,
      },
      checkin: checkin.value,
      checkout: checkout.value,
      guests: Math.max(1, Number(guests?.value) || 2),
      items: [room],
      source: "wishlist",
      reference: `WISH-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(trip));
      window.BomoAccountUI?.notify("Selected stays added to your booking");
      const destination = new URL("../hotel-booking.html", window.location.href);
      destination.searchParams.set("trip", "1");
      destination.searchParams.set("source", "wishlist");
      window.setTimeout(() => window.location.assign(destination.href), 220);
    } catch {
      showBookingError(
        "We couldn’t prepare this booking. Please try again.",
      );
    }
  });

  syncSelection();
  applyFilters();
}

function addLocalDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function capitalize(value) {
  const text = String(value || "");
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : "Stay";
}

function initializePaymentMethods() {
  const modal = document.getElementById("paymentMethodModal");
  if (!modal || modal.dataset.initialized === "true") return;
  modal.dataset.initialized = "true";

  const paymentType = document.getElementById("paymentType");
  const cardFields = document.getElementById("cardFields");
  const ewalletFields = document.getElementById("ewalletFields");

  window.openPaymentMethodModal = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  };

  window.closePaymentMethodModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  };

  paymentType?.addEventListener("change", () => {
    const isCard = paymentType.value === "card";
    cardFields?.classList.toggle("hidden", !isCard);
    ewalletFields?.classList.toggle("hidden", isCard);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) window.closePaymentMethodModal();
  });

  modal.querySelector(".save-payment-method")?.addEventListener("click", () => {
    window.closePaymentMethodModal();
    window.BomoAccountUI?.notify("Payment method saved");
  });
}

function readBooking() {
  try {
    return JSON.parse(sessionStorage.getItem(BOOKING_STORAGE_KEY));
  } catch {
    return null;
  }
}

function getNights(checkin, checkout) {
  const difference =
    new Date(`${checkout}T00:00:00`) - new Date(`${checkin}T00:00:00`);
  return Math.max(1, Math.round(difference / 86400000));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function money(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.loadGuestPage = async (page) => {
  const resolvedPage = normalizeGuestPageName(page);
  const url = new URL(window.location.href);
  url.searchParams.set("pgid", resolvedPage);
  if (resolvedPage !== "upload") url.searchParams.delete("video_id");
  if (!["reviews", "upload", "booking-details"].includes(resolvedPage)) {
    url.searchParams.delete("booking_id");
  }
  if (resolvedPage !== "message-thread") url.searchParams.delete("thread_id");
  history.pushState({ pgid: resolvedPage }, "", `${url.pathname}${url.search}`);
  await renderCurrentGuestRoute();
};
