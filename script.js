const query = selector => document.querySelector(selector);
const all = selector => document.querySelectorAll(selector);
const byId = id => document.getElementById(id);

function recordText(record) {
  const surface = record.whole ? "" : formatSurfaceText(record.surfaces);
  return surface ? surface + " " + record.finding : record.finding;
}

function setDentitionButtons(mode) {
  all(".dentition-button").forEach(button => {
    const active = button.dataset.dentition === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
}

function refreshChart() {
  updateFindingButtons();
  renderFindings();
  renderChart();
}

function finishSelection() {
  clearTemporarySelection();
  selections = [];
  refreshChart();
}

let selections = [];
let findings = [];
let nextBatchId = 1;
let chartEdits = {};
const anteriorTeeth = [ 6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27 ];
const maxillaryTeeth = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
const mandibularTeeth = [ 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17 ];
const primaryToothMap = {
  4: "A", 5: "B", 6: "C", 7: "D", 8: "E", 9: "F", 10: "G", 11: "H", 12: "I", 13: "J",
  20: "K", 21: "L", 22: "M", 23: "N", 24: "O", 25: "P", 26: "Q", 27: "R", 28: "S", 29: "T"
};
const positionFindings = [ "mobility", "tilted", "rotated", "super-eruption", "erupting" ];
const mixedPermanentTeeth = [ 3, 14, 19, 30, 7, 8, 9, 10, 23, 24, 25, 26 ];
createArch("maxillary", maxillaryTeeth);
createArch("mandibular", mandibularTeeth);
updateFindingButtons();

function createArch(containerID, teeth) {
  const container = byId(containerID);
  teeth.forEach((toothNumber, index) => {
    const tooth = createTooth(toothNumber);
    if (index === 7) tooth.classList.add("midline");
    container.appendChild(tooth);
  });
}

function createTooth(toothNumber) {
  const wrapper = document.createElement("div");
  wrapper.className = "tooth";
  wrapper.dataset.tooth = toothNumber;
  const isAnterior = anteriorTeeth.includes(toothNumber);
  const centerSurface = isAnterior ? "I" : "O";
  const outerSurface = isAnterior ? "F" : "B";
  const isRightSide = (toothNumber >= 1 && toothNumber <= 8) || (toothNumber >= 25 && toothNumber <= 32);
  const leftSurface = isRightSide ? "D" : "M";
  const rightSurface = isRightSide ? "M" : "D";
  const isMandibular = toothNumber >= 17 && toothNumber <= 32;
  const topSurface = isMandibular ? "L" : outerSurface;
  const bottomSurface = isMandibular ? outerSurface : "L";
  wrapper.innerHTML = ` <svg class="tooth-diagram" viewBox="0 0 120 205" data-tooth="${toothNumber}" >
    <path class="surface" data-surface="${topSurface}" d="M 13.515 13.515 Q 17.029 10 22 10 H 98 Q 102.971 10 106.485 13.515 L 85 35 H 35 Z" >
    </path>
    <path class="surface" data-surface="${leftSurface}" d="M 13.515 13.515 L 35 35 V 85 L 13.515 106.485 Q 10 102.971 10 98 V 22 Q 10 17.029 13.515 13.515 Z" >
    </path>
    <rect class="surface" data-surface="${centerSurface}" x="35" y="35" width="50" height="50" >
    </rect>
    <path class="surface" data-surface="${rightSurface}" d="M 106.485 13.515 Q 110 17.029 110 22 V 98 Q 110 102.971 106.485 106.485 L 85 85 V 35 Z" >
    </path>
    <path class="surface" data-surface="${bottomSurface}" d="M 13.515 106.485 L 35 85 H 85 L 106.485 106.485 Q 102.971 110 98 110 H 22 Q 17.029 110 13.515 106.485 Z" >
    </path>
    <g class="endo-coronal-network">
    <path class="endo-coronal-links" d="M60 60 L60 23 M60 60 L23 60 M60 60 L97 60 M60 60 L60 98" >
    </path>
    <circle cx="60" cy="23" r="9">
    </circle>
    <circle cx="23" cy="60" r="9">
    </circle>
    <circle cx="60" cy="60" r="9">
    </circle>
    <circle cx="97" cy="60" r="9">
    </circle>
    <circle cx="60" cy="98" r="9">
    </circle>
    </g>
    <text x="60" y="28">${topSurface}</text>
    <text x="23" y="65">${leftSurface}</text>
    <text x="60" y="65">${centerSurface}</text>
    <text x="97" y="65">${rightSurface}</text>
    <text x="60" y="103">${bottomSurface}</text>
    <rect class="surface cervical-surface" data-surface="C" x="15" y="135" width="90" height="40" rx="3" >
    </rect>
    <text class="cervical-label" x="60" y="155" >C</text>
    <g class="lengthening-arrows">
    <path d="M35 181 V197 M29 191 L35 197 L41 191" >
    </path>
    <path d="M60 181 V197 M54 191 L60 197 L66 191" >
    </path>
    <path d="M85 181 V197 M79 191 L85 197 L91 191" >
    </path>
    </g>
    <g class="endo-symbol">
    <path class="endo-root" d="M43 130 Q60 125 77 130 L68 169 Q60 184 52 169 Z" >
    </path>
    <path class="endo-canal" d="M50 135 H70 M60 135 L60 174" >
    </path>
    </g>
    <g class="pulpotomy-symbol">
    <path class="endo-root" d="M43 130 Q60 125 77 130 L68 169 Q60 184 52 169 Z" >
    </path>
    <rect class="pulp-chamber" x="49" y="132" width="22" height="10" rx="2" >
    </rect>
    </g>
    <g class="post-core-symbol">
    <path class="endo-root" d="M43 130 Q60 125 77 130 L68 169 Q60 184 52 169 Z" >
    </path>
    <path class="post-canal" d="M60 155 V174" >
    </path>
    <rect class="core-block" x="47" y="130" width="26" height="12" rx="2" >
    </rect>
    <path class="post-shaft" d="M60 140 V159" >
    </path>
    </g>
    <g class="implant-symbol" transform="translate(0 121) scale(1 .38)" >
    <path d="M48 14 H72 V29 L77 35 H43 L48 29 Z" fill="#ccefed" >
    </path>
    <path d="M40 36 H80 V48 L72 127 Q60 147 48 127 L40 48 Z" fill="#e8f6f5" >
    </path>
    <path d="M39 49 L80 55 M41 62 L78 68 M42 75 L77 81 M44 88 L76 94 M45 101 L74 107 M47 114 L72 120 M50 126 L68 132" fill="none" >
    </path>
    </g>
    <rect class="crown-outline" x="6" y="6" width="108" height="108" rx="8" >
    </rect>
    <path class="extraction-cross" d="M10 10 L110 175 M110 10 L10 175" >
    </path>
    </svg>
    <div class="tooth-number" data-tooth="${toothNumber}" data-age="permanent" >#${toothNumber}</div>
    <div class="root-markers" data-tooth="${toothNumber}" >
    </div>
    <div class="watch-marker" data-tooth="${toothNumber}" >
    <svg viewBox="0 0 32 20" role="img" aria-label="Watch tooth" >
    <path d="M2 10 Q16 -5 30 10 Q16 25 2 10 Z">
    </path>
    <circle cx="16" cy="10" r="4">
    </circle>
    </svg>
    </div>
    <div class="position-display" data-tooth="${toothNumber}" >
    </div> `;
  return wrapper;
}

function getToothLabel(toothNumber) {
  const numberElement = query( `.tooth-number[data-tooth="${toothNumber}"]` );
  if ( numberElement && numberElement.dataset.age === "primary" ) return "#" + primaryToothMap[toothNumber];
  return "#" + toothNumber;
}
document.addEventListener("click", event => {
  const surface = event.target.closest(".surface");
  if (!surface) return;
  const svg = surface.closest(".tooth-diagram");
  const toothNumber = Number(svg.dataset.tooth);
  const surfaceName = surface.dataset.surface;
  if (hasWholeSelections()) {
    clearTemporarySelection();
    selections = [];
  }
  let toothSelection = selections.find((item) => item.tooth === toothNumber && item.whole === false);
  if (!toothSelection) {
    toothSelection = {
      tooth: toothNumber, surfaces: [], whole: false };
    selections.push(toothSelection);
  }
  if (toothSelection.surfaces.includes(surfaceName)) {
    toothSelection.surfaces = toothSelection.surfaces.filter((item) => item !== surfaceName);
    surface.classList.remove("selected");
  } else {
    toothSelection.surfaces.push(surfaceName);
    surface.classList.add("selected");
  }
  if (toothSelection.surfaces.length === 0) selections = selections.filter((item) => item !== toothSelection);
  updateFindingButtons();
});
document.addEventListener("click", event => {
  const number = event.target.closest(".tooth-number");
  if (!number) return;
  const toothNumber = Number(number.dataset.tooth);
  if (hasSurfaceSelections()) {
    clearTemporarySelection();
    selections = [];
  }
  const existing = selections.find((item) => item.tooth === toothNumber && item.whole === true);
  if (existing) {
    selections = selections.filter((item) => item !== existing);
    number.classList.remove("selected");
  } else {
    selections.push({
      tooth: toothNumber, surfaces: [], whole: true });
    number.classList.add("selected");
  }
  updateFindingButtons();
});

function hasWholeSelections() {
  return selections.some(item => item.whole === true);
}

function hasSurfaceSelections() {
  return selections.some(item => item.whole === false);
}

function clearTemporarySelection() {
  all(".surface.selected, .tooth-number.selected")
  .forEach(element => element.classList.remove("selected"));
}

function isToothMissing(toothNumber) {
  const tooth = query( `.tooth[data-tooth="${toothNumber}"]` );
  return Boolean(tooth && tooth.hidden) || findings.some((record) => record.tooth === toothNumber && record.whole === true && record.finding === "missing");
}

function updateFindingButtons() {
  const surface = hasSurfaceSelections();
  const whole = selections.length > 0 && !surface;
  const setDisabled = (selector, disabled) => {
    all(selector).forEach(button => { button.disabled = disabled; });
  };
  setDisabled(".watch-treatment", !hasWholeSelections() && !surface);
  setDisabled(".surface-treatment", !surface);
  setDisabled(".whole-treatment", !hasWholeSelections());
  setDisabled(".surface-finding", !surface);
  setDisabled(".whole-finding", !whole);
  const unmissing = whole && selections.every(item => isToothMissing(item.tooth));
  const missingButton = byId("missingMain");
  missingButton.textContent = unmissing ? "(M) Unmissing" : "(M) Missing";
  missingButton.dataset.name = unmissing ? "unmissing" : "missing";
}
all(".finding").forEach(function(button) {
  button.addEventListener("click", function() {
    if (selections.length === 0) return;
    const finding = this.dataset.name;
    if (finding === "unmissing") {
      delete chartEdits["missing-teeth"];
      const selectedToothNumbers = selections.map((selection) => selection.tooth);
      findings = findings.filter((record) => !( selectedToothNumbers.includes(record.tooth) && record.whole === true && record.finding === "missing" ));
      selectedToothNumbers.forEach(toothNumber => {
        const tooth = query( `.tooth[data-tooth="${toothNumber}"]` );
        if (tooth) tooth.hidden = false;
      });
      finishSelection();
      return;
    }
    if (finding === "missing") delete chartEdits["missing-teeth"];
    const batchId = nextBatchId++;
    if (finding === "Bridge") {
      const selectedTeeth = selections .map((selection) => selection.tooth) .sort((a, b) => a - b);
      if (selectedTeeth.length < 2) {
        alert("Please select at least two teeth for a bridge.");
        return;
      }
      const bridgeStart = selectedTeeth[0];
      const bridgeEnd = selectedTeeth[selectedTeeth.length - 1];
      findings.push({
        tooth: bridgeStart, bridgeTeeth: selectedTeeth, bridgeStart, bridgeEnd, bridgeStartLabel: getToothLabel(bridgeStart), bridgeEndLabel: getToothLabel(bridgeEnd), surfaces: [], whole: true, finding: "Bridge", batchId });
    } else {
      selections.forEach(selection => {
        findings.push({
          tooth: selection.tooth, toothLabel: getToothLabel(selection.tooth), surfaces: [...selection.surfaces], whole: selection.whole, finding, batchId });
      });
    }
    finishSelection();
  });
});
byId("changeAge").addEventListener( "click", () => {
  if (!hasWholeSelections()) {
    alert("Please select one or more tooth numbers first.");
    return;
  }
  selections.forEach(selection => {
    const tooth = query( `.tooth[data-tooth="${selection.tooth}"]` );
    const number = tooth.querySelector(".tooth-number");
    const showPermanent = tooth.hidden || number.dataset.age === "primary";
    setToothAge( selection.tooth, showPermanent ? "permanent" : "primary" );
  });
  clearTemporarySelection();
  selections = [];
  all(".dentition-button").forEach( button => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
  refreshChart();
});

function setToothAge(toothNumber, age) {
  const tooth = query( `.tooth[data-tooth="${toothNumber}"]` );
  const number = tooth.querySelector(".tooth-number");
  const primary = age === "primary";
  const letter = primaryToothMap[toothNumber];
  tooth.hidden = primary && !letter;
  number.dataset.age = primary && letter ? "primary" : "permanent";
  number.textContent = "#" + (primary && letter ? letter : toothNumber);
}

function setDentition(mode) {
  clearTemporarySelection();
  selections = [];
  all(".tooth").forEach(tooth => {
    const toothNumber = Number(tooth.dataset.tooth);
    const permanent = mode === "permanent" || ( mode === "mixed" && mixedPermanentTeeth.includes(toothNumber) );
    setToothAge( toothNumber, permanent ? "permanent" : "primary" );
  });
  setDentitionButtons(mode);
  refreshChart();
}
all(".dentition-button").forEach( button => {
  button.addEventListener("click", () => { setDentition(button.dataset.dentition); });
});
all(".treatment").forEach(button => {
  button.addEventListener("click", () => {
    if (button.disabled || selections.length === 0) return;
    const bridgeTeeth = ["Bridge", "bridge"].includes(button.dataset.treatment) ? selections.map(selection => selection.tooth) : null;
    if (bridgeTeeth && bridgeTeeth.length < 2) {
      alert("Please select at least two teeth for a bridge.");
      return;
    }
    const batchId = nextBatchId++;
    selections.forEach(selection => {
      const label = getToothLabel(selection.tooth);
      const record = {
        tooth: selection.tooth, toothLabel: label, surfaces: [...selection.surfaces], whole: selection.whole, finding: button.dataset.treatment, treatment: true, bridgeTeeth, batchId };
      const duplicate = findings.some((r) => r.treatment && r.tooth === record.tooth && r.toothLabel === label && r.finding === record.finding && r.whole === record.whole && [...r.surfaces].sort().join(",") === [...record.surfaces].sort().join(","));
      if (!duplicate) findings.push(record);
      delete chartEdits[ "tooth-" + record.tooth + "-" + label ];
    });
    finishSelection();
  });
});

function getRecordColor(record) {
  const selector = record.treatment ? ".treatment" : ".finding";
  const button = Array.from( all(selector) ).find(button => {
    const name = record.treatment ? button.dataset.treatment : button.dataset.name;
    return name === record.finding;
  });
  return button
  ? getComputedStyle(button).backgroundColor
  : null;
}

function markCrown(toothNumber, color) {
  const tooth = query( `.tooth-diagram[data-tooth="${toothNumber}"]` );
  if (!tooth || !color) return;
  tooth.classList.add("has-crown-outline");
  tooth.querySelector(".crown-outline").style.stroke = color;
}

function renderFindings() {
  all(".tooth").forEach(tooth => { tooth.classList.remove("has-watch-marker"); });
  const surfaceClasses = {
    "stain": "stain", "caries": "caries", "cavity": "caries",
    "decay": "caries", "decalcified": "decalcified", "incipient caries": "incipient-caries",
    "recurrent caries": "recurrent-caries", "gross caries": "gross-caries", "composite": "composite",
    "amalgam": "amalgam", "sealant": "sealant", "IRM": "irm",
    "wear": "wear", "abfraction": "abfraction", "erosion": "erosion",
    "crack line": "crack-line", "broken": "broken"
  };
  const wholeClasses = {
    "SSC": "ssc", "Zirconia crown": "zirconia-crown", "PFM crown": "pfm-crown",
    "Metal crown": "metal-crown", "RCT": "rct", "post & core": "post-core",
    "implant": "implant", "missing": "missing", "root tip": "root-tip",
    "PARL": "parl", "PARO": "paro", "ankylosis": "ankylosis"
  };
  const crownFindings = [ "SSC", "Zirconia crown", "PFM crown", "Metal crown", "implant" ];
  const crownTreatments = [ "CBU", "SSC", "Zirconia", "PFM", "Metal", "Bridge", "bridge", "Implant", "implant" ];
  const fillingTreatments = [ "Composite", "Amalgam", "RMGI", "IRM" ];
  all(".cervical-label").forEach( label => { label.textContent = "C"; });
  all(".root-markers").forEach( marker => { marker.innerHTML = ""; });
  all(".surface").forEach( surface => {
    surface.classList.remove( ...new Set(Object.values(surfaceClasses)) );
    surface.style.removeProperty("fill");
  });
  all(".tooth-diagram").forEach( tooth => {
    tooth.classList.remove( ...Object.values(wholeClasses), "bridge", "extraction-planned", "has-crown-outline", "has-implant-symbol", "has-endo-symbol", "has-lengthening-arrows", "has-pulpotomy-symbol", "has-post-core-symbol", "has-endo-coronal" );
    tooth.style.removeProperty("--endo-color");
    tooth.querySelector(".crown-outline") .style.removeProperty("stroke");
  });
  findings.forEach(record => {
    const color = getRecordColor(record);
    const tooth = query( `.tooth-diagram[data-tooth="${record.tooth}"]` );
    if (!tooth) return;
    if ( ["Pulpotomy", "RCT", "post & core"].includes(record.finding) ) {
      tooth.classList.add("has-endo-coronal");
      tooth.style.setProperty( "--endo-color", color || "#66bb6a" );
    }
    if (record.finding === "RCT") tooth.classList.add("has-endo-symbol");
    if (record.finding === "Pulpotomy") tooth.classList.add("has-pulpotomy-symbol");
    if (record.finding === "post & core") tooth.classList.add("has-post-core-symbol");
    if ( record.treatment && record.finding === "Crown lengthening" ) tooth.classList.add("has-lengthening-arrows");
    if (record.treatment) {
      if (record.finding === "Watch" && record.whole) tooth.closest(".tooth") .classList.add("has-watch-marker");
      if (record.finding === "Extraction") tooth.classList.add("extraction-planned");
      if (["Implant", "implant"].includes(record.finding)) tooth.classList.add("has-implant-symbol");
      if (crownTreatments.includes(record.finding)) markCrown(record.tooth, color);
      if (fillingTreatments.includes(record.finding) && color) {
        record.surfaces.forEach(name => {
          const surface = tooth.querySelector( `.surface[data-surface="${name}"]` );
          if (surface) surface.style.fill = color;
        });
      }
      return;
    }
    if (record.whole) {
      if (positionFindings.includes(record.finding)) return;
      if ( record.finding === "Bridge" && record.bridgeTeeth ) {
        record.bridgeTeeth.forEach(number => { markCrown(number, color); });
        return;
      }
      if ( ["PARL", "PARO", "ankylosis"].includes(record.finding) ) {
        const markers = query( `.root-markers[data-tooth="${record.tooth}"]` );
        const alreadyPresent = Array.from( markers.children ).some((dot) => dot.dataset.finding === record.finding);
        if (!alreadyPresent) {
          const dot = document.createElement("span");
          dot.className = "root-marker";
          dot.dataset.finding = record.finding;
          dot.style.backgroundColor = color;
          dot.title = record.finding;
          dot.setAttribute("aria-label", record.finding);
          markers.appendChild(dot);
        }
        return;
      }
      if (record.finding === "implant") tooth.classList.add("has-implant-symbol");
      if (crownFindings.includes(record.finding)) markCrown(record.tooth, color);
      if (wholeClasses[record.finding]) tooth.classList.add(wholeClasses[record.finding]);
      if (record.finding === "root tip") tooth.querySelector(".cervical-label").textContent = "R";
      return;
    }
    record.surfaces.forEach(name => {
      const surface = tooth.querySelector( `.surface[data-surface="${name}"]` );
      if (!surface) return;
      if (surfaceClasses[record.finding]) surface.classList.add(surfaceClasses[record.finding]);
      if ( ["composite", "amalgam", "sealant", "IRM"] .includes(record.finding) && color ) surface.style.fill = color;
    });
  });
  renderPositions();
  renderBridges();
}

function renderPositions() {
  all(".position-display").forEach( display => { display.innerHTML = ""; });
  all(".tooth-number").forEach( number => { number.classList.remove("has-mobility"); });
  findings.forEach(record => {
    if (!positionFindings.includes(record.finding)) return;
    const display = query( `.position-display[data-tooth="${record.tooth}"]` );
    if (!display) return;
    const item = document.createElement("span");
    item.className = "position-item";
    item.textContent = record.finding.charAt(0).toUpperCase() + record.finding.slice(1);
    display.appendChild(item);
    if (record.finding === "mobility") {
      const toothNumber = query( `.tooth-number[data-tooth="${record.tooth}"]` );
      if (toothNumber) toothNumber.classList.add("has-mobility");
    }
  });
}

function renderBridges() {
  all(".bridge-overlay").forEach( overlay => { overlay.remove(); });
  const bridgeGroups = new Map();
  findings.filter((record) => ["Bridge", "bridge"].includes(record.finding)).forEach(record => {
    const key = (record.treatment ? "treatment-" : "finding-") + record.batchId;
    if (!bridgeGroups.has(key)) {
      bridgeGroups.set(key, {
        record, teeth: new Set() });
    }
    (record.bridgeTeeth || [record.tooth]).forEach( number => { bridgeGroups.get(key).teeth.add(number); });
  });
  const ns = "http://www.w3.org/2000/svg";
  all(".arch").forEach(arch => {
    const bounds = arch.getBoundingClientRect();
    const overlay = document.createElementNS(ns, "svg");
    overlay.classList.add("bridge-overlay");
    overlay.setAttribute("width", arch.scrollWidth);
    overlay.setAttribute("height", arch.clientHeight);
    overlay.setAttribute("aria-hidden", "true");
    bridgeGroups.forEach(group => {
      const color = getRecordColor(group.record) || "#ffa726";
      const teeth = [...group.teeth] .map(number => {
        const card = arch.querySelector( `.tooth[data-tooth="${number}"]` );
        if (!card) return null;
        const diagram = card.querySelector(".tooth-diagram");
        const box = diagram.getBoundingClientRect();
        const scale = box.width / 120;
        const pontic = isToothMissing(number);
        if (!pontic) markCrown(number, color);
        return {
          x: box.left - bounds.left + arch.scrollLeft + box.width / 2, y: box.top - bounds.top + arch.scrollTop + 60 * scale, edge: pontic ? 5 : 54 * scale, pontic };
      }) .filter(Boolean) .sort((a, b) => a.x - b.x);
      if (teeth.length < 2) return;
      for (let index = 0; index < teeth.length - 1; index++) {
        const left = teeth[index];
        const right = teeth[index + 1];
        const line = document.createElementNS(ns, "line");
        setAttributes(line, {
          x1: left.x + left.edge, y1: left.y, x2: right.x - right.edge, y2: right.y, stroke: color, "stroke-width": "3", "stroke-linecap": "round" });
        overlay.appendChild(line);
      }
      teeth.filter((tooth) => tooth.pontic).forEach(tooth => {
        const circle = document.createElementNS(ns, "circle");
        setAttributes(circle, { cx: tooth.x, cy: tooth.y, r: "5", fill: color });
        overlay.appendChild(circle);
      });
    });
    arch.appendChild(overlay);
  });
}
let bridgeResizeFrame;
window.addEventListener("resize", () => {
  cancelAnimationFrame(bridgeResizeFrame);
  bridgeResizeFrame = requestAnimationFrame(renderBridges);
});

function bridgeLabel(label) {
  return typeof label === "string" && label.startsWith("#") ? label.slice(1) : label;
}

function formatSurfaceText(surfaces) {
  const order = ["M", "O", "I", "D", "B", "F", "L", "C"];
  const sorted = [...surfaces].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const text = sorted.filter(surface => surface !== "C").join("");
  return sorted.includes("C") ? (text ? text + " cervical" : "cervical") : text;
}

function highlightMobility(element) {
  const originalText = element.textContent;
  const parts = originalText.split(/(mobility)/gi);
  element.innerHTML = "";
  parts.forEach(part => {
    if (part.toLowerCase() === "mobility") {
      const mobility = document.createElement("span");
      mobility.className = "chart-mobility";
      mobility.textContent = part;
      element.appendChild(mobility);
    } else {
      element.appendChild(document.createTextNode(part));
    }
  });
}

function formatChartRecord(record) {
  const text = recordText(record);
  return record.treatment ? "[" + text + "]" : text;
}

function formatTreatmentRecord(record) {
  if (["Bridge", "bridge"].includes(record.finding)) return isToothMissing(record.tooth) ? "FPD pontic" : "FPD abutment";
  return recordText(record);
}

function createChartLine(editKey, defaultText, removeRecords) {
  const entry = document.createElement("div");
  entry.className = "chart-entry";
  const text = document.createElement("span");
  text.className = "chart-text";
  text.contentEditable = "true";
  text.spellcheck = true;
  text.textContent = chartEdits[editKey] ?? defaultText;
  highlightMobility(text);
  text.addEventListener("input", () => { chartEdits[editKey] = text.textContent; });
  text.addEventListener("blur", () => {
    chartEdits[editKey] = text.textContent;
    highlightMobility(text);
  });
  const button = document.createElement("button");
  button.className = "delete-chart-line";
  button.textContent = "×";
  button.title = "Delete this chart line";
  button.addEventListener("click", () => {
    removeRecords();
    delete chartEdits[editKey];
    refreshChart();
  });
  entry.append(text, button);
  return entry;
}

function renderBridgeChart(output) {
  const groups = new Map();
  findings.filter((record) => !record.treatment && ["Bridge", "bridge"].includes(record.finding)).forEach(record => {
    const key = (record.treatment ? "treatment-" : "finding-") + record.batchId;
    if (!groups.has(key)) {
      groups.set(key, {
        records: [], teeth: new Set() });
    }
    const group = groups.get(key);
    group.records.push(record);
    (record.bridgeTeeth || [record.tooth]).forEach( number => { group.teeth.add(number); });
  });
  groups.forEach((group, key) => {
    const teeth = [...group.teeth].sort((a, b) => a - b);
    if (teeth.length < 2) return;
    const start = teeth[0];
    const end = teeth[teeth.length - 1];
    const text = "#" + start + "-" + end + " bridge";
    output.appendChild( createChartLine( "bridge-" + key, text, () => { findings = findings.filter((record) => !group.records.includes(record)); }
    ) );
  });
}

function renderChart() {
  const output = byId("output");
  output.innerHTML = "";
  const missing = findings.filter((record) => !record.treatment && record.finding === "missing");
  if (missing.length) {
    const labels = [...new Set( missing.slice() .sort((a, b) => a.tooth - b.tooth) .map((record) => record.toothLabel || getToothLabel(record.tooth)) )];
    output.appendChild( createChartLine( "missing-" + labels.join("|"), "Missing teeth: " + labels.join(", "), () => { findings = findings.filter((record) => !missing.includes(record)); }
    ) );
  }
  renderBridgeChart(output);
  const groups = {};
  findings.filter((record) => record.treatment || ( !["Bridge", "bridge"].includes(record.finding) && record.finding !== "missing" )).forEach(record => {
    const label = record.toothLabel || getToothLabel(record.tooth);
    const key = record.tooth + "|" + label;
    if (!groups[key]) {
      groups[key] = {
        tooth: record.tooth, label, records: [] };
    }
    groups[key].records.push(record);
  });
  Object.values(groups)
  .sort((a, b) => a.tooth - b.tooth)
  .forEach(group => {
    const findingText = group.records .filter((record) => !record.treatment) .map(formatChartRecord) .join("; ");
    const treatmentText = group.records .filter((record) => record.treatment) .map(formatTreatmentRecord) .join("; ");
    const text = group.label + (findingText ? ": " + findingText : "") + (treatmentText ? " [" + treatmentText + "]" : "");
    output.appendChild( createChartLine( "tooth-" + group.tooth + "-" + group.label, text, () => { findings = findings.filter((record) => !group.records.includes(record)); }
    ) );
  });
}

function renderMissingChart(output) {
  const missingRecords = findings.filter((record) => record.finding === "missing");
  if (missingRecords.length === 0) return;
  const labels = [...new Set( missingRecords.slice() .sort((a, b) => a.tooth - b.tooth) .map((record) => record.toothLabel || getToothLabel(record.tooth)) )];
  const entry = document.createElement("div");
  entry.className = "chart-entry";
  const text = document.createElement("span");
  text.className = "chart-text";
  text.contentEditable = "true";
  text.spellcheck = true;
  text.textContent = chartEdits["missing-teeth"] ?? "Missing teeth: " + labels.join(", ");
  text.addEventListener("input", () => { chartEdits["missing-teeth"] = text.textContent; });
  text.addEventListener("blur", () => { chartEdits["missing-teeth"] = text.textContent; });
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-chart-line";
  deleteButton.textContent = "×";
  deleteButton.title = "Delete all missing-tooth findings";
  deleteButton.addEventListener("click", () => {
    findings = findings.filter((record) => record.finding !== "missing");
    delete chartEdits["missing-teeth"];
    refreshChart();
  });
  entry.appendChild(text);
  entry.appendChild(deleteButton);
  output.appendChild(entry);
}
byId("undo").addEventListener( "click", () => {
  if (findings.length === 0) return;
  const lastBatchId = findings[findings.length - 1].batchId;
  findings = findings.filter((record) => record.batchId !== lastBatchId);
  delete chartEdits["missing-teeth"];
  renderFindings();
  renderChart();
});
byId("copyChart").addEventListener( "click", () => {
  const entries = all("#output .chart-text");
  if (entries.length === 0) {
    alert("The chart is empty.");
    return;
  }
  const text = Array.from(entries) .map((entry) => entry.textContent) .join("\n");
  navigator.clipboard.writeText(text).then(() => {
    const message = byId("copyMessage");
    message.textContent = "Chart copied!";
    setTimeout(() => { message.textContent = ""; }, 2000);
  });
});

const findingShortcuts = {
  d: "decay", c: "composite", a: "amalgam",
  r: "RCT", z: "Zirconia crown", b: "Bridge",
  w: "wear", m: "missingMain", t: "root tip",
  p: "PFM crown", i: "incipient caries"
};
document.addEventListener("keydown", event => {
  if ( event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.isComposing ) return;
  const editingSelector = "input, textarea, select, " + "[contenteditable]:not([contenteditable='false']), " + "[role='textbox']";
  const active = document.activeElement;
  if (active && active.closest(editingSelector)) return;
  if ( event.target instanceof Element && event.target.closest(editingSelector) ) return;
  const name = findingShortcuts[event.key.toLowerCase()];
  if (!name) return;
  const button = name === "missingMain" ? byId("missingMain") : Array.from(all(".finding")) .find((button) => button.dataset.name === name);
  if ( !button || button.disabled || selections.length === 0 ) return;
  event.preventDefault();
  button.click();
});

const odontogramStorageKey = "odontogram-autosave-v1";
let restoringOdontogram = false;
const autosaveMessage = document.createElement("div");
autosaveMessage.id = "autosaveMessage";
autosaveMessage.setAttribute("role", "status");
byId("copyMessage").after(autosaveMessage);

function saveOdontogram() {
  if (restoringOdontogram) return;
  const data = {
    version: 1,
    findings,
    nextBatchId,
    chartEdits,
    teeth: Array.from( all(".tooth") ).map(tooth => {
      return {
        number: Number(tooth.dataset.tooth), age: tooth.querySelector(".tooth-number").dataset.age, hidden: tooth.hidden };
    }),
    mode:
    query(".dentition-button.active")
    ?.dataset.dentition || null
  };
  try {
    localStorage.setItem( odontogramStorageKey, JSON.stringify(data) );
    autosaveMessage.textContent = "Saved on this device.";
  } catch (error) {
    autosaveMessage.textContent = "Autosave unavailable. This browser could not save the chart.";
  }
}

function restoreOdontogram() {
  restoringOdontogram = true;
  try {
    const raw = localStorage.getItem(odontogramStorageKey);
    if (!raw) {
      autosaveMessage.textContent = "Autosave ready on this device.";
      return;
    }
    const data = JSON.parse(raw);
    if ( data.version !== 1 || !Array.isArray(data.findings) || !Array.isArray(data.teeth) ) throw new Error("Invalid saved chart");
    const validFindings = data.findings.every((record) => record && Number.isInteger(record.tooth) && record.tooth >= 1 && record.tooth <= 32 && typeof record.finding === "string" && Array.isArray(record.surfaces) && typeof record.whole === "boolean" && Number.isInteger(record.batchId));
    if (!validFindings) throw new Error("Invalid saved findings");
    findings = data.findings;
    chartEdits = Object.fromEntries( Object.entries(data.chartEdits || {}) .filter((entry) => typeof entry[1] === "string") );
    nextBatchId = Math.max( Number(data.nextBatchId) || 1, 1 + findings.reduce((max, record) => Math.max(max, record.batchId), 0) );
    data.teeth.forEach(saved => {
      if ( !Number.isInteger(saved.number) || saved.number < 1 || saved.number > 32 ) return;
      setToothAge( saved.number, saved.age === "primary" ? "primary" : "permanent" );
      query( `.tooth[data-tooth="${saved.number}"]` ).hidden = Boolean(saved.hidden);
    });
    setDentitionButtons(data.mode);
    selections = [];
    clearTemporarySelection();
    refreshChart();
    autosaveMessage.textContent = "Saved chart restored.";
  } catch (error) {
    autosaveMessage.textContent = "The saved chart could not be restored. " + "Your stored copy has not been changed.";
  } finally {
    restoringOdontogram = false;
  }
}
const renderChartBeforeAutosave = renderChart;
renderChart = () => {
  renderChartBeforeAutosave();
  saveOdontogram();
};
document.addEventListener("input", event => { if (event.target.closest(".chart-text")) saveOdontogram(); });
document.addEventListener("focusout", event => { if (event.target.closest(".chart-text")) saveOdontogram(); });
window.addEventListener("pagehide", saveOdontogram);

restoreOdontogram();
const clearAllDialog = byId("clearAllDialog");
byId("clearAll").addEventListener( "click", () => { clearAllDialog.showModal(); });
byId("cancelClearAll").addEventListener( "click", () => { clearAllDialog.close(); });
byId("confirmClearAll").addEventListener( "click", () => {
  findings = [];
  chartEdits = {};
  selections = [];
  nextBatchId = 1;
  clearTemporarySelection();
  for (let number = 1; number <= 32; number++) {
    setToothAge(number, "permanent");
  }
  setDentitionButtons("permanent");
  byId("copyMessage").textContent = "";
  refreshChart();
  clearAllDialog.close();
});
all(".finding-section, .treatment-section")
.forEach(section => {
  if (section.querySelector(".category-pair")) return;
  const rows = [...section.children] .filter(row => row.classList.contains("finding-row"));
  for (let i = 0; i < rows.length; i += 2) {
    const pair = document.createElement("div");
    pair.className = "category-pair";
    rows[i].before(pair);
    pair.append(rows[i]);
    if (rows[i + 1]) pair.append(rows[i + 1]);
  }
});

function alignMidline() {
  const canvas = query(".dentition-canvas");
  const tooth8 = query('#maxillary .tooth-diagram[data-tooth="8"]');
  const tooth9 = query('#maxillary .tooth-diagram[data-tooth="9"]');
  if (!canvas || !tooth8 || !tooth9) return;
  const midpoint = ( tooth8.getBoundingClientRect().right + tooth9.getBoundingClientRect().left ) / 2;
  canvas.style.setProperty( "--tooth-midline", `${midpoint - canvas.getBoundingClientRect().left}px` );
}
requestAnimationFrame(alignMidline);
window.addEventListener("resize", alignMidline);
const odontogram = query(".odontogram-grid");
const treatments = query(".treatment-section");
const treatmentPanel = treatments?.closest(".clinical-panel");
if (odontogram && treatmentPanel) {
  const oldWrapper = treatmentPanel.parentElement;
  const divider = document.createElement("hr");
  divider.className = "treatment-divider";
  treatmentPanel.classList.add("odontogram-treatments");
  odontogram.append(divider, treatmentPanel);
  if ( oldWrapper.classList.contains("clinical-panels") && !oldWrapper.children.length ) oldWrapper.remove();
}
// Show the last applied action above #8/#9 and allow it to be undone.
(() => {
  const canvas = document.querySelector(".dentition-canvas");
  if (!canvas) return;

  const style = document.createElement("style");
  style.textContent = `
    .dentition-canvas.has-action-notice { padding-top: 44px; }
    .odontogram-action-notice {
      position: absolute;
      top: 0;
      left: var(--tooth-midline, 50%);
      transform: translateX(-50%);
      z-index: 12;
      display: flex;
      align-items: center;
      gap: 10px;
      width: max-content;
      max-width: calc(100% - 24px);
      box-sizing: border-box;
      padding: 3px 8px;
      border: 1px solid rgba(118, 145, 175, .3);
      border-radius: 12px;
      background: rgba(245, 250, 255, .92);
      backdrop-filter: blur(14px);
      box-shadow: 0 3px 12px rgba(30, 60, 100, .1);
      color: #203653;
      font: 12px/1.2 Arial, sans-serif;
    }
    .odontogram-action-notice[hidden] { display: none; }
    .odontogram-action-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .odontogram-action-undo {
      flex: none;
      padding: 3px 8px;
      border: 1px solid rgba(118, 145, 175, .4);
      border-radius: 8px;
      background: rgba(255, 255, 255, .8);
      color: #203653;
      font: bold 11px/1.2 Arial, sans-serif;
      cursor: pointer;
    }
    .odontogram-action-undo:hover { background: #fff; }
    .odontogram-action-undo:disabled { opacity: .45; cursor: default; }
    @media (max-width: 640px) {
      .dentition-canvas.has-action-notice { padding-top: 76px; }
      .odontogram-action-notice { top: 0; }
    }
  `;
  document.head.append(style);

  const notice = document.createElement("div");
  notice.className = "odontogram-action-notice";
  notice.hidden = true;
  const text = document.createElement("span");
  text.className = "odontogram-action-text";
  text.setAttribute("role", "status");
  text.setAttribute("aria-live", "polite");
  const undo = document.createElement("button");
  undo.type = "button";
  undo.className = "odontogram-action-undo";
  undo.textContent = "Undo";
  undo.title = "Undo this action";
  notice.append(text, undo);
  canvas.append(notice);

  let history = [];
  let pending = null;

  function snapshot() {
    return {
      findings: JSON.parse(JSON.stringify(findings)),
      chartEdits: { ...chartEdits },
      nextBatchId,
      teeth: [...document.querySelectorAll(".tooth")].map(tooth => ({
        number: Number(tooth.dataset.tooth),
        age: tooth.querySelector(".tooth-number").dataset.age,
        hidden: tooth.hidden
      })),
      modes: [...document.querySelectorAll(".dentition-button")]
        .map(button => button.classList.contains("active"))
    };
  }

  function positionNotice() {
    if (notice.hidden) return;
    const bounds = canvas.getBoundingClientRect();
    const center = bounds.left + parseFloat(
      canvas.style.getPropertyValue("--tooth-midline") || bounds.width / 2
    );
    let left = bounds.left + 12;
    let right = bounds.right - 12;
    let toolbarBottom = bounds.top;
    canvas.querySelectorAll(".dentition-controls, .main-odontogram-controls")
      .forEach(controls => {
        const box = controls.getBoundingClientRect();
        toolbarBottom = Math.max(toolbarBottom, box.bottom);
        if (box.left < center) left = Math.max(left, box.right + 8);
        else right = Math.min(right, box.left - 8);
      });
    const room = 2 * Math.min(center - left, right - center);
    // Use the centered space in the toolbar; wrap below it on narrow screens.
    const fits = room >= 120;
    notice.style.top = fits ? "0px" : `${toolbarBottom - bounds.top + 8}px`;
    notice.style.maxWidth = `${fits ? room : bounds.width - 24}px`;
    canvas.style.paddingTop = fits ? "" :
      `${toolbarBottom - bounds.top + notice.offsetHeight + 24}px`;
  }
  window.addEventListener("resize", () => {
    requestAnimationFrame(positionNotice);
  });

  function show(message, canUndo = true) {
    text.textContent = message;
    text.title = message;
    undo.disabled = !canUndo;
    notice.hidden = false;
    canvas.classList.add("has-action-notice");
    requestAnimationFrame(() => {
      alignMidline();
      positionNotice();
      renderBridges();
    });
  }

  function reset() {
    history = [];
    pending = null;
    notice.hidden = true;
    canvas.classList.remove("has-action-notice");
    canvas.style.paddingTop = "";
    requestAnimationFrame(() => {
      alignMidline();
      positionNotice();
      renderBridges();
    });
  }

  function undoAction() {
    const action = history.pop();
    if (!action) return;
    const state = action.before;
    findings = state.findings;
    chartEdits = state.chartEdits;
    nextBatchId = state.nextBatchId;
    state.teeth.forEach(saved => {
      setToothAge(saved.number, saved.age);
      document.querySelector(`.tooth[data-tooth="${saved.number}"]`).hidden = saved.hidden;
    });
    document.querySelectorAll(".dentition-button").forEach((button, index) => {
      button.classList.toggle("active", state.modes[index]);
      button.setAttribute("aria-pressed", String(state.modes[index]));
    });
    clearTemporarySelection();
    selections = [];
    refreshChart();
    const previous = history[history.length - 1];
    show(previous ? previous.message : "Undone: " + action.message, !!previous);
  }

  undo.addEventListener("click", undoAction);

  // Capture the state before the existing button handlers apply an action.
  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    pending = null;
    if (button.id === "undo") {
      if (history.length) {
        event.preventDefault();
        event.stopImmediatePropagation();
        undoAction();
      } else reset();
      return;
    }
    if (button.matches("#confirmClearAll, .delete-chart-line, .dentition-button")) {
      reset();
      return;
    }
    if (!button.matches("#changeAge, .finding, .treatment")) return;
    if (!selections.length || (button.id === "changeAge" && !hasWholeSelections())) return;
    const name = button.dataset.name || button.dataset.treatment;
    if (["Bridge", "bridge"].includes(name) && selections.length < 2) return;
    pending = {
      button,
      before: snapshot(),
      name,
      selected: selections.map(selection => ({
        ...selection,
        surfaces: [...selection.surfaces],
        label: getToothLabel(selection.tooth)
      }))
    };
  }, true);

  // Existing handlers have now updated the chart; announce successful changes.
  document.addEventListener("click", event => {
    const action = pending;
    pending = null;
    if (!action || event.target.closest("button") !== action.button) return;
    const after = snapshot();
    const content = state => JSON.stringify([state.findings, state.chartEdits, state.teeth]);
    if (content(action.before) === content(after)) return;
    action.message = action.selected.map(selection => {
      if (action.button.id === "changeAge") {
        const tooth = after.teeth.find(item => item.number === selection.tooth);
        return `${selection.label}: ${tooth.age}${tooth.hidden ? " (hidden in primary dentition)" : " → " + getToothLabel(selection.tooth)}`;
      }
      const surface = selection.whole ? "" : formatSurfaceText(selection.surfaces);
      const name = action.name === "unmissing" ? "restored" : action.name;
      const detail = (surface ? surface + " " : "") + name;
      return `${selection.label}: ${action.button.matches(".treatment") ? "[" + detail + "]" : detail}`;
    }).join("; ");
    history.push(action);
    show(action.message);
  });

  // Later manual edits should remain intact when using the original chart Undo.
  document.addEventListener("input", event => {
    if (event.target.closest(".chart-text")) reset();
  });
})();
