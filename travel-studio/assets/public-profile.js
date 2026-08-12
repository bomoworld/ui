import { videoReviewStore } from "./video-reviews.js";

const VIDEO_REVIEW_STORAGE_KEY = "bomo-video-reviews-v1";
const DEMO_VIDEO_URL = "https://youtu.be/m6kYdPKhig8";
const DEMO_VIDEO_EMBED_URL =
  "https://www.youtube.com/embed/m6kYdPKhig8?rel=0";

const grid = document.querySelector("[data-public-video-grid]");
const sortControl = document.querySelector("[data-public-sort]");
const modal = document.getElementById("publicVideoModal");
let activeReviewButton = null;

initializePublicProfile();

function initializePublicProfile() {
  renderApprovedSubmissions();
  sortReviews(sortControl?.value || "newest");

  sortControl?.addEventListener("change", () => {
    sortReviews(sortControl.value);
  });

  document.addEventListener("click", async (event) => {
    const reviewButton = event.target.closest(
      "[data-public-video] .public-video-button",
    );
    if (reviewButton) {
      openPublicVideo(reviewButton.closest("[data-public-video]"));
      return;
    }

    if (event.target.closest("[data-share-profile]")) {
      await shareProfile();
      return;
    }

    if (
      event.target.closest('[data-modal-close="publicVideoModal"]') ||
      event.target === modal
    ) {
      closePublicVideo();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePublicVideo();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== VIDEO_REVIEW_STORAGE_KEY) return;
    renderApprovedSubmissions();
    sortReviews(sortControl?.value || "newest");
  });
}

function renderApprovedSubmissions() {
  if (!grid) return;
  grid
    .querySelectorAll("[data-stored-review]")
    .forEach((card) => card.remove());

  const existingTitles = new Set(
    [...grid.querySelectorAll("[data-public-video]")].map((card) =>
      normalize(card.dataset.title),
    ),
  );
  const approved = videoReviewStore
    .all()
    .filter(
      (record) =>
        record.status === "approved" &&
        !existingTitles.has(normalize(record.title)),
    );

  if (approved.length) {
    grid.insertAdjacentHTML(
      "afterbegin",
      approved.map(renderStoredReview).join(""),
    );
  }

  const count = document.querySelector("[data-public-review-count]");
  if (count) {
    const base = Number(count.dataset.baseCount) || 0;
    count.textContent = new Intl.NumberFormat("en-PH").format(
      base + approved.length,
    );
  }
}

function renderStoredReview(record, index) {
  const rating = Math.max(1, Math.min(5, Number(record.rating) || 5));
  const views = Math.max(0, Number(record.views) || 0);
  const theme = `t${(index % 6) + 1}`;
  const date = record.publishedAt || record.updatedAt || record.createdAt;

  return `<article
    class="public-video"
    data-public-video
    data-stored-review
    data-title="${escapeHtml(record.title)}"
    data-rating="${rating}"
    data-views="${views}"
    data-duration="${escapeHtml(record.duration || "Preview")}"
    data-date="${escapeHtml(date)}"
    data-description="${escapeHtml(record.description || "Verified BOMO stay video review.")}"
  >
    <button type="button" class="public-video-button">
      <span class="thumb ${theme}">
        <span class="public-review-badge">
          <i class="fa-solid fa-circle-check"></i>
          Verified stay
        </span>
        <span class="play"><i class="fa-solid fa-play"></i></span>
        <span class="duration">${escapeHtml(record.duration || "Preview")}</span>
      </span>
      <span class="public-video-copy">
        <strong>${escapeHtml(record.title)}</strong>
        <span class="public-card-meta">
          <span class="public-rating" aria-label="${rating} out of 5 stars">
            <i class="fa-solid fa-star"></i>
            ${rating.toFixed(1)}
          </span>
          <small><i class="fa-regular fa-eye"></i> ${formatNumber(views)} views</small>
        </span>
      </span>
    </button>
  </article>`;
}

function sortReviews(sortBy) {
  if (!grid) return;
  const cards = [...grid.querySelectorAll("[data-public-video]")];
  cards.sort((left, right) => {
    if (sortBy === "views") {
      return numberFrom(right.dataset.views) - numberFrom(left.dataset.views);
    }
    if (sortBy === "rating") {
      return numberFrom(right.dataset.rating) - numberFrom(left.dataset.rating);
    }
    return dateFrom(right.dataset.date) - dateFrom(left.dataset.date);
  });
  cards.forEach((card) => grid.appendChild(card));
}

function openPublicVideo(card) {
  if (!card || !modal) return;
  activeReviewButton = card.querySelector(".public-video-button");
  const title = card.dataset.title || "Video review";
  const rating = Math.max(1, Math.min(5, numberFrom(card.dataset.rating) || 5));
  const views = Math.max(0, numberFrom(card.dataset.views));

  const titleElement = document.getElementById("publicVideoTitle");
  if (titleElement) titleElement.textContent = title;
  const ratingElement = modal.querySelector("[data-public-modal-rating]");
  if (ratingElement) ratingElement.textContent = `${rating.toFixed(1)} ★`;
  const viewsElement = modal.querySelector("[data-public-modal-views]");
  if (viewsElement) viewsElement.textContent = formatNumber(views);
  const descriptionElement = modal.querySelector(
    "[data-public-modal-description]",
  );
  if (descriptionElement) {
    descriptionElement.textContent =
      card.dataset.description || "Verified BOMO stay video review.";
  }

  const videoFrame = modal.querySelector("[data-public-video-frame]");
  if (videoFrame) {
    videoFrame.src = DEMO_VIDEO_EMBED_URL;
    videoFrame.dataset.videoSource = DEMO_VIDEO_URL;
  }
  window.BomoAccountUI?.openModal("publicVideoModal");
}

function closePublicVideo() {
  const videoFrame = modal?.querySelector("[data-public-video-frame]");
  if (videoFrame) videoFrame.src = "";
  activeReviewButton?.focus({ preventScroll: true });
  activeReviewButton = null;
}

async function shareProfile() {
  const shareData = {
    title: document.title,
    text: "Explore Juan Dela Cruz's verified BOMO travel reviews.",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(shareData.url);
    window.BomoAccountUI?.notify("Profile link copied");
  } catch (error) {
    if (error?.name === "AbortError") return;
    window.prompt("Copy this profile link:", shareData.url);
  }
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function numberFrom(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

function dateFrom(value) {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-PH").format(Number(value) || 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
