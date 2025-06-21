<script>
    const apiUrl = "https://script.google.com/macros/s/AKfycbyqF0od4uI8H-cC0XPG3dA38O9-7dcEeTCAHcoB9xCkyZa5TUZuzSiNU9LR3XMAe_VM/exec"; // <-- Replace with your real URL

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or no access.");
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);

        const staffList = document.getElementById("staffList");
        staffList.innerHTML = "";
        staffList.disabled = false;

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Entered By";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        staffList.appendChild(defaultOption);

        data.values.forEach(row => {
          const option = document.createElement("option");
          option.value = row[0];
          option.textContent = row[0];
          staffList.appendChild(option);
        });

        document.getElementById("status").style.display = "none";
      })
      .catch(err => {
        document.getElementById("status").className = "error";
        document.getElementById("status").textContent = "Access denied or you are not logged into a Google Account.";
        console.error(err);
      });
  </script>