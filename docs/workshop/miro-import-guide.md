# Import the board in Miro (from `miro-board.csv`)

Unlike Microsoft Whiteboard, Miro **does** create one sticky note per cell when pasting from a spreadsheet, and
preserves the grid layout. The file `docs/workshop/miro-board.csv` is already laid out as a board:
**columns = swimlanes**, and each cell = one card (16 total).

## Steps (≈ 5 min)

1. **Open the CSV in a spreadsheet**:
   - *Google Sheets (recommended)*: `File > Import > Upload` → `miro-board.csv` → "Detect automatically". Handles commas well.
   - *Excel*: open it; if everything falls in column A (locale with `;`), use `Data > Text to Columns > Delimited > Comma`.
2. **Select** the range with content (from `A1` to `G4`).
3. **Copy** (`Ctrl/Cmd+C`).
4. In **Miro**, click on an empty area of the canvas and **paste** (`Ctrl/Cmd+V`). Choose **"Paste as sticky notes"**
   (keeps the grid). Each cell becomes a note; row 1 stays as column headers.
5. **Clean up**: delete the ~5 empty notes that appear from blank cells (the 3rd row of lanes with 2 cards).
   - *Alternative without gaps*: instead of pasting everything at once, select and paste **column by column** (one swimlane at a time);
     this lets you place each lane cleanly with spacing.
6. **Color by swimlane** (optional): select the notes in a column → change the color for visual scanning.
7. **Lane headers** (optional, recommended): wrap each column in a Miro **Frame** with the swimlane name,
   or convert the header note into large text. This creates a "real" swimlane board.
8. **Dynamics**: add `To do / Doing / Done` frames on the right so teams can drag their card there when they pick it up.

> Miro limits: up to 5,000 cells / 50 rows / 100 columns per paste. Here we use 4×7 = plenty of margin.
> The full detail of each card is in `whiteboard-backlog.md` (the notes only carry enough to scan at a glance).

## Do you want it 100% set up via API? (optional)

Miro has a **REST API**: I can generate a Node script that builds the board automatically — frames per swimlane, colored and
positioned notes, and even dependency arrows. You would need a **Miro access token** (you create a developer app and copy the token;
**do not put it in the repo or paste it to me** — you would use it yourself via an environment variable).
If you want this, let me know and I'll generate the script (verifying the exact API endpoints at that time).
