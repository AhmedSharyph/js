function KafihiCalendar(input, options = {}) {
  const popup = document.createElement("div");
  popup.className = "kafihi-popup";
  document.body.appendChild(popup);

  const today = new Date();
  let currentDate = new Date(today);

  const disableFuture = options.disableFuture || false;
  const disablePast = options.disablePast || false;

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  function renderCalendar() {
    popup.innerHTML = "";

    const header = document.createElement("div");
    header.className = "kafihi-header";

    // Month controls (with arrows)
    const monthControls = document.createElement("div");
    monthControls.className = "kafihi-month-controls";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "‹";
    prevBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    const monthLabel = document.createElement("span");
    monthLabel.textContent = currentDate.toLocaleString("default", { month: "long" });

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "›";
    nextBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    monthControls.appendChild(prevBtn);
    monthControls.appendChild(monthLabel);
    monthControls.appendChild(nextBtn);

    // Year fixed at right
    const yearLabel = document.createElement("span");
    yearLabel.className = "kafihi-year";
    yearLabel.textContent = currentDate.getFullYear();

    header.appendChild(monthControls);
    header.appendChild(yearLabel);

    const weekdays = document.createElement("div");
    weekdays.className = "kafihi-weekdays";
    ["Su","Mo","Tu","We","Th","Fr","Sa"].forEach(d => {
      const div = document.createElement("div");
      div.textContent = d;
      weekdays.appendChild(div);
    });

    const days = document.createElement("div");
    days.className = "kafihi-days";

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);

    for (let i=0; i<firstDay.getDay(); i++) {
      days.appendChild(document.createElement("div"));
    }

    for (let d=1; d<=lastDay.getDate(); d++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const dayDiv = document.createElement("div");
      dayDiv.textContent = d;

      if (isSameDay(dateObj, today)) dayDiv.classList.add("today");
      if (isSameDay(dateObj, new Date(input.value))) dayDiv.classList.add("selected");

      if ((disableFuture && dateObj > today && !isSameDay(dateObj, today)) ||
          (disablePast && dateObj < today && !isSameDay(dateObj, today))) {
        dayDiv.classList.add("disabled");
      } else {
        dayDiv.addEventListener("click", () => {
          input.value = dateObj.toISOString().split("T")[0];
          popup.style.display = "none";
        });
      }
      days.appendChild(dayDiv);
    }

    popup.appendChild(header);
    popup.appendChild(weekdays);
    popup.appendChild(days);
  }

  input.addEventListener("click", (e) => {
    const rect = input.getBoundingClientRect();
    popup.style.top = rect.bottom + window.scrollY + "px";
    popup.style.left = rect.left + window.scrollX + "px";
    popup.style.display = "block";
    renderCalendar();
    e.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && e.target !== input) {
      popup.style.display = "none";
    }
  });
}
