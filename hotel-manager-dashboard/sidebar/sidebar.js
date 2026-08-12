$(function () {
  const sidebar = $("#dashboardSidebar");
  const mainWrapper = $("#mainWrapper");
  const overlay = $("#sidebarOverlay");

  const collapsed =
    localStorage.getItem("sidebarCollapsed") === "true";

  if (collapsed && window.innerWidth >= 1024) {
    sidebar.addClass("collapsed");
    mainWrapper.addClass("sidebar-collapsed");
  }

  $("#sidebarToggle").on("click", function () {
    sidebar.toggleClass("collapsed");
    mainWrapper.toggleClass("sidebar-collapsed");

    localStorage.setItem(
      "sidebarCollapsed",
      sidebar.hasClass("collapsed"),
    );
  });

  $("#sidebarClose, #sidebarOverlay").on("click", function () {
    sidebar.removeClass("mobile-open");
    overlay.addClass("hidden");
  });

  const activePage =
    localStorage.getItem("activeDashboardPage") || "dashboard";

  $(`.dashboard-nav[data-page="${activePage}"]`).addClass("active");

  $(".dashboard-nav").on("click", function () {
    $(".dashboard-nav").removeClass("active");

    $(this).addClass("active");

    localStorage.setItem(
      "activeDashboardPage",
      $(this).data("page"),
    );
  });

  $(window).on("resize", function () {
    if (window.innerWidth >= 1024) {
      sidebar.removeClass("mobile-open");
      overlay.addClass("hidden");
    }
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      sidebar.removeClass("mobile-open");
      overlay.addClass("hidden");
    }
  });
});