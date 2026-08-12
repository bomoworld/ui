import { closeAdminModal, openAdminModal } from "../modal.js";

const PARTNER_REQUIREMENTS_API = "/api/admin/partner-requirements";
const REQUIREMENTS_STORAGE_KEY = "BOMO_PARTNER_REQUIREMENT_CONFIGURATIONS";

const initialPartners = [
  {
    id: "PA-203",
    name: "Maria Santos",
    company: "Santos Hospitality Group",
    email: "maria@santoshospitality.ph",
    type: "Hospitality group",
    country: "Philippines",
    review: "Identity verification",
    category: "verification",
    status: "pending",
    priority: "high",
    evidence: "Government ID pending",
    missingEvidence: true,
    reviewer: "Unassigned",
    submitted: "32 minutes ago",
    risk: "Enhanced review",
    note: "Legal name on government ID does not yet match the business registration.",
  },
  {
    id: "PA-202",
    name: "Arlo Reyes",
    company: "Reyes Island Stays",
    email: "arlo@reyesisland.ph",
    type: "Property partner",
    country: "Philippines",
    review: "Business compliance",
    category: "business",
    status: "documents",
    priority: "normal",
    evidence: "2 documents missing",
    missingEvidence: true,
    reviewer: "You",
    submitted: "2 hours ago",
    risk: "Standard",
    note: "Business registration is uploaded; municipal permit and proof of address are required.",
  },
  {
    id: "PA-201",
    name: "Carmen Ong",
    company: "Ong City Suites",
    email: "carmen@ongsuites.ph",
    type: "Property manager",
    country: "Philippines",
    review: "Payout account",
    category: "payout",
    status: "pending",
    priority: "normal",
    evidence: "Bank letter uploaded",
    missingEvidence: false,
    reviewer: "Finance Team",
    submitted: "4 hours ago",
    risk: "Standard",
    note: "Validate account holder name against the partner business registration.",
  },
  {
    id: "PA-200",
    name: "Daniel Lim",
    company: "Coastal Key Management",
    email: "daniel@coastalkey.sg",
    type: "Property manager",
    country: "Singapore",
    review: "Identity verification",
    category: "verification",
    status: "pending",
    priority: "normal",
    evidence: "Complete",
    missingEvidence: false,
    reviewer: "Unassigned",
    submitted: "Today",
    risk: "Standard",
    note: "Director identification and authorised representative forms are ready for review.",
  },
  {
    id: "PA-199",
    name: "Lea Villanueva",
    company: "Luna Villa Collection",
    email: "lea@lunavillas.ph",
    type: "Property partner",
    country: "Philippines",
    review: "Payout account",
    category: "payout",
    status: "ready",
    priority: "normal",
    evidence: "Account verified",
    missingEvidence: false,
    reviewer: "You",
    submitted: "5 hours ago",
    risk: "Low",
    note: "Identity, business registration and account information align. Ready for verification.",
  },
  {
    id: "PA-198",
    name: "Kai Tan",
    company: "Pacific House Group",
    email: "kai@pacifichouse.au",
    type: "Hospitality group",
    country: "Australia",
    review: "Business compliance",
    category: "business",
    status: "escalated",
    priority: "high",
    evidence: "Registration conflict",
    missingEvidence: true,
    reviewer: "Compliance Team",
    submitted: "Yesterday",
    risk: "Sanctions screening",
    note: "Business registration contains conflicting director information and requires compliance review.",
  },
  {
    id: "PA-197",
    name: "Noel Garcia",
    company: "Garcia Boutique Hotels",
    email: "noel@garciahotels.ph",
    type: "Hospitality group",
    country: "Philippines",
    review: "Business compliance",
    category: "business",
    status: "pending",
    priority: "normal",
    evidence: "Permit expires in 14 days",
    missingEvidence: false,
    reviewer: "Legal Team",
    submitted: "Yesterday",
    risk: "Standard",
    note: "Request current local business permit before enabling additional properties.",
  },
  {
    id: "PA-196",
    name: "Tessa Wong",
    company: "Harbor View Homes",
    email: "tessa@harborview.sg",
    type: "Property partner",
    country: "Singapore",
    review: "Payout account",
    category: "payout",
    status: "restricted",
    priority: "normal",
    evidence: "Account name mismatch",
    missingEvidence: true,
    reviewer: "Finance Team",
    submitted: "Jul 24",
    risk: "Restricted",
    note: "Payout account access remains restricted until the account holder name is corrected.",
  },
];

const partnerProfileOptions = [
  {
    value: "individual_property_partner",
    label: "Individual property partner",
  },
  {
    value: "business_property_partner",
    label: "Business property partner",
  },
  {
    value: "property_manager_authorized_representative",
    label: "Property manager / authorized representative",
  },
];

const requirementInputTypes = [
  { value: "file", label: "File upload", icon: "fa-file-arrow-up" },
  { value: "text", label: "Text input", icon: "fa-font" },
  { value: "textarea", label: "Long text", icon: "fa-align-left" },
  { value: "date", label: "Date input", icon: "fa-calendar-days" },
  { value: "number", label: "Number input", icon: "fa-hashtag" },
  { value: "select", label: "Dropdown selection", icon: "fa-list" },
  {
    value: "checkbox",
    label: "Confirmation checkbox",
    icon: "fa-square-check",
  },
];

const requirementCategories = [
  "Identity",
  "Business registration",
  "Tax registration",
  "Property ownership",
  "Authorization",
  "Local permit",
  "Tourism compliance",
  "Health and safety",
  "Payout",
  "Other",
];

const sampleDocumentRequirements = [
  {
    key: "valid_government_id",
    name: "Valid government-issued ID",
    category: "Identity",
    profiles: [
      "individual_property_partner",
      "property_manager_authorized_representative",
    ],
    inputType: "file",
    required: true,
    hasExpiration: true,
    description:
      "Upload a clear front and back copy of a current government-issued photo ID.",
  },
  {
    key: "dti_sec_cda_registration",
    name: "DTI, SEC, or CDA registration",
    category: "Business registration",
    profiles: ["business_property_partner"],
    inputType: "file",
    required: true,
    hasExpiration: false,
    description:
      "Upload the applicable certificate of business or entity registration.",
  },
  {
    key: "bir_certificate_2303",
    name: "BIR Certificate of Registration",
    category: "Tax registration",
    profiles: ["business_property_partner"],
    inputType: "file",
    required: true,
    hasExpiration: false,
    description:
      "Upload the BIR Certificate of Registration, commonly BIR Form 2303.",
  },
  {
    key: "mayors_business_permit",
    name: "Mayor's or business permit",
    category: "Local permit",
    profiles: ["business_property_partner"],
    inputType: "file",
    required: true,
    hasExpiration: true,
    description:
      "Upload the current permit issued by the applicable local government unit.",
  },
  {
    key: "sanitary_permit",
    name: "Sanitary permit",
    category: "Health and safety",
    profiles: ["business_property_partner"],
    inputType: "file",
    required: true,
    hasExpiration: true,
    description:
      "Upload the current sanitary permit for the accommodation establishment, when applicable.",
  },
  {
    key: "dot_accreditation",
    name: "DOT accreditation",
    category: "Tourism compliance",
    profiles: ["business_property_partner"],
    inputType: "file",
    required: false,
    hasExpiration: true,
    description:
      "Upload the current Department of Tourism accreditation certificate, when applicable.",
  },
  {
    key: "fire_safety_inspection_certificate",
    name: "Fire Safety Inspection Certificate",
    category: "Health and safety",
    profiles: ["business_property_partner"],
    inputType: "file",
    required: false,
    hasExpiration: true,
    description:
      "Upload the current fire safety inspection certificate, when applicable.",
  },
  {
    key: "proof_of_property_ownership",
    name: "Proof of property ownership",
    category: "Property ownership",
    profiles: ["individual_property_partner", "business_property_partner"],
    inputType: "file",
    required: true,
    hasExpiration: false,
    description:
      "Upload a title, tax declaration, deed of sale, contract to sell, or equivalent ownership document.",
  },
  {
    key: "condominium_admin_approval",
    name: "Condominium or building approval",
    category: "Authorization",
    profiles: [
      "individual_property_partner",
      "business_property_partner",
      "property_manager_authorized_representative",
    ],
    inputType: "file",
    required: false,
    hasExpiration: true,
    description:
      "Upload building administration approval when the property requires permission for rental or transient use.",
  },
  {
    key: "property_management_agreement",
    name: "Property management agreement",
    category: "Authorization",
    profiles: ["property_manager_authorized_representative"],
    inputType: "file",
    required: true,
    hasExpiration: true,
    description:
      "Upload the signed agreement between the property owner and property manager.",
  },
  {
    key: "owner_authorization_or_spa",
    name: "Owner authorization letter or SPA",
    category: "Authorization",
    profiles: ["property_manager_authorized_representative"],
    inputType: "file",
    required: true,
    hasExpiration: true,
    description:
      "Upload an authorization letter or Special Power of Attorney showing authority to list or manage the property.",
  },
  {
    key: "bank_account_proof",
    name: "Bank account proof",
    category: "Payout",
    profiles: [
      "individual_property_partner",
      "business_property_partner",
      "property_manager_authorized_representative",
    ],
    inputType: "file",
    required: true,
    hasExpiration: false,
    description:
      "Upload a bank certificate, statement, or account confirmation showing the payout account name.",
  },
];

