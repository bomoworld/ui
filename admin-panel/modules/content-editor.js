import { openAdminModal } from "../modal.js";

let currentContent;
let editor;
let titleField;

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export default function initializeContentEditor() {
  currentContent = document.getElementById("admin-content-module");
  if (!currentContent) return;
  editor = currentContent.querySelector('[contenteditable="true"]');
  titleField = currentContent.querySelector('input[placeholder="Untitled Page"]');

  try {
    const record = JSON.parse(sessionStorage.getItem("bomo-content-editor-record"));
    if (record) {
      titleField.value = record.title;
      const slugField = [...currentContent.querySelectorAll("input")].find((input) => input.value?.startsWith("/"));
      if (slugField) slugField.value = record.slug;
    }
  } catch {}

  const toolbar = editor?.closest(".rounded-\\[32px\\]")?.querySelector(".sticky");
  toolbar?.querySelectorAll("button").forEach((button) => {
    const icon = button.querySelector("i")?.className || "";
    const label = button.textContent.trim();
    if (icon.includes("fa-heading")) setEditorAction(button, "heading", "Heading");
    if (icon.includes("fa-bold")) setEditorAction(button, "bold", "Bold");
    if (icon.includes("fa-italic")) setEditorAction(button, "italic", "Italic");
    if (icon.includes("fa-list") && !icon.includes("fa-list-check")) setEditorAction(button, "list", "Bulleted list");
    if (icon.includes("fa-list-check")) setEditorAction(button, "checklist", "Checklist");
    if (icon.includes("fa-link")) setEditorAction(button, "link", "Insert link");
    if (icon.includes("fa-image")) setEditorAction(button, "image", "Insert image");
    if (icon.includes("fa-video")) setEditorAction(button, "video", "Insert video");
    if (icon.includes("fa-table")) setEditorAction(button, "table", "Insert table");
    if (icon.includes("fa-quote-left")) setEditorAction(button, "quote", "Block quote");
    if (label === "Desktop") setEditorAction(button, "desktop", "Desktop preview");
    if (label === "Mobile") setEditorAction(button, "mobile", "Mobile preview");
  });

  currentContent.querySelectorAll("button").forEach((button) => {
    const label = button.textContent.replace(/\s+/g, " ").trim();
    if (label === "Add Section") setEditorAction(button, "add-section");
    if (label === "Publish Content") setEditorAction(button, "publish");
    if (label === "Save Draft") setEditorAction(button, "save-draft");
  });

  const cover = [...currentContent.querySelectorAll("div")].find((item) => item.textContent.trim() === "Upload Cover Image" && item.closest(".border-dashed"));
  const coverTarget = cover?.closest(".border-dashed");
  if (coverTarget) {
    coverTarget.dataset.editorAction = "cover";
    coverTarget.tabIndex = 0;
    coverTarget.setAttribute("role", "button");
  }

  currentContent.addEventListener("click", handleClick);
  currentContent.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches('[data-editor-action="cover"]')) openCover();
  });
}

function setEditorAction(button, action, label) {
  button.type = "button";
  button.dataset.editorAction = action;
  if (label) { button.title = label; button.setAttribute("aria-label", label); }
}

function handleClick(event) {
  const control = event.target.closest("[data-editor-action]");
  if (!control || !currentContent.contains(control)) return;
  const action = control.dataset.editorAction;
  if (["heading", "bold", "italic", "list", "checklist", "quote"].includes(action)) applyFormatting(action);
  if (["link", "image", "video", "table"].includes(action)) openInsert(action);
  if (action === "desktop" || action === "mobile") setViewport(action);
  if (action === "cover") openCover();
  if (action === "add-section") openAddSection();
  if (action === "publish") openPublish();
  if (action === "save-draft") openSaveDraft();
}

function applyFormatting(action) {
  editor?.focus();
  if (action === "heading") document.execCommand("formatBlock", false, "h2");
  if (action === "bold") document.execCommand("bold");
  if (action === "italic") document.execCommand("italic");
  if (action === "list") document.execCommand("insertUnorderedList");
  if (action === "quote") document.execCommand("formatBlock", false, "blockquote");
  if (action === "checklist") document.execCommand("insertHTML", false, '<p>☐ Checklist item</p>');
}

function insertHtml(html) {
  editor?.focus();
  document.execCommand("insertHTML", false, html);
}

