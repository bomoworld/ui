(function () {
  "use strict";

  const THEME_KEY = "bomo-theme";
  const SETTINGS_KEY = "bomo-account-settings-v1";
  const DEFAULT_SETTINGS = Object.freeze({
    compactVideos: false,
    moderationUpdates: true,
    earningsUpdates: true,
    publicProfile: true,
    loginAlerts: true,
  });
  const TITLES = Object.freeze({
    dashboard: "Dashboard",
    bookings: "Trips",
    "booking-details": "Trip details",
    reviews: "Reviews",
    messages: "Messages",
    "message-thread": "Conversation",
    wishlist: "Saved stays",
    profile: "Profile & payments",
    overview: "Creator studio",
    videos: "Video reviews",
    upload: "Upload video review",
    analytics: "Analytics",
    earnings: "Earnings",
    credits: "Review credits",
    help: "Help center",
    contact: "Contact support",
    settings: "Settings",
    "profile-settings": "Creator profile settings",
    "public-profile": "Public creator profile",
  });

  let globalEventsBound = false;

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch {
      // Keep the current tab usable when storage is unavailable.
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    const resolved = theme === "dark" ? "dark" : "light";
    const isDark = resolved === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.body?.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#071329" : "#0B2A6F");

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const label = isDark ? "Switch to light mode" : "Switch to dark mode";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(isDark));
      const icon = button.querySelector("[data-theme-icon]");
      if (icon) {
        icon.classList.toggle("fa-moon", !isDark);
        icon.classList.toggle("fa-sun", isDark);
      } else if (button.id === "themeToggle") {
        button.textContent = isDark ? "☀" : "◐";
      }
    });
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      const isActive = button.dataset.themeChoice === resolved;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function toggleTheme() {
    const next = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Theme still applies to the current tab.
    }
    applyTheme(next);
  }

  function updatePage(page, title, eyebrow) {
    document.body.dataset.page = page;
    document.title = `${title || TITLES[page] || "TRAVEL STUDIO"} | BOMO TRAVEL STUDIO`;
    const titleElement = document.getElementById("pageTitle");
    if (titleElement)
      titleElement.textContent = title || TITLES[page] || "TRAVEL STUDIO";
    const eyebrowElement = document.getElementById("pageEyebrow");
    if (eyebrowElement) {
      eyebrowElement.textContent =
        eyebrow ||
        (isCreatorPage(page) ? "BOMO TRAVEL STUDIO" : "TRAVEL STUDIO");
    }
  }

  function isCreatorPage(page) {
    return [
      "overview",
      "videos",
      "upload",
      "analytics",
      "earnings",
      "credits",
      "public-profile",
      "profile-settings",
    ].includes(page);
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("open");
    document.body.classList.add("overflow-hidden");
    modal.querySelector("button, [href], input, select, textarea")?.focus();
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.querySelectorAll("video").forEach((video) => video.pause());
    modal
      .querySelectorAll("iframe[data-video-source]")
      .forEach((frame) => frame.removeAttribute("src"));
    modal.classList.remove("open");
    if (!document.querySelector(".modal-backdrop.open")) {
      document.body.classList.remove("overflow-hidden");
    }
  }

  function notify(message, tone = "success") {
    let region = document.getElementById("accountToastRegion");
    if (!region) {
      region = document.createElement("div");
      region.id = "accountToastRegion";
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }

    const toast = document.createElement("div");
    toast.className = `account-toast ${tone}`;
    const icon = tone === "error" ? "fa-circle-exclamation" : "fa-circle-check";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span></span>`;
    toast.querySelector("span").textContent = message;
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    window.setTimeout(() => {
      toast.classList.remove("show");
      window.setTimeout(() => toast.remove(), 220);
    }, 3600);
  }

  function bindGlobalEvents() {
    if (globalEventsBound) return;
    globalEventsBound = true;

    document.addEventListener("click", (event) => {
      const themeButton = event.target.closest("[data-theme-toggle]");
      if (themeButton) {
        event.preventDefault();
        toggleTheme();
        return;
      }

      const profileButton = event.target.closest("#profileMenuBtn");
      if (profileButton) {
        event.stopPropagation();
        const menu = document.getElementById("profileMenu");
        const willOpen = !menu?.classList.contains("open");
        menu?.classList.toggle("open", willOpen);
        profileButton.setAttribute("aria-expanded", String(willOpen));
        return;
      }

      const modalTrigger = event.target.closest("[data-modal-open]");
      if (modalTrigger) {
        event.preventDefault();
        openModal(modalTrigger.dataset.modalOpen);
        return;
      }

      const modalClose = event.target.closest("[data-modal-close]");
      if (modalClose) {
        closeModal(modalClose.dataset.modalClose);
        return;
      }

      if (event.target.classList?.contains("modal-backdrop")) {
        closeModal(event.target.id);
        return;
      }

      document.getElementById("profileMenu")?.classList.remove("open");
      document
        .getElementById("profileMenuBtn")
        ?.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      document
        .querySelectorAll(".modal-backdrop.open")
        .forEach((modal) => closeModal(modal.id));
      document.getElementById("profileMenu")?.classList.remove("open");
    });

    window.addEventListener("storage", (event) => {
      if (
        event.key === THEME_KEY &&
        (event.newValue === "dark" || event.newValue === "light")
      ) {
        applyTheme(event.newValue);
      }
      if (event.key === SETTINGS_KEY) {
        applyAccountSettings(readSettings());
      }
    });
  }

  function initializeFileUpload(root) {
    const choose = root.querySelector?.("#chooseFile");
    const input = root.querySelector?.("#fileInput");
    const drop = root.querySelector?.("#dropzone");
    const preview = root.querySelector?.("#filePreview");
    if (!choose || !input || !drop || !preview || drop.dataset.bound === "true")
      return;
    drop.dataset.bound = "true";

    const showFile = (file) => {
      if (!file) return false;
      const allowedTypes = new Set([
        "video/mp4",
        "video/quicktime",
        "video/webm",
      ]);
      const extensionAllowed = /\.(mp4|mov|webm)$/i.test(file.name);
      if (!allowedTypes.has(file.type) && !extensionAllowed) {
        notify("Choose an MP4, MOV, or WebM video", "error");
        return false;
      }
      if (file.size > 2 * 1024 * 1024 * 1024) {
        notify("Video files must be 2 GB or smaller", "error");
        return false;
      }
      preview.textContent = `Selected: ${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
      preview.classList.remove("hidden");
      return true;
    };

    choose.addEventListener("click", () => input.click());
    input.addEventListener("change", () => {
      if (!showFile(input.files[0])) input.value = "";
    });
    drop.addEventListener("dragover", (event) => {
      event.preventDefault();
      drop.style.borderColor = "#1746d1";
    });
    drop.addEventListener("dragleave", () => {
      drop.style.borderColor = "";
    });
    drop.addEventListener("drop", (event) => {
      event.preventDefault();
      drop.style.borderColor = "";
      const file = event.dataTransfer.files[0];
      if (!showFile(file)) return;
      try {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
      } catch {
        notify("Use Choose Video to confirm this dropped file", "error");
      }
    });
  }

  function initializeRating(root) {
    root.querySelectorAll?.(".star-rating").forEach((group) => {
      if (!group.querySelector('input[type="radio"]')) {
        const name = group.dataset.ratingName || "rating";
        const prefix = (group.dataset.ratingPrefix || name).replace(
          /[^a-zA-Z0-9_-]/g,
          "-",
        );
        const initialValue = Math.max(
          1,
          Math.min(5, Number(group.dataset.ratingValue) || 5),
        );

        for (let value = 1; value <= 5; value += 1) {
          const input = document.createElement("input");
          input.type = "radio";
          input.id = `${prefix}-${value}`;
          input.name = name;
          input.value = String(value);
          input.checked = value === initialValue;
          input.required = true;
          input.setAttribute(
            "aria-label",
            value === 1 ? "1 star" : `${value} stars`,
          );

          const label = document.createElement("label");
          label.htmlFor = input.id;
          label.title = value === 1 ? "1 star" : `${value} stars`;
          label.dataset.ratingStar = String(value);
          label.textContent = "★";

          group.append(input, label);
        }
      }

      const inputs = [...group.querySelectorAll('input[type="radio"]')];
      if (!inputs.length) return;

      const field = group.closest(".rating-field");
      const ratingText = field?.querySelector(
        "[data-rating-text], #ratingText",
      );
      const labels = inputs
        .map((input) => {
          const label = group.querySelector(`label[for="${input.id}"]`);
          if (label) label.dataset.ratingStar = input.value;
          return label;
        })
        .filter(Boolean);
      const paintRating = (value) => {
        labels.forEach((label) => {
          label.classList.toggle(
            "is-filled",
            Number(label.dataset.ratingStar) <= value,
          );
        });
      };
      const updateRating = (input) => {
        if (!input) return;
        const value = Math.max(1, Math.min(5, Number(input.value) || 5));
        group.dataset.ratingValue = String(value);
        if (field) field.dataset.ratingValue = String(value);
        paintRating(value);
        if (ratingText) {
          ratingText.textContent = value === 1 ? "1 star" : `${value} stars`;
          ratingText.classList.remove("rating-error");
        }
      };

      if (group.dataset.bound !== "true") {
        group.dataset.bound = "true";
        inputs.forEach((input) => {
          input.addEventListener("change", () => updateRating(input));
        });
        labels.forEach((label) => {
          label.addEventListener("pointerenter", () => {
            paintRating(Number(label.dataset.ratingStar) || 1);
          });
        });
        group.addEventListener("pointerleave", () => {
          paintRating(
            Number(inputs.find((input) => input.checked)?.value) || 5,
          );
        });
      }

      updateRating(
        inputs.find((input) => input.checked) ||
          inputs.find(
            (input) => input.value === String(group.dataset.ratingValue || "5"),
          ) ||
          inputs[0],
      );
    });
  }

  function initializeSettings(root) {
    const settings = readSettings();
    applyAccountSettings(settings);

    root.querySelectorAll?.("[data-theme-choice]").forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const theme = button.dataset.themeChoice === "dark" ? "dark" : "light";
        try {
          localStorage.setItem(THEME_KEY, theme);
        } catch {
          // The selected theme still applies to this tab.
        }
        applyTheme(theme);
        notify(`${theme === "dark" ? "Dark" : "Light"} mode enabled`);
      });
    });

    root.querySelectorAll?.("[data-setting-key]").forEach((input) => {
      const key = input.dataset.settingKey;
      input.checked = Boolean(settings[key]);
      if (input.dataset.bound === "true") return;
      input.dataset.bound = "true";
      input.addEventListener("change", () => {
        const next = { ...readSettings(), [key]: input.checked };
        writeSettings(next);
        applyAccountSettings(next);
        notify("Preference saved");
      });
    });

    root.querySelectorAll?.(".settings-nav a[href^='#']").forEach((link) => {
      if (link.dataset.bound === "true") return;
      link.dataset.bound = "true";
      link.addEventListener("click", () => {
        root.querySelectorAll(".settings-nav a").forEach((item) => {
          item.classList.toggle("active", item === link);
        });
      });
    });

    const savePassword = document.querySelector("[data-save-password]");
    if (savePassword && savePassword.dataset.bound !== "true") {
      savePassword.dataset.bound = "true";
      savePassword.addEventListener("click", () => {
        const current = document.querySelector("[data-current-password]");
        const next = document.querySelector("[data-new-password]");
        const confirmation = document.querySelector("[data-confirm-password]");
        if (!current?.value || !next?.value || next.value.length < 8) {
          notify(
            "Enter your current password and at least 8 new characters",
            "error",
          );
          return;
        }
        if (next.value !== confirmation?.value) {
          notify("New password confirmation does not match", "error");
          return;
        }
        current.value = "";
        next.value = "";
        confirmation.value = "";
        closeModal("securityModal");
        notify("Password updated");
      });
    }
  }

  function readSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      return { ...DEFAULT_SETTINGS, ...saved };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function writeSettings(settings) {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...DEFAULT_SETTINGS, ...settings }),
      );
    } catch {
      notify("Settings could not be saved in this browser", "error");
    }
  }

  function applyAccountSettings(settings = readSettings()) {
    document.body?.classList.toggle(
      "compact-videos",
      Boolean(settings.compactVideos),
    );
  }

  function initializeTabs(root) {
    if (root.querySelector?.("#videoList[data-enhanced-video-library]")) return;
    root.querySelectorAll?.(".tabs").forEach((tabs) => {
      if (tabs.dataset.bound === "true") return;
      tabs.dataset.bound = "true";
      tabs.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        tabs.querySelectorAll("button").forEach((item) => {
          item.classList.toggle("active", item === button);
        });

        const status = button.textContent.trim().toLowerCase();
        const list = root.querySelector("#videoList");
        if (!list) return;
        list.querySelectorAll(".searchable").forEach((card) => {
          const text = card.textContent.toLowerCase();
          const visible =
            status.startsWith("all") ||
            (status.startsWith("published") && text.includes("published")) ||
            (status.startsWith("under review") &&
              text.includes("under review")) ||
            (status.startsWith("needs attention") &&
              text.includes("needs attention"));
          card.hidden = !visible;
        });
      });
    });
  }

  function initializePagination(root) {
    const list = root.querySelector?.("#videoList");
    if (list?.hasAttribute("data-enhanced-video-library")) return;
    if (!list || list.dataset.paginationBound === "true") return;
    list.dataset.paginationBound = "true";

    const cards = [...list.querySelectorAll(".searchable")];
    if (!cards.length) return;
    const search = root.querySelector("#videoSearch");
    const perPage = 5;
    let currentPage = 1;
    let filtered = [...cards];

    const render = () => {
      const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
      currentPage = Math.min(currentPage, totalPages);
      cards.forEach((card) => {
        card.style.display = "none";
      });
      filtered
        .slice((currentPage - 1) * perPage, currentPage * perPage)
        .forEach((card) => {
          card.style.display = "grid";
        });

      const numbers = root.querySelector("#pageNumbers");
      if (numbers) {
        numbers.innerHTML = "";
        for (let page = 1; page <= totalPages; page += 1) {
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = page;
          button.className = page === currentPage ? "active" : "";
          button.addEventListener("click", () => {
            currentPage = page;
            render();
            list.scrollIntoView({ behavior: "smooth", block: "start" });
          });
          numbers.appendChild(button);
        }
      }

      const previous = root.querySelector("#prevPage");
      const next = root.querySelector("#nextPage");
      if (previous) {
        previous.disabled = currentPage === 1;
        previous.onclick = () => {
          if (currentPage > 1) {
            currentPage -= 1;
            render();
          }
        };
      }
      if (next) {
        next.disabled = currentPage === totalPages;
        next.onclick = () => {
          if (currentPage < totalPages) {
            currentPage += 1;
            render();
          }
        };
      }

      const info = root.querySelector("#pageInfo");
      if (info) {
        const first = filtered.length ? (currentPage - 1) * perPage + 1 : 0;
        info.textContent = `Showing ${first}–${Math.min(
          currentPage * perPage,
          filtered.length,
        )} of ${filtered.length}`;
      }
    };

    search?.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      filtered = cards.filter((card) =>
        card.textContent.toLowerCase().includes(query),
      );
      currentPage = 1;
      render();
    });
    render();
  }

  function initialize(root = document) {
    applyTheme(getPreferredTheme());
    applyAccountSettings();
    bindGlobalEvents();
    initializeFileUpload(root);
    initializeRating(root);
    initializeSettings(root);
    initializeTabs(root);
    initializePagination(root);
  }

  window.BomoAccountUI = Object.freeze({
    initialize,
    applyTheme,
    toggleTheme,
    updatePage,
    openModal,
    closeModal,
    notify,
    titles: TITLES,
  });

  const start = () => {
    if (document.body?.hasAttribute("data-independent-profile")) {
      initialize(document);
      return;
    }

    const legacyTravelPage =
      document.body?.dataset.page &&
      !document.body.hasAttribute("data-unified-account") &&
      /\/travel-studio\//.test(window.location.pathname.replaceAll("\\", "/"));

    if (legacyTravelPage) {
      const normalizedPath = window.location.pathname.replaceAll("\\", "/");
      const studioRootIndex = normalizedPath.indexOf("/travel-studio/");
      const studioRoot =
        studioRootIndex >= 0
          ? normalizedPath.slice(0, studioRootIndex + "/travel-studio/".length)
          : "./";
      const destination = new URL(
        `${studioRoot}index.html`,
        window.location.origin,
      );
      new URLSearchParams(window.location.search).forEach((value, key) => {
        destination.searchParams.append(key, value);
      });
      destination.searchParams.set("pgid", document.body.dataset.page);
      destination.hash = window.location.hash;
      window.location.replace(destination.href);
      return;
    }

    updatePage(document.body?.dataset.page || "dashboard");
    initialize(document);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