const defaultRequirementRecords = [
  {
    id: "REQ-001",
    code: "valid_government_id",
    name: "Valid government-issued ID",
    category: "Identity",
    inputType: "file",
    partnerProfiles: [
      "individual_property_partner",
      "property_manager_authorized_representative",
    ],
    country: "Philippines",
    description:
      "Upload a clear front and back copy of a current government-issued photo ID.",
    placeholder: "",
    required: true,
    conditional: false,
    acceptedTypes: ["pdf", "jpg", "jpeg", "png"],
    maximumFiles: 2,
    maximumSizeMb: 10,
    hasExpiration: true,
    minimumLength: null,
    maximumLength: null,
    minimumValue: null,
    maximumValue: null,
    selectOptions: [],
    status: "active",
    sortOrder: 1,
  },
  {
    id: "REQ-002",
    code: "business_registration_certificate",
    name: "DTI, SEC, or CDA registration",
    category: "Business registration",
    inputType: "file",
    partnerProfiles: ["business_property_partner"],
    country: "Philippines",
    description:
      "Upload the applicable certificate of business or entity registration.",
    placeholder: "",
    required: true,
    conditional: false,
    acceptedTypes: ["pdf", "jpg", "jpeg", "png"],
    maximumFiles: 1,
    maximumSizeMb: 10,
    hasExpiration: false,
    minimumLength: null,
    maximumLength: null,
    minimumValue: null,
    maximumValue: null,
    selectOptions: [],
    status: "active",
    sortOrder: 2,
  },
  {
    id: "REQ-003",
    code: "bir_certificate_2303",
    name: "BIR Certificate of Registration",
    category: "Tax registration",
    inputType: "file",
    partnerProfiles: ["business_property_partner"],
    country: "Philippines",
    description:
      "Upload the BIR Certificate of Registration, commonly BIR Form 2303.",
    placeholder: "",
    required: true,
    conditional: false,
    acceptedTypes: ["pdf", "jpg", "jpeg", "png"],
    maximumFiles: 1,
    maximumSizeMb: 10,
    hasExpiration: false,
    minimumLength: null,
    maximumLength: null,
    minimumValue: null,
    maximumValue: null,
    selectOptions: [],
    status: "active",
    sortOrder: 3,
  },
  {
    id: "REQ-004",
    code: "sanitary_permit",
    name: "Sanitary permit",
    category: "Health and safety",
    inputType: "file",
    partnerProfiles: ["business_property_partner"],
    country: "Philippines",
    description:
      "Upload the current sanitary permit for the accommodation establishment, when applicable.",
    placeholder: "",
    required: true,
    conditional: true,
    acceptedTypes: ["pdf", "jpg", "jpeg", "png"],
    maximumFiles: 1,
    maximumSizeMb: 10,
    hasExpiration: true,
    minimumLength: null,
    maximumLength: null,
    minimumValue: null,
    maximumValue: null,
    selectOptions: [],
    status: "active",
    sortOrder: 4,
  },
  {
    id: "REQ-005",
    code: "dot_accreditation",
    name: "DOT accreditation",
    category: "Tourism compliance",
    inputType: "file",
    partnerProfiles: ["business_property_partner"],
    country: "Philippines",
    description:
      "Upload the current Department of Tourism accreditation certificate, when applicable.",
    placeholder: "",
    required: false,
    conditional: true,
    acceptedTypes: ["pdf", "jpg", "jpeg", "png"],
    maximumFiles: 1,
    maximumSizeMb: 10,
    hasExpiration: true,
    minimumLength: null,
    maximumLength: null,
    minimumValue: null,
    maximumValue: null,
    selectOptions: [],
    status: "active",
    sortOrder: 5,
  },
];

let partners = structuredClone(initialPartners);
let requirementRecords = [];
let activeQuickFilter = "all";
let currentContent;

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const statusLabel = (status) =>
  ({
    pending: "Pending review",
    documents: "Documents requested",
    ready: "Ready to verify",
    verified: "Verified",
    restricted: "Restricted",
    escalated: "Escalated",
  })[status] || status;

const statusClass = (status) =>
  ({
    pending: "bg-blue-50 text-blue-700",
    documents: "bg-amber-50 text-amber-700",
    ready: "bg-emerald-50 text-emerald-700",
    verified: "bg-emerald-50 text-emerald-700",
    restricted: "bg-rose-50 text-rose-700",
    escalated: "bg-rose-50 text-rose-700",
  })[status] || "bg-slate-100 text-slate-700";

const reviewClass = (category) =>
  ({
    verification: "bg-indigo-50 text-indigo-700",
    business: "bg-amber-50 text-amber-700",
    payout: "bg-emerald-50 text-emerald-700",
  })[category] || "bg-slate-100 text-slate-700";

function filters() {
  return {
    search:
      currentContent
        .querySelector("[data-partner-search]")
        ?.value.trim()
        .toLowerCase() || "",
    status:
      currentContent.querySelector("[data-partner-status]")?.value || "all",
    type: currentContent.querySelector("[data-partner-type]")?.value || "all",
    country:
      currentContent.querySelector("[data-partner-country]")?.value || "all",
  };
}

function visiblePartners() {
  const values = filters();

  return partners.filter((partner) => {
    const search =
      `${partner.id} ${partner.name} ${partner.company} ${partner.email} ${partner.country} ${partner.review}`.toLowerCase();
    const matchesQuick =
      activeQuickFilter === "all" ||
      (activeQuickFilter === "assigned" && partner.reviewer === "You") ||
      (activeQuickFilter === "high-risk" && partner.priority === "high") ||
      partner.category === activeQuickFilter;

    return (
      matchesQuick &&
      (!values.search || search.includes(values.search)) &&
      (values.status === "all" || partner.status === values.status) &&
      (values.type === "all" || partner.type === values.type) &&
      (values.country === "all" || partner.country === values.country)
    );
  });
}

