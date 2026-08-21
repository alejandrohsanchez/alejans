const clock = document.querySelector("#clock");
const timeZoneCounter = document.querySelector("#time-zone-counter");
const themeToggle = document.querySelector("#theme-toggle");
const themeStorageKey = "alejans-theme";
const easternTimeZone = "America/New_York";

// Edit table content here. Add another array for a row, or add another value
// inside each row for a new column. Widths and ASCII borders update automatically.
const tables = {
  status: {
    elementId: "status-table",
    columnClasses: ["ascii-label", ""],
    rows: [
      ["what_im_probably_doing_right_now", "sleeping"],
      ["working_on", "small things, carefully"],
      ["location", "the tropics"],
      ["where_you_can_find_me", "most likely in the lab"],
    ],
  },
  notes: {
    elementId: "notes-table",
    emptyMessage: "no notes yet",
    emptyColumnWidth: 42,
    columnClasses: ["ascii-label", ""],
    rows: [
      // ["2026-08-21 14:30", { text: "first-note.md", href: "#" }],
    ],
  },
  published: {
    elementId: "published-table",
    emptyMessage: "no published project yet",
    emptyColumnWidth: 42,
    columnClasses: ["ascii-label", ""],
    rows: [
      // ["2026-08-21 14:30", { text: "project-name/", href: "#" }],
    ],
  },
};

function normalizeCell(cell) {
  if (typeof cell === "object" && cell !== null) {
    return {
      text: String(cell.text ?? ""),
      href: cell.href,
      className: cell.className ?? "",
    };
  }

  return { text: String(cell ?? ""), href: undefined, className: "" };
}

function appendBorderLine(table, widths) {
  const border = document.createElement("span");
  border.className = "ascii-border";
  border.textContent = `+${widths.map((width) => "-".repeat(width + 2)).join("+")}+`;
  table.append(border, "\n");
}

function renderAsciiTable(config) {
  const table = document.querySelector(`#${config.elementId}`);
  if (!table) return;

  const isEmpty = config.rows.length === 0;
  const sourceRows = !isEmpty
    ? config.rows
    : [[config.emptyMessage ?? "empty"]];
  const columnCount = Math.max(...sourceRows.map((row) => row.length), 1);
  const rows = sourceRows.map((row) =>
    Array.from({ length: columnCount }, (_, index) => normalizeCell(row[index])),
  );
  const widths = Array.from({ length: columnCount }, (_, columnIndex) => {
    const contentWidth = Math.max(...rows.map((row) => row[columnIndex].text.length));
    const emptyWidth = isEmpty && columnIndex === 0 ? config.emptyColumnWidth ?? 0 : 0;
    return Math.max(contentWidth, emptyWidth);
  });

  table.replaceChildren();
  appendBorderLine(table, widths);

  rows.forEach((row) => {
    row.forEach((cell, columnIndex) => {
      const edge = document.createElement("span");
      edge.className = "ascii-border";
      edge.textContent = "|";
      table.append(edge, " ");

      const content = document.createElement(cell.href ? "a" : "span");
      content.textContent = cell.text;
      content.className = cell.className || config.columnClasses?.[columnIndex] || "";
      if (cell.href) content.href = cell.href;
      table.append(content, " ".repeat(widths[columnIndex] - cell.text.length + 1));
    });

    const edge = document.createElement("span");
    edge.className = "ascii-border";
    edge.textContent = "|";
    table.append(edge, "\n");
    appendBorderLine(table, widths);
  });
}

function applyTheme(theme, persist = false) {
  const activeTheme = theme === "light" ? "light" : "dark";
  const nextTheme = activeTheme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = activeTheme;

  if (themeToggle) {
    themeToggle.textContent = `[ ${nextTheme} ]`;
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeToggle.setAttribute("aria-pressed", String(activeTheme === "light"));
  }

  if (persist) {
    try {
      localStorage.setItem(themeStorageKey, activeTheme);
    } catch {}
  }
}

function getTimeZoneOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  const timeInUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return Math.round((timeInUtc - date.getTime()) / 60000);
}

function updateTimeZoneCounter(date) {
  if (!timeZoneCounter) return;

  const visitorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const visitorOffset = visitorTimeZone
    ? getTimeZoneOffsetMinutes(date, visitorTimeZone)
    : -date.getTimezoneOffset();
  const easternOffset = getTimeZoneOffsetMinutes(date, easternTimeZone);
  const differenceInHours = (visitorOffset - easternOffset) / 60;
  const formattedHours = Number.isInteger(differenceInHours)
    ? String(differenceInHours)
    : differenceInHours.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  const sign = differenceInHours > 0 ? "+" : "";
  const unit = Math.abs(differenceInHours) === 1 ? "hr" : "hrs";

  timeZoneCounter.textContent = `${sign}${formattedHours} ${unit}`;
  if (visitorTimeZone) {
    timeZoneCounter.title = `${visitorTimeZone} compared with ${easternTimeZone}`;
  }
}

function updateClock() {
  if (!clock) return;

  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  clock.textContent = formatter.format(now);
  updateTimeZoneCounter(now);
}

function showView(name) {
  document.querySelectorAll(".view").forEach((view) => {
    view.hidden = view.id !== name;
  });

  document.querySelectorAll("[data-view]").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === name);
  });

  document.title = `Alejandro — ${name}`;
}

function route() {
  const name = location.hash.slice(1) || "status";
  showView(document.querySelector(`#${CSS.escape(name)}`) ? name : "status");
}

updateClock();
setInterval(updateClock, 1000);
window.addEventListener("hashchange", route);
themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme, true);
});
applyTheme(document.documentElement.dataset.theme);
Object.values(tables).forEach(renderAsciiTable);
route();
