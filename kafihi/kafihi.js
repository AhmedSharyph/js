(function(){
  function createKafihiCalendar(input){
    const popup = document.createElement("div");
    popup.className="kafihi-popup";
    document.body.appendChild(popup);

    let selectedDate = null;
    let today=new Date();
    let currentMonth=today.getMonth();
    let currentYear=today.getFullYear();

    const disableFuture = input.dataset.disableFuture === "true";
    const disablePast = input.dataset.disablePast === "true";

    function toGMTPlus5(date){ return new Date(date.getTime() + 5*60*60*1000); }
    function formatDate(date){ 
      if(!date) return "";
      const gmt5=toGMTPlus5(date);
      const yyyy=gmt5.getFullYear();
      const mm=String(gmt5.getMonth()+1).padStart(2,"0");
      const dd=String(gmt5.getDate()).padStart(2,"0");
      return `${yyyy}-${mm}-${dd}`;
    }

    function renderCalendar(){
      popup.innerHTML="";
      const header=document.createElement("div"); header.className="kafihi-header";
      const prevBtn=document.createElement("button"); prevBtn.textContent="◀";
      const nextBtn=document.createElement("button"); nextBtn.textContent="▶";

      const monthSelect=document.createElement("select");
      for(let m=0;m<12;m++){ 
        const opt=document.createElement("option"); opt.value=m; opt.textContent=new Date(0,m).toLocaleString('default',{month:'short'}); 
        if(m===currentMonth) opt.selected=true;
        monthSelect.appendChild(opt);
      }

      const yearSelect=document.createElement("select");
      for(let y=today.getFullYear()-100;y<=today.getFullYear()+10;y++){ 
        const opt=document.createElement("option"); opt.value=y; opt.textContent=y; 
        if(y===currentYear) opt.selected=true; yearSelect.appendChild(opt);
      }

      header.appendChild(prevBtn); header.appendChild(monthSelect); header.appendChild(yearSelect); header.appendChild(nextBtn);
      popup.appendChild(header);

      // Weekdays
      const weekdays=["Su","Mo","Tu","We","Th","Fr","Sa"];
      const weekDiv=document.createElement("div"); weekDiv.className="kafihi-weekdays";
      weekdays.forEach((d,i)=>{ const el=document.createElement("div"); el.textContent=d; if(i===5||i===6) el.style.color="#ef4444"; weekDiv.appendChild(el); });
      popup.appendChild(weekDiv);

      // Days
      const daysDiv=document.createElement("div"); daysDiv.className="kafihi-days";
      const firstDay=new Date(currentYear,currentMonth,1).getDay();
      const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();
      for(let i=0;i<firstDay;i++) daysDiv.appendChild(document.createElement("div"));
      const gmtToday=toGMTPlus5(new Date());

      for(let d=1;d<=daysInMonth;d++){
        const dayEl=document.createElement("div"); dayEl.textContent=d;
        const dateObj=new Date(currentYear,currentMonth,d);

        if(dateObj.toDateString()===today.toDateString()) dayEl.classList.add("today");
        if(dateObj.getDay()===5||dateObj.getDay()===6) dayEl.classList.add("weekend");

        let disabled=false;
        if(disableFuture && dateObj>today) disabled=true;
        if(disablePast && dateObj<today) disabled=true;
        if(disabled){ dayEl.classList.add("disabled"); } 
        else { dayEl.addEventListener("click",()=>{ selectedDate=dateObj; input.value=formatDate(selectedDate); popup.style.display="none"; }); }

        daysDiv.appendChild(dayEl);
      }
      popup.appendChild(daysDiv);

      // Footer
      const footer=document.createElement("div"); footer.className="kafihi-footer";
      const clearBtn=document.createElement("button"); clearBtn.textContent="Clear";
      const todayBtn=document.createElement("button"); todayBtn.textContent="Today";
      const closeBtn=document.createElement("button"); closeBtn.textContent="Close";

      clearBtn.addEventListener("click",()=>{ selectedDate=null; input.value=""; });
      todayBtn.addEventListener("click",()=>{
        selectedDate=new Date();
        if(disableFuture && selectedDate>today) return;
        if(disablePast && selectedDate<today) return;
        input.value=formatDate(selectedDate); renderCalendar();
      });
      closeBtn.addEventListener("click",()=>{ popup.style.display="none"; });

      footer.appendChild(clearBtn); footer.appendChild(todayBtn); footer.appendChild(closeBtn);
      popup.appendChild(footer);

      // Navigation
      prevBtn.addEventListener("click",()=>{ currentMonth--; if(currentMonth<0){currentMonth=11;currentYear--;} renderCalendar(); });
      nextBtn.addEventListener("click",()=>{ currentMonth++; if(currentMonth>11){currentMonth=0;currentYear++;} renderCalendar(); });
      monthSelect.addEventListener("change",()=>{ currentMonth=parseInt(monthSelect.value); renderCalendar(); });
      yearSelect.addEventListener("change",()=>{ currentYear=parseInt(yearSelect.value); renderCalendar(); });
    }

    function showPopup(){
      popup.style.display="block";
      const rect=input.getBoundingClientRect();
      popup.style.top=rect.bottom+window.scrollY+"px";
      popup.style.left=rect.left+window.scrollX+"px";
      renderCalendar();
    }

    input.addEventListener("focus",showPopup);
    document.addEventListener("click",(e)=>{ if(!popup.contains(e.target) && e.target!==input) popup.style.display="none"; });
  }

  document.querySelectorAll(".kafihi-calendar").forEach(input=>createKafihiCalendar(input));
})();