function renderRows() {
  const list = currentContent.querySelector("[data-partner-list]");
  const visible = visiblePartners();
  const count = currentContent.querySelector("[data-partner-visible-count]");
  const footer = currentContent.querySelector("[data-partner-footer-count]");

  if (count) {
    count.textContent = `${visible.length} ${visible.length === 1 ? "record" : "records"}`;
  }

  if (footer) {
    footer.textContent = visible.length;
  }

  if (!list) return;

  if (!visible.length) {
    list.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-14 text-center">
          <div class="mx-auto flex max-w-sm flex-col items-center">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <i class="fa-solid fa-filter-circle-xmark"></i>
            </span>
            <p class="mt-3 font-semibold text-slate-800">No partner records match these filters</p>
            <p class="mt-1 text-sm text-slate-500">Clear the filters or choose a different queue.</p>
            <button type="button" class="mt-4 partner-button partner-button-secondary" data-partner-action="clear-filters">
              Clear filters
            </button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  list.innerHTML = visible
    .map(
      (partner) => `
        <tr class="partner-queue-row">
          <td class="px-5 py-4 sm:px-6">
            <div class="flex items-start gap-3">
              <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                partner.priority === "high" ? "bg-rose-500" : "bg-indigo-500"
              }"></span>
              <div class="min-w-0">
                <p class="font-semibold text-slate-900">${escapeHtml(partner.name)}</p>
                <p class="mt-0.5 text-xs text-slate-500">${escapeHtml(partner.company)} · ${escapeHtml(partner.type)}</p>
                <p class="mt-1 text-xs text-slate-400">${escapeHtml(partner.id)} · ${escapeHtml(partner.email)} · ${escapeHtml(partner.submitted)}</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-4">
            <div class="flex flex-col items-start gap-1.5">
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${reviewClass(partner.category)}">${escapeHtml(partner.review)}</span>
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(partner.status)}">${escapeHtml(statusLabel(partner.status))}</span>
            </div>
          </td>
          <td class="px-5 py-4">
            <span class="font-medium ${partner.missingEvidence ? "text-rose-600" : "text-emerald-600"}">${escapeHtml(partner.evidence)}</span>
          </td>
          <td class="px-5 py-4"><span class="text-slate-700">${escapeHtml(partner.reviewer)}</span></td>
          <td class="px-5 py-4">
            <span class="font-semibold ${partner.priority === "high" ? "text-rose-600" : "text-slate-700"}">${escapeHtml(partner.risk)}</span>
          </td>
          <td class="px-5 py-4 text-right">
            <button type="button" class="partner-button partner-button-primary partner-row-action" data-partner-action="review" data-partner-id="${escapeHtml(partner.id)}">
              Review <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function updateSummary() {
  const totals = {
    open: partners.filter((partner) => partner.status !== "verified").length,
    risk: partners.filter(
      (partner) => partner.priority === "high" && partner.status !== "verified",
    ).length,
    documents: partners.filter(
      (partner) => partner.missingEvidence && partner.status !== "verified",
    ).length,
    ready: partners.filter((partner) => partner.status === "ready").length,
  };

  Object.entries(totals).forEach(([key, value]) => {
    const element = currentContent.querySelector(
      `[data-partner-summary="${key}"]`,
    );

    if (element) {
      element.textContent = value;
    }
  });
}

function setQuickFilter(filter) {
  activeQuickFilter = filter;

  currentContent.querySelectorAll("[data-partner-filter]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.partnerFilter === filter,
    );
  });

  renderRows();
}

function clearFilters() {
  const search = currentContent.querySelector("[data-partner-search]");
  const status = currentContent.querySelector("[data-partner-status]");
  const type = currentContent.querySelector("[data-partner-type]");
  const country = currentContent.querySelector("[data-partner-country]");

  if (search) search.value = "";
  if (status) status.value = "all";
  if (type) type.value = "all";
  if (country) country.value = "all";

  setQuickFilter("all");
}

function showNotice(message, tone = "success") {
  const notice = currentContent.querySelector("#partnerNotice");

  if (!notice) return;

  const toneClass =
    tone === "error"
      ? "bg-rose-50 text-rose-700"
      : "bg-emerald-50 text-emerald-700";

  notice.textContent = message;
  notice.className = `rounded-lg px-3 py-2 text-sm font-medium ${toneClass}`;

  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => {
    notice.classList.add("hidden");
  }, 5000);
}

function openAssignReviewer() {
  const visible = visiblePartners().filter(
    (partner) =>
      partner.reviewer === "Unassigned" && partner.status !== "verified",
  );

  const modal = openAdminModal({
    title: "Assign partner reviewer",
    content: `
      <form data-partner-assign-form class="space-y-5">
        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="font-semibold text-slate-900">Assign unassigned records in the current view</p>
          <p class="mt-1 text-sm text-slate-500">
            ${visible.length} ${visible.length === 1 ? "record is" : "records are"} ready to be assigned. Current filters are respected.
          </p>
        </div>

        <label class="block text-sm font-medium text-slate-700">
          Reviewer
          <select name="reviewer" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            <option value="You">You — Partner Operations</option>
            <option value="Legal Team">Legal Team</option>
            <option value="Compliance Team">Compliance Team</option>
            <option value="Finance Team">Finance Team</option>
          </select>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Assignment note
          <textarea name="note" class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Optional internal assignment note"></textarea>
        </label>

        <div class="flex justify-end gap-3">
          <button type="button" data-admin-modal-close class="partner-button partner-button-secondary">Cancel</button>
          <button type="submit" class="partner-button partner-button-primary">
            <i class="fa-solid fa-user-check"></i> Assign reviewer
          </button>
        </div>
      </form>
    `,
  });

  modal
    .querySelector("[data-partner-assign-form]")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const reviewer = new FormData(event.currentTarget).get("reviewer");

      visible.forEach((partner) => {
        partner.reviewer = reviewer;
      });

      closeAdminModal();
      renderRows();
      showNotice(
        `${visible.length} ${visible.length === 1 ? "record was" : "records were"} assigned to ${reviewer}.`,
      );
    });
}

function openReview(id) {
  const partner = partners.find((item) => item.id === id);

  if (!partner) return;

  const modal = openAdminModal({
    title: `Review · ${escapeHtml(partner.name)}`,
    size: "max-w-4xl",
    content: `
      <form data-partner-review-form class="space-y-6">
        <div class="grid gap-3 sm:grid-cols-2">
          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Partner</dt>
            <dd class="mt-1 font-semibold text-slate-900">${escapeHtml(partner.name)}</dd>
            <dd class="mt-1 text-sm text-slate-500">${escapeHtml(partner.company)}</dd>
          </dl>

          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</dt>
            <dd class="mt-1 font-semibold text-slate-900">${escapeHtml(partner.email)}</dd>
            <dd class="mt-1 text-sm text-slate-500">${escapeHtml(partner.country)} · ${escapeHtml(partner.id)}</dd>
          </dl>

          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Review requirement</dt>
            <dd class="mt-1 font-semibold text-slate-900">${escapeHtml(partner.review)}</dd>
            <dd class="mt-1 text-sm text-slate-500">${escapeHtml(partner.note)}</dd>
          </dl>

          <dl class="rounded-2xl border border-slate-200 p-4">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Evidence</dt>
            <dd class="mt-1 font-semibold ${partner.missingEvidence ? "text-rose-600" : "text-emerald-600"}">${escapeHtml(partner.evidence)}</dd>
            <dd class="mt-1 text-sm text-slate-500">Assigned to ${escapeHtml(partner.reviewer)}</dd>
          </dl>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Admin decision
            <select name="status" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
              <option value="pending" ${partner.status === "pending" ? "selected" : ""}>Keep in review</option>
              <option value="documents" ${partner.status === "documents" ? "selected" : ""}>Request documents</option>
              <option value="ready" ${partner.status === "ready" ? "selected" : ""}>Approve for verification</option>
              <option value="verified" ${partner.status === "verified" ? "selected" : ""}>Verify and enable access</option>
              <option value="restricted" ${partner.status === "restricted" ? "selected" : ""}>Restrict account access</option>
              <option value="escalated" ${partner.status === "escalated" ? "selected" : ""}>Escalate to compliance</option>
            </select>
          </label>

          <label class="block text-sm font-medium text-slate-700">
            Assign reviewer
            <select name="reviewer" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
              <option value="You" ${partner.reviewer === "You" ? "selected" : ""}>You — Partner Operations</option>
              <option value="Unassigned" ${partner.reviewer === "Unassigned" ? "selected" : ""}>Unassigned</option>
              <option value="Legal Team" ${partner.reviewer === "Legal Team" ? "selected" : ""}>Legal Team</option>
              <option value="Compliance Team" ${partner.reviewer === "Compliance Team" ? "selected" : ""}>Compliance Team</option>
              <option value="Finance Team" ${partner.reviewer === "Finance Team" ? "selected" : ""}>Finance Team</option>
            </select>
          </label>
        </div>

        <label class="block text-sm font-medium text-slate-700">
          Internal decision note
          <textarea name="note" required class="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Record the evidence reviewed and the decision rationale.">${escapeHtml(partner.note)}</textarea>
        </label>

        <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <input name="notify" type="checkbox" checked class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="text-slate-800">Notify the partner</strong><br>
            Send the verification decision and required next steps to the partner contact.
          </span>
        </label>

        <div class="flex flex-wrap justify-end gap-3">
          <button type="button" data-admin-modal-close class="partner-button partner-button-secondary">Cancel</button>
          <button type="submit" class="partner-button partner-button-primary">
            <i class="fa-solid fa-floppy-disk"></i> Save decision
          </button>
        </div>
      </form>
    `,
  });

  modal
    .querySelector("[data-partner-review-form]")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = new FormData(event.currentTarget);
      partner.status = form.get("status");
      partner.reviewer = form.get("reviewer");
      partner.note = form.get("note").trim();
      partner.missingEvidence =
        !["verified", "ready"].includes(partner.status) &&
        partner.evidence !== "Complete" &&
        partner.evidence !== "Account verified";

      closeAdminModal();
      updateSummary();
      renderRows();
      showNotice(
        `${partner.name} was updated to “${statusLabel(partner.status)}”.`,
      );
    });
}

function normalizeRequirementCode(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function generateRequirementId() {
  const highestNumber = requirementRecords.reduce((highest, requirement) => {
    const numericId = Number(String(requirement.id || "").replace(/\D/g, ""));
    return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
  }, 0);

  return `REQ-${String(highestNumber + 1).padStart(3, "0")}`;
}

function partnerProfileLabel(profile) {
  return (
    partnerProfileOptions.find((option) => option.value === profile)?.label ||
    profile
  );
}

function inputTypeMeta(inputType) {
  return (
    requirementInputTypes.find((option) => option.value === inputType) || {
      value: inputType,
      label: inputType,
      icon: "fa-clipboard-check",
    }
  );
}

function normalizeRequirementRecord(record) {
  const partnerProfiles = Array.isArray(record.partnerProfiles)
    ? record.partnerProfiles
    : Array.isArray(record.partner_profiles)
      ? record.partner_profiles
      : record.profile || record.partner_profile
        ? [record.profile || record.partner_profile]
        : [];

  const acceptedTypes = Array.isArray(record.acceptedTypes)
    ? record.acceptedTypes
    : Array.isArray(record.accepted_file_types)
      ? record.accepted_file_types
      : [];

  const selectOptions = Array.isArray(record.selectOptions)
    ? record.selectOptions
    : Array.isArray(record.select_options)
      ? record.select_options
      : [];

  return {
    id: String(record.id || generateRequirementId()),
    code: record.code || record.requirement_code || "",
    name: record.name || record.requirement_name || "",
    category: record.category || "Other",
    inputType: record.inputType || record.input_type || "file",
    partnerProfiles,
    country: record.country || "Philippines",
    description: record.description || "",
    placeholder: record.placeholder || "",
    required: Boolean(record.required ?? record.is_required ?? true),
    conditional: Boolean(record.conditional ?? record.is_conditional ?? false),
    acceptedTypes,
    maximumFiles: Number(record.maximumFiles ?? record.maximum_files ?? 1),
    maximumSizeMb: Number(
      record.maximumSizeMb ?? record.maximum_file_size_mb ?? 10,
    ),
    hasExpiration: Boolean(
      record.hasExpiration ?? record.requires_expiration_date ?? false,
    ),
    minimumLength: record.minimumLength ?? record.minimum_length ?? null,
    maximumLength: record.maximumLength ?? record.maximum_length ?? null,
    minimumValue: record.minimumValue ?? record.minimum_value ?? null,
    maximumValue: record.maximumValue ?? record.maximum_value ?? null,
    selectOptions,
    status: record.status || "active",
    sortOrder: Number(record.sortOrder ?? record.sort_order ?? 1),
  };
}

function readLocalRequirements() {
  try {
    const stored = window.localStorage.getItem(REQUIREMENTS_STORAGE_KEY);

    if (!stored) {
      return structuredClone(defaultRequirementRecords);
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return structuredClone(defaultRequirementRecords);
    }

    return parsed.map(normalizeRequirementRecord);
  } catch (error) {
    console.warn("Unable to read local partner requirements.", error);
    return structuredClone(defaultRequirementRecords);
  }
}

function writeLocalRequirements() {
  try {
    window.localStorage.setItem(
      REQUIREMENTS_STORAGE_KEY,
      JSON.stringify(requirementRecords),
    );
  } catch (error) {
    console.warn("Unable to save local partner requirements.", error);
  }
}

async function loadRequirementRecords() {
  try {
    const response = await fetch(PARTNER_REQUIREMENTS_API, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Requirements request failed with ${response.status}.`);
    }

    const payload = await response.json();
    const records =
      payload?.data?.requirements ||
      payload?.data ||
      payload?.requirements ||
      payload;

    if (!Array.isArray(records)) {
      throw new Error("Requirements response is not an array.");
    }

    requirementRecords = records.map(normalizeRequirementRecord);
    writeLocalRequirements();
    return { source: "api" };
  } catch (error) {
    console.warn(
      "Using locally stored partner requirement configurations.",
      error,
    );
    requirementRecords = readLocalRequirements();
    return { source: "local" };
  }
}

