let activeModal;
let focusedBeforeOpen;

function getFocusableElements(modal) {
  return [
    ...modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ];
}

function handleModalKeydown(event) {
  if (!activeModal) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeAdminModal();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = getFocusableElements(activeModal);

  if (!focusable.length) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener("keydown", handleModalKeydown);

export function openAdminModal({
  title,
  content,
  size = "max-w-3xl",
  labelledBy = "adminModalTitle",
  showHeader = true,
}) {
  closeAdminModal({ restoreFocus: false });

  const container = document.getElementById("modalContainer") || document.body;
  focusedBeforeOpen =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6";
  modal.dataset.adminModal = "true";
  const accessibleName = showHeader
    ? `aria-labelledby="${labelledBy}"`
    : `aria-label="${title}"`;
  const header = showHeader
    ? `<header class="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
        <h2 id="${labelledBy}" class="text-lg font-semibold text-slate-900 sm:text-xl">${title}</h2>
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
          aria-label="Close dialog"
          data-admin-modal-close
        >
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </header>`
    : "";

  modal.innerHTML = `
    <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" data-admin-modal-close></div>
    <section
      class="relative flex max-h-[calc(100vh-2rem)] w-full ${size} flex-col overflow-hidden rounded-3xl bg-white shadow-[0_28px_90px_rgba(15,23,42,0.38)]"
      role="dialog"
      aria-modal="true"
      ${accessibleName}
      tabindex="-1"
    >
      ${header}
      <div class="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">${content}</div>
    </section>
  `;

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-admin-modal-close]")) {
      closeAdminModal();
    }
  });

  container.appendChild(modal);
  activeModal = modal;
  modal
    .querySelector(
      'section [data-admin-modal-close], section [data-admin-action="close-modal"], section button, section [href], section input, section select, section textarea',
    )
    ?.focus();

  return modal;
}

export function closeAdminModal({ restoreFocus = true } = {}) {
  if (!activeModal) return;

  activeModal.remove();
  activeModal = undefined;

  if (restoreFocus && focusedBeforeOpen?.isConnected) {
    focusedBeforeOpen.focus();
  }

  focusedBeforeOpen = undefined;
}

export function isAdminModalOpen() {
  return Boolean(activeModal);
}
