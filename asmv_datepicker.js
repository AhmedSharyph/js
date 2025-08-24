/*!
 * ASMV Datepicker
 * Project: asmv_datepicker
 * Author: Ahmed Shareef
 * Website: ahmedshayph.mv
 * GitHub: ahmedsharyph.mv
 * Version: 1.0.0
 * Created: 2025-08-24
 */

class asm_datepicker {
  constructor(input) {
    this.input = input;
    this.selectedDate = null;
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.yearLimitCurrent = input.dataset.yearLimit === "current";
    this.weekendsDisabled = input.datasetWeekendsDisabled === "true";

    this.injectCSS();
    this.buildPicker();
    this.bindEvents();
  }

  injectCSS() {
    if (document.getElementById("asm_datepicker_css")) return; // only once
    const style = document.createElement("style");
    style.id = "asm_datepicker_css";
    style.textContent = `
      .asm-datepicker { position:absolute; z-index:50; background:white; border-radius:6px; padding:8px; margin-top:2px; font-size:14px; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
      .asm-datepicker .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; color:#374151; }
      .asm-datepicker .header button { background:none; border:none; cursor:pointer; font-size:16px; color:#6b7280; transition:0.2s; }
      .asm-datepicker .header button:hover { color:#111827; }
      .asm-datepicker .month-year { font-weight:600; }
      .asm-datepicker .weekdays, .asm-datepicker .days { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; text-align:center; }
      .asm-datepicker .weekdays div { font-weight:500; font-size:12px; color:#6b7280; }
      .asm-datepicker .days div { cursor:pointer; border-radius:4px; padding:4px 0; transition:0.2s; }
      .asm-datepicker .days div:hover { background:#bfdbfe; }
      .asm-datepicker .days div.today { background:#dbeafe; font-weight:600; }
      .asm-datepicker .days div.disabled { color:#9ca3af; cursor:not-allowed; }
      .asm-datepicker .footer { display:flex; justify-content:space-between; margin-top:6px; }
      .asm-datepicker .footer button { font-size:12px; padding:4px 6px; border-radius:4px; border:none; cursor:pointer; transition:0.2s; }
    `;
    document.head.appendChild(style);
  }

  buildPicker() {
    this.picker = document.createElement("div");
    this.picker.className = "asm-datepicker hidden";

    // Width matches input font (10ch + 5px left/right)
    const font = window.getComputedStyle(this.input).font || "14px sans-serif";
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = font;
    const textWidth = ctx.measureText("YYYY-MM-DD").width;
    this.picker.style.width = `${textWidth + 10}px`;

    // Header
    const header = document.createElement("div");
    header.className = "header";

    this.prevBtn = document.createElement("button");
    this.prevBtn.textContent = "◀";
    this.nextBtn = document.createElement("button");
    this.nextBtn.textContent = "▶";
    this.monthYear = document.createElement("span");
    this.monthYear.className = "month-year";

    header.appendChild(this.prevBtn);
    header.appendChild(this.monthYear);
    header.appendChild(this.nextBtn);
    this.picker.appendChild(header);

    // Weekdays
    const weekdays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    const weekDiv = document.createElement("div");
    weekDiv.className = "weekdays";
    weekdays.forEach(d => {
      const el = document.createElement("div");
      el.textContent = d;
      weekDiv.appendChild(el);
    });
    this.picker.appendChild(weekDiv);

    // Days
    this.daysGrid = document.createElement("div");
    this.daysGrid.className = "days";
    this.picker.appendChild(this.daysGrid);

    // Footer
    const footer = document.createElement("div");
    footer.className = "footer";

    this.clearBtn = document.createElement("button");
    this.clearBtn.textContent = "Clear";
    this.clearBtn.className = "clear";

    this.todayBtn = document.createElement("button");
    this.todayBtn.textContent = "Today";
    this.todayBtn.className = "today";

    this.closeBtn = document.createElement("button");
    this.closeBtn.textContent = "Close";
    this.closeBtn.className = "close";

    footer.appendChild(this.clearBtn);
    footer.appendChild(this.todayBtn);
    footer.appendChild(this.closeBtn);
    this.picker.appendChild(footer);

    document.body.appendChild(this.picker);
    this.renderCalendar();
  }

  bindEvents() {
    this.input.addEventListener("focus", () => this.show());
    this.prevBtn.addEventListener("click", () => this.changeMonth(-1));
    this.nextBtn.addEventListener("click", () => this.changeMonth(1));
    this.clearBtn.addEventListener("click", () => { this.input.value=""; this.selectedDate=null; });
    this.todayBtn.addEventListener("click", () => { this.selectDate(this.today); });
    this.closeBtn.addEventListener("click", () => this.hide());
    document.addEventListener("click", e => {
      if(!this.picker.contains(e.target) && e.target!==this.input) this.hide();
    });
  }

  show() {
    this.picker.classList.remove("hidden");
    const rect = this.input.getBoundingClientRect();
    this.picker.style.top = `${rect.bottom + window.scrollY}px`;
    this.picker.style.left = `${rect.left + window.scrollX}px`;
  }

  hide() { this.picker.classList.add("hidden"); }

  changeMonth(delta) {
    let m = this.currentMonth + delta;
    let y = this.currentYear;
    if(m<0){ m=11; y--; }
    if(m>11){ m=0; y++; }
    if(this.yearLimitCurrent && y>this.today.getFullYear()) return;
    this.currentMonth = m;
    this.currentYear = y;
    this.renderCalendar();
  }

  renderCalendar() {
    const firstDay = new Date(this.currentYear,this.currentMonth,1).getDay();
    const daysInMonth = new Date(this.currentYear,this.currentMonth+1,0).getDate();
    this.monthYear.textContent = `${this.currentYear}-${String(this.currentMonth+1).padStart(2,'0')}`;

    this.daysGrid.innerHTML = "";
    for(let i=0;i<firstDay;i++){
      const empty = document.createElement("div");
      this.daysGrid.appendChild(empty);
    }
    for(let d=1;d<=daysInMonth;d++){
      const dayEl = document.createElement("div");
      dayEl.textContent = d;
      const dateObj = new Date(this.currentYear,this.currentMonth,d);

      // Highlight today
      if(dateObj.toDateString()===this.today.toDateString()) dayEl.classList.add("today");

      // Disable weekends
      if(this.weekendsDisabled && (dateObj.getDay()===5 || dateObj.getDay()===6)) dayEl.classList.add("disabled");

      // Disable future if yearLimitCurrent
      if(this.yearLimitCurrent && dateObj>this.today) dayEl.classList.add("disabled");

      dayEl.addEventListener("click", () => {
        if(dayEl.classList.contains("disabled")) return;
        this.selectDate(dateObj);
      });
      this.daysGrid.appendChild(dayEl);
    }
  }

  selectDate(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth()+1).padStart(2,"0");
    const dd = String(dateObj.getDate()).padStart(2,"0");
    this.input.value = `${yyyy}-${mm}-${dd}`;
    this.selectedDate = dateObj;
    this.hide();
  }
}

// Initialize datepickers
document.querySelectorAll(".asmv_datepicker").forEach(input => new asm_datepicker(input));
