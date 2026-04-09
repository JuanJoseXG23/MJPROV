function initMemoryFilters() {
  const searchInput = document.getElementById("searchMemory");
  const fromDateInput = document.getElementById("fromDate");
  const toDateInput = document.getElementById("toDate");
  const filterButton = document.querySelector('[data-action="filter-memories"]');
  const resetButton = document.querySelector('[data-action="reset-memories"]');
  const emptyState = document.getElementById("memoryEmptyState");
  const cards = Array.from(document.querySelectorAll(".memory-card"));

  if (!cards.length || !searchInput || !fromDateInput || !toDateInput) {
    return;
  }

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;
    let visibleCount = 0;

    cards.forEach((card) => {
      const memoryDate = card.dataset.date || "";
      const title = card.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const text = card.querySelector(".card-text")?.textContent.toLowerCase() || "";
      const matchesQuery = !query || title.includes(query) || text.includes(query);
      const matchesFromDate = !fromDate || memoryDate >= fromDate;
      const matchesToDate = !toDate || memoryDate <= toDate;
      const isVisible = matchesQuery && matchesFromDate && matchesToDate;

      card.classList.toggle("d-none", !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("d-none", visibleCount > 0);
    }
  }

  function resetFilters() {
    searchInput.value = "";
    fromDateInput.value = "";
    toDateInput.value = "";
    applyFilters();
  }

  searchInput.addEventListener("input", applyFilters);
  fromDateInput.addEventListener("change", applyFilters);
  toDateInput.addEventListener("change", applyFilters);
  filterButton?.addEventListener("click", applyFilters);
  resetButton?.addEventListener("click", resetFilters);
}

function initLoveTimer() {
  const years = document.getElementById("years");
  const months = document.getElementById("months");
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (!years || !months || !days || !hours || !minutes || !seconds) {
    return;
  }

  const startDate = new Date("2023-03-18T00:00:00");

  function updateLoveTimer() {
    const now = new Date();
    let diff = Math.floor((now - startDate) / 1000);

    const secondsValue = diff % 60;
    diff = Math.floor(diff / 60);
    const minutesValue = diff % 60;
    diff = Math.floor(diff / 60);
    const hoursValue = diff % 24;
    diff = Math.floor(diff / 24);
    const daysValue = diff % 30;
    diff = Math.floor(diff / 30);
    const monthsValue = diff % 12;
    const yearsValue = Math.floor(diff / 12);

    years.textContent = yearsValue;
    months.textContent = monthsValue;
    days.textContent = daysValue;
    hours.textContent = hoursValue;
    minutes.textContent = minutesValue;
    seconds.textContent = secondsValue;
  }

  updateLoveTimer();
  setInterval(updateLoveTimer, 1000);
}

function initRegionSelector() {
  const buttons = Array.from(document.querySelectorAll("#regionSelector button"));
  const regions = Array.from(document.querySelectorAll(".region-content"));

  if (!buttons.length || !regions.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const region = button.dataset.region;

      buttons.forEach((currentButton) => {
        const isActive = currentButton === button;
        currentButton.classList.toggle("active", isActive);
        currentButton.setAttribute("aria-pressed", String(isActive));
      });

      regions.forEach((section) => {
        section.classList.toggle("d-none", section.dataset.region !== region);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMemoryFilters();
  initLoveTimer();
  initRegionSelector();
});
