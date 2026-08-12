BOMO Partner Studio — Room Rate Plan Form

The room rate plan experience is a single-page form.

Sections:
1. Basics
2. Rooms & availability
3. Rate plan application rules
4. Guest policies
5. Overrides & promo rates
6. Test data simulator

UI behavior:
- The form header links directly to room-rate-plan-diocs.html for partner guidance.
- In-page section navigation replaces the multi-page wizard.
- The summary sidebar and duplicated review step are removed.
- Optional and advanced controls use progressive disclosure.
- Service charge and local tax are not shown.
- Base room rates are inherited from Room Settings; there is no duplicate pricing section.
- VAT Inclusive or VAT Exclusive is selected in Add Room Type before Room Description.
- Rate plans inherit the room-level VAT treatment and do not provide a conflicting VAT input.
- The simulator shows the applicable VAT result; platform fee remains an inherited setting.
- Date overrides and promo rates share one list and editor.
- Overrides and promos can be added, viewed, edited, and removed.
- Overrides and promos have separate tables and creation actions.
- Example rate plans use scenario-based names and are clearly marked as editable test data.
- Selecting an example pre-fills its connected rooms, dates, application rules, guest policies, overrides, promos, and simulator samples.
- Example override and promo names describe the scenario; their amount, date, code, and eligibility remain in dedicated fields.
- Multiple matching overrides always resolve to one applied override.
- Resolution options support priority, highest rate, or lowest rate.
- Sample overrides and promos are viewable and editable.
- The test data simulator uses sample bookings to preview override, promo, VAT, and settlement results.
- Draft and paused plans can be previewed without changing status; the result clearly warns that they are not bookable.
- Draft data persists in localStorage.
- Each plan is stored independently by its URL plan ID.
- Plan statuses include Draft, Active, Scheduled, Paused, and Archived.
- Only Active or eligible Scheduled plans can be selected for booking.
- Room, validity, booking window, stay length, and stay-day rules determine eligibility.
- The eligible conditional plan with the smallest priority number applies first.
- A Default plan is used only when no conditional plan matches.
- Exactly one rate plan applies to a booking.
- Guest policies use the expanded cancellation and payment choices.
- Pay at Property requires a deposit percentage; the remaining balance is collected at the property.
- Each plan has a separate read-only report view with its setup, overrides, and promo rates.
- Rooms & Rates labels the compact overview as "Available / active promo and override plans".
- The complete create/edit experience is served from form.html; the old step-based wizard is no longer used.
