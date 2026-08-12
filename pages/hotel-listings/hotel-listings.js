

async function loadHotelResultsView(view) {
  try {
    const response = await fetch(
      `pages/hotel-listings/${view}.html?v=${Date.now()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    const container = document.getElementById(
      "hotel-results-content"
    );

    if (container) {
      container.innerHTML = html;
    }
  } catch (error) {
    console.error(error);
  }
}
function updateActiveButtons(view) {
  const listBtn = document.getElementById(
    "hotelListViewBtn"
  );

  const gridBtn = document.getElementById(
    "hotelGridViewBtn"
  );

  const mapBtn = document.getElementById(
    "mapViewBtn"
    );

  [listBtn, gridBtn, mapBtn].forEach((btn) => {
    if (!btn) return;

    btn.classList.remove(
      "bg-orange-100",
      "text-orange-600"
    );

    btn.classList.add(
      "bg-white"
    );
  });

  const active =
    view === "list"
      ? listBtn
      : view === "grid"
      ? gridBtn
      : mapBtn;

  active?.classList.remove(
    "bg-white"
  );

  active?.classList.add(
    "bg-orange-100",
    "text-orange-600"
  );

  if (mapFilter) {
    mapFilter.classList.toggle(
      "hidden",
      view === "map"
    );
  }
}

export async function initializeHotelListings() {
  console.log("initializeHotelListings");

  const listBtn = document.getElementById(
    "hotelListViewBtn"
  );

  const gridBtn = document.getElementById(
    "hotelGridViewBtn"
  );

  const mapBtn = document.getElementById(
    "mapViewBtn"
  );

  if (!listBtn || !gridBtn || !mapBtn) return;

  if (
    document.body.dataset.hotelListingsInitialized ===
    "true"
  ) {
    return;
  }

  document.body.dataset.hotelListingsInitialized =
    "true";

  await loadHotelResultsView(
    "hotel-results-list"
  );

  updateActiveButtons("list");

  gridBtn.addEventListener(
    "click",
    async () => {
      await loadHotelResultsView(
        "hotel-results-grid"
      );

      updateActiveButtons("grid");
    }
  );

  listBtn.addEventListener(
    "click",
    async () => {
      await loadHotelResultsView(
        "hotel-results-list"
      );

      updateActiveButtons("list");
    }
  );

    mapBtn?.addEventListener(
        "click",
        async () => {
            await loadHotelResultsView(
            "hotel-results-map"
            );

            updateActiveButtons(
            "map"
            );
        }
    );
}
 