
KAFIHI CALENDAR - README
=======================

Version: 1.0
Modified: 2025-08-25
Author: Your Name

DESCRIPTION
-----------
Kafihi Calendar is a lightweight, standalone JavaScript datepicker that automatically converts all dates to GMT+5. It provides flexible options for selecting dates, including disabling future or past dates. It’s easy to integrate and requires no external libraries like jQuery.

FEATURES
--------
- Lightweight, no dependencies.
- GMT+5 date conversion built-in.
- Modern responsive design.
- Supports past-only or future-only date selections.
- Highlight today’s date.
- Weekends highlighted (Friday & Saturday).
- Clear, Today, and Close buttons.
- Mobile-friendly responsive layout.

FILES
-----
- `kafihi-calendar.html` – demo HTML file with usage examples.
- `kafihi-calendar.css` – optional: extract CSS styles.
- `kafihi-calendar.js` – optional: extract JavaScript logic.

INSTALLATION
------------
1. Include the CSS (optional but recommended for styling):

   ```html
   <link rel="stylesheet" href="kafihi-calendar.css">
   ```

2. Include the JavaScript:

   ```html
   <script src="kafihi-calendar.js"></script>
   ```

3. Add the input field(s) with class `kafihi-calendar`:

   ```html
   <input type="text" class="kafihi-calendar" placeholder="YYYY-MM-DD">
   ```

4. Optional attributes for date restrictions:
   - `data-disable-future="true"` – disables selection of future dates.
   - `data-disable-past="true"` – disables selection of past dates.

   Examples:

   ```html
   <!-- Normal Datepicker -->
   <input type="text" class="kafihi-calendar" placeholder="YYYY-MM-DD">

   <!-- Past-only Datepicker (future disabled) -->
   <input type="text" class="kafihi-calendar" data-disable-future="true" placeholder="YYYY-MM-DD">

   <!-- Future-only Datepicker (past disabled) -->
   <input type="text" class="kafihi-calendar" data-disable-past="true" placeholder="YYYY-MM-DD">
   ```

USAGE
-----
1. Once the script is included, all inputs with `kafihi-calendar` class are automatically initialized.
2. Clicking on the input will open the popup calendar.
3. Navigate months with ◀ / ▶ buttons or select directly using the dropdowns.
4. Select a date by clicking on a day.
5. Use the **Clear**, **Today**, or **Close** buttons in the footer as needed.
6. Future/past restriction is automatically enforced if the respective `data-` attribute is set.

CONFIGURATION OPTIONS
---------------------
- **Class selector**: `.kafihi-calendar` (default). Can be customized by modifying the JS initialization.
- **Future date disable**: `data-disable-future="true"`  
- **Past date disable**: `data-disable-past="true"`  

CUSTOMIZATION
-------------
- **Styling**: Modify CSS variables or classes:
  - `.kafihi-calendar` – input field style.
  - `.kafihi-popup` – popup container.
  - `.kafihi-header` – month/year navigation header.
  - `.kafihi-weekdays` / `.kafihi-days` – calendar grid.
  - `.kafihi-footer` – buttons at the bottom.
- **Date format**: By default `YYYY-MM-DD`. Change formatting inside `formatDate(date)` function in JS.
- **Weekend color**: By default red (#ef4444). Modify `.kafihi-days .weekend` CSS class.

EXAMPLES
--------
```html
<h3>Normal:</h3>
<input type="text" class="kafihi-calendar" placeholder="YYYY-MM-DD">

<h3>Past-only:</h3>
<input type="text" class="kafihi-calendar" data-disable-future="true" placeholder="YYYY-MM-DD">

<h3>Future-only:</h3>
<input type="text" class="kafihi-calendar" data-disable-past="true" placeholder="YYYY-MM-DD">
```

ADVANCED
--------
- You can extract `kafihi-calendar.css` and `kafihi-calendar.js` into separate files for cleaner structure.
- Multiple instances on the same page are supported.
- Popup automatically positions below the input, with adjustments to stay within viewport.

SUPPORT
-------
For issues or enhancements, please contact: [Your email or GitHub]

LICENSE
-------
MIT License – free to use and modify.

CHANGELOG
---------
v1.0 (2025-08-25)
- Initial release
- Features: normal, past-only, future-only datepickers
- GMT+5 adjustment
- Responsive, modern design
- Highlight weekends and today

NOTES
-----
- The calendar converts all selected dates to GMT+5 internally.
- Ensure the `kafihi-calendar` class is correctly applied to all input elements you want to attach the calendar to.
- Avoid using multiple datepicker libraries simultaneously on the same input to prevent conflicts.