function requirementPayload(requirement) {
  return {
    code: requirement.code,
    name: requirement.name,
    category: requirement.category,
    inputType: requirement.inputType,
    partnerProfiles: requirement.partnerProfiles,
    country: requirement.country,
    description: requirement.description,
    placeholder: requirement.placeholder,
    required: requirement.required,
    conditional: requirement.conditional,
    acceptedTypes: requirement.acceptedTypes,
    maximumFiles: requirement.maximumFiles,
    maximumSizeMb: requirement.maximumSizeMb,
    hasExpiration: requirement.hasExpiration,
    minimumLength: requirement.minimumLength,
    maximumLength: requirement.maximumLength,
    minimumValue: requirement.minimumValue,
    maximumValue: requirement.maximumValue,
    selectOptions: requirement.selectOptions,
    status: requirement.status,
    sortOrder: requirement.sortOrder,
  };
}

async function persistRequirement(requirement, isExisting) {
  const temporaryId = requirement.id;

  try {
    const response = await fetch(
      isExisting
        ? `${PARTNER_REQUIREMENTS_API}/${encodeURIComponent(requirement.id)}`
        : PARTNER_REQUIREMENTS_API,
      {
        method: isExisting ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(requirementPayload(requirement)),
      },
    );

    if (!response.ok) {
      throw new Error(`Requirement save failed with ${response.status}.`);
    }

    let payload = {};

    if (response.status !== 204) {
      payload = await response.json();
    }

    const responseRecord = payload?.data || payload;
    const saved = normalizeRequirementRecord({
      ...requirement,
      ...(responseRecord && typeof responseRecord === "object"
        ? responseRecord
        : {}),
      id: responseRecord?.id || temporaryId,
    });

    return saved;
  } catch (error) {
    console.warn("Requirement saved in browser storage only.", error);
    return requirement;
  }
}

