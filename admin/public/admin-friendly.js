/* Client-friendly layer for the CMS admin.
 *
 * Loaded (deferred) after the base admin script, before the first render. It
 * does not change what the server stores — it changes how the admin talks to a
 * non-technical editor: plain names, a Home dashboard, "Update website" state,
 * picture pickers, and list reordering. Base functions are global, so they are
 * wrapped or replaced here by name. */
(function () {
  "use strict";

  /* ═══════════════ Plain-language names ═══════════════ */
  const SCHEMA_TEXT = {
    "corporate-settings": ["Company details", "Legal name, registration number, addresses, phone numbers and emails used across the website."],
    "publication-settings": ["Reporting period", "The financial year and “as on” date shown beside reports and figures."],
    "brand-settings": ["Logo & branding", "Logos, browser icon, search-engine text and social media links."],
    navigation: ["Menus", "The top menu, the small strip above it, and the mobile menu."],
    footer: ["Footer", "Links, contact details and copyright at the bottom of every page."],
    documents: ["Documents & filings", "Reports, policies and disclosures that visitors can download."],
    media: ["Photos & files", "Your library of pictures and files. Add each one here once, then choose it wherever it is needed."],
    metrics: ["Key numbers", "Figures such as area, capacity and years. Each one can be used on several pages."],
    locations: ["Map locations", "The places that appear on the website maps."],
    "portfolio-assets": ["Projects", "The projects listed on the Portfolio page."],
    "assets-under-management": ["Land & assets register", "Land parcels and assets under management."],
    "business-verticals": ["Business lines", "The business areas described on the Business pages."],
    "esg-initiatives": ["ESG initiatives", "Sustainability initiatives shown on the ESG page and its map."],
    "governance-records": ["Governance", "Leadership, policies and committee records."],
    "contact-directory": ["Contact offices", "The offices and contacts on the Contact page. Add or remove as many as you need."],
    slideshows: ["Slideshows", "Picture slideshows with captions."],
  };

  const FIELD_TEXT = {
    imageMedia: ["Picture", "Choose a picture from Photos & files."],
    photoMedia: ["Photo", "Choose a photo from Photos & files."],
    mediaId: ["Picture or file", "Choose from Photos & files."],
    locationId: ["Map location", "Choose the place on the map this belongs to."],
    documentRef: ["Linked document", "Choose a document from Documents & filings."],
    metricKey: ["Key number", "Choose one of your Key numbers."],
    assetsUnderManagementId: ["Linked land parcel", "Choose the land parcel this project is built on."],
    alt: ["Picture description", "A short description for people using screen readers. Also helps search engines."],
    href: ["Link", "Where this goes when clicked. Use https://… for other websites."],
    external: ["Opens in a new tab", ""],
    lat: ["Latitude", ""],
    lon: ["Longitude", ""],
    fileUpload: ["Upload a file", "Choose a file from your computer (maximum 30 MB)."],
  };

  function friendlyHelper(text) {
    if (!text) return text;
    return /^Id of|^Ref of|published media asset|published document|shared location/i.test(text) ? "" : text;
  }
  function friendlyFields(fields) {
    for (const f of fields || []) {
      const t = FIELD_TEXT[f.key];
      if (t) {
        f.label = t[0];
        if (t[1]) f.helper = t[1];
      } else if (f.helper) {
        f.helper = friendlyHelper(f.helper);
      }
      friendlyFields(f.itemFields);
      friendlyFields(f.fields);
    }
  }
  function applyFriendlyMeta(meta) {
    for (const s of meta.schemas) {
      const t = SCHEMA_TEXT[s.key];
      if (t) {
        s.label = t[0];
        s.description = t[1];
      }
      friendlyFields(s.fields);
    }
  }

  /* Wrap api(): friendly meta on load; refresh "unpublished changes" after edits. */
  const baseApi = window.api;
  window.api = async function (path, options) {
    const result = await baseApi(path, options);
    if (path === "/api/meta") applyFriendlyMeta(result);
    if (options && options.method === "POST" && !String(path).startsWith("/api/auth")) refreshStatusSoon();
    return result;
  };

  /* ═══════════════ Navigation groups ═══════════════ */
  EDITOR_GROUPS.length = 0;
  EDITOR_GROUPS.push(
    { label: "Whole website", keys: ["corporate-settings", "brand-settings", "navigation", "footer"] },
    { label: "Pages", keys: ["business-verticals", "esg-initiatives", "governance-records", "contact-directory", "slideshows"] },
    { label: "Portfolio & maps", keys: ["portfolio-assets", "assets-under-management", "locations"] },
    { label: "Library", keys: ["media", "documents"] },
    { label: "Numbers", keys: ["metrics", "publication-settings"] },
  );

  const baseValidKey = window.validEditorKey;
  window.validEditorKey = (key) => key === "home" || baseValidKey(key);
  window.initialEditorKey = function () {
    const requested = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    return requested && window.validEditorKey(requested) ? requested : "home";
  };

  const baseOpenEditor = window.openEditor;
  window.openEditor = async function (key, opts) {
    if (key !== "home") return baseOpenEditor(key, opts);
    if (window.innerWidth <= 900) {
      $("sidebar").classList.remove("open");
      $("sidebar-overlay").classList.remove("open");
    }
    state.currentKey = "home";
    state.draft = null;
    state.dirty = false;
    history.replaceState(null, "", "#home");
    renderSidebar();
    await renderHome();
  };

  window.renderSidebar = function () {
    const nav = $("sidebar");
    nav.innerHTML = "";
    nav.append(el("div", { class: "brand" }, "NDR Smart Spaces", el("span", null, "Website manager")));
    nav.append(
      el(
        "button",
        {
          class: "nav-item home" + (state.currentKey === "home" ? " active" : ""),
          onclick: async () => {
            if (await checkDirty("Leave this page? Unsaved changes will be lost.")) openEditor("home");
          },
        },
        el("span", { class: "nav-label" }, "⌂  Home"),
      ),
    );
    const search = el("div", { class: "sidebar-search" });
    search.append(
      el("input", {
        type: "text",
        placeholder: "Find a section…",
        value: state.sidebarQuery || "",
        oninput: (e) => {
          state.sidebarQuery = e.target.value;
          filterSidebarItems(nav);
        },
      }),
    );
    nav.append(search);
    const box = el("div", { class: "sidebar-nav" });
    for (const group of EDITOR_GROUPS) {
      const g = el("div", { class: "sidebar-group", "data-group": group.label });
      g.append(el("div", { class: "sidebar-group-label" }, group.label));
      for (const key of group.keys) {
        const schema = state.meta.schemas.find((s) => s.key === key);
        if (!schema) continue;
        const recs = state.records[key]?.records;
        g.append(
          el(
            "button",
            {
              class: "nav-item" + (state.currentKey === key ? " active" : ""),
              "data-key": key,
              "data-label": schema.label.toLowerCase(),
              onclick: async () => {
                if (await checkDirty("Leave this page? Unsaved changes will be lost.")) openEditor(key);
              },
            },
            el("span", { class: "nav-label" }, schema.label),
            schema.singleRecord || !recs ? null : el("span", { class: "nav-badge" }, String(recs.length)),
          ),
        );
      }
      box.append(g);
    }
    nav.append(box);
    filterSidebarItems(nav);
  };

  /* ═══════════════ Top bar wording + publish state ═══════════════ */
  const status = { unpublished: 0, pending: [], lastPublishedAt: null, recent: [] };
  let statusTimer = null;
  async function refreshStatus() {
    try {
      const s = await baseApi("/api/status");
      status.unpublished = s.unpublishedChanges;
      status.pending = s.pendingSections;
      status.lastPublishedAt = s.lastPublishedAt;
      status.recent = s.recent;
      paintPublishButton();
      if (state.currentKey === "home" && $("home-status")) paintHomeStatus();
    } catch (_) {
      /* not signed in yet */
    }
  }
  function refreshStatusSoon() {
    clearTimeout(statusTimer);
    statusTimer = setTimeout(refreshStatus, 400);
  }
  function paintPublishButton() {
    const b = $("btn-export");
    if (!b || b.disabled) return;
    b.textContent = status.unpublished ? `Update website · changes waiting` : "Update website";
    b.classList.toggle("has-changes", status.unpublished > 0);
    b.title = "Make all saved changes visible on the public website";
  }
  function relabelTopbar() {
    const set = (id, text) => $(id) && ($(id).textContent = text);
    set("btn-audit", "History");
    set("btn-refresh", "Reload");
    set("btn-logout", "Sign out");
  }

  /* ═══════════════ Home dashboard ═══════════════ */
  const QUICK = [
    ["contact-directory", "Add a contact office", "New office, phone, email"],
    ["portfolio-assets", "Add a project", "Shows on the Portfolio page"],
    ["documents", "Upload a document", "Reports, policies, filings"],
    ["media", "Add a photo", "Upload once, use anywhere"],
    ["esg-initiatives", "Add an ESG initiative", "Appears on the ESG page"],
    ["metrics", "Change a key number", "Numbers used across pages"],
  ];
  const WHERE = [
    ["Every page", [["navigation"], ["footer"], ["brand-settings"], ["corporate-settings"]]],
    ["Homepage", [["metrics"], ["locations"], ["business-verticals"]]],
    ["Business", [["business-verticals"], ["metrics"]]],
    ["Portfolio", [["portfolio-assets"], ["assets-under-management"], ["locations"]]],
    ["Investor Centre", [["documents"], ["governance-records"], ["metrics"]]],
    ["ESG", [["esg-initiatives"], ["media"]]],
    ["Media", [["slideshows"], ["media"]]],
    ["Contact", [["contact-directory"], ["corporate-settings"]]],
  ];
  const ACTION_WORDS = { create: "added", update: "changed", publish: "set live", archive: "hid", restore: "restored", delete: "removed" };

  function labelOf(key) {
    return state.meta.schemas.find((s) => s.key === key)?.label ?? key;
  }
  const FILE_TO_KEY = {
    corporateSettings: "corporate-settings", publicationSettings: "publication-settings", brandSettings: "brand-settings",
    navigation: "navigation", footer: "footer", documents: "documents", media: "media", metrics: "metrics",
    locations: "locations", portfolioAssets: "portfolio-assets", assetsUnderManagement: "assets-under-management",
    businessVerticals: "business-verticals", esgInitiatives: "esg-initiatives", governanceRecords: "governance-records",
    contactDirectory: "contact-directory", slideshows: "slideshows",
  };
  function sectionName(file) {
    return labelOf(FILE_TO_KEY[file] || file);
  }
  function ago(iso) {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
    return new Date(iso).toLocaleDateString();
  }
  function paintHomeStatus() {
    const box = $("home-status");
    const clean = status.unpublished === 0;
    box.className = "home-card status" + (clean ? " clean" : "");
    box.replaceChildren(
      el("h3", null, clean ? "Website is up to date" : "Changes waiting to go live"),
      el("div", { class: "big" }, clean ? "✓" : String(status.unpublished)),
      el(
        "p",
        null,
        clean
          ? status.lastPublishedAt
            ? `Last updated ${ago(status.lastPublishedAt)}.`
            : "Nothing to update."
          : `Saved but not visible to visitors yet: ${status.pending.map(sectionName).join(", ")}.`,
      ),
      el("button", { class: "primary", onclick: () => runPublish() }, "Update website"),
    );
    const list = $("home-activity");
    list.replaceChildren(
      ...(status.recent.length
        ? status.recent.map((e) =>
            el(
              "li",
              null,
              `${e.user} ${ACTION_WORDS[e.action] || e.action} “${e.recordId}” in ${labelOf(e.collection)}`,
              el("span", { class: "when" }, ago(e.timestamp)),
            ),
          )
        : [el("li", null, "No changes yet.")]),
    );
  }
  async function newRecord(key) {
    await openEditor(key);
    const schema = state.meta.schemas.find((s) => s.key === key);
    if (schema && !schema.singleRecord) openRecordForm(schema, null);
  }
  async function renderHome() {
    const name = state.session?.user ?? "";
    const view = el(
      "div",
      { class: "home" },
      el("h1", null, `Welcome${name ? ", " + name : ""}`),
      el("p", { class: "lede" }, "Edit anything on the website from here. Changes appear on the live site when you press “Update website”."),
      el("div", { class: "home-grid" }, el("div", { id: "home-status", class: "home-card status" })),
      el("div", { class: "home-section" }, "Quick actions"),
      el(
        "div",
        { class: "quick-actions" },
        ...QUICK.map(([key, title, sub]) =>
          el("button", { onclick: () => newRecord(key) }, title, el("small", null, sub)),
        ),
      ),
      el("div", { class: "home-section" }, "Where do I change…?"),
      el(
        "table",
        { class: "where-table" },
        el(
          "tbody",
          null,
          ...WHERE.map(([page, links]) =>
            el(
              "tr",
              null,
              el("td", null, page),
              el(
                "td",
                null,
                ...links.map(([key]) => el("a", { onclick: () => openEditor(key) }, labelOf(key))),
              ),
            ),
          ),
        ),
      ),
      el(
        "p",
        { class: "helper", style: "margin-top:10px" },
        "Some fixed wording (for example the About us story and the legal pages) is not editable here yet.",
      ),
      el("div", { class: "home-section" }, "Recent changes"),
      el("ul", { id: "home-activity", class: "activity" }),
    );
    $("content").replaceChildren(view);
    await refreshStatus();
    paintHomeStatus();
  }

  /* ═══════════════ Editor header: clear Save / Add, unsaved flag ═══════════════ */
  window.editorHeader = function (schema, record, onSave) {
    const single = !!schema.singleRecord;
    return el(
      "div",
      { class: "editor-head" },
      el("h1", null, schema.label),
      el("p", null, schema.description),
      el(
        "div",
        { class: "toolbar" },
        record && single
          ? el("span", { style: "color:var(--muted);font-size:12px" }, `Last saved ${ago(record.updatedAt)}`)
          : null,
        el("span", { class: "spacer" }),
        single
          ? el("button", { class: "primary", onclick: onSave }, "Save changes")
          : el("button", { class: "primary", onclick: () => openRecordForm(schema, null) }, "+ Add new"),
      ),
    );
  };
  /* Floating chip so unsaved edits are obvious in every editor. */
  const chip = el("div", { id: "unsaved-chip" }, "● Unsaved changes — press Save");
  document.body.append(chip);
  setInterval(() => chip.classList.toggle("on", !!state.dirty), 300);
  const baseValidationError = window.renderValidationError;
  window.renderValidationError = function (error) {
    baseValidationError(error);
    for (const s of document.querySelectorAll("#form-errors strong, .card h3")) {
      if (/Save failed/.test(s.textContent)) s.textContent = "Please fix these before saving:";
    }
  };

  /* ═══════════════ Picker for linked items (pictures show a preview) ═══════════════ */
  window.relField = function (field, path, options, idKey, labelKey, subKey, placeholder) {
    const value = String(getPath(state.draft, path) || "");
    const thumb = el("div", { class: "thumb" }, "No picture");
    const showThumb = (id) => {
      const opt = options.find((o) => o[idKey] === id);
      thumb.replaceChildren();
      if (opt && opt.fileId && opt.fileName && /^(image|logo|svg)$/.test(opt.kind || "")) {
        thumb.replaceChildren(
          el("img", {
            src: `/api/files/${encodeURIComponent(opt.fileId)}/${encodeURIComponent(opt.fileName)}`,
            alt: "",
            style: "width:100%;height:100%;object-fit:cover;border-radius:8px",
          }),
        );
      } else {
        thumb.textContent = opt ? (opt.kind || "Chosen").toUpperCase() : "None chosen";
      }
    };
    const select = el("select", {
      onchange: (e) => {
        setPath(state.draft, path, e.target.value);
        showThumb(e.target.value);
      },
    });
    select.append(el("option", { value: "", selected: !value }, placeholder || "Choose…"));
    /* Only live items can be linked; keep the current one visible even if it has since changed. */
    for (const opt of options) {
      const live = opt.status === "published" || opt.status === "external";
      if (!live && opt[idKey] !== value) continue;
      const sub = opt[subKey] && opt[subKey] !== opt[labelKey] ? ` — ${opt[subKey]}` : "";
      const note = live ? "" : ` (${statusLabel(opt.status)})`;
      select.append(
        el("option", { value: opt[idKey], selected: value === opt[idKey] }, `${opt[labelKey] || opt[idKey]}${sub}${note}`),
      );
    }
    const isPicture = /media/i.test(field.key) || field.key === "mediaId";
    showThumb(value);
    const control = isPicture ? el("div", { class: "picker" }, thumb, select) : select;
    const empty = options.every((o) => o.status !== "published" && o.status !== "external");
    return fieldRow(
      field,
      path,
      control,
      empty ? "Nothing to choose yet — add and set live in the matching section first." : field.helper,
    );
  };

  /* ═══════════════ Lists: move up / down, duplicate, readable titles ═══════════════ */
  function itemTitle(item, index) {
    const first = Object.values(item || {}).find((v) => typeof v === "string" && v.trim());
    return first ? `${index + 1}. ${first.length > 60 ? first.slice(0, 57) + "…" : first}` : `Item ${index + 1}`;
  }
  window.listField = function (field, path, value, lookup) {
    if (!Array.isArray(value)) {
      initPath(state.draft, path, []);
    }
    const set = el("fieldset", { class: "group" }, el("legend", null, field.label));
    const container = el("div");
    const mutate = (fn) => {
      const list = getPath(state.draft, path) || [];
      fn(list);
      setPath(state.draft, path, list);
      redraw();
    };
    const redraw = () => {
      container.innerHTML = "";
      const items = getPath(state.draft, path);
      if (!Array.isArray(items)) return;
      items.forEach((item, index) => {
        const btn = (label, title, fn, cls) =>
          el("button", { class: "mini " + (cls || ""), title, onclick: fn }, label);
        const card = el(
          "div",
          { class: "item-card" },
          el(
            "div",
            { class: "item-head" },
            el("span", { class: "item-title" }, itemTitle(item, index)),
            index > 0
              ? btn("▲", "Move up", () => mutate((l) => l.splice(index - 1, 0, l.splice(index, 1)[0])))
              : null,
            index < items.length - 1
              ? btn("▼", "Move down", () => mutate((l) => l.splice(index + 1, 0, l.splice(index, 1)[0])))
              : null,
            btn("Duplicate", "Copy this item", () =>
              mutate((l) => l.splice(index + 1, 0, JSON.parse(JSON.stringify(l[index])))),
            ),
            btn("Remove", "Remove this item", () => mutate((l) => l.splice(index, 1)), "danger"),
          ),
        );
        for (const child of field.itemFields || [])
          card.append(fieldWidget(child, [...path, index, child.key], lookup));
        container.append(card);
      });
    };
    redraw();
    set.append(
      container,
      el(
        "button",
        { class: "mini", onclick: () => mutate((l) => l.push({})) },
        `+ Add ${(field.itemFields?.[0]?.label || "item").toLowerCase()}`,
      ),
    );
    return set;
  };

  /* ═══════════════ Boot hooks ═══════════════ */
  relabelTopbar();
  let pollStarted = false;
  const baseBootApp = window.bootApp;
  window.bootApp = async function () {
    relabelTopbar();
    await baseBootApp();
    refreshStatus();
    if (!pollStarted) {
      pollStarted = true;
      setInterval(refreshStatus, 30000);
    }
  };
})();
