/*!
 * ASMV Datepicker - Modified Version
 * Project: asmv_datepicker
 * Author: Ahmed Shareef (Modified)
 * Website: ahmedshayph.mv
 * GitHub: ahmedsharyph.mv
 * Created: 2025-08-24
 * Version: 1.1.0-mod
 * Modified: 2025-08-24 23:00
 */

const style=document.createElement("style");
style.textContent=`
.asm-datepicker {
  position:absolute !important;
  z-index:9999 !important;
  background:#fff !important;
  border-radius:12px !important;
  padding:12px !important;
  box-shadow:0 6px 20px rgba(0,0,0,0.15) !important;
  font-family:"Segoe UI", Roboto, sans-serif !important;
  font-size:14px !important;
  line-height:1.4 !important;
  letter-spacing:0 !important;
  width:auto !important;
  max-width:95vw !important;
  box-sizing:border-box !important;
}
.asm-datepicker .header { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:6px; margin-bottom:6px; color:#333 !important; }
.asm-datepicker .header button { background:none !important; border:none !important; cursor:pointer !important; font-size:18px !important; color:#6b7280 !important; transition:color 0.2s !important; }
.asm-datepicker .header button:hover { color:#1f2937 !important; }
.asm-datepicker select { font-size:14px !important; padding:4px 6px !important; border-radius:6px !important; border:1px solid #d1d5db !important; cursor:pointer !important; transition:border-color 0.2s !important; background:#fff !important; }
.asm-datepicker select:hover { border-color:#3b82f6 !important; }
.asm-datepicker .weekdays, .asm-datepicker .days { display:grid !important; grid-template-columns:repeat(7,minmax(30px,1fr)) !important; text-align:center !important; gap:4px !important; }
.asm-datepicker .weekdays div { font-weight:600 !important; font-size:12px !important; }
.asm-datepicker .days div { cursor:pointer !important; border-radius:8px !important; padding:6px 0 !important; transition:background 0.2s,color 0.2s !important; aspect-ratio:1/1 !important; }
.asm-datepicker .days div:hover:not(.disabled) { background:#3b82f6 !important; color:#fff !important; }
.asm-datepicker .days div.today { background:#bfdbfe !important; font-weight:600 !important; }
.asm-datepicker .days div.disabled { color:#d1d5db !important; cursor:not-allowed !important; }
.asm-datepicker .days div.weekend { color:#ef4444 !important; }
.asm-datepicker .footer { display:flex !important; justify-content:space-between !important; margin-top:8px !important; }
.asm-datepicker .footer button { font-size:12px !important; padding:6px 10px !important; border-radius:6px !important; border:none !important; cursor:pointer !important; background:#f3f4f6 !important; transition:background 0.2s !important; }
.asm-datepicker .footer button:hover { background:#e5e7eb !important; }
.hidden { display:none !important; }
@media(max-width:400px){
  .asm-datepicker { padding:8px !important; font-size:13px !important; }
  .asm-datepicker .days div { font-size:14px !important; padding:8px 0 !important; }
  .asm-datepicker .header, .asm-datepicker .footer { flex-wrap:wrap; gap:4px !important; }
}
`;
document.head.appendChild(style);

// ---------------- Datepicker Class ----------------
class asm_datepicker {
  constructor(input){
    this.input=input;
    this.selectedDate=null;
    this.today=new Date();
    this.currentMonth=this.today.getMonth();
    this.currentYear=this.today.getFullYear();
    this.yearLimitCurrent=input.dataset.yearLimit==="current";
    this.weekendsDisabled=input.dataset.weekendsDisabled==="true";
    this.buildPicker();
    this.bindEvents();
  }

  buildPicker(){
    this.picker=document.createElement("div");
    this.picker.className="asm-datepicker hidden";

    const header=document.createElement("div"); header.className="header";
    this.prevBtn=document.createElement("button"); this.prevBtn.textContent="◀";
    this.nextBtn=document.createElement("button"); this.nextBtn.textContent="▶";

    this.monthSelect=document.createElement("select");
    for(let m=0;m<12;m++){
      const opt=document.createElement("option"); opt.value=m;
      opt.textContent=new Date(0,m).toLocaleString('default',{month:'short'});
      if(m===this.currentMonth) opt.selected=true;
      this.monthSelect.appendChild(opt);
    }

    this.yearSelect=document.createElement("select");
    const startYear=this.today.getFullYear()-100;
    const endYear=this.yearLimitCurrent?this.today.getFullYear():this.today.getFullYear()+10;
    for(let y=startYear;y<=endYear;y++){
      const opt=document.createElement("option"); opt.value=y; opt.textContent=y;
      if(y===this.currentYear) opt.selected=true;
      this.yearSelect.appendChild(opt);
    }

    header.appendChild(this.prevBtn);
    header.appendChild(this.monthSelect);
    header.appendChild(this.yearSelect);
    header.appendChild(this.nextBtn);
    this.picker.appendChild(header);

    // Weekdays
    const weekdays=["Su","Mo","Tu","We","Th","Fr","Sa"];
    const weekDiv=document.createElement("div"); weekDiv.className="weekdays";
    weekdays.forEach((d,i)=>{
      const el=document.createElement("div"); el.textContent=d;
      if(i===5||i===6) el.style.color="#ef4444";
      weekDiv.appendChild(el);
    });
    this.picker.appendChild(weekDiv);

    // Days grid
    this.daysGrid=document.createElement("div"); this.daysGrid.className="days";
    this.picker.appendChild(this.daysGrid);

    // Footer
    const footer=document.createElement("div"); footer.className="footer";
    this.clearBtn=document.createElement("button"); this.clearBtn.textContent="Clear";
    this.todayBtn=document.createElement("button"); this.todayBtn.textContent="Today";
    this.closeBtn=document.createElement("button"); this.closeBtn.textContent="Close";
    footer.appendChild(this.clearBtn); footer.appendChild(this.todayBtn); footer.appendChild(this.closeBtn);
    this.picker.appendChild(footer);

    document.body.appendChild(this.picker);
    this.renderCalendar();
  }

