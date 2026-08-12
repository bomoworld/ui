 
async function loadModule(selector, path) {
  const element = document.querySelector(selector);

  if (!element) return;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    element.innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${path}`, error);

    element.innerHTML = `
      <div class="bomo-card border border-red-100 rounded-[28px] p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center text-2xl">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>

        <h3 class="text-xl font-black text-slate-900 mt-5">
          Failed To Load Page
        </h3>

        <p class="text-sm text-slate-500 mt-2">
          Unable to load:
          <span class="font-semibold text-slate-700">${path}</span>
        </p>
      </div>
    `;
  }
}

function updateLayout(page) {
  const authLayout = document.getElementById("auth-layout");

  const authSidebar = document.getElementById("auth-sidebar");

  const authContainer = document.getElementById("auth-container");

  const mobileTitle = document.querySelector(".lg\\:hidden h1");

  const mobileDescription =
    document.querySelector(".lg\\:hidden p");

  const fullPages = ["hotel-partner-register"];

  if (fullPages.includes(page)) {
    authLayout.classList.remove(
      "lg:grid",
      "lg:grid-cols-[1.08fr_0.92fr]",
    );

    authLayout.classList.add("auth-full-layout");

    if (authSidebar) {
      authSidebar.style.display = "none";
    }

    if (authContainer) {
      authContainer.classList.remove("max-w-md");

      authContainer.classList.add("max-w-7xl");
    }
  } else {
    authLayout.classList.add(
      "lg:grid",
      "lg:grid-cols-[1.08fr_0.92fr]",
    );

    authLayout.classList.remove("auth-full-layout");

    if (authSidebar) {
      authSidebar.style.display = "";
    }

    if (authContainer) {
      authContainer.classList.remove("max-w-7xl");

      authContainer.classList.add("max-w-md");
    }
  }

  // MOBILE TITLE
  if (mobileTitle && mobileDescription) {
    switch (page) {
      case "register":
        mobileTitle.textContent = "Create Account";

        mobileDescription.textContent =
          "Register and continue your travel experience.";
        break;

      case "forgot-password":
        mobileTitle.textContent = "Forgot Password";

        mobileDescription.textContent =
          "Recover and secure your account access.";
        break;

      case "hotel-partner-register":
        mobileTitle.textContent = "Property Partner";

        mobileDescription.textContent =
          "Register your property business with BOMO.";
        break;

      default:
        mobileTitle.textContent = "Welcome Back";

        mobileDescription.textContent =
          "Continue your travel experience.";
        break;
    }
  }
}

async function loadPage() {
  const params = new URLSearchParams(window.location.search);

  const page = params.get("page") || "login";

  updateLayout(page);

  await loadModule(
    "#auth-content",
    `./pages/${page}.html`,
  );

  document.title = `BOMO ${
    page
      .replaceAll("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }`;
}

document.addEventListener("DOMContentLoaded", loadPage);
 
