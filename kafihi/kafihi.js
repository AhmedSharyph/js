(function(){
  function createKafihiCalendar(input){
    const popup = document.createElement("div");
    popup.className = "kafihi-popup";
    popup.style.display = "none";
    popup.style.width = "300px";  // Standard width
    popup.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(popup);

    let selectedDate = null;
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const disableFuture = input.dataset.disableFuture === "true";
    const disablePast = input.dataset.disablePast === "true";

    function toGMTPlus5(date) { 
      return new Date(date.getTime() + 5 * 60 * 60 * 1000); 
    }

    function formatDate(date) { 
      if (!date) return "";
      const gmt5 = toGMTPlus5(date);
      const yyyy = gmt5.getFullYear();
      const mm = String(gmt5.getMonth() + 1).padStart(2, "0");
      const dd = String(gmt5.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    function renderCalendar() {
      popup.innerHTML = "";

      // Header with navigation
      const header = document.createElement("div");
      header.className = "kafihi-header";
      header.style.display = "flex";
      header.style.alignItems = "center";
      header.style.justifyContent = "space-between";
      header.style.marginBottom = "10px";

      const prevBtn = document.createElement("button");
      prevBtn.textContent = "◀";
      prevBtn.style.border = "none";
      prevBtn.style.background = "transparent";
      prevBtn.style.cursor = "pointer";
      prevBtn.style.fontSize = "1.2em";
      prevBtn.style.padding = "0 5px";

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "▶";
      nextBtn.style.border = "none";
      nextBtn.style.background = "transparent";
      nextBtn.style.cursor = "pointer";
      nextBtn.style.fontSize = "1.2em";
      nextBtn.style.padding = "0 5px";

      const monthSelect = document.createElement("select");
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let m = 0; m < 12; m++) {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = monthNames[m];
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

      // Arrange: ◀ Month Year ▶
      header.appendChild(prevBtn);
      header.appendChild(monthSelect);
      header.appendChild(yearSelect);
      header.appendChild(nextBtn);
      popup.appendChild(header);

      // Weekdays
      const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      const weekDiv = document.createElement("div");
      weekDiv.className = "kafihi-weekdays";
      weekDiv.style.display = "grid";
      weekDiv.style.gridTemplateColumns = "repeat(7, 1fr)";
      weekDiv.style.textAlign = "center";
      weekDiv.style.marginBottom = "5px";
      weekDiv.style.fontWeight = "bold";
      weekDiv.style.color = "#333";

      weekdays.forEach((day, i) => {
        const el = document.createElement("div");
        el.textContent = day;
        if (i === 5 || i === 6) el.style.color = "#ef4444";
        weekDiv.appendChild(el);
      });
      popup.appendChild(weekDiv);

      // Days
      const daysDiv = document.createElement("div");
      daysDiv.className = "kafihi-days";
      daysDiv.style.display = "grid";
      daysDiv.style.gridTemplateColumns = "repeat(7, 1fr)";
      daysDiv.style.gap = "2px";
      daysDiv.style.marginBottom = "10px";

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const gmtToday = toGMTPlus5(new Date());

      // Empty cells for days before start of month
      for (let i = 0; i < firstDay; i++) {
        daysDiv.appendChild(document.createElement("div"));
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement("div");
        dayEl.textContent = d;
        dayEl.style.textAlign = "center";
        dayEl.style.padding = "8px 0";
        dayEl.style.cursor = "pointer";
        dayEl.style.borderRadius = "4px";
        dayEl.style.fontSize = "14px";

        const dateObj = new Date(currentYear, currentMonth, d);

        // Highlight today
        if (dateObj.toDateString() === today.toDateString()) {
          dayEl.classList.add("today");
          dayEl.style.backgroundColor = "#007bff";
          dayEl.style.color = "white";
        }

        // Weekend styling
        if (dateObj.getDay() === 5 || dateObj.getDay() === 6) {
          dayEl.classList.add("weekend");
          dayEl.style.color = "#ef4444";
        }

        // Disable logic
        let disabled = false;
        if (disableFuture && dateObj > today) disabled = true;
        if (disablePast && dateObj < today) disabled = true;

        if (disabled) {
          dayEl.classList.add("disabled");
          dayEl.style.color = "#ccc";
          dayEl.style.cursor = "not-allowed";
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

      // Footer
      const footer = document.createElement("div");
      footer.className = "kafihi-footer";
      footer.style.display = "flex";
      footer.style.justifyContent = "space-between";
      footer.style.gap = "5px";
      footer.style.marginTop = "10px";

      const clearBtn = document.createElement("button");
      clearBtn.textContent = "Clear";
      clearBtn.style.flex = "1";
      clearBtn.style.padding = "6px";
      clearBtn.style.border = "1px solid #ccc";
      clearBtn.style.backgroundColor = "#f8f8f8";
      clearBtn.style.cursor = "pointer";

      const todayBtn = document.createElement("button");
      todayBtn.textContent = "Today";
      todayBtn.style.flex = "1";
      todayBtn.style.padding = "6px";
      todayBtn.style.border = "1px solid #ccc";
      todayBtn.style.backgroundColor = "#e0e0e0";
      todayBtn.style.cursor = "pointer";

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Close";
      closeBtn.style.flex = "1";
      closeBtn.style.padding = "6px";
      closeBtn.style.border = "1px solid #ccc";
      closeBtn.style.backgroundColor = "#f8f8f8";
      closeBtn.style.cursor = "pointer";

      clearBtn.addEventListener("click", () => {
        selectedDate = null;
        input.value = "";
      });

      todayBtn.addEventListener("click", () => {
        selectedDate = new Date();
        if (disableFuture && selectedDate > today) return;
        if (disablePast && selectedDate < today) return;
        input.value = formatDate(selectedDate);
        currentMonth = selectedDate.getMonth();
        currentYear = selectedDate.getFullYear();
        renderCalendar();
      });

      closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
      });

      footer.appendChild(clearBtn);
      footer.appendChild(todayBtn);
      footer.appendChild(closeBtn);
      popup.appendChild(footer);

      // Navigation Events
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

    function showPopup() {
      popup.style.display = "block";
      const rect = input.getBoundingClientRect();
      popup.style.position = "absolute";
      popup.style.top = `${rect.bottom + window.scrollY}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.style.zIndex = "1000";
      popup.style.backgroundColor = "white";
      popup.style.border = "1px solid #ddd";
      popup.style.borderRadius = "8px";
      popup.style.padding = "10px";
      popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      renderCalendar();
    }

    input.addEventListener("focus", showPopup);
    input.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && e.target !== input) {
        popup.style.display = "none";
      }
    });
  }

  // Initialize all elements with class 'kafihi-calendar'
  document.querySelectorAll(".kafihi-calendar").forEach(input => createKafihiCalendar(input));
})();
