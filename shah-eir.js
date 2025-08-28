// shah-eir.js
document.addEventListener("DOMContentLoaded", function () {
  const webAppUrl = "https://script.google.com/macros/s/AKfycbx3iquv624k2RUg3kstfSXBJV_CTu8TjkwcuO8LyAGjnfJp7hblxP24Y7xdJnoU00tj/exec?sheet=shah_eir_original";

  const tableHead = document.querySelector("#dataTable thead");
  const tableBody = document.querySelector("#dataTable tbody");
  const loading = document.getElementById("loading");
  const beneficiaryInput = document.getElementById("beneficiaryInput");
  const beneficiaryList = document.getElementById("beneficiaryList");
  const clearBtn = document.getElementById("clearFilter");
  const livingFilter = document.getElementById("livingFilter");

  const headers = [
    "currently_living", "unique_id", "foolhumaa_form_number", "beneficiary_national_id",
    "beneficiary_name", "dob", "age", "sex", "island_residence", "current_address", "mother_name",
    "mother_national_id", "primary_contact", "caregiver_name", "caregiver_id", "caregiver_contact",
    "country", "birth_weight", "birth_facility", "hbv_not_24h", "remarks"
  ];

  function calculateAge(dobStr) {
    if (!dobStr) return "";
    const dob = new Date(dobStr);
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    let ageStr = "";
    if (years) ageStr += years + "Y ";
    if (months) ageStr += months + "M ";
    if (days) ageStr += days + "D";
    return ageStr.trim();
  }

  function renderHeader() {
    let headRow = "<tr>";
    headers.forEach(h => {
      const displayName = h.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      headRow += `<th>${displayName}</th>`;
    });
    headRow += "</tr>";
    tableHead.innerHTML = headRow;
  }

  function renderTable(data) {
    data.sort((a, b) => {
      if (!a.dob) return 1;
      if (!b.dob) return -1;
      return new Date(b.dob) - new Date(a.dob);
    });

    let rows = "";
    data.forEach(row => {
      rows += "<tr>";
      headers.forEach(h => {
        if (h === "age") {
          rows += `<td>${calculateAge(row.dob)}</td>`;
        } else {
          rows += `<td>${row[h] || ""}</td>`;
        }
      });
      rows += "</tr>";
    });
    tableBody.innerHTML = rows;
  }

  let fullData = [];
  let filteredData = [];

  function populateBeneficiaryOptions(data) {
    const ids = [...new Set(data.map(d => d.beneficiary_national_id).filter(Boolean))];
    renderBeneficiaryList(ids);
    populateLivingFilter(data);
  }

  function renderBeneficiaryList(listItems) {
    beneficiaryList.innerHTML = "";
    listItems.forEach(id => {
      const li = document.createElement('li');
      li.textContent = id;
      li.addEventListener('click', () => {
        beneficiaryInput.value = id;
        beneficiaryList.style.display = 'none';
        applyFilters();
      });
      beneficiaryList.appendChild(li);
    });
  }

  function populateLivingFilter(data) {
    const uniqueLiving = [...new Set(data.map(d => d.currently_living).filter(Boolean))].sort();
    livingFilter.innerHTML = "<option value=''>All</option>";
    uniqueLiving.forEach(val => {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = val;
      livingFilter.appendChild(option);
    });
  }

  function applyFilters() {
    const search = beneficiaryInput.value.toLowerCase();
    const living = livingFilter.value;

    filteredData = fullData.filter(row => {
      const matchesSearch = headers.some(key => {
        return row[key] && row[key].toString().toLowerCase().includes(search);
      });
      const matchesLiving = living ? row.currently_living === living : true;
      return matchesSearch && matchesLiving;
    });

    renderTable(filteredData);

    const dropdownIds = [...new Set(filteredData.map(d => d.beneficiary_national_id).filter(Boolean))];
    renderBeneficiaryList(dropdownIds);
  }

  beneficiaryInput.addEventListener('input', () => {
    beneficiaryList.style.display = beneficiaryInput.value ? 'block' : 'none';
    applyFilters();
  });

  livingFilter.addEventListener('change', applyFilters);

  document.addEventListener('click', e => {
    if (!e.target.closest('.relative')) beneficiaryList.style.display = 'none';
  });

  clearBtn.addEventListener('click', () => {
    beneficiaryInput.value = "";
    livingFilter.value = "";
    beneficiaryList.style.display = 'none';
    filteredData = [...fullData];
    renderTable(filteredData);
    populateBeneficiaryOptions(fullData);
  });

  const scheduleButton = document.getElementById('scheduleButton');
  const scheduleDropdown = document.getElementById('scheduleDropdown');
  scheduleButton.addEventListener('click', e => {
    e.stopPropagation();
    scheduleDropdown.classList.toggle('hidden');
  });
  document.addEventListener('click', () => {
    scheduleDropdown.classList.add('hidden');
  });

  async function loadData() {
    loading.textContent = "Loading data...";
    try {
      const res = await fetch(webAppUrl);
      const result = await res.json();
      if (result.status !== "success") {
        loading.textContent = "Error: " + result.message;
        return;
      }

      fullData = result.data;
      filteredData = [...fullData];

      renderHeader();
      renderTable(filteredData);
      populateBeneficiaryOptions(fullData);

      loading.style.display = "none";
    } catch (err) {
      loading.textContent = "Failed to load data.";
      console.error(err);
    }
  }

  loadData();
});