function openInsert(type) {
  const labels = { link: "Insert link", image: "Insert image", video: "Insert video", table: "Insert table" };
  const fields = {
    link: `<label class="settings-field"><span>Link text <b>*</b></span><input required name="text" class="bomo-input w-full" placeholder="Link label"></label><label class="settings-field"><span>Destination URL <b>*</b></span><input required type="url" name="url" class="bomo-input w-full" placeholder="https://"></label><label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="newTab" checked> Open in a new tab</label>`,
    image: `<label class="settings-field"><span>Image URL <b>*</b></span><input required type="url" name="url" class="bomo-input w-full" placeholder="https://"></label><label class="settings-field"><span>Alternative text <b>*</b></span><input required name="alt" class="bomo-input w-full" placeholder="Describe the image"></label><label class="settings-field"><span>Caption</span><input name="caption" class="bomo-input w-full"></label>`,
    video: `<label class="settings-field"><span>Video URL <b>*</b></span><input required type="url" name="url" class="bomo-input w-full" placeholder="https://"></label><label class="settings-field"><span>Video title <b>*</b></span><input required name="title" class="bomo-input w-full"></label><label class="settings-field"><span>Caption</span><input name="caption" class="bomo-input w-full"></label>`,
    table: `<div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Rows <b>*</b></span><input required type="number" min="1" max="20" name="rows" value="3" class="bomo-input w-full"></label><label class="settings-field"><span>Columns <b>*</b></span><input required type="number" min="1" max="8" name="columns" value="3" class="bomo-input w-full"></label></div><label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" name="header" checked> Use the first row as a header</label>`,
  }[type];
  const modal = openAdminModal({ title: labels[type], size: "max-w-xl", content: `<form data-insert-form class="space-y-5">${fields}<div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary">Insert ${type}</button></div></form>` });
  modal.querySelector("[data-insert-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (type === "link") insertHtml(`<a href="${escapeHtml(data.url)}" ${data.newTab ? 'target="_blank" rel="noopener"' : ""}>${escapeHtml(data.text)}</a>`);
    if (type === "image") insertHtml(`<figure><img src="${escapeHtml(data.url)}" alt="${escapeHtml(data.alt)}">${data.caption ? `<figcaption>${escapeHtml(data.caption)}</figcaption>` : ""}</figure>`);
    if (type === "video") insertHtml(`<figure><video controls src="${escapeHtml(data.url)}" aria-label="${escapeHtml(data.title)}"></video>${data.caption ? `<figcaption>${escapeHtml(data.caption)}</figcaption>` : ""}</figure>`);
    if (type === "table") {
      const rows = Number(data.rows); const columns = Number(data.columns);
      const html = Array.from({ length: rows }, (_, row) => `<tr>${Array.from({ length: columns }, (_, column) => row === 0 && data.header ? `<th>Heading ${column + 1}</th>` : "<td>Content</td>").join("")}</tr>`).join("");
      insertHtml(`<table><tbody>${html}</tbody></table>`);
    }
    modal.querySelector("form").innerHTML = successState(`${labels[type]} complete`, `The ${type} was added to the editor.`);
  });
}

function setViewport(view) {
  const canvas = editor?.closest(".rounded-\\[32px\\]");
  if (!canvas) return;
  canvas.style.maxWidth = view === "mobile" ? "420px" : "";
  canvas.style.marginInline = view === "mobile" ? "auto" : "";
  currentContent.querySelectorAll('[data-editor-action="desktop"], [data-editor-action="mobile"]').forEach((button) => {
    button.classList.toggle("bg-slate-900", button.dataset.editorAction === view);
    button.classList.toggle("text-white", button.dataset.editorAction === view);
  });
}

function openCover() {
  const modal = openAdminModal({ title: "Set cover image", size: "max-w-xl", content: `<form data-cover-form class="space-y-5"><label class="settings-field"><span>Image URL <b>*</b></span><input required type="url" name="url" class="bomo-input w-full" placeholder="https://"></label><label class="settings-field"><span>Alternative text <b>*</b></span><input required name="alt" class="bomo-input w-full" placeholder="Describe the cover image"></label><label class="settings-field"><span>Focal position</span><select name="position" class="bomo-input w-full"><option>Center</option><option>Top</option><option>Bottom</option></select></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary">Apply cover</button></div></form>` });
  modal.querySelector("[data-cover-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const cover = currentContent.querySelector('[data-editor-action="cover"]');
    cover.style.backgroundImage = `linear-gradient(rgba(15,23,42,.08),rgba(15,23,42,.08)),url("${data.url.replaceAll('"', "%22")}")`;
    cover.style.backgroundSize = "cover";
    cover.style.backgroundPosition = data.position.toLowerCase();
    cover.setAttribute("aria-label", data.alt);
    cover.innerHTML = '<span class="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">Change cover</span>';
    modal.querySelector("form").innerHTML = successState("Cover updated", "The cover image and alternative text were applied.");
  });
}

