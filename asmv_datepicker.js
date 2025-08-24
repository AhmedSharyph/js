/* 
  Project: asmv_datepicker
  Class: asm_datepicker
  Author: Ahmed Shareef
  Website: https://ahmedshayph.mv
  GitHub: https://github.com/ahmedsharyph.mv
  Description: Self-contained custom date picker to substitute browser date input.
  Version: 1.1.0
  Created: 2025-08-24
*/

class asm_datepicker {
  constructor(input) {
    this.input = input;
    this.today = new Date();
    this.selectedYear = this.today.getFullYear();
    this.selectedMonth = this.today.getMonth();
    this.selectedDay = this.today.getDate();
    this.injectStyles();
    this.createPicker();
    this.attachEvents();
  }

  injectStyles() {
    if (document.getElementById("asm-datepicker-styles")) return;
    const style = document.createElement("style");
    style.id = "asm-datepicker-styles";
    style.textContent = `
      .datepicker { position:absolute; display:none; background:#fff; border:1px solid #ccc; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-family:sans-serif; z-index:9999; width:260px; }
      .datepicker-header { display:flex; justify-content:space-between; padding:8px; align-items:center; }
      .month-nav { display:flex; align-items:center; gap:4px; }
      .month-select, .year-select-dropdown { padding:4px; font-size:14px; }
      .arrow-btn { border:none; background:none; font-size:16px; cursor:pointer; color:#555; padding:2px 6px; }
      .calendar-grid { display:grid; grid-template-columns:repeat(7,1fr); padding:8px; gap:4px; text-align:center; }
      .calendar-grid div { padding:6px 0; border-radius:4px; cursor:pointer; }
      .calendar-grid .header { font-weight:600; color:#333; cursor:default; }
      .calendar-grid .empty { background:transparent; cursor:default; }
      .calendar-grid .today { background:#3b82f6; color:#fff; }
      .calendar-grid .weekend { color:#dc2626; }
      .datepicker-footer { display:flex; justify-content:space-between; padding:6px 8px; border-top:1px solid #eee; }
      .datepicker-footer button { padding:4px 8px; border:none; border-radius:4px; cursor:pointer; background:#3b82f6; color:#fff; font-size:13px; transition:0.2s; }
      .datepicker-footer button:hover { background:#2563eb; }
      .datepicker-footer .clear-btn { background:#6b7280; }
      .datepicker-footer .clear-btn:hover { background:#4b5563; }
    `;
    document.head.appendChild(style);
  }

  createPicker() {
    this.picker = document.createElement("div");
    this.picker.className = "datepicker";
    this.picker.innerHTML = `
      <div class="datepicker-header">
        <div class="month-nav">
          <button class="arrow-btn prev-month">◀</button>
          <select class="month-select">
            <option value="0">January</option><option value="1">February</option><option value="2">March</option><option value="3">April</option>
            <option value="4">May</option><option value="5">June</option><option value="6">July</option><option value="7">August</option>
            <option value="8">September</option><option value="9">October</option><option value="10">November</option><option value="11">December</option>
          </select>
          <button class="arrow-btn next-month">▶</button>
        </div>
        <div class="year-select">
          <select class="year-select-dropdown"></select>
        </div>
      </div>
      <div class="calendar-grid"></div>
      <div class="datepicker-footer">
        <button class="clear-btn">Clear</button>
        <button class="today-btn">Today</button>
        <button class="close-btn">Close</button>
      </div>
    `;
    document.body.appendChild(this.picker);

    this.monthSelect = this.picker.querySelector(".month-select");
    this.yearSelect = this.picker.querySelector(".year-select-dropdown");
    this.calendarGrid = this.picker.querySelector(".calendar-grid");
    this.prevMonthBtn = this.picker.querySelector(".prev-month");
    this.nextMonthBtn = this.picker.querySelector(".next-month");
    this.clearBtn = this.picker.querySelector(".clear-btn");
    this.todayBtn = this.picker.querySelector(".today-btn");
    this.closeBtn = this.picker.querySelector(".close-btn");

    // Set year dropdown based on attribute
    const yearLimit = this.input.getAttribute("data-year-limit");
    let minYear = 1900, maxYear = this.today.getFullYear() + 1000; // default unlimited
    if (yearLimit === "current") minYear = maxYear = this.today.getFullYear();
    for (let y = maxYear; y >= minYear; y--) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      this.yearSelect.appendChild(opt);
    }
    if (yearLimit === "current") this.yearSelect.disabled = true;

