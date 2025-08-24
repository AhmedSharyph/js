// === Step 1: Inject CSS into the document head ===
function injectStyles() {
  const styles = `
    .kafihi-calendar {
      padding: 6px 10px;
      font-size: 14px;
      border-radius: 6px;
      border: 1px solid #ccc;
      width: 150px;
      margin: 5px;
    }

    .kafihi-popup {
      position: absolute;
      background: #fff;
      border-radius: 10px;
      padding: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      font-family: "Segoe UI", Roboto, sans-serif;
      z-index: 1000;
      display: none;
      max-width: 95vw;
    }

    .kafihi-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; gap:4px; }
    .kafihi-header button { cursor:pointer; background:none; border:none; font-size:18px; color:#6b7280; transition:.2s; }
    .kafihi-header button:hover { color:#1f2937; }
    .kafihi-header select { padding:4px 6px; border-radius:6px; border:1px solid #d1d5db; cursor:pointer; }

    .kafihi-weekdays, .kafihi-days { display:grid; grid-template-columns:repeat(7,1fr); text-align:center; gap:4px; }
    .kafihi-weekdays div { font-weight:600; font-size:12px; }
    .kafihi-days div { cursor:pointer; border-radius:6px; padding:6px 0; transition:.2s; aspect-ratio:1/1; }
    .kafihi-days div:hover { background:#3b82f6; color:#fff; }
    .kafihi-days div.today { background:#bfdbfe; font-weight:600; }
    .kafihi-days div.disabled { color:#d1d5db; cursor:not-allowed; }
    .kafihi-days div.weekend { color:#ef4444; }

    .kafihi-footer { display:flex; justify-content:space-between; margin-top:8px; }
    .kafihi-footer button { font-size:12px; padding:6px 10px; border-radius:6px; border:none; cursor:pointer; background:#f3f4f6; }
    .kafihi-footer button:hover { background:#e5e7eb; }

    @media(max-width:400px){
      .kafihi-popup { padding:8px; font-size:13px; }
      .kafihi-days div { padding:8px 0; }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
})();

// === Step 2: Build HTML structure dynamically ===
(function buildHTML() {
  document.body.innerHTML = `
    <h2>Kafihi Calendar Demo</h2>

    <h3>1. Normal Datepicker:</h3>
    <input type="text" class="kafihi-calendar" id="normal" placeholder="YYYY-MM-DD">

    <h3>2. Past Dates Only (Future Disabled):</h3>
    <input type="text" class="kafihi-calendar" id="past" data-disable-future="true" placeholder="YYYY-MM-DD">

    <h3>3. Future Dates Only (Past Disabled):</h3>
    <input type="text" class="kafihi-calendar" id="future" data-disable-past="true" placeholder="YYYY-MM-DD">
  `;
})();

// === Step 3: Calendar functionality ===
(function createKafihiCalendarModule() {
  function createKafihiCalendar(input) {
    const popup = document.createElement("div");
    popup.className = "kafihi-popup";
    document.body.appendChild(popup);

    let selectedDate = null;
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const disableFuture = input.dataset.disableFuture === "true";
    const disablePast = input.dataset.disablePast === "true";

    // Convert to GMT+5 (e.g., Pakistan Standard Time)
    function toGMTPlus5(date) {
      return new Date(date.getTime() + 5 * 60 * 60 * 1000);
    }

    // Format date as YYYY-MM-DD in GMT+5
    function formatDate(date) {
      if (!date) return "";
      const gmt5 = toGMTPlus5(date);
      const yyyy = gmt5.getFullYear();
      const mm = String(gmt5.getMonth() + 1).padStart(2, "0");
      const dd = String(gmt5.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    // Render the calendar UI
    function renderCalendar() {
      popup.innerHTML = "";

      // Header with navigation
      const header = document.createElement("div");
      header.className = "kafihi-header";

      const prevBtn = document.createElement("button");
      prevBtn.textContent = "◀";
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "▶";

      const monthSelect = document.createElement("select");
      for (let m = 0; m < 12; m++) {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = new Date(0, m).toLocaleString('default', { month: 'short' });
        if (m === currentMonth) opt.selected = true;
        monthSelect.appendChild(opt);
      }

      const yearSelect = document.createElement("select");
      for (let y = today.getFullYear() - 100; y <= today.getFullYear() + 10; y++) {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        if (y === currentYear) opt.selected = true;
        yearSelect.appendChild(opt);
      }

      header.appendChild(prevBtn);
      header.appendChild(monthSelect);
      header.appendChild(yearSelect);
      header.appendChild(nextBtn);
      popup.appendChild(header);

      // Weekdays row
      const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      const weekDiv = document.createElement("div");
      weekDiv.className = "kafihi-weekdays";
      weekdays.forEach((day, i) => {
        const el = document.createElement("div");
        el.textContent = day;
        if (i === 5 || i === 6) el.style.color = "#ef4444";
        weekDiv.appendChild(el);
      });
      popup.appendChild(weekDiv);

      // Days grid
      const daysDiv = document.createElement("div");
      daysDiv.className = "kafihi-days";

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      // Empty divs for days before the 1st
      for (let i = 0; i < firstDay; i++) {
        daysDiv.appendChild(document.createElement("div"));
      }

      const gmtToday = toGMTPlus5(new Date());

      for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement("div");
        dayEl.textContent = d;
        const dateObj = new Date(currentYear, currentMonth, d);

        // Highlight today
        if (dateObj.toDateString() === today.toDateString()) {
          dayEl.classList.add("today");
        }

        // Weekend styling
        if (dateObj.getDay() === 5 || dateObj.getDay() === 6) {
          dayEl.classList.add("weekend");
        }

        // Disable logic
        let disabled = false;
        if (disableFuture && dateObj > today) disabled = true;
        if (disablePast && dateObj < today) disabled = true;

        if (disabled) {
          dayEl.classList.add("disabled");
        } else {
          dayEl.addEventListener("click", () => {
            selectedDate = dateObj;
            input.value = formatDate(selectedDate);
            popup.style.display = "none";
          });
        }

        daysDiv.appendChild(dayEl);
      }
      popup.appendChild(daysDiv);

      // Footer buttons
      const footer = document.createElement("div");
      footer.className = "kafihi-footer";

      const clearBtn = document.createElement("button");
      clearBtn.textContent = "Clear";
      const todayBtn = document.createElement("button");
      todayBtn.textContent = "Today";
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Close";

      clearBtn.addEventListener("click", () => {
        selectedDate = null;
        input.value = "";
      });

      todayBtn.addEventListener("click", () => {
        selectedDate = new Date();
        if (disableFuture && selectedDate > today) return;
        if (disablePast && selectedDate < today) return;
        input.value = formatDate(selectedDate);
        renderCalendar();
      });

      closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
      });

      footer.appendChild(clearBtn);
      footer.appendChild(todayBtn);
      footer.appendChild(closeBtn);
      popup.appendChild(footer);

      // Navigation event listeners
      prevBtn.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar();
      });

      nextBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar();
      });

      monthSelect.addEventListener("change", () => {
        currentMonth = parseInt(monthSelect.value);
        renderCalendar();
      });

      yearSelect.addEventListener("change", () => {
        currentYear = parseInt(yearSelect.value);
        renderCalendar();
      });
    }

    // Show the popup calendar
    function showPopup() {
      popup.style.display = "block";
      const rect = input.getBoundingClientRect();
      popup.style.top = rect.bottom + window.scrollY + "px";
      popup.style.left = rect.left + window.scrollX + "px";
      renderCalendar();
    }

    // Open on focus
    input.addEventListener("focus", showPopup);

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && e.target !== input) {
        popup.style.display = "none";
      }
    });
  }

  // Initialize all kafihi-calendar inputs
  document.querySelectorAll(".kafihi-calendar").forEach(input => {
    createKafihiCalendar(input);
  });
})();