  bindEvents(){
    this.input.addEventListener("focus",()=>this.show());
    this.prevBtn.addEventListener("click",()=>this.changeMonth(-1));
    this.nextBtn.addEventListener("click",()=>this.changeMonth(1));
    this.clearBtn.addEventListener("click",()=>{this.input.value=""; this.selectedDate=null;});
    this.todayBtn.addEventListener("click",()=>{this.selectDate(this.today);});
    this.closeBtn.addEventListener("click",()=>this.hide());
    this.monthSelect.addEventListener("change",()=>{this.currentMonth=parseInt(this.monthSelect.value); this.renderCalendar();});
    this.yearSelect.addEventListener("change",()=>{this.currentYear=parseInt(this.yearSelect.value); this.renderCalendar();});
    document.addEventListener("click",e=>{if(!this.picker.contains(e.target)&&e.target!==this.input)this.hide();});
    window.addEventListener("resize",()=>this.positionPicker());
  }

  show(){ this.picker.classList.remove("hidden"); this.positionPicker(); }
  hide(){ this.picker.classList.add("hidden"); }

  positionPicker(){
    const rect=this.input.getBoundingClientRect();
    let top=rect.bottom+window.scrollY;
    let left=rect.left+window.scrollX;
    const pickerHeight=this.picker.offsetHeight;
    const pickerWidth=this.picker.offsetWidth;
    if(top+pickerHeight>window.scrollY+window.innerHeight) top=rect.top+window.scrollY-pickerHeight-2;
    if(left+pickerWidth>window.scrollX+window.innerWidth) left=window.scrollX+window.innerWidth-pickerWidth-2;
    this.picker.style.top=top+"px"; this.picker.style.left=left+"px";
  }

  changeMonth(delta){ 
    let m=this.currentMonth+delta; let y=this.currentYear; 
    if(m<0){m=11;y--;} if(m>11){m=0;y++;} 
    if(this.yearLimitCurrent&&y>this.today.getFullYear()) return; 
    this.currentMonth=m; this.currentYear=y; this.renderCalendar(); 
  }

  renderCalendar(){
    this.monthSelect.value=this.currentMonth; this.yearSelect.value=this.currentYear;
    const firstDay=new Date(this.currentYear,this.currentMonth,1).getDay();
    const daysInMonth=new Date(this.currentYear,this.currentMonth+1,0).getDate();
    this.daysGrid.innerHTML="";
    for(let i=0;i<firstDay;i++) this.daysGrid.appendChild(document.createElement("div"));
    for(let d=1;d<=daysInMonth;d++){
      const dayEl=document.createElement("div"); dayEl.textContent=d;
      const dateObj=new Date(this.currentYear,this.currentMonth,d);
      if(dateObj.toDateString()===this.today.toDateString()) dayEl.classList.add("today");
      if(dateObj.getDay()===5||dateObj.getDay()===6) dayEl.classList.add("weekend");
      if(this.weekendsDisabled&&(dateObj.getDay()===5||dateObj.getDay()===6)) dayEl.classList.add("disabled");
      if(this.yearLimitCurrent&&dateObj>this.today) dayEl.classList.add("disabled");
      dayEl.addEventListener("click",()=>{if(!dayEl.classList.contains("disabled"))this.selectDate(dateObj)});
      this.daysGrid.appendChild(dayEl);
    }
  }

  selectDate(dateObj){
    const yyyy=dateObj.getFullYear();
    const mm=String(dateObj.getMonth()+1).padStart(2,"0");
    const dd=String(dateObj.getDate()).padStart(2,"0");
    this.input.value=`${yyyy}-${mm}-${dd}`;
    this.selectedDate=dateObj;
    this.hide();
  }
}

// ---------------- Initialize datepickers with hidden-input support ----------------
function initDatepickerWhenVisible(input){
  if(input.offsetParent!==null){
    new asm_datepicker(input);
  } else {
    const observer=new MutationObserver(()=>{
      if(input.offsetParent!==null){
        observer.disconnect();
        new asm_datepicker(input);
      }
    });
    observer.observe(input,{attributes:true,attributeFilter:['style','class']});
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".asmv_datepicker").forEach(input=>{
    initDatepickerWhenVisible(input);
  });
});