async function removeRequirement(requirementId) {
  try {
    const response = await fetch(
      `${PARTNER_REQUIREMENTS_API}/${encodeURIComponent(requirementId)}`,
      {
        method: "DELETE",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      },
    );

    if (!response.ok) {
      throw new Error(`Requirement delete failed with ${response.status}.`);
    }
  } catch (error) {
    console.warn("Requirement removed from browser storage only.", error);
  }
}

function statusBadgeClass(status) {
  return status === "active"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";
}

function requirementProfileSummary(requirement) {
  const labels = requirement.partnerProfiles.map(partnerProfileLabel);

  if (!labels.length) return "No profile selected";
  if (labels.length === partnerProfileOptions.length)
    return "All partner profiles";
  if (labels.length === 1) return labels[0];

  return `${labels[0]} +${labels.length - 1}`;
}

function renderRequirementRows(modal) {
  const list = modal.querySelector("[data-requirement-list]");
  const count = modal.querySelector("[data-requirement-count]");
  const empty = modal.querySelector("[data-requirement-empty]");
  const search =
    modal
      .querySelector("[data-requirement-search]")
      ?.value.trim()
      .toLowerCase() || "";
  const profile =
    modal.querySelector("[data-requirement-filter-profile]")?.value || "all";
  const inputType =
    modal.querySelector("[data-requirement-filter-input]")?.value || "all";
  const status =
    modal.querySelector("[data-requirement-filter-status]")?.value || "all";

  if (!list) return;

  const filtered = requirementRecords
    .filter((requirement) => {
      const searchable = [
        requirement.name,
        requirement.code,
        requirement.category,
        requirement.description,
        requirement.country,
        ...requirement.partnerProfiles.map(partnerProfileLabel),
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!search || searchable.includes(search)) &&
        (profile === "all" || requirement.partnerProfiles.includes(profile)) &&
        (inputType === "all" || requirement.inputType === inputType) &&
        (status === "all" || requirement.status === status)
      );
    })
    .sort(
      (a, b) =>
        Number(a.sortOrder || 0) - Number(b.sortOrder || 0) ||
        a.name.localeCompare(b.name),
    );

  if (count) {
    count.textContent = `${filtered.length} ${filtered.length === 1 ? "configuration" : "configurations"}`;
  }

  if (empty) {
    empty.classList.toggle("hidden", filtered.length > 0);
  }

  list.innerHTML = filtered
    .map((requirement) => {
      const inputMeta = inputTypeMeta(requirement.inputType);

      return `
        <tr class="border-b border-slate-100 last:border-0">
          <td class="px-4 py-4">
            <div class="flex items-start gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <i class="fa-solid ${escapeHtml(inputMeta.icon)}"></i>
              </span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="font-semibold text-slate-900">${escapeHtml(requirement.name)}</p>
                  ${
                    requirement.required
                      ? '<span class="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">Required</span>'
                      : '<span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">Optional</span>'
                  }
                  ${
                    requirement.conditional
                      ? '<span class="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Conditional</span>'
                      : ""
                  }
                </div>
                <p class="mt-1 font-mono text-xs text-slate-400">${escapeHtml(requirement.code)}</p>
                <p class="mt-1 max-w-xl text-xs leading-5 text-slate-500">${escapeHtml(requirement.description || "No partner instructions provided.")}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-4">
            <p class="font-medium text-slate-700">${escapeHtml(requirementProfileSummary(requirement))}</p>
            <p class="mt-1 text-xs text-slate-400">${escapeHtml(requirement.country)}</p>
          </td>
          <td class="px-4 py-4">
            <p class="font-medium text-slate-700">${escapeHtml(inputMeta.label)}</p>
            <p class="mt-1 text-xs text-slate-400">${escapeHtml(requirement.category)}</p>
          </td>
          <td class="px-4 py-4">
            <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(requirement.status)}">
              ${requirement.status === "active" ? "Active" : "Inactive"}
            </span>
          </td>
          <td class="px-4 py-4 text-right">
            <div class="flex justify-end gap-2">
              <button type="button" class="partner-button partner-button-secondary" data-requirement-action="edit" data-requirement-id="${escapeHtml(requirement.id)}">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
              <button type="button" class="partner-button partner-button-secondary text-rose-600" data-requirement-action="delete" data-requirement-id="${escapeHtml(requirement.id)}" aria-label="Delete ${escapeHtml(requirement.name)}">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function sampleRowsHtml() {
  return sampleDocumentRequirements
    .map(
      (sample) => `
        <tr class="border-b border-slate-100 last:border-0">
          <td class="px-4 py-3.5">
            <p class="font-semibold text-slate-800">${escapeHtml(sample.name)}</p>
            <p class="mt-1 text-xs text-slate-400">${escapeHtml(sample.category)}</p>
          </td>
          <td class="px-4 py-3.5 text-slate-600">${escapeHtml(inputTypeMeta(sample.inputType).label)}</td>
          <td class="px-4 py-3.5 text-slate-600">${escapeHtml(sample.profiles.map(partnerProfileLabel).join(", "))}</td>
          <td class="px-4 py-3.5">
            <div class="flex flex-wrap gap-1.5">
              <span class="rounded-full ${sample.required ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"} px-2 py-0.5 text-[11px] font-semibold">
                ${sample.required ? "Usually required" : "Conditional"}
              </span>
              ${
                sample.hasExpiration
                  ? '<span class="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Expiration date</span>'
                  : ""
              }
            </div>
          </td>
          <td class="px-4 py-3.5 text-right">
            <button type="button" class="partner-button partner-button-secondary" data-requirement-action="use-sample" data-sample-key="${escapeHtml(sample.key)}">
              <i class="fa-solid fa-plus"></i> Use sample
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function profileCheckboxesHtml(selectedProfiles) {
  return partnerProfileOptions
    .map(
      (profile) => `
        <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
          <input
            type="checkbox"
            name="partnerProfiles"
            value="${escapeHtml(profile.value)}"
            ${selectedProfiles.includes(profile.value) ? "checked" : ""}
            class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span class="text-sm font-medium text-slate-700">${escapeHtml(profile.label)}</span>
        </label>
      `,
    )
    .join("");
}

function requirementEditorHtml(requirement = null) {
  const record = requirement || {
    id: "",
    code: "",
    name: "",
    category: "Local permit",
    inputType: "file",
    partnerProfiles: ["business_property_partner"],
    country: "Philippines",
    description: "",
    placeholder: "",
    required: true,
    conditional: false,
    acceptedTypes: ["pdf", "jpg", "jpeg", "png"],
    maximumFiles: 1,
    maximumSizeMb: 10,
    hasExpiration: false,
    minimumLength: null,
    maximumLength: null,
    minimumValue: null,
    maximumValue: null,
    selectOptions: [],
    status: "active",
    sortOrder: requirementRecords.length + 1,
  };

  return `
    <form data-requirement-editor-form class="space-y-6">
      <input type="hidden" name="id" value="${escapeHtml(record.id)}">

      <section class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
        <div class="flex items-start gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <i class="fa-solid fa-sliders"></i>
          </span>
          <div>
            <h3 class="font-semibold text-slate-900">Define a verification input</h3>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Configure the field that BOMO will display to the partner. This screen does not collect or upload the actual document.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="font-semibold text-slate-900">Applicable partner profiles</h3>
            <p class="mt-1 text-sm text-slate-500">Select one or more profiles that must see this input.</p>
          </div>
        </div>
        <div class="mt-3 grid gap-3 md:grid-cols-3">
          ${profileCheckboxesHtml(record.partnerProfiles)}
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-3">
        <label class="block text-sm font-medium text-slate-700">
          Country or ruleset
          <select name="country" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            <option value="Philippines" ${record.country === "Philippines" ? "selected" : ""}>Philippines</option>
            <option value="Singapore" ${record.country === "Singapore" ? "selected" : ""}>Singapore</option>
            <option value="Australia" ${record.country === "Australia" ? "selected" : ""}>Australia</option>
            <option value="All countries" ${record.country === "All countries" ? "selected" : ""}>All countries</option>
          </select>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Category
          <select name="category" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            ${requirementCategories
              .map(
                (category) => `
                  <option value="${escapeHtml(category)}" ${record.category === category ? "selected" : ""}>${escapeHtml(category)}</option>
                `,
              )
              .join("")}
          </select>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Input type
          <select name="inputType" required data-requirement-input-type class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            ${requirementInputTypes
              .map(
                (input) => `
                  <option value="${escapeHtml(input.value)}" ${record.inputType === input.value ? "selected" : ""}>${escapeHtml(input.label)}</option>
                `,
              )
              .join("")}
          </select>
        </label>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <label class="block text-sm font-medium text-slate-700">
          Field or document name
          <input type="text" name="name" required value="${escapeHtml(record.name)}" placeholder="Example: DOT Accreditation" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
        </label>

        <label class="block text-sm font-medium text-slate-700">
          System code
          <input type="text" name="code" required value="${escapeHtml(record.code)}" placeholder="dot_accreditation" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          <span class="mt-1 block text-xs text-slate-400">Unique lowercase code. Spaces become underscores.</span>
        </label>
      </section>

      <label class="block text-sm font-medium text-slate-700">
        Instructions shown to partner
        <textarea name="description" class="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Example: Upload the current certificate issued by the Department of Tourism.">${escapeHtml(record.description)}</textarea>
      </label>

      <label data-setting="placeholder" class="block text-sm font-medium text-slate-700">
        Placeholder or example
        <input type="text" name="placeholder" value="${escapeHtml(record.placeholder)}" placeholder="Example value shown inside the input" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
      </label>

      <section data-setting="file" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 class="font-semibold text-slate-900">File input settings</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Maximum files
            <input type="number" name="maximumFiles" min="1" max="20" value="${escapeHtml(record.maximumFiles)}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Maximum size per file
            <div class="relative mt-2">
              <input type="number" name="maximumSizeMb" min="1" max="100" value="${escapeHtml(record.maximumSizeMb)}" class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">MB</span>
            </div>
          </label>
        </div>

        <fieldset class="mt-4">
          <legend class="text-sm font-medium text-slate-700">Accepted file formats</legend>
          <div class="mt-3 flex flex-wrap gap-3">
            ${["pdf", "jpg", "jpeg", "png"]
              .map(
                (type) => `
                  <label class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <input type="checkbox" name="acceptedTypes" value="${type}" ${record.acceptedTypes.includes(type) ? "checked" : ""} class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    ${type.toUpperCase()}
                  </label>
                `,
              )
              .join("")}
          </div>
        </fieldset>

        <label class="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <input type="checkbox" name="hasExpiration" ${record.hasExpiration ? "checked" : ""} class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="block text-sm text-slate-800">Also ask for expiration date</strong>
            <span class="mt-1 block text-xs leading-5 text-slate-500">The generated partner form will add an expiration-date input beside this file.</span>
          </span>
        </label>
      </section>

      <section data-setting="text" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 class="font-semibold text-slate-900">Text validation</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Minimum characters
            <input type="number" name="minimumLength" min="0" value="${escapeHtml(record.minimumLength ?? "")}" placeholder="0" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Maximum characters
            <input type="number" name="maximumLength" min="1" value="${escapeHtml(record.maximumLength ?? "")}" placeholder="255" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
        </div>
      </section>

      <section data-setting="number" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 class="font-semibold text-slate-900">Number validation</h3>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="block text-sm font-medium text-slate-700">
            Minimum value
            <input type="number" name="minimumValue" value="${escapeHtml(record.minimumValue ?? "")}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
          <label class="block text-sm font-medium text-slate-700">
            Maximum value
            <input type="number" name="maximumValue" value="${escapeHtml(record.maximumValue ?? "")}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
          </label>
        </div>
      </section>

      <label data-setting="select" class="block text-sm font-medium text-slate-700">
        Dropdown options
        <textarea name="selectOptions" class="mt-2 min-h-32 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" placeholder="Enter one option per line">${escapeHtml(record.selectOptions.join("\n"))}</textarea>
        <span class="mt-1 block text-xs text-slate-400">Enter one option per line.</span>
      </label>

      <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label class="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
          <input type="checkbox" name="required" ${record.required ? "checked" : ""} class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="block text-sm text-slate-800">Required</strong>
            <span class="mt-1 block text-xs leading-5 text-slate-500">Partner cannot complete verification without this input.</span>
          </span>
        </label>

        <label class="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
          <input type="checkbox" name="conditional" ${record.conditional ? "checked" : ""} class="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          <span>
            <strong class="block text-sm text-slate-800">Conditional</strong>
            <span class="mt-1 block text-xs leading-5 text-slate-500">Displayed only when applicable to the partner or property.</span>
          </span>
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Display order
          <input type="number" name="sortOrder" required min="1" value="${escapeHtml(record.sortOrder)}" class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Status
          <select name="status" required class="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
            <option value="active" ${record.status === "active" ? "selected" : ""}>Active</option>
            <option value="inactive" ${record.status === "inactive" ? "selected" : ""}>Inactive</option>
          </select>
        </label>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="font-semibold text-slate-900">Partner form preview</h3>
            <p class="mt-1 text-sm text-slate-500">Preview of the input generated from this configuration.</p>
          </div>
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Preview only</span>
        </div>
        <div data-requirement-preview class="mt-4"></div>
      </section>

      <div data-requirement-form-error class="hidden rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"></div>

      <div class="flex flex-wrap justify-end gap-3">
        <button type="button" data-requirement-editor-cancel class="partner-button partner-button-secondary">Cancel</button>
        <button type="submit" data-requirement-save class="partner-button partner-button-primary">
          <i class="fa-solid fa-floppy-disk"></i> Save input configuration
        </button>
      </div>
    </form>
  `;
}

function toggleRequirementSettings(form) {
  const inputType = form.querySelector("[data-requirement-input-type]")?.value;

  form
    .querySelector('[data-setting="file"]')
    ?.classList.toggle("hidden", inputType !== "file");

  form
    .querySelector('[data-setting="text"]')
    ?.classList.toggle("hidden", !["text", "textarea"].includes(inputType));

  form
    .querySelector('[data-setting="number"]')
    ?.classList.toggle("hidden", inputType !== "number");

  form
    .querySelector('[data-setting="select"]')
    ?.classList.toggle("hidden", inputType !== "select");

  form
    .querySelector('[data-setting="placeholder"]')
    ?.classList.toggle("hidden", inputType === "checkbox");
}

function readEditorDraft(form) {
  const formData = new FormData(form);
  const inputType = formData.get("inputType") || "file";

  return {
    name: formData.get("name")?.trim() || "Verification requirement",
    description: formData.get("description")?.trim() || "",
    placeholder: formData.get("placeholder")?.trim() || "",
    inputType,
    required: formData.has("required"),
    acceptedTypes: formData.getAll("acceptedTypes"),
    maximumFiles: Number(formData.get("maximumFiles") || 1),
    hasExpiration: formData.has("hasExpiration"),
    selectOptions: String(formData.get("selectOptions") || "")
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean),
  };
}