function openAddSection() {
  const modal = openAdminModal({ title: "Add page section", size: "max-w-xl", content: `<form data-section-form class="space-y-5"><label class="settings-field"><span>Section type <b>*</b></span><select required name="type" class="bomo-input w-full"><option>Text and media</option><option>Call to action</option><option>FAQ accordion</option><option>Featured properties</option><option>Statistics</option><option>Quote</option></select></label><label class="settings-field"><span>Section heading <b>*</b></span><input required name="heading" class="bomo-input w-full"></label><label class="settings-field"><span>Placement</span><select name="placement" class="bomo-input w-full"><option>After current content</option><option>Before current content</option></select></label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary">Add section</button></div></form>` });
  modal.querySelector("[data-section-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    insertHtml(`<section><h2>${escapeHtml(data.heading)}</h2><p>Start adding ${escapeHtml(data.type.toLowerCase())} content here.</p></section>`);
    event.currentTarget.innerHTML = successState("Section added", `${escapeHtml(data.heading)} was added to the page canvas.`);
  });
}

function openPublish() {
  const title = titleField?.value.trim();
  const modal = openAdminModal({ title: "Publish content", size: "max-w-2xl", content: `<form data-publish-form class="space-y-5"><div class="rounded-2xl ${title ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"} p-4 text-sm"><strong>${title ? "Content is ready for publishing review" : "A page title is required"}</strong><p class="mt-1">${title ? escapeHtml(title) : "Close this dialog and add a clear page title before publishing."}</p></div><div class="grid gap-4 sm:grid-cols-2"><label class="settings-field"><span>Publishing status <b>*</b></span><select required name="status" class="bomo-input w-full"><option>Publish now</option><option>Schedule publishing</option><option>Submit for review</option></select></label><label class="settings-field"><span>Publish date</span><input type="datetime-local" name="date" class="bomo-input w-full"></label><label class="settings-field"><span>Visibility</span><select class="bomo-input w-full"><option>Public</option><option>Unlisted</option><option>Admin preview only</option></select></label><label class="settings-field"><span>Change type</span><select class="bomo-input w-full"><option>New content</option><option>Minor update</option><option>Policy update</option><option>Campaign content</option></select></label><label class="settings-field sm:col-span-2"><span>Publishing note <b>*</b></span><textarea required rows="3" class="bomo-input w-full" placeholder="Summarize the content and approval context."></textarea></label></div><label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600"><input type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300"> Notify content administrators when the page is published.</label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" ${title ? "" : "disabled"} class="property-button property-button-primary disabled:cursor-not-allowed disabled:opacity-40"><i class="fa-solid fa-paper-plane"></i> Confirm publishing</button></div></form>` });
  modal.querySelector("[data-publish-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    updateEditorStatus("Published");
    event.currentTarget.innerHTML = successState("Content published", `${escapeHtml(title)} is published in this UI session.`);
  });
}

function openSaveDraft() {
  const modal = openAdminModal({ title: "Save content draft", size: "max-w-xl", content: `<form data-draft-form class="space-y-5"><div class="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800"><strong>${escapeHtml(titleField?.value.trim() || "Untitled page")}</strong><p class="mt-1 text-blue-700">Your page content, organization, SEO fields, and publishing settings will be included.</p></div><label class="settings-field"><span>Version note</span><textarea rows="3" class="bomo-input w-full" placeholder="What changed in this draft?"></textarea></label><label class="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-600"><input type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300"> Continue autosaving changes after this version.</label><div class="flex justify-end gap-3"><button type="button" data-admin-modal-close class="property-button property-button-secondary">Cancel</button><button type="submit" class="property-button property-button-primary"><i class="fa-solid fa-floppy-disk"></i> Save draft</button></div></form>` });
  modal.querySelector("[data-draft-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateEditorStatus("Draft");
    event.currentTarget.innerHTML = successState("Draft saved", "A new content version was saved for this UI session.");
  });
}

function updateEditorStatus(status) {
  const badge = currentContent.querySelector("span.bg-blue-100, span.bg-emerald-100");
  if (badge) {
    badge.textContent = status;
    badge.className = `px-3 py-1 rounded-full text-xs font-semibold ${status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`;
  }
  const saved = [...currentContent.querySelectorAll("span")].find((span) => span.textContent.includes("Last saved"));
  if (saved) saved.textContent = "Last saved just now";
}

function successState(title, message) {
  return `<div class="py-7 text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><i class="fa-solid fa-check"></i></div><h3 class="mt-4 text-lg font-semibold text-slate-900">${title}</h3><p class="mt-2 text-sm text-slate-500">${message}</p><button type="button" data-admin-modal-close class="property-button property-button-primary mt-6">Done</button></div>`;
}