    this.monthSelect.value = this.selectedMonth;
    this.yearSelect.value = this.selectedYear;
    this.renderCalendar();
  }

  attachEvents() {
    this.input.addEventListener("click", () => { 
      const rect = this.input.getBoundingClientRect();
      this.picker.style.top = rect.bottom + window.scrollY + "px";
      this.picker.style.left = rect.left + "px";
      this.picker.style.display = "block"; 
      this.renderCalendar();
    });

    this.monthSelect.addEventListener("change", () => { 
      this.selectedMonth = parseInt(this.monthSelect.value); 
      this.renderCalendar(); 
    });

    this.yearSelect.addEventListener("change", () => { 
      this.selectedYear = parseInt(this.yearSelect.value); 
      this.renderCalendar(); 
    });

    this.prevMonthBtn.addEventListener("click", () => {
      this.selectedMonth--;
      if(this.selectedMonth < 0) { this.selectedMonth = 11; this.selectedYear--; this.yearSelect.value = this.selectedYear; }
      this.monthSelect.value = this.selectedMonth;
      this.renderCalendar();
    });

    this.nextMonthBtn.addEventListener("click", () => {
      this.selectedMonth++;
      if(this.selectedMonth > 11) { this.selectedMonth = 0; this.selectedYear++; this.yearSelect.value = this.selectedYear; }
      this.monthSelect.value = this.selectedMonth;
      this.renderCalendar();
    });

    this.clearBtn.addEventListener("click", () => { this.input.value = ""; });
    this.todayBtn.addEventListener("click", () => {
      this.selectedYear = this.today.getFullYear();
      this.selectedMonth = this.today.getMonth();
      this.selectedDay = this.today.getDate();
      this.input.value = `${this.selectedYear}-${String(this.selectedMonth+1).padStart(2,"0")}-${String(this.selectedDay).padStart(2,"0")}`;
      this.monthSelect.value = this.selectedMonth;
      this.yearSelect.value = this.selectedYear;
      this.renderCalendar();
    });

    this.closeBtn.addEventListener("click", () => { this.picker.style.display = "none"; });

    document.addEventListener("click", (e) => {
      if(!this.picker.contains(e.target) && e.target !== this.input) this.picker.style.display = "none";
    });
  }

  renderCalendar() {
    this.calendarGrid.innerHTML = "";
    const weekdays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    weekdays.forEach(day => {
      const div = document.createElement("div"); 
      div.textContent = day; 
      div.className = "header"; 
      this.calendarGrid.appendChild(div); 
    });

    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    for(let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div"); 
      empty.className = "empty"; 
      this.calendarGrid.appendChild(empty); 
    }

    for(let d = 1; d <= daysInMonth; d++) {
      const div = document.createElement("div"); 
      div.textContent = d;
      const currentDate = new Date(this.selectedYear, this.selectedMonth, d);
      const dayOfWeek = currentDate.getDay();

      if(dayOfWeek === 5 || dayOfWeek === 6) div.classList.add("weekend");
      const today = new Date();
      if(d === today.getDate() && this.selectedYear === today.getFullYear() && this.selectedMonth === today.getMonth()) div.classList.add("today");

      // Disable future dates if year locked
      const yearLimit = this.input.getAttribute("data-year-limit");
      if(yearLimit === "current" && currentDate > today) {
        div.style.pointerEvents = "none";
        div.style.opacity = "0.4";
      } else {
        div.addEventListener("click", () => {
          this.selectedDay = d;
          this.input.value = `${this.selectedYear}-${String(this.selectedMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          this.picker.style.display = "none";
        });
      }

      this.calendarGrid.appendChild(div);
    }
  }
}

// Initialize all inputs
document.querySelectorAll(".asmv_datepicker").forEach(inp => new asm_datepicker(inp));
