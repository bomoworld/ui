import { openAdminModal } from "../modal.js";

let currentContent;
let activeType = "All Content";

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export default function initializeContentManagement() {
  currentContent = document.getElementById("admin-content-module");
  if (!currentContent) return;

  currentContent.querySelectorAll("button").forEach((button) => {
    const cardTitle = button.querySelector("h3")?.textContent.trim();
    if (cardTitle === "Media Library") button.dataset.contentAction = "media";
    if (cardTitle === "SEO Manager") button.dataset.contentAction = "seo";
    if (cardTitle === "Categories") button.dataset.contentAction = "categories";
  });

  currentContent.querySelector('[data-admin-link="content-editor"]')?.addEventListener("click", () => {
    sessionStorage.removeItem("bomo-content-editor-record");
  });

  const library = [...currentContent.querySelectorAll("section")].find((section) => section.querySelector("h2")?.textContent.includes("Content Library"));
  library?.querySelectorAll("button").forEach((button) => {
    const label = button.textContent.replace(/\s+/g, " ").trim();
    if (["All Content", "Pages", "Articles", "Policies", "FAQ", "Help Center"].includes(label)) {
      button.dataset.contentAction = "filter";
      button.dataset.contentType = label;
    }
    if (["Edit", "View", "Review"].includes(label)) {
      button.dataset.contentAction = label.toLowerCase();
    }
    if (["Previous", "1", "2", "3", "Next"].includes(label)) {
      button.dataset.contentAction = "page";
      button.dataset.contentPage = label;
    }
  });

  const search = library?.querySelector('input[placeholder*="Search content"]');
  const status = library?.querySelector("select");
  if (search) { search.dataset.contentSearch = "true"; search.addEventListener("input", filterRows); }
  if (status) { status.dataset.contentStatus = "true"; status.addEventListener("change", filterRows); }
  currentContent.addEventListener("click", handleClick);
}

function handleClick(event) {
  const control = event.target.closest("[data-content-action]");
  if (!control || !currentContent.contains(control)) return;
  const action = control.dataset.contentAction;
  if (action === "filter") {
    activeType = control.dataset.contentType;
    currentContent.querySelectorAll("[data-content-type]").forEach((button) => {
      const active = button === control;
      button.classList.toggle("bg-slate-900", active);
      button.classList.toggle("text-white", active);
      button.classList.toggle("bg-white", !active);
      button.classList.toggle("border", !active);
      button.classList.toggle("border-slate-200", !active);
    });
    filterRows();
  }
  if (action === "media") openMediaLibrary();
  if (action === "seo") openSeoManager();
  if (action === "categories") openCategories();
  if (["edit", "view", "review"].includes(action)) openContentRecord(action, control.closest("tr"));
  if (action === "page") {
    currentContent.querySelectorAll('[data-content-action="page"]').forEach((button) => {
      const active = button === control && /^\d+$/.test(button.dataset.contentPage);
      button.classList.toggle("bg-slate-900", active);
      button.classList.toggle("text-white", active);
    });
  }
}

function filterRows() {
  const search = currentContent.querySelector("[data-content-search]")?.value.trim().toLowerCase() || "";
  const status = currentContent.querySelector("[data-content-status]")?.value || "All Status";
  const rows = [...currentContent.querySelectorAll("tbody tr")];
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll("td")].map((cell) => cell.textContent.replace(/\s+/g, " ").trim());
    const type = cells[1] || "";
    const rowStatus = cells[5] || "";
    const typeMatch = activeType === "All Content"
      || (activeType === "Pages" && type === "Page")
      || (activeType === "Articles" && type === "Article")
      || (activeType === "Policies" && type === "Policy")
      || (activeType === "FAQ" && type === "FAQ")
      || (activeType === "Help Center" && type.includes("Help"));
    row.classList.toggle("hidden", !typeMatch || (status !== "All Status" && rowStatus !== status) || (search && !row.textContent.toLowerCase().includes(search)));
  });
}