function renderRequirementPreview(form) {
  const preview = form.querySelector("[data-requirement-preview]");

  if (!preview) return;

  const draft = readEditorDraft(form);
  const requiredMark = draft.required
    ? '<span class="ml-1 text-rose-500">*</span>'
    : '<span class="ml-2 text-xs font-normal text-slate-400">Optional</span>';

  let inputHtml = "";

  if (draft.inputType === "file") {
    inputHtml = `
      <div class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <div class="flex items-center gap-3">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
            <i class="fa-solid fa-cloud-arrow-up"></i>
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-700">Choose ${draft.maximumFiles > 1 ? `up to ${draft.maximumFiles} files` : "a file"}</p>
            <p class="mt-0.5 text-xs text-slate-400">${escapeHtml((draft.acceptedTypes.length ? draft.acceptedTypes : ["pdf", "jpg", "png"]).join(", ").toUpperCase())}</p>
          </div>
        </div>
      </div>
      ${
        draft.hasExpiration
          ? '<input type="date" disabled class="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">'
          : ""
      }
    `;
  } else if (draft.inputType === "textarea") {
    inputHtml = `<textarea disabled class="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm" placeholder="${escapeHtml(draft.placeholder)}"></textarea>`;
  } else if (draft.inputType === "select") {
    inputHtml = `
      <select disabled class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
        <option>${draft.selectOptions.length ? "Select an option" : "No options configured"}</option>
        ${draft.selectOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join("")}
      </select>
    `;
  } else if (draft.inputType === "checkbox") {
    inputHtml = `
      <label class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <input type="checkbox" disabled class="mt-0.5 h-4 w-4 rounded border-slate-300">
        <span>${escapeHtml(draft.description || draft.name)}</span>
      </label>
    `;
  } else {
    inputHtml = `<input type="${escapeHtml(draft.inputType)}" disabled class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm" placeholder="${escapeHtml(draft.placeholder)}">`;
  }

  preview.innerHTML = `
    <label class="block text-sm font-medium text-slate-700">
      ${escapeHtml(draft.name)}${requiredMark}
      ${draft.inputType === "checkbox" ? "" : `<div class="mt-2">${inputHtml}</div>`}
    </label>
    ${draft.inputType === "checkbox" ? `<div class="mt-2">${inputHtml}</div>` : ""}
    ${
      draft.description && draft.inputType !== "checkbox"
        ? `<p class="mt-2 text-xs leading-5 text-slate-400">${escapeHtml(draft.description)}</p>`
        : ""
    }
  `;
}

