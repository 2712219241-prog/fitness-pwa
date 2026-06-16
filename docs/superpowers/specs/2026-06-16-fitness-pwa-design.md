# Personal Fitness PWA Design

Date: 2026-06-16

## Goal

Build a mobile-first personal fitness record PWA that can be deployed to a public URL and opened from any modern phone browser. The first version is for one user only, with no login, no server database, and no cloud sync. Data is stored locally on the phone and can be exported for viewing or backup.

## Product Shape

The app is a responsive PWA optimized for iPhone usage while remaining usable on Android and desktop browsers. It should be hosted publicly, such as on Cloudflare Pages or Vercel, so a phone with internet access can open it without a computer running locally.

Users can add the site to the iPhone home screen and use it like a lightweight app. Offline-friendly behavior is desirable for saved app assets, but the first version does not need background sync or native health integrations.

## Visual Direction

The interface follows the provided reference image:

- White cards on a light gray background.
- Orange as the primary accent color.
- Large rounded cards and simple bottom navigation.
- Minimal, clean UI with no marketing page.
- Unified illustrated exercise imagery rather than photos.
- No plan, team, feed, step count, or unrelated sports entries.

The app opens directly to the recording experience. It should feel like a personal training log, not a landing page.

## Navigation

Use a three-item bottom navigation:

- Record
- Stats
- Export

The top of each page shows only the current page title and contextual controls. Do not duplicate the same Record / Stats / Export navigation in both the header and bottom bar.

## Record Page

The record page is date-based. It supports recording today and backfilling past dates.

The page includes:

- Today's summary card with date, strength record count, climb duration, and body data state.
- Backfill entry for selecting a past date and adding records.
- Strength training section.
- Climb section.
- Body data section.

### Strength Training

Strength training is grouped by body part:

- Chest
- Shoulders
- Back
- Arms
- Abs

Each body part contains exercise cards. Exercises come from a preset library and can also be added or deleted by the user.

Each exercise card includes:

- Exercise name.
- Body part.
- Unified illustrated image.
- A control to add a new set.
- A list or compact summary of sets for the selected date.

Each set records:

- Weight.
- Reps.
- Automatic timestamp at the moment the set is added.

Users should be able to delete or edit incorrectly entered sets.

### Climb Cardio

Cardio is intentionally limited to incline climbing. It is separate from strength training.

Each climb record includes:

- Duration.
- Notes.
- Automatic timestamp or date association.

No generic running, cycling, swimming, walking, yoga, jump rope, or other cardio categories are included in version one.

### Body Data

Body data includes only:

- Weight.
- Arm circumference.
- Waist circumference.

Values are associated with a date. Users can edit or replace the values for a date.

## Stats Page

The stats page supports selecting a date range with a start date and end date.

It includes two main chart groups:

### Body Trend Charts

Charts show changes over time for:

- Weight.
- Arm circumference.
- Waist circumference.

The UI should allow quickly generating a chart for the selected date range. A combined chart is acceptable if visually clear, with distinct colors and a legend.

### Strength Trend Charts

Users can select an exercise and generate charts over the selected date range.

The strength stats include:

- Max weight per date.
- Total reps per date.
- Total volume per date, calculated as weight times reps and summed across sets.

The chart UI should make the selected exercise and metric clear. The chart visuals should be more polished than a plain line graph, using clean cards, legends, subtle grid lines, and restrained accent colors.

## Export Page

The export page supports date range selection.

### CSV Export

CSV is for human-readable analysis in Excel, WPS, Numbers, or similar tools.

The CSV export should include:

- Date.
- Record type.
- Body part when applicable.
- Exercise name when applicable.
- Set index when applicable.
- Weight when applicable.
- Reps when applicable.
- Set timestamp when applicable.
- Climb duration when applicable.
- Climb notes when applicable.
- Body weight when applicable.
- Arm circumference when applicable.
- Waist circumference when applicable.

### JSON Backup

JSON is for complete backup and restore. It preserves the full local data structure, including exercises, records, sets, body data, climb entries, and metadata needed by the app.

The export page includes:

- Export CSV.
- Export JSON backup.
- Import JSON backup.

Import should validate the file shape before replacing or merging local data. The first version can use a clear replace flow with confirmation.

## Data Storage

Use browser local storage suited for structured local app data. IndexedDB is preferred over simple localStorage because records are structured and may grow over time.

Data entities:

- Exercise: id, name, bodyPart, illustrationKey, createdAt, updatedAt, deletedAt as a nullable timestamp for soft-deleted custom exercises.
- DailyRecord: date, strength entries, climb entries, body data, updatedAt.
- StrengthSet: id, exerciseId, bodyPart, weight, reps, timestamp.
- ClimbEntry: id, durationMinutes, notes, timestamp.
- BodyMeasurement: date, weightKg, armCm, waistCm, updatedAt.

The app should avoid server-side storage in version one.

## Deployment

The site should be deployable to a public static hosting service such as Cloudflare Pages or Vercel.

Expected deployment result:

- A public HTTPS URL.
- PWA metadata and icons.
- Mobile-friendly layout.
- Static assets served without requiring a local computer.

## Testing And Verification

The implementation should verify:

- The app loads on a mobile viewport.
- Records persist after refresh.
- Backfilled records save under the selected date.
- Strength sets store weight, reps, and timestamp.
- Climb records store duration and notes.
- Body measurements store weight, arm circumference, and waist circumference.
- Stats respect the selected date range.
- CSV export contains expected rows.
- JSON export can be imported to restore data.
- The build succeeds.

## Out Of Scope For Version One

- User accounts.
- Cloud sync.
- Social features.
- Team, plan, or feed pages.
- Step counting.
- Apple Health or wearable integrations.
- App Store or native iOS release.
- Multiple users.
- Generic cardio categories beyond incline climbing.

## Future Extensions

Possible later additions:

- Cloud backup and multi-device sync.
- Save chart images or PDF reports.
- More body measurements.
- More polished exercise illustrations.
- Training templates.
- Progress goals.
- Native app packaging.
