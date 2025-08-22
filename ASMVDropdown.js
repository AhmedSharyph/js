/*!
 * ASMVDropdown.js
 * 
 * A lightweight, customizable dropdown replacement with:
 *  - Searchable options
 *  - Dynamic data fetching
 *  - Optional "Add New" support
 *
 * Author   : Ahmed Shareef
 * GitHub   : https://github.com/AhmedSharyph
 * Website  : https://ahmedsharyph.mv
 * License  : MIT
 * Version  : 1.1.0
 */

class ASMVDropdown {
  constructor(selectEl, options = {}) {
    this.select = selectEl;
    this.container = selectEl.parentElement;

    // Options (with defaults)
    this.options = Object.assign({
      allowAdd: selectEl.getAttribute('data-allow-add') === 'true',
      url: selectEl.getAttribute('data-url') || null,
      classes: {
        hiddenSelect: 'asmv-hidden-select',
        container: 'dropdown-container',
        selected: 'dropdown-selected',
        list: 'dropdown-list',
        item: 'dropdown-item',
        input: 'search-input'
      }
    }, options);

    this.allowAdd = this.options.allowAdd;
    this.url = this.options.url;
    this.items = Array.from(selectEl.options).map(opt => opt.text).filter(t => t);

    // Hide original select
    this.select.classList.add(this.options.classes.hiddenSelect);

    this.createDropdown();
    this.init();
  }

  createDropdown() {
    // Selected box
    this.selectedDiv = document.createElement('div');
    this.selectedDiv.className = this.options.classes.selected;
    this.selectedDiv.textContent = this.select.options[this.select.selectedIndex]?.text || "-- Select --";
    this.container.appendChild(this.selectedDiv);

    // Dropdown list
    this.dropdownList = document.createElement('div');
    this.dropdownList.className = this.options.classes.list;

    // Search input
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.className = this.options.classes.input;
    this.searchInput.placeholder = 'Type to search...';

    this.dropdownList.appendChild(this.searchInput);
    this.container.appendChild(this.dropdownList);

    // Initial items
    this.items.forEach(item => this.addItem(item));
  }

  addItem(item) {
    const div = document.createElement('div');
    div.textContent = item;
    div.className = this.options.classes.item;
    div.addEventListener('click', () => this.selectItem(item));
    this.dropdownList.appendChild(div);
  }

  async init() {
    // Fetch dynamic data if URL provided
    if (this.url) {
      try {
        const res = await fetch(this.url);
        const json = await res.json();
        const fetched = json.data.flat();
        fetched.forEach(f => {
          if (!this.items.includes(f)) {
            this.items.push(f);
            const option = document.createElement('option');
            option.value = f;
            option.textContent = f;
            this.select.appendChild(option);
            this.addItem(f);
          }
        });
      } catch (err) {
        console.error('ASMVDropdown: Error fetching data ->', err);
      }
    }

    // Open/close dropdown
    this.selectedDiv.addEventListener('click', () => {
      this.dropdownList.style.display = this.dropdownList.style.display === 'block' ? 'none' : 'block';
      this.searchInput.focus();
    });

    // Live search filter
    this.searchInput.addEventListener('input', () => {
      const val = this.searchInput.value.trim().toLowerCase();
      const filtered = this.items.filter(i => i.toLowerCase().includes(val));
      this.renderFiltered(filtered);
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!this.container.contains(e.target)) {
        this.dropdownList.style.display = 'none';
      }
    });
  }

  renderFiltered(list) {
    this.dropdownList.querySelectorAll('.' + this.options.classes.item).forEach(d => d.remove());
    list.forEach(item => this.addItem(item));

    // Allow "Add New" option
    if (this.allowAdd && this.searchInput.value.trim() && !this.items.includes(this.searchInput.value)) {
      this.addItem('[Add] ' + this.searchInput.value);
    }
  }

  selectItem(item) {
    if (this.allowAdd && item.startsWith('[Add] ')) {
      const newItem = item.replace('[Add] ', '');
      this.items.push(newItem);
      const option = document.createElement('option');
      option.value = newItem;
      option.textContent = newItem;
      this.select.appendChild(option);
      this.select.value = newItem;
      this.selectedDiv.textContent = newItem;
    } else {
      this.select.value = item;
      this.selectedDiv.textContent = item;
    }
    this.dropdownList.style.display = 'none';
    this.searchInput.value = '';
  }

  // Inject default styles (runs once)
  static injectStyles() {
    if (document.getElementById("asmv-dropdown-styles")) return;
    const style = document.createElement("style");
    style.id = "asmv-dropdown-styles";
    style.textContent = `
      .asmv-hidden-select {
        display: none !important;
        visibility: hidden !important;
        position: absolute !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      .dropdown-container {
        position: relative;
        width: 100%;
      }
      .dropdown-selected {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        background-color: #fff;
        cursor: pointer;
      }
      .dropdown-list {
        position: absolute;
        top: calc(100%);
        left: 0;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: #fff;
        z-index: 50;
        display: none;
      }
      .dropdown-item {
        padding: 0.5rem;
        cursor: pointer;
      }
      .dropdown-item:hover {
        background-color: #3b82f6;
        color: white;
      }
      .search-input {
        padding: 0.5rem;
        width: 100%;
        border-bottom: 1px solid #ddd;
        outline: none;
      }
    `;
    document.head.appendChild(style);
  }
}

// Auto-init all .asmv-select elements with defaults
document.addEventListener("DOMContentLoaded", () => {
  ASMVDropdown.injectStyles();
  document.querySelectorAll('.asmv-select').forEach(sel => new ASMVDropdown(sel));
});