function openMediaLibrary() {
  const modal = openAdminModal({
    title: "Media library",
    size: "max-w-4xl",
    content: `<div class="space-y-5"><div class="flex flex-col gap-3 sm:flex-row"><label class="relative flex-1"><i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i><input class="bomo-input w-full !pl-11" placeholder="Search media assets"></label><select class="bomo-input sm:w-44"><option>All asset types</option><option>Images</option><option>Videos</option><option>Documents</option></select><button type="button" data-content-modal-action="upload" class="property-button property-button-primary"><i class="fa-solid fa-upload"></i> Upload asset</button></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${["Homepage hero", "El Nido destination", "BOMO partner guide", "Summer campaign", "Trust & safety", "Mobile booking"].map((name, index) => `<button type="button" data-content-media-asset="${name}" class="overflow-hidden rounded-2xl border border-slate-200 text-left hover:border-blue-300"><div class="flex h-28 items-center justify-center bg-gradient-to-br ${index % 2 ? "from-blue-100 to-indigo-100" : "from-emerald-100 to-cyan-100"} text-3xl text-slate-500"><i class="fa-regular ${index === 2 ? "fa-file-pdf" : "fa-image"}"></i></div><div class="p-3"><p class="text-sm font-semibold text-slate-900">${name}</p><p class="mt-1 text-xs text-slate-500">${index === 2 ? "PDF · 1.4 MB" : "JPG · 1600 × 900"}</p></div></button>`).join("")}</div></div>`,
  });
  modal.addEventListener("click", (event) => {
    const asset = event.target.closest("[data-content-media-asset]")?.dataset.contentMediaAsset;
    const upload = event.target.closest('[data-content-modal-action="upload"]');
    if (asset) {
      modal.querySelector(".overflow-y-auto").innerHTML = `<form data-media-detail-form class="space-y-5"><div class="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-5xl text-slate-500"><i class="fa-regular fa-image"></i></div><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Asset title <b>*</b></span><input required value="${escapeHtml(asset)}" class="bomo-input w-full"></label><label class="settings-field"><span>Folder</span><select class="bomo-input w-full"><option>General</option><option>Destinations</option><option>Campaigns</option></select></label><label class="settings-field sm:col-span-2"><span>Alternative text <b>*</b></span><input required value="${escapeHtml(asset)} image" class="bomo-input w-full"></label><label class="settings-field sm:col-span-2"><span>Public URL</span><input readonly value="https://bomo.world/assets/${escapeHtml(asset.toLowerCase().replaceAll(" ", "-"))}.jpg" class="bomo-input w-full"></label></div><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Close</button><button type="submit" class="property-button property-button-primary">Save metadata</button></div></form>`;
      modal.querySelector("[data-media-detail-form]")?.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();
        if (!submitEvent.currentTarget.reportValidity()) return;
        submitEvent.currentTarget.innerHTML = successState("Asset metadata updated", `${escapeHtml(asset)} was updated in this UI session.`);
      });
    }
    if (upload) {
      modal.querySelector(".overflow-y-auto").innerHTML = `<form data-media-upload-form class="space-y-5"><div class="rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center"><i class="fa-solid fa-cloud-arrow-up text-4xl text-blue-500"></i><p class="mt-3 font-semibold text-slate-900">Choose an asset</p><input required type="file" class="mt-4 text-sm"></div><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Asset title <b>*</b></span><input required class="bomo-input w-full"></label><label class="settings-field"><span>Folder</span><select class="bomo-input w-full"><option>General</option><option>Destinations</option><option>Campaigns</option><option>Legal</option></select></label><label class="settings-field sm:col-span-2"><span>Alternative text <b>*</b></span><input required class="bomo-input w-full" placeholder="Describe the image for accessibility"></label></div><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary">Upload asset</button></div></form>`;
      modal.querySelector("[data-media-upload-form]")?.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();
        if (!submitEvent.currentTarget.reportValidity()) return;
        submitEvent.currentTarget.innerHTML = successState("Asset uploaded", "The media asset and accessibility metadata were added to this UI session.");
      });
    }
  });
}

function openSeoManager() {
  const modal = openAdminModal({
    title: "SEO manager",
    size: "max-w-3xl",
    content: `<form data-seo-manager-form class="space-y-5"><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field sm:col-span-2"><span>Content record <b>*</b></span><select required class="bomo-input w-full"><option>About BOMO · /about-bomo</option><option>Privacy Policy · /privacy-policy</option><option>Summer Travel Guide 2026</option><option>Careers Page Update</option></select></label><label class="settings-field sm:col-span-2"><span>SEO title <b>*</b></span><input required maxlength="60" value="About BOMO | Trusted Travel Experiences" class="bomo-input w-full"><small>48 of 60 recommended characters</small></label><label class="settings-field sm:col-span-2"><span>Meta description <b>*</b></span><textarea required maxlength="160" rows="3" class="bomo-input w-full">Learn how BOMO helps travelers book trusted stays through verified guest experiences.</textarea></label><label class="settings-field"><span>Focus keyword</span><input value="trusted travel booking" class="bomo-input w-full"></label><label class="settings-field"><span>Indexing</span><select class="bomo-input w-full"><option>Index and follow</option><option>No index</option><option>Index, no follow</option></select></label><label class="settings-field sm:col-span-2"><span>Canonical URL</span><input type="url" value="https://bomo.world/about-bomo" class="bomo-input w-full"></label></div><div class="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800"><strong>SEO score: 87/100</strong><p class="mt-1 text-emerald-700">Title, description, canonical URL, and primary keyword are present.</p></div><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary">Save SEO settings</button></div></form>`,
  });
  modal.querySelector("[data-seo-manager-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.innerHTML = successState("SEO settings updated", "Search metadata was saved for this UI session.");
  });
}

function openCategories() {
  const modal = openAdminModal({
    title: "Manage content categories",
    size: "max-w-2xl",
    content: `<form data-category-form class="space-y-5"><div class="space-y-2">${[["Company", 18], ["Travel", 42], ["Legal", 12], ["Support", 31], ["Careers", 8]].map(([name, count]) => `<div class="flex items-center justify-between rounded-xl border border-slate-200 p-3"><div><p class="text-sm font-semibold text-slate-900">${name}</p><p class="text-xs text-slate-500">${count} content records</p></div><button type="button" data-category-edit="${name}" class="text-sm font-semibold text-blue-600">Edit</button></div>`).join("")}</div><div class="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2"><label class="settings-field"><span>Category name <b>*</b></span><input required name="name" class="bomo-input w-full" placeholder="Category name"></label><label class="settings-field"><span>URL key <b>*</b></span><input required name="slug" class="bomo-input w-full" placeholder="category-key"></label></div><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> Save category</button></div></form>`,
  });
  modal.addEventListener("click", (event) => {
    const name = event.target.closest("[data-category-edit]")?.dataset.categoryEdit;
    if (!name) return;
    const form = modal.querySelector("[data-category-form]");
    form.elements.name.value = name;
    form.elements.slug.value = name.toLowerCase().replaceAll(" ", "-");
    form.elements.name.focus();
  });
  modal.querySelector("[data-category-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.innerHTML = successState("Category saved", "The content category is available in this UI session.");
  });
}

function openContentRecord(action, row) {
  const cells = [...row.querySelectorAll("td")].map((cell) => cell.textContent.replace(/\s+/g, " ").trim());
  const title = cells[0]?.split("/")[0]?.trim() || "Content record";
  const slug = row.querySelector("td div.text-sm")?.textContent.trim() || "/";
  if (action === "edit") {
    sessionStorage.setItem("bomo-content-editor-record", JSON.stringify({ title, slug, type: cells[1], category: cells[2] }));
    history.pushState({ page: "content-editor" }, "", "?page=content-editor");
    window.dispatchEvent(new PopStateEvent("popstate"));
    return;
  }
  if (action === "view") {
    openAdminModal({ title: `Preview · ${escapeHtml(title)}`, size: "max-w-3xl", content: `<div class="overflow-hidden rounded-2xl border border-slate-200"><div class="bg-slate-950 px-6 py-5 text-white"><p class="text-xs text-slate-400">${escapeHtml(slug)}</p><h2 class="mt-2 text-2xl font-semibold">${escapeHtml(title)}</h2></div><div class="p-6"><span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">${escapeHtml(cells[5])}</span><p class="mt-5 text-sm leading-7 text-slate-600">This preview represents the published content layout, metadata, and primary page copy for the selected record.</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Close preview</button></div></div>` });
    return;
  }
  const modal = openAdminModal({ title: `Content review · ${escapeHtml(title)}`, size: "max-w-2xl", content: `<form data-content-review-form class="space-y-5"><div class="rounded-2xl bg-slate-50 p-4"><p class="font-semibold text-slate-900">${escapeHtml(title)}</p><p class="mt-1 text-sm text-slate-500">${escapeHtml(slug)} · ${escapeHtml(cells[1])} · ${escapeHtml(cells[2])}</p></div><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Review decision <b>*</b></span><select required class="bomo-input w-full"><option>Approve for publishing</option><option>Request changes</option><option>Return to draft</option><option>Escalate to Legal</option></select></label><label class="settings-field"><span>Assign editor</span><select class="bomo-input w-full"><option>Marketing Team</option><option>Legal Team</option><option>Operations Team</option></select></label><label class="settings-field sm:col-span-2"><span>Review note <b>*</b></span><textarea required rows="4" class="bomo-input w-full" placeholder="Record required edits or approval context."></textarea></label></div><label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300"> Notify the content author about this decision.</label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary">Save review decision</button></div></form>` });
  modal.querySelector("[data-content-review-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.innerHTML = successState("Content review saved", `${escapeHtml(title)} was updated in this UI session.`);
  });
}

function successState(title, message) {
  return `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">${title}</h3><p class="mt-2 text-sm text-slate-500">${message}</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
}
