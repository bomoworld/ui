const STORAGE_KEY = "bomo-video-reviews-v1";
const VALID_STATUSES = new Set([
  "draft",
  "pending",
  "approved",
  "changes_requested",
  "rejected",
]);

export const videoReviewStore = Object.freeze({
  all,
  get,
  saveDraft,
  submit,
  withdraw,
  remove,
});

function all() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.map(normalizeRecord) : [];
  } catch {
    return [];
  }
}

function get(id) {
  return all().find((record) => record.id === id) || null;
}

function saveDraft(input, id = null) {
  const records = all();
  const index = id ? records.findIndex((record) => record.id === id) : -1;
  const previous = index >= 0 ? records[index] : null;
  if (previous?.status === "pending" || previous?.status === "approved") {
    throw new Error("Withdraw this submission before editing it.");
  }

  const now = new Date().toISOString();
  const record = normalizeRecord({
    ...previous,
    ...input,
    id: previous?.id || createId(),
    status:
      previous?.status === "changes_requested" ? "changes_requested" : "draft",
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  });

  if (index >= 0) records[index] = record;
  else records.unshift(record);
  write(records);
  return record;
}

function submit(input, id = null) {
  const draft = saveDraft(input, id);
  const records = all();
  const index = records.findIndex((record) => record.id === draft.id);
  const record = normalizeRecord({
    ...draft,
    status: "pending",
    submittedAt: new Date().toISOString(),
    moderationReason: "",
    decidedAt: "",
    publishedAt: "",
    updatedAt: new Date().toISOString(),
  });
  records[index] = record;
  write(records);
  return record;
}

function withdraw(id) {
  const records = all();
  const index = records.findIndex((record) => record.id === id);
  if (index < 0) throw new Error("Video review not found.");
  if (records[index].status !== "pending") {
    throw new Error("Only pending submissions can be withdrawn.");
  }
  records[index] = normalizeRecord({
    ...records[index],
    status: "draft",
    submittedAt: "",
    decidedAt: "",
    publishedAt: "",
    updatedAt: new Date().toISOString(),
  });
  write(records);
  return records[index];
}

function remove(id) {
  const records = all();
  const record = records.find((item) => item.id === id);
  if (!record) return false;
  if (record.status === "approved") {
    throw new Error("Approved reviews must be unpublished by BOMO support.");
  }
  write(records.filter((item) => item.id !== id));
  return true;
}

function normalizeRecord(value) {
  const rating = Math.max(1, Math.min(5, Number(value?.rating) || 5));
  const status = VALID_STATUSES.has(value?.status) ? value.status : "draft";
  return {
    id: String(value?.id || createId()),
    title: String(value?.title || "Untitled video review"),
    property: String(value?.property || "BOMO stay"),
    bookingId: String(value?.bookingId || ""),
    rating,
    description: String(value?.description || ""),
    visibility: String(value?.visibility || "Public after approval"),
    fileName: String(value?.fileName || ""),
    status,
    views: Math.max(0, Number(value?.views) || 0),
    uniqueViewers: Math.max(0, Number(value?.uniqueViewers) || 0),
    earnings: Math.max(0, Number(value?.earnings) || 0),
    duration: String(value?.duration || "Preview"),
    moderationReason: String(value?.moderationReason || ""),
    createdAt: value?.createdAt || new Date().toISOString(),
    updatedAt: value?.updatedAt || new Date().toISOString(),
    submittedAt: value?.submittedAt || "",
    decidedAt: value?.decidedAt || "",
    publishedAt: value?.publishedAt || "",
  };
}

function write(records) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records.map(normalizeRecord)),
    );
  } catch {
    throw new Error("Video reviews could not be saved in this browser.");
  }
}

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `video-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}
