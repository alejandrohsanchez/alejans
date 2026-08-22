const clock = document.querySelector("#clock");
const timeZoneCounter = document.querySelector("#time-zone-counter");
const themeToggle = document.querySelector("#theme-toggle");
const articleContent = document.querySelector("#article-content");
const articleBack = document.querySelector("#article-back");
const interactiveTerminal = document.querySelector("#interactive-terminal");
const terminalInput = document.querySelector("#terminal-input");
const terminalOutput = document.querySelector("#terminal-output");
const themeStorageKey = "alejans-theme";
const easternTimeZone = "America/New_York";

// Edit this schedule to describe the most likely status for each day and time.
// The overnight chunk covers midnight through 6am and 10pm through midnight.
const statusSchedule = {
  Sunday: {
    daytime:  { status: "online",
                working_on: "new projects",
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    evening:  { status: "online",
                working_on: "preparing for the week",     
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    overnight:{ status: "offline",          
                working_on: "nothing",
                location: "Florida", 
                where_you_can_find_me: "home" 
              },
  },
  Monday: {
    daytime:  { status: "online",                      
                working_on: "performance analysis",       
                location: "Florida", 
                where_you_can_find_me: "in the lab" 
              },
    evening: {  status: "online",                       
                working_on: "new projects",                    
                location: "Florida", 
                where_you_can_find_me: "out and about"
               },
    overnight:{ status: "offline",                      
                working_on: "nothing",                    
                location: "Florida",
                where_you_can_find_me: "home" 
              },
  },
  Tuesday: {
    daytime: {  status: "online",                      
                working_on: "innovative solutions",       
                location: "Florida", 
                where_you_can_find_me: "in the lab" 
              },
    evening: {  status: "online",                       
                working_on: "new projects",                    
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    overnight:{ status: "offline",                      
                working_on: "nothing",                    
                location: "Florida", 
                where_you_can_find_me: "home" 
              },
  },
  Wednesday: {
    daytime: {  status: "online",                      
                working_on: "building structs",           
                location: "Florida", 
                where_you_can_find_me: "in the lab" 
              },
    evening: {  status: "online",                       
                working_on: "new projects",                    
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    overnight:{ status: "offline",                      
                working_on: "nothing",                    
                location: "Florida", 
                where_you_can_find_me: "home" 
              },
  },
  Thursday: {
    daytime: {  status: "online",                      
                working_on: "initializing arrays", 
                location: "Florida", 
                where_you_can_find_me: "in the lab" 
              },
    evening: {  status: "online",                          
                working_on: "new projects",                    
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    overnight:{ status: "probably online",                      
                working_on: "new projects",                    
                location: "Florida", 
                where_you_can_find_me: "probably out and about" 
              },
  },
  Friday: {
    daytime: {  status: "online",    
                working_on: "new projects", 
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    evening: {  status: "online",                          
                working_on: "new projects", 
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    overnight:{ status: "probably online",          
                working_on: "new projects", 
                location: "Florida", 
                where_you_can_find_me: "probably out and about" 
              },
  },
  Saturday: {
    daytime: {  status: "online", 
                working_on: "new projects", 
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    evening: {  status: "online", 
                working_on: "new projects", 
                location: "Florida", 
                where_you_can_find_me: "out and about" 
              },
    overnight:{ status: "probably online", 
                working_on: "new projects", 
                location: "Florida", 
                where_you_can_find_me: "probably out and about" 
              },
  },
};

// Edit other ASCII table content here. Add another array for a row, or add
// another value inside each row for a new column.
const tables = {
  status: {
    elementId: "status-table",
    columnClasses: ["ascii-label", ""],
    rows: [],
  },
  notes: {
    elementId: "notes-table",
    emptyMessage: "no notes yet",
    emptyColumnWidth: 42,
    columnClasses: ["ascii-label", ""],
    rows: [],
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

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getCurrentStatus(date = new Date()) {
  const hour = date.getHours();
  const timeChunk = hour >= 6 && hour < 18 ? "daytime" : hour >= 18 && hour < 22 ? "evening" : "overnight";
  return statusSchedule[weekdayNames[date.getDay()]][timeChunk];
}

function updateStatusTable(date = new Date()) {
  tables.status.rows = Object.entries(getCurrentStatus(date));
  renderAsciiTable(tables.status);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function renderInlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/_([^_]+)_|\*([^*]+)\*/g, (_, italicText, starredText) => `<em>${italicText ?? starredText}</em>`);
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
  return html;
}

function renderMarkdown(markdown) {
  const fragment = document.createDocumentFragment();
  let paragraphLines = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const paragraph = document.createElement("p");
    paragraph.innerHTML = paragraphLines.map(renderInlineMarkdown).join(" ");
    fragment.append(paragraph);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!list) return;
    fragment.append(list);
    list = null;
  };

  markdown.split(/\r?\n/).map((line) => line.trim()).forEach((line) => {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const unorderedItem = line.match(/^[-*]\s+(.+)$/);
    const orderedItem = line.match(/^\d+\.\s+(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();
      const element = document.createElement(`h${heading[1].length}`);
      element.innerHTML = renderInlineMarkdown(heading[2]);
      fragment.append(element);
    } else if (unorderedItem || orderedItem) {
      flushParagraph();
      const listType = unorderedItem ? "ul" : "ol";
      if (!list || list.nodeName.toLowerCase() !== listType) {
        flushList();
        list = document.createElement(listType);
      }
      const item = document.createElement("li");
      item.innerHTML = renderInlineMarkdown((unorderedItem || orderedItem)[1]);
      list.append(item);
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraphLines.push(line);
    }
  });

  flushParagraph();
  flushList();
  return fragment;
}

function updateNotesTable() {
  tables.notes.rows = notes.map((note) => [
    note.metadata.published,
    { text: note.name, href: `#article/${encodeURIComponent(note.slug)}` },
  ]);
  renderAsciiTable(tables.notes);
}

function getPublishedEntries() {
  return tables.published.rows.flatMap((row) => {
    const name = normalizeCell(row[1]);
    return name.text ? [{ name: name.text, href: name.href }] : [];
  });
}

function setTerminalOutput(content) {
  if (!terminalOutput) return;
  terminalOutput.replaceChildren();
  if (typeof content === "string") terminalOutput.textContent = content;
  else terminalOutput.append(content);
}

function showTerminalHelp() {
  setTerminalOutput(`status       open the status page
notes        open the notes page
published    open the published page
theme -l     switch to light theme
theme -d     switch to dark theme
clear        clear the terminal
find -"text" search note and project names`);
}

function showSearchResults(query) {
  const normalizedQuery = query.toLocaleLowerCase();
  const matches = [
    ...notes
      .filter((note) => note.name.toLocaleLowerCase().includes(normalizedQuery))
      .map((note) => ({ name: note.name, href: `#article/${encodeURIComponent(note.slug)}` })),
    ...getPublishedEntries().filter((project) => project.name.toLocaleLowerCase().includes(normalizedQuery)),
  ].slice(0, 3);

  if (!matches.length) {
    setTerminalOutput("no match found");
    return;
  }

  const output = document.createDocumentFragment();
  output.append("match found\n");
  matches.forEach((match, index) => {
    if (index) output.append("\n");
    output.append("> ");
    const link = document.createElement("a");
    link.href = match.href || "#published";
    link.textContent = match.name;
    output.append(link);
  });
  setTerminalOutput(output);
}

function runTerminalCommand(command) {
  const trimmedCommand = command.trim();
  if (trimmedCommand === "-help") {
    showTerminalHelp();
  } else if (trimmedCommand === "clear") {
    setTerminalOutput("");
  } else if (trimmedCommand === "status" || trimmedCommand === "notes" || trimmedCommand === "published") {
    if (trimmedCommand === "status") {
      setTerminalOutput("status opened");
    } else if (trimmedCommand === "notes") {
      setTerminalOutput("notes opened");
    } else if (trimmedCommand === "published") {
      setTerminalOutput("published opened");
    }
    location.hash = trimmedCommand;
  } else if (trimmedCommand === "theme -l") {
    applyTheme("light", true);
    setTerminalOutput("theme changed");
  } else if (trimmedCommand === "theme -d") {
    applyTheme("dark", true);
    setTerminalOutput("theme changed");
  } else {
    const search = trimmedCommand.match(/^find\s+-"([^"]+)"$/);
    if (search) showSearchResults(search[1]);
    else setTerminalOutput("wrong input");
  }
  if (terminalInput) terminalInput.value = "";
}

function showArticle(slug) {
  const note = notes.find((entry) => entry.slug === decodeURIComponent(slug));
  if (!note || !articleContent) return false;

  articleContent.replaceChildren();
  const title = document.createElement("h1");
  title.textContent = note.name;
  const metadata = document.createElement("dl");
  metadata.className = "article-metadata";
  Object.entries(note.metadata).forEach(([key, value]) => {
    const label = document.createElement("dt");
    label.textContent = key;
    const detail = document.createElement(key === "published" ? "time" : "dd");
    detail.textContent = value;
    if (key === "published") detail.dateTime = value.replace(" ", "T");
    metadata.append(label, detail);
  });
  const body = document.createElement("div");
  body.className = "markdown-body";
  body.append(renderMarkdown(note.markdown));
  articleContent.append(title, metadata, body);
  document.title = `Alejandro — ${note.name}`;
  return true;
}

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
  const values = {};
  parts.forEach((part) => {
    if (part.type !== "literal") values[part.type] = part.value;
  });
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

function focusTerminal() {
  requestAnimationFrame(() => terminalInput?.focus({ preventScroll: true }));
}

function route() {
  const [name, slug] = location.hash.slice(1).split("/");
  if (name === "article" && slug) {
    showView("article");
    if (showArticle(slug)) {
      focusTerminal();
      return;
    }
  }

  const viewName = name || "status";
  const view = document.getElementById(viewName);
  showView(view?.classList.contains("view") ? viewName : "status");
  if (viewName === "notes" && history.state?.notesScrollY !== undefined) {
    requestAnimationFrame(() => window.scrollTo(0, history.state.notesScrollY));
  }
  focusTerminal();
}

updateClock();
setInterval(updateClock, 1000);
updateStatusTable();
setInterval(updateStatusTable, 60000);
window.addEventListener("hashchange", route);
interactiveTerminal?.addEventListener("submit", (event) => {
  event.preventDefault();
  runTerminalCommand(terminalInput?.value ?? "");
});
document.querySelector("#notes-table")?.addEventListener("click", () => {
  history.replaceState({ notesScrollY: window.scrollY }, "", location.href);
});
articleBack?.addEventListener("click", (event) => {
  event.preventDefault();
  if (history.length > 1) history.back();
  else location.hash = "notes";
});
themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme, true);
});
applyTheme(document.documentElement.dataset.theme);
Object.values(tables).filter((table) => table !== tables.status).forEach(renderAsciiTable);
updateNotesTable();
route();