function requirementFromForm(form) {
  const formData = new FormData(form);
  const inputType = formData.get("inputType");
  const id = formData.get("id") || generateRequirementId();
  const partnerProfiles = formData.getAll("partnerProfiles");

  return {
    id,
    code: normalizeRequirementCode(formData.get("code")),
    name: formData.get("name")?.trim() || "",
    category: formData.get("category"),
    inputType,
    partnerProfiles,
    country: formData.get("country"),
    description: formData.get("description")?.trim() || "",
    placeholder: formData.get("placeholder")?.trim() || "",
    required: formData.has("required"),
    conditional: formData.has("conditional"),
    acceptedTypes: inputType === "file" ? formData.getAll("acceptedTypes") : [],
    maximumFiles:
      inputType === "file" ? Number(formData.get("maximumFiles") || 1) : null,
    maximumSizeMb:
      inputType === "file" ? Number(formData.get("maximumSizeMb") || 10) : null,
    hasExpiration: inputType === "file" && formData.has("hasExpiration"),
    minimumLength:
      ["text", "textarea"].includes(inputType) &&
      formData.get("minimumLength") !== ""
        ? Number(formData.get("minimumLength"))
        : null,
    maximumLength:
      ["text", "textarea"].includes(inputType) &&
      formData.get("maximumLength") !== ""
        ? Number(formData.get("maximumLength"))
        : null,
    minimumValue:
      inputType === "number" && formData.get("minimumValue") !== ""
        ? Number(formData.get("minimumValue"))
        : null,
    maximumValue:
      inputType === "number" && formData.get("maximumValue") !== ""
        ? Number(formData.get("maximumValue"))
        : null,
    selectOptions:
      inputType === "select"
        ? String(formData.get("selectOptions") || "")
            .split("\n")
            .map((option) => option.trim())
            .filter(Boolean)
        : [],
    status: formData.get("status"),
    sortOrder: Number(formData.get("sortOrder") || 1),
  };
}

function validateRequirement(requirement) {
  if (!requirement.partnerProfiles.length) {
    return "Select at least one applicable partner profile.";
  }

  if (!requirement.name) {
    return "Enter a field or document name.";
  }

  if (!requirement.code) {
    return "Enter a valid system code.";
  }

  const duplicate = requirementRecords.find(
    (record) =>
      record.code === requirement.code &&
      record.country === requirement.country &&
      record.id !== requirement.id,
  );

  if (duplicate) {
    return "This system code already exists for the selected country or ruleset.";
  }

  if (requirement.inputType === "file" && !requirement.acceptedTypes.length) {
    return "Select at least one accepted file format.";
  }

  if (requirement.inputType === "select" && !requirement.selectOptions.length) {
    return "Enter at least one dropdown option.";
  }

  if (
    requirement.minimumLength !== null &&
    requirement.maximumLength !== null &&
    requirement.minimumLength > requirement.maximumLength
  ) {
    return "Minimum characters cannot exceed maximum characters.";
  }

  if (
    requirement.minimumValue !== null &&
    requirement.maximumValue !== null &&
    requirement.minimumValue > requirement.maximumValue
  ) {
    return "Minimum value cannot exceed maximum value.";
  }

  return "";
}

function showRequirementEditor(modal, requirement = null) {
  const managerPanel = modal.querySelector("[data-requirement-manager-panel]");
  const editorPanel = modal.querySelector("[data-requirement-editor-panel]");

  if (!managerPanel || !editorPanel) return;

  managerPanel.classList.add("hidden");
  editorPanel.classList.remove("hidden");
  editorPanel.innerHTML = requirementEditorHtml(requirement);

  const form = editorPanel.querySelector("[data-requirement-editor-form]");
  const nameInput = form?.querySelector('[name="name"]');
  const codeInput = form?.querySelector('[name="code"]');
  const inputType = form?.querySelector("[data-requirement-input-type]");
  const cancel = form?.querySelector("[data-requirement-editor-cancel]");

  if (!form) return;

  let codeManuallyEdited = Boolean(requirement?.code);

  codeInput?.addEventListener("input", () => {
    codeManuallyEdited = true;
    codeInput.value = normalizeRequirementCode(codeInput.value);
  });

  nameInput?.addEventListener("input", () => {
    if (!codeManuallyEdited && codeInput) {
      codeInput.value = normalizeRequirementCode(nameInput.value);
    }
  });

  inputType?.addEventListener("change", () => {
    toggleRequirementSettings(form);
    renderRequirementPreview(form);
  });

  form.addEventListener("input", () => renderRequirementPreview(form));
  form.addEventListener("change", () => renderRequirementPreview(form));

  cancel?.addEventListener("click", () => {
    editorPanel.classList.add("hidden");
    editorPanel.innerHTML = "";
    managerPanel.classList.remove("hidden");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const errorElement = form.querySelector("[data-requirement-form-error]");
    const saveButton = form.querySelector("[data-requirement-save]");
    const requirementData = requirementFromForm(form);
    const validationError = validateRequirement(requirementData);

    errorElement?.classList.add("hidden");

    if (validationError) {
      if (errorElement) {
        errorElement.textContent = validationError;
        errorElement.classList.remove("hidden");
      }
      return;
    }

    const existingIndex = requirementRecords.findIndex(
      (record) => record.id === requirementData.id,
    );
    const isExisting = existingIndex >= 0;

    if (saveButton) {
      saveButton.disabled = true;
      saveButton.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
    }

    const saved = await persistRequirement(requirementData, isExisting);

    if (isExisting) {
      requirementRecords[existingIndex] = saved;
    } else {
      requirementRecords.push(saved);
    }

    writeLocalRequirements();
    editorPanel.classList.add("hidden");
    editorPanel.innerHTML = "";
    managerPanel.classList.remove("hidden");
    renderRequirementRows(modal);
    showNotice(`${saved.name} was saved as a verification input.`);
  });

  toggleRequirementSettings(form);
  renderRequirementPreview(form);
}

