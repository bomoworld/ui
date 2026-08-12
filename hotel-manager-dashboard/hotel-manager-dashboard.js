let currentModule = null;
let isLoadingModule = false;

 const DEFAULT_PAGE = "dashboard";

const VALID_PAGES = [
  "dashboard",
  "calendar",
  "bookings",
  "property",
  "rooms",
  "housekeeping",
  "revenue",
  "payouts",
  "reports",
  "promotions",
  "reviews",
  "messages",
  "profile",
  "verification",
  "settings", 
];


async function loadDashboardModule(
  moduleName
) {
  if (
    isLoadingModule ||
    currentModule === moduleName
  ) {
    return;
  }

  isLoadingModule = true;

  const content =
    document.getElementById(
      "dashboardContent"
    );

  if (!content) {
    isLoadingModule = false;
    return;
  }

  currentModule = moduleName;

  content.innerHTML = `
    <div class="flex items-center justify-center py-24">
      <div class="text-center">
        <i
          class="fa-solid fa-spinner fa-spin text-3xl text-orange-500"
        ></i>

        <p class="mt-3 text-slate-500">
          Loading...
        </p>
      </div>
    </div>
  `;

  try {
    const response = await fetch(
      `hotel-manager-dashboard/pages/${moduleName}.html`,
      {
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Module not found: ${moduleName}`
      );
    }

    const html =
      await response.text();

    content.innerHTML = html;

    if (
      typeof updateActiveNavigation ===
      "function"
    ) {
      updateActiveNavigation(
        moduleName
      );
    }

    if (
      typeof executeModuleScripts ===
      "function"
    ) {
      executeModuleScripts(
        content
      );
    }

    if (
      moduleName === "settings" &&
      typeof initSettingsPage ===
        "function"
    ) {
      initSettingsPage();
    }

   if (
  moduleName === "verification" &&
  typeof initVerificationType ===
    "function"
) {
  setTimeout(
    initVerificationType,
    200
  );
}

    if (
      typeof initSidebarNavigation ===
      "function"
    ) {
      initSidebarNavigation();
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.error(error);

    currentModule = null;

    content.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-3xl p-8">
        <h3 class="font-bold text-red-600 mb-2">
          Module Load Error
        </h3>

        <p class="text-slate-600">
          Unable to load:
          ${moduleName}.html
        </p>
      </div>
    `;
  } finally {
    isLoadingModule = false;
  }
}

function updateActiveNavigation(
  page,
) {
  document
    .querySelectorAll(
      ".dashboard-nav",
    )
    .forEach((nav) => {
      nav.classList.remove(
        "active",
      );

      if (
        nav.dataset.page === page
      ) {
        nav.classList.add(
          "active",
        );
      }
    });
}

async function loadSettingsPage(page) {
  console.log("Loading settings:", page);

  try {
    const url =
      `hotel-manager-dashboard/pages/settings/${page}.html`;

    console.log(url);

    const response = await fetch(url);

    console.log(response.status);

    const html = await response.text();

    document.getElementById(
      "settingsContent"
    ).innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

async function loadModuleFromUrl() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const page =
    params.get("page") ||
    DEFAULT_PAGE;

  await loadDashboardModule(
    page
  );
}

function executeModuleScripts(
  container
) {
  const scripts =
    container.querySelectorAll(
      "script"
    );

  scripts.forEach((oldScript) => {
    const newScript =
      document.createElement(
        "script"
      );

    Array.from(
      oldScript.attributes
    ).forEach((attr) => {
      newScript.setAttribute(
        attr.name,
        attr.value
      );
    });

    newScript.textContent =
      oldScript.textContent;

    oldScript.parentNode.replaceChild(
      newScript,
      oldScript
    );
  });
}

function initSidebarNavigation() {
  document
    .querySelectorAll(
      ".dashboard-nav",
    )
    .forEach((nav) => {
      nav.addEventListener(
        "click",
        (e) => {
          e.preventDefault();

          const page =
            nav.dataset.page;

          if (!page) return;

          const url =
            new URL(
              window.location,
            );

          url.searchParams.set(
            "page",
            page,
          );

          
          history.pushState(
          {
            page,
          },
          "",
          url,
        );

        loadDashboardModule(
          page,
        );

          if (window.innerWidth < 1024) {
            const sidebar =
              document.getElementById(
                "dashboardSidebar"
              );

            const backdrop =
              document.getElementById(
                "sidebarBackdrop"
              );

            sidebar?.classList.add(
              "-translate-x-full"
            );

            backdrop?.classList.add(
              "hidden"
            );

            localStorage.setItem(
              "bomo_sidebar_hidden",
              "true"
            );
          }
        },
      );
    });
}
 
window.addEventListener(
  "popstate",
  () => {
    loadModuleFromUrl();
  },
);

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await loadModuleFromUrl();

    setTimeout(() => {
      initializeSidebar();
      initSidebarNavigation();
    }, 100);
  }
);

window.dashboard = {
  loadDashboardModule,
};

function initSettingsPage() {
  const tabs = document.querySelectorAll(
    ".settings-tab"
  );

  if (!tabs.length) {
    console.log(
      "Settings tabs not found"
    );
    return;
  }

  tabs.forEach((tab) => {
    tab.onclick = () => {
      loadSettingsTab(
        tab.dataset.tab
      );
    };
  });

  loadSettingsTab("profile");
}
 
async function loadSettingsTab(page) {
  try {
    const url = new URL(window.location);

    url.searchParams.set("page", "settings");
    url.hash = page;

    history.replaceState(
      {
        page: "settings",
        tab: page
      },
      "",
      url
    );

    const response = await fetch(
      `hotel-manager-dashboard/pages/settings/${page}.html`,
      {
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Settings page not found: ${page}`
      );
    }

    const html = await response.text();

    const settingsContent =
      document.getElementById(
        "settingsContent"
      );

    if (!settingsContent) {
      return;
    }

    settingsContent.innerHTML = html;

    executeModuleScripts(
      settingsContent
    );

    updateSettingsTabUI(page);

    if (page === "profile") {
      setTimeout(() => {
        initPartnerProfilePage();
      }, 50);
    }
  } catch (error) {
    console.error(error);
  }
}
function updateSettingsTabUI(
  page
) {
  document
    .querySelectorAll(
      ".settings-tab"
    )
    .forEach((tab) => {
      tab.classList.remove(
        "bg-orange-500",
        "text-white"
      );

      tab.classList.add(
        "hover:bg-slate-100"
      );
    });

  const activeTab =
    document.querySelector(
      `.settings-tab[data-tab="${page}"]`
    );

  if (!activeTab) return;

  activeTab.classList.add(
    "bg-orange-500",
    "text-white"
  );

  activeTab.classList.remove(
    "hover:bg-slate-100"
  );
}

function initPartnerProfilePage() {
  const partnerType =
    document.getElementById(
      "partnerType"
    );

  if (!partnerType) {
    console.error(
      "partnerType not found"
    );
    return;
  }

  const businessSection =
    document.getElementById(
      "businessSection"
    );

  const representativeSection =
    document.getElementById(
      "representativeSection"
    );

  const authoritySection =
    document.getElementById(
      "authoritySection"
    );

  function updatePartnerView() {
    const type =
      partnerType.dataset
        .partnerType || "owner";

    if (businessSection)
      businessSection.style.display =
        "none";

    if (
      representativeSection
    )
      representativeSection.style.display =
        "none";

    if (authoritySection)
      authoritySection.style.display =
        "none";

    switch (type) {
      case "owner":
        if (
          authoritySection
        ) {
          authoritySection.style.display =
            "block";
        }
        break;

      case "business":
        if (
          businessSection
        ) {
          businessSection.style.display =
            "block";
        }

        if (
          representativeSection
        ) {
          representativeSection.style.display =
            "block";
        }
        break;

    }
  }

  updatePartnerView();
}

function initVerificationType() {
  const sectionMap = {
    individual_owner:
      "individualOwnerSection",

    business_partner:
      "businessPartnerSection",

    authorized_representative:
      "authorizedRepresentativeSection",
  };

  function updateView() {
    document
      .querySelectorAll(
        "#individualOwnerSection, #businessPartnerSection, #authorizedRepresentativeSection"
      )
      .forEach((section) => {
        section.classList.add(
          "hidden"
        );
      });

    document
      .querySelectorAll(
        ".verification-card"
      )
      .forEach((card) => {
        card.classList.remove(
          "border-orange-300",
          "bg-orange-50"
        );

        card.classList.add(
          "border-slate-200"
        );
      });

    const activeRadio =
      document.querySelector(
        'input[name="verification_type"]:checked'
      );

    if (!activeRadio) {
      return;
    }

    const targetId =
      sectionMap[
        activeRadio.value
      ];

    document
      .getElementById(
        targetId
      )
      ?.classList.remove(
        "hidden"
      );

    activeRadio
      .closest(
        ".verification-card"
      )
      ?.classList.remove(
        "border-slate-200"
      );

    activeRadio
      .closest(
        ".verification-card"
      )
      ?.classList.add(
        "border-orange-300",
        "bg-orange-50"
      );
  }

  document.removeEventListener(
    "change",
    window
      .verificationTypeHandler
  );

  window.verificationTypeHandler =
    function (e) {
      if (
        e.target.matches(
          'input[name="verification_type"]'
        )
      ) {
        updateView();
      }
    };

  document.addEventListener(
    "change",
    window
      .verificationTypeHandler
  );

  updateView();
}

setTimeout(() => {
  console.log(
    document.querySelectorAll(
      'input[name="verification_type"]'
    ).length
  );
  initVerificationType();
}, 200);

const defaultVerification =
  document.querySelector(
    'input[value="business_partner"]'
  );

if (defaultVerification) {
  defaultVerification.checked = true;

  defaultVerification.dispatchEvent(
    new Event("change", {
      bubbles: true,
    })
  );
}

function updateView() {
  const activeRadio =
    document.querySelector(
      'input[name="verification_type"]:checked'
    );

  if (!activeRadio) return;

  document
    .querySelectorAll(
      "#individualOwnerSection,#businessPartnerSection,#authorizedRepresentativeSection"
    )
    .forEach((section) => {
      section.classList.add("hidden");
    });

  const target = {
    individual_owner:
      "individualOwnerSection",
    business_partner:
      "businessPartnerSection",
    authorized_representative:
      "authorizedRepresentativeSection",
  };

  document
    .getElementById(
      target[activeRadio.value]
    )
    ?.classList.remove(
      "hidden"
    );
}

function initializeSidebar() {
  const sidebar =
    document.getElementById(
      "dashboardSidebar"
    );
  const mainWrapper =
    document.getElementById(
      "mainWrapper"
    );
  const toggle =
    document.getElementById(
      "sidebarToggle"
    );

  const backdrop =
    document.getElementById(
      "sidebarBackdrop"
    );

  console.log(
    "Sidebar Init:",
    {
      sidebar,
      toggle,
      backdrop,
    }
  );

  if (!sidebar) {
    console.error(
      "#dashboardSidebar not found"
    );
    return;
  }

  if (!toggle) {
    console.error(
      "#sidebarToggle not found"
    );
    return;
  }

  const STORAGE_KEY =
    "bomo_sidebar_hidden";

  const isHidden = () =>
    sidebar.classList.contains(
      "-translate-x-full"
    );

  const showSidebar = () => {
    sidebar.classList.remove(
      "-translate-x-full"
    );

    backdrop?.classList.remove(
      "hidden"
    );

    mainWrapper?.classList.add(
      "lg:ml-72"
    );

    localStorage.setItem(
      STORAGE_KEY,
      "false"
    );
  };

  const hideSidebar = () => {
    sidebar.classList.add(
      "-translate-x-full"
    );

    backdrop?.classList.add(
      "hidden"
    );

    mainWrapper?.classList.remove(
      "lg:ml-72"
    );

    localStorage.setItem(
      STORAGE_KEY,
      "true"
    );
  };

  toggle.onclick = () => {
    console.log(
      "Sidebar Toggle Clicked"
    );

    if (isHidden()) {
      showSidebar();
    } else {
      hideSidebar();
    }
  };

  backdrop?.addEventListener(
    "click",
    hideSidebar
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        hideSidebar();
      }
    }
  );

  const savedState =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (savedState === "true") {
    hideSidebar();
  } else {
    showSidebar();
  }
}

 
 