function sampleToRequirement(sample) {
  return {
    id: "",
    code: sample.key,
    name: sample.name,
    category: sample.category,
    inputType: sample.inputType,
    partnerProfiles: [...sample.profiles],
    country: "Philippines",
    description: sample.description,
    placeholder: "",
    required: sample.required,
    conditional: !sample.required,
    acceptedTypes: ["pdf", "jpg", "jpeg", "png"],
    maximumFiles: sample.key === "valid_government_id" ? 2 : 1,
    maximumSizeMb: 10,
    hasExpiration: sample.hasExpiration,
    minimumLength: null,
    maximumLength: null,
    minimumValue: null,
    maximumValue: null,
    selectOptions: [],
    status: "active",
    sortOrder: requirementRecords.length + 1,
  };
}

async function openRequirementsManager() {
  const modal = openAdminModal({
    title: "Partner verification inputs",
    size: "max-w-7xl",
    content: `
      <div data-requirement-manager-panel class="space-y-6">
        <section class="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-start gap-3">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <i class="fa-solid fa-list-check"></i>
              </span>
              <div>
                <h3 class="font-semibold text-slate-900">Verification form configuration</h3>
                <p class="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Define the fields and document uploads that partners must complete. These configurations generate the partner-facing verification form; this screen does not collect partner submissions.
                </p>
              </div>
            </div>
            <button type="button" class="partner-button partner-button-primary" data-requirement-action="add">
              <i class="fa-solid fa-plus"></i> Add input
            </button>
          </div>
        </section>

        <details class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 bg-slate-50 px-5 py-4">
            <div>
              <h3 class="font-semibold text-slate-900">Sample Philippine document inputs</h3>
              <p class="mt-1 text-sm text-slate-500">Reference examples only. Select Use sample to prefill a new configuration.</p>
            </div>
            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
              <i class="fa-solid fa-chevron-down"></i>
            </span>
          </summary>
          <div class="overflow-x-auto border-t border-slate-100">
            <table class="min-w-[1050px] w-full text-left text-sm">
              <thead class="border-b border-slate-100 bg-white text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th class="px-4 py-3.5">Sample document</th>
                  <th class="px-4 py-3.5">Input</th>
                  <th class="px-4 py-3.5">Applicable partner</th>
                  <th class="px-4 py-3.5">Suggested rule</th>
                  <th class="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>${sampleRowsHtml()}</tbody>
            </table>
          </div>
        </details>

        <section class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_15rem_13rem_10rem]">
          <label class="relative block">
            <span class="sr-only">Search requirement configurations</span>
            <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
            <input type="search" data-requirement-search class="bomo-input h-11 w-full pl-10" placeholder="Search field, document, code, or category...">
          </label>

          <label>
            <span class="sr-only">Filter by partner profile</span>
            <select data-requirement-filter-profile class="bomo-input h-11 w-full">
              <option value="all">All partner profiles</option>
              ${partnerProfileOptions.map((profile) => `<option value="${escapeHtml(profile.value)}">${escapeHtml(profile.label)}</option>`).join("")}
            </select>
          </label>

          <label>
            <span class="sr-only">Filter by input type</span>
            <select data-requirement-filter-input class="bomo-input h-11 w-full">
              <option value="all">All input types</option>
              ${requirementInputTypes.map((input) => `<option value="${escapeHtml(input.value)}">${escapeHtml(input.label)}</option>`).join("")}
            </select>
          </label>

          <label>
            <span class="sr-only">Filter by status</span>
            <select data-requirement-filter-status class="bomo-input h-11 w-full">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </section>

        <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div class="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-semibold text-slate-900">Configured partner inputs</h3>
              <p class="mt-1 text-sm text-slate-500">Active records are used to build the partner verification requirements form.</p>
            </div>
            <span data-requirement-count class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">0 configurations</span>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-[1050px] w-full text-left text-sm">
              <thead class="border-b border-slate-100 bg-white text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th class="px-4 py-3.5">Requirement input</th>
                  <th class="px-4 py-3.5">Partner profile</th>
                  <th class="px-4 py-3.5">Input needed</th>
                  <th class="px-4 py-3.5">Status</th>
                  <th class="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody data-requirement-list>
                <tr>
                  <td colspan="5" class="px-6 py-14 text-center">
                    <i class="fa-solid fa-circle-notch fa-spin text-xl text-indigo-600"></i>
                    <p class="mt-3 text-sm font-medium text-slate-600">Loading input configurations...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div data-requirement-empty class="hidden px-6 py-14 text-center">
            <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <i class="fa-solid fa-folder-open"></i>
            </span>
            <p class="mt-3 font-semibold text-slate-800">No configurations found</p>
            <p class="mt-1 text-sm text-slate-500">Add an input or change the selected filters.</p>
          </div>
        </section>

        <div class="flex justify-end">
          <button type="button" data-admin-modal-close class="partner-button partner-button-secondary">Close</button>
        </div>
      </div>

      <div data-requirement-editor-panel class="hidden"></div>
    `,
  });

  const controls = modal.querySelectorAll(
    "[data-requirement-search], [data-requirement-filter-profile], [data-requirement-filter-input], [data-requirement-filter-status]",
  );

  const source = await loadRequirementRecords();
  renderRequirementRows(modal);

  const sourceMessage =
    source.source === "api"
      ? "Requirements loaded from the database."
      : "Requirements API was unavailable. Browser storage is being used for this session.";

  if (source.source !== "api") {
    showNotice(sourceMessage, "error");
  }

  controls.forEach((control) => {
    const eventName = control.matches('input[type="search"]')
      ? "input"
      : "change";
    control.addEventListener(eventName, () => renderRequirementRows(modal));
  });

  modal.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-requirement-action]");

    if (!button || !modal.contains(button)) return;

    const action = button.dataset.requirementAction;

    if (action === "add") {
      showRequirementEditor(modal);
      return;
    }

    if (action === "use-sample") {
      const sample = sampleDocumentRequirements.find(
        (item) => item.key === button.dataset.sampleKey,
      );

      if (sample) {
        showRequirementEditor(modal, sampleToRequirement(sample));
      }
      return;
    }

    const requirement = requirementRecords.find(
      (record) => record.id === button.dataset.requirementId,
    );

    if (!requirement) return;

    if (action === "edit") {
      showRequirementEditor(modal, requirement);
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(
        `Delete “${requirement.name}”? It will no longer be used to generate new partner verification forms.`,
      );

      if (!confirmed) return;

      await removeRequirement(requirement.id);
      requirementRecords = requirementRecords.filter(
        (record) => record.id !== requirement.id,
      );
      writeLocalRequirements();
      renderRequirementRows(modal);
      showNotice(`${requirement.name} was deleted.`);
    }
  });
}

function ensureRequirementsButtonBinding() {
  const explicitButton = currentContent.querySelector(
    '[data-partner-action="requirements"]',
  );

  if (explicitButton) return;

  const possibleButton = Array.from(
    currentContent.querySelectorAll("button"),
  ).find((button) =>
    button.textContent.trim().toLowerCase().includes("requirements"),
  );

  if (possibleButton) {
    possibleButton.dataset.partnerAction = "requirements";
  }
}

function handleClick(event) {
  const control = event.target.closest("[data-partner-action]");

  if (!control || !currentContent.contains(control)) return;

  const {
    partnerAction: action,
    partnerFilter: filter,
    partnerId: id,
  } = control.dataset;

  if (action === "filter") setQuickFilter(filter);
  if (action === "clear-filters") clearFilters();
  if (action === "assign-reviewer") openAssignReviewer();
  if (action === "review") openReview(id);
  if (action === "requirements") openRequirementsManager();
}

export default function initializePartners() {
  currentContent = document.getElementById("admin-content-module");

  if (!currentContent) return;

  ensureRequirementsButtonBinding();
  currentContent.addEventListener("click", handleClick);
  currentContent
    .querySelector("[data-partner-search]")
    ?.addEventListener("input", renderRows);

  currentContent
    .querySelectorAll(
      "[data-partner-status], [data-partner-type], [data-partner-country]",
    )
    .forEach((control) => control.addEventListener("change", renderRows));

  updateSummary();
  renderRows();
}
