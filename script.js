// ==========================================
// STATE
// ==========================================

let selections = [];
let findings = [];
let nextBatchId = 1;
let chartEdits = {};

// ==========================================
// TOOTH GROUPS
// ==========================================

const anteriorTeeth = [
  6, 7, 8, 9, 10, 11,
  22, 23, 24, 25, 26, 27
];

const maxillaryTeeth = [
  1, 2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14, 15, 16
];

const mandibularTeeth = [
  32, 31, 30, 29, 28, 27, 26, 25,
  24, 23, 22, 21, 20, 19, 18, 17
];

const primaryToothMap = {
  4: "A",
  5: "B",
  6: "C",
  7: "D",
  8: "E",
  9: "F",
  10: "G",
  11: "H",
  12: "I",
  13: "J",
  20: "K",
  21: "L",
  22: "M",
  23: "N",
  24: "O",
  25: "P",
  26: "Q",
  27: "R",
  28: "S",
  29: "T"
};

const positionFindings = [
  "mobility",
  "tilted",
  "rotated",
  "super-eruption",
  "erupting"
];

const mixedPermanentTeeth = [
  3, 14, 19, 30,
  7, 8, 9, 10,
  23, 24, 25, 26
];

// ==========================================
// CREATE ODONTOGRAM
// ==========================================

createArch("maxillary", maxillaryTeeth);
createArch("mandibular", mandibularTeeth);
updateFindingButtons();

function createArch(containerID, teeth) {
  const container = document.getElementById(containerID);

  teeth.forEach(function(toothNumber, index) {
    const tooth = createTooth(toothNumber);

    if (index === 7) {
      tooth.classList.add("midline");
    }

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

  const isRightSide =
    (toothNumber >= 1 && toothNumber <= 8) ||
    (toothNumber >= 25 && toothNumber <= 32);

  const leftSurface = isRightSide ? "D" : "M";
  const rightSurface = isRightSide ? "M" : "D";

  const isMandibular =
    toothNumber >= 17 && toothNumber <= 32;

  const topSurface = isMandibular ? "L" : outerSurface;
  const bottomSurface = isMandibular ? outerSurface : "L";

  wrapper.innerHTML = `
    <svg
      class="tooth-diagram"
      viewBox="0 0 120 205"
      data-tooth="${toothNumber}"
    >
      <!-- Top surface -->
      <path
        class="surface"
        data-surface="${topSurface}"
        d="M 13.515 13.515
           Q 17.029 10 22 10
           H 98
           Q 102.971 10 106.485 13.515
           L 85 35
           H 35 Z"
      ></path>

      <!-- Left surface -->
      <path
        class="surface"
        data-surface="${leftSurface}"
        d="M 13.515 13.515
           L 35 35
           V 85
           L 13.515 106.485
           Q 10 102.971 10 98
           V 22
           Q 10 17.029 13.515 13.515 Z"
      ></path>

      <!-- Center surface -->
      <rect
        class="surface"
        data-surface="${centerSurface}"
        x="35"
        y="35"
        width="50"
        height="50"
      ></rect>

      <!-- Right surface -->
      <path
        class="surface"
        data-surface="${rightSurface}"
        d="M 106.485 13.515
           Q 110 17.029 110 22
           V 98
           Q 110 102.971 106.485 106.485
           L 85 85
           V 35 Z"
      ></path>

      <!-- Bottom surface -->
      <path
        class="surface"
        data-surface="${bottomSurface}"
        d="M 13.515 106.485
           L 35 85
           H 85
           L 106.485 106.485
           Q 102.971 110 98 110
           H 22
           Q 17.029 110 13.515 106.485 Z"
      ></path>

      <!-- Endodontic circles and connecting lines -->
      <g class="endo-coronal-network">
        <path
          class="endo-coronal-links"
          d="M60 60 L60 23
             M60 60 L23 60
             M60 60 L97 60
             M60 60 L60 98"
        ></path>

        <circle cx="60" cy="23" r="9"></circle>
        <circle cx="23" cy="60" r="9"></circle>
        <circle cx="60" cy="60" r="9"></circle>
        <circle cx="97" cy="60" r="9"></circle>
        <circle cx="60" cy="98" r="9"></circle>
      </g>

      <!-- Surface letters -->
      <text x="60" y="28">${topSurface}</text>
      <text x="23" y="65">${leftSurface}</text>
      <text x="60" y="65">${centerSurface}</text>
      <text x="97" y="65">${rightSurface}</text>
      <text x="60" y="103">${bottomSurface}</text>

      <!-- Cervical surface -->
      <rect
        class="surface cervical-surface"
        data-surface="C"
        x="15"
        y="135"
        width="90"
        height="40"
        rx="3"
      ></rect>

      <text
        class="cervical-label"
        x="60"
        y="155"
      >C</text>

      <!-- Crown lengthening -->
      <g class="lengthening-arrows">
        <path
          d="M35 181 V197
             M29 191 L35 197 L41 191"
        ></path>
        <path
          d="M60 181 V197
             M54 191 L60 197 L66 191"
        ></path>
        <path
          d="M85 181 V197
             M79 191 L85 197 L91 191"
        ></path>
      </g>

      <!-- RCT root and canal -->
      <g class="endo-symbol">
        <path
          class="endo-root"
          d="M43 130
             Q60 125 77 130
             L68 169
             Q60 184 52 169 Z"
        ></path>
        <path
          class="endo-canal"
          d="M50 135 H70
             M60 135 L60 174"
        ></path>
      </g>

      <!-- Pulpotomy: no canal line -->
      <g class="pulpotomy-symbol">
        <path
          class="endo-root"
          d="M43 130
             Q60 125 77 130
             L68 169
             Q60 184 52 169 Z"
        ></path>
        <rect
          class="pulp-chamber"
          x="49"
          y="132"
          width="22"
          height="10"
          rx="2"
        ></rect>
      </g>

      <!-- Post and core -->
      <g class="post-core-symbol">
        <path
          class="endo-root"
          d="M43 130
             Q60 125 77 130
             L68 169
             Q60 184 52 169 Z"
        ></path>
        <path
          class="post-canal"
          d="M60 155 V174"
        ></path>
        <rect
          class="core-block"
          x="47"
          y="130"
          width="26"
          height="12"
          rx="2"
        ></rect>
        <path
          class="post-shaft"
          d="M60 140 V159"
        ></path>
      </g>

      <!-- Implant screw -->
      <g
        class="implant-symbol"
        transform="translate(0 121) scale(1 .38)"
      >
        <path
          d="M48 14 H72 V29
             L77 35 H43 L48 29 Z"
          fill="#ccefed"
        ></path>
        <path
          d="M40 36 H80 V48
             L72 127
             Q60 147 48 127
             L40 48 Z"
          fill="#e8f6f5"
        ></path>
        <path
          d="M39 49 L80 55
             M41 62 L78 68
             M42 75 L77 81
             M44 88 L76 94
             M45 101 L74 107
             M47 114 L72 120
             M50 126 L68 132"
          fill="none"
        ></path>
      </g>

      <!-- Crown frame -->
      <rect
        class="crown-outline"
        x="6"
        y="6"
        width="108"
        height="108"
        rx="8"
      ></rect>

      <!-- Extraction: one large cross -->
      <path
        class="extraction-cross"
        d="M10 10 L110 175
           M110 10 L10 175"
      ></path>
    </svg>

    <div
      class="tooth-number"
      data-tooth="${toothNumber}"
      data-age="permanent"
    >#${toothNumber}</div>

    <div
      class="root-markers"
      data-tooth="${toothNumber}"
    ></div>

    <div
      class="watch-marker"
      data-tooth="${toothNumber}"
    >
      <svg
        viewBox="0 0 32 20"
        role="img"
        aria-label="Watch tooth"
      >
        <path d="M2 10 Q16 -5 30 10 Q16 25 2 10 Z"></path>
        <circle cx="16" cy="10" r="4"></circle>
      </svg>
    </div>

    <div
      class="position-display"
      data-tooth="${toothNumber}"
    ></div>
  `;

  return wrapper;
}

// ==========================================
// TOOTH LABEL
// ==========================================

function getToothLabel(toothNumber) {
  const numberElement = document.querySelector(
    `.tooth-number[data-tooth="${toothNumber}"]`
  );

  if (
    numberElement &&
    numberElement.dataset.age === "primary"
  ) {
    return "#" + primaryToothMap[toothNumber];
  }

  return "#" + toothNumber;
}

// ==========================================
// SURFACE SELECTION
// ==========================================

document.addEventListener("click", function(event) {
  const surface = event.target.closest(".surface");

  if (!surface) return;

  const svg = surface.closest(".tooth-diagram");
  const toothNumber = Number(svg.dataset.tooth);
  const surfaceName = surface.dataset.surface;

  if (hasWholeSelections()) {
    clearTemporarySelection();
    selections = [];
  }

  let toothSelection = selections.find(function(item) {
    return item.tooth === toothNumber && item.whole === false;
  });

  if (!toothSelection) {
    toothSelection = {
      tooth: toothNumber,
      surfaces: [],
      whole: false
    };

    selections.push(toothSelection);
  }

  if (toothSelection.surfaces.includes(surfaceName)) {
    toothSelection.surfaces =
      toothSelection.surfaces.filter(function(item) {
        return item !== surfaceName;
      });

    surface.classList.remove("selected");
  } else {
    toothSelection.surfaces.push(surfaceName);
    surface.classList.add("selected");
  }

  if (toothSelection.surfaces.length === 0) {
    selections = selections.filter(function(item) {
      return item !== toothSelection;
    });
  }

  updateFindingButtons();
});

// ==========================================
// WHOLE-TOOTH SELECTION
// ==========================================

document.addEventListener("click", function(event) {
  const number = event.target.closest(".tooth-number");

  if (!number) return;

  const toothNumber = Number(number.dataset.tooth);

  if (hasSurfaceSelections()) {
    clearTemporarySelection();
    selections = [];
  }

  const existing = selections.find(function(item) {
    return item.tooth === toothNumber && item.whole === true;
  });

  if (existing) {
    selections = selections.filter(function(item) {
      return item !== existing;
    });

    number.classList.remove("selected");
  } else {
    selections.push({
      tooth: toothNumber,
      surfaces: [],
      whole: true
    });

    number.classList.add("selected");
  }

  updateFindingButtons();
});

// ==========================================
// SELECTION HELPERS
// ==========================================

function hasWholeSelections() {
  return selections.some(function(item) {
    return item.whole === true;
  });
}

function hasSurfaceSelections() {
  return selections.some(function(item) {
    return item.whole === false;
  });
}

function clearTemporarySelection() {
  document.querySelectorAll(".surface.selected").forEach(
    function(surface) {
      surface.classList.remove("selected");
    }
  );

  document.querySelectorAll(".tooth-number.selected").forEach(
    function(number) {
      number.classList.remove("selected");
    }
  );
}

// ==========================================
// MISSING CHECK
// ==========================================

function isToothMissing(toothNumber) {
  const tooth = document.querySelector(
    `.tooth[data-tooth="${toothNumber}"]`
  );

  return Boolean(tooth && tooth.hidden) ||
    findings.some(function(record) {
      return record.tooth === toothNumber &&
        record.whole === true &&
        record.finding === "missing";
    });
}

// ==========================================
// BUTTON AVAILABILITY
// ==========================================

function updateFindingButtons() {
  document.querySelectorAll(".watch-treatment").forEach(
    function(button) {
      button.disabled =
        !hasWholeSelections() && !hasSurfaceSelections();
    }
  );

  document.querySelectorAll(".surface-treatment").forEach(
    function(button) {
      button.disabled = !hasSurfaceSelections();
    }
  );

  document.querySelectorAll(".whole-treatment").forEach(
    function(button) {
      button.disabled = !hasWholeSelections();
    }
  );

  const surfaceButtons =
    document.querySelectorAll(".surface-finding");

  const wholeButtons =
    document.querySelectorAll(".whole-finding");

  const missingButton = document.getElementById("missingMain");

  if (selections.length === 0) {
    surfaceButtons.forEach(function(button) {
      button.disabled = true;
    });

    wholeButtons.forEach(function(button) {
      button.disabled = true;
    });

    missingButton.textContent = "(M) Missing";
    missingButton.dataset.name = "missing";

    return;
  }

  if (hasSurfaceSelections()) {
    surfaceButtons.forEach(function(button) {
      button.disabled = false;
    });

    wholeButtons.forEach(function(button) {
      button.disabled = true;
    });

    missingButton.textContent = "(M) Missing";
    missingButton.dataset.name = "missing";

    return;
  }

  surfaceButtons.forEach(function(button) {
    button.disabled = true;
  });

  wholeButtons.forEach(function(button) {
    button.disabled = false;
  });

  const allSelectedAreMissing =
    selections.every(function(selection) {
      return isToothMissing(selection.tooth);
    });

  if (allSelectedAreMissing) {
    missingButton.textContent = "(M) Unmissing";
    missingButton.dataset.name = "unmissing";
  } else {
    missingButton.textContent = "(M) Missing";
    missingButton.dataset.name = "missing";
  }
}

// ==========================================
// FINDINGS
// ==========================================

document.querySelectorAll(".finding").forEach(function(button) {
  button.addEventListener("click", function() {
    if (selections.length === 0) return;

    const finding = this.dataset.name;

    if (finding === "unmissing") {
      delete chartEdits["missing-teeth"];

      const selectedToothNumbers =
        selections.map(function(selection) {
          return selection.tooth;
        });

      findings = findings.filter(function(record) {
        return !(
          selectedToothNumbers.includes(record.tooth) &&
          record.whole === true &&
          record.finding === "missing"
        );
      });

      selectedToothNumbers.forEach(function(toothNumber) {
        const tooth = document.querySelector(
          `.tooth[data-tooth="${toothNumber}"]`
        );

        if (tooth) tooth.hidden = false;
      });

      clearTemporarySelection();
      selections = [];
      updateFindingButtons();
      renderFindings();
      renderChart();

      return;
    }

    if (finding === "missing") {
      delete chartEdits["missing-teeth"];
    }

    const batchId = nextBatchId++;

    if (finding === "Bridge") {
      const selectedTeeth = selections
        .map(function(selection) {
          return selection.tooth;
        })
        .sort(function(a, b) {
          return a - b;
        });

      if (selectedTeeth.length < 2) {
        alert("Please select at least two teeth for a bridge.");
        return;
      }

      const bridgeStart = selectedTeeth[0];
      const bridgeEnd = selectedTeeth[selectedTeeth.length - 1];

      findings.push({
        tooth: bridgeStart,
        bridgeTeeth: selectedTeeth,
        bridgeStart: bridgeStart,
        bridgeEnd: bridgeEnd,
        bridgeStartLabel: getToothLabel(bridgeStart),
        bridgeEndLabel: getToothLabel(bridgeEnd),
        surfaces: [],
        whole: true,
        finding: "Bridge",
        batchId: batchId
      });
    } else {
      selections.forEach(function(selection) {
        findings.push({
          tooth: selection.tooth,
          toothLabel: getToothLabel(selection.tooth),
          surfaces: [...selection.surfaces],
          whole: selection.whole,
          finding: finding,
          batchId: batchId
        });
      });
    }

    clearTemporarySelection();
    selections = [];
    updateFindingButtons();
    renderFindings();
    renderChart();
  });
});

// ==========================================
// CHANGE AGE
// ==========================================

document.getElementById("changeAge").addEventListener(
  "click",
  function() {
    if (!hasWholeSelections()) {
      alert("Please select one or more tooth numbers first.");
      return;
    }

    selections.forEach(function(selection) {
      const tooth = document.querySelector(
        `.tooth[data-tooth="${selection.tooth}"]`
      );

      const number = tooth.querySelector(".tooth-number");

      const showPermanent =
        tooth.hidden || number.dataset.age === "primary";

      setToothAge(
        selection.tooth,
        showPermanent ? "permanent" : "primary"
      );
    });

    clearTemporarySelection();
    selections = [];

    document.querySelectorAll(".dentition-button").forEach(
      function(button) {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      }
    );

    updateFindingButtons();
    renderFindings();
    renderChart();
  }
);

// ==========================================
// DENTITION MODES
// ==========================================

function setToothAge(toothNumber, age) {
  const tooth = document.querySelector(
    `.tooth[data-tooth="${toothNumber}"]`
  );

  const number = tooth.querySelector(".tooth-number");
  const primary = age === "primary";
  const letter = primaryToothMap[toothNumber];

  tooth.hidden = primary && !letter;
  number.dataset.age = primary && letter ? "primary" : "permanent";

  number.textContent =
    "#" + (primary && letter ? letter : toothNumber);
}

function setDentition(mode) {
  clearTemporarySelection();
  selections = [];

  document.querySelectorAll(".tooth").forEach(function(tooth) {
    const toothNumber = Number(tooth.dataset.tooth);

    const permanent =
      mode === "permanent" ||
      (
        mode === "mixed" &&
        mixedPermanentTeeth.includes(toothNumber)
      );

    setToothAge(
      toothNumber,
      permanent ? "permanent" : "primary"
    );
  });

  document.querySelectorAll(".dentition-button").forEach(
    function(button) {
      const active = button.dataset.dentition === mode;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  );

  updateFindingButtons();
  renderFindings();
  renderChart();
}

document.querySelectorAll(".dentition-button").forEach(
  function(button) {
    button.addEventListener("click", function() {
      setDentition(button.dataset.dentition);
    });
  }
);

// ==========================================
// SUGGESTED TREATMENTS
// ==========================================

document.querySelectorAll(".treatment").forEach(function(button) {
  button.addEventListener("click", function() {
    if (button.disabled || selections.length === 0) return;

    const bridgeTeeth =
      ["Bridge", "bridge"].includes(button.dataset.treatment)
        ? selections.map(selection => selection.tooth)
        : null;

    if (bridgeTeeth && bridgeTeeth.length < 2) {
      alert("Please select at least two teeth for a bridge.");
      return;
    }

    const batchId = nextBatchId++;

    selections.forEach(function(selection) {
      const label = getToothLabel(selection.tooth);

      const record = {
        tooth: selection.tooth,
        toothLabel: label,
        surfaces: [...selection.surfaces],
        whole: selection.whole,
        finding: button.dataset.treatment,
        treatment: true,
        bridgeTeeth: bridgeTeeth,
        batchId: batchId
      };

      const duplicate = findings.some(function(r) {
        return r.treatment &&
          r.tooth === record.tooth &&
          r.toothLabel === label &&
          r.finding === record.finding &&
          r.whole === record.whole &&
          [...r.surfaces].sort().join(",") ===
            [...record.surfaces].sort().join(",");
      });

      if (!duplicate) findings.push(record);

      delete chartEdits[
        "tooth-" + record.tooth + "-" + label
      ];
    });

    clearTemporarySelection();
    selections = [];
    updateFindingButtons();
    renderFindings();
    renderChart();
  });
});

// ==========================================
// COLORS AND CROWN FRAMES
// ==========================================

function getRecordColor(record) {
  const selector = record.treatment ? ".treatment" : ".finding";

  const button = Array.from(
    document.querySelectorAll(selector)
  ).find(function(button) {
    const name = record.treatment
      ? button.dataset.treatment
      : button.dataset.name;

    return name === record.finding;
  });

  return button
    ? getComputedStyle(button).backgroundColor
    : null;
}

function markCrown(toothNumber, color) {
  const tooth = document.querySelector(
    `.tooth-diagram[data-tooth="${toothNumber}"]`
  );

  if (!tooth || !color) return;

  tooth.classList.add("has-crown-outline");
  tooth.querySelector(".crown-outline").style.stroke = color;
}

// ==========================================
// RENDER FINDINGS AND TREATMENTS
// ==========================================

function renderFindings() {
  document.querySelectorAll(".tooth").forEach(function(tooth) {
    tooth.classList.remove("has-watch-marker");
  });

  const surfaceClasses = {
    "stain": "stain",
    "caries": "caries",
    "cavity": "caries",
    "decay": "caries",
    "decalcified": "decalcified",
    "incipient caries": "incipient-caries",
    "recurrent caries": "recurrent-caries",
    "gross caries": "gross-caries",
    "composite": "composite",
    "amalgam": "amalgam",
    "sealant": "sealant",
    "IRM": "irm",
    "wear": "wear",
    "abfraction": "abfraction",
    "erosion": "erosion",
    "crack line": "crack-line",
    "broken": "broken"
  };

  const wholeClasses = {
    "SSC": "ssc",
    "Zirconia crown": "zirconia-crown",
    "PFM crown": "pfm-crown",
    "Metal crown": "metal-crown",
    "RCT": "rct",
    "post & core": "post-core",
    "implant": "implant",
    "missing": "missing",
    "root tip": "root-tip",
    "PARL": "parl",
    "PARO": "paro",
    "ankylosis": "ankylosis"
  };

  const crownFindings = [
    "SSC",
    "Zirconia crown",
    "PFM crown",
    "Metal crown",
    "implant"
  ];

  const crownTreatments = [
    "CBU",
    "SSC",
    "Zirconia",
    "PFM",
    "Metal",
    "Bridge",
    "bridge",
    "Implant",
    "implant"
  ];

  const fillingTreatments = [
    "Composite",
    "Amalgam",
    "RMGI",
    "IRM"
  ];

  document.querySelectorAll(".cervical-label").forEach(
    function(label) {
      label.textContent = "C";
    }
  );

  document.querySelectorAll(".root-markers").forEach(
    function(marker) {
      marker.innerHTML = "";
    }
  );

  document.querySelectorAll(".surface").forEach(
    function(surface) {
      surface.classList.remove(
        ...new Set(Object.values(surfaceClasses))
      );

      surface.style.removeProperty("fill");
    }
  );

  document.querySelectorAll(".tooth-diagram").forEach(
    function(tooth) {
      tooth.classList.remove(
        ...Object.values(wholeClasses),
        "bridge",
        "extraction-planned",
        "has-crown-outline",
        "has-implant-symbol",
        "has-endo-symbol",
        "has-lengthening-arrows",
        "has-pulpotomy-symbol",
        "has-post-core-symbol",
        "has-endo-coronal"
      );

      tooth.style.removeProperty("--endo-color");

      tooth.querySelector(".crown-outline")
        .style.removeProperty("stroke");
    }
  );

  findings.forEach(function(record) {
    const color = getRecordColor(record);

    const tooth = document.querySelector(
      `.tooth-diagram[data-tooth="${record.tooth}"]`
    );

    if (!tooth) return;

    if (
      ["Pulpotomy", "RCT", "post & core"].includes(record.finding)
    ) {
      tooth.classList.add("has-endo-coronal");

      tooth.style.setProperty(
        "--endo-color",
        color || "#66bb6a"
      );
    }

    if (record.finding === "RCT") {
      tooth.classList.add("has-endo-symbol");
    }

    if (record.finding === "Pulpotomy") {
      tooth.classList.add("has-pulpotomy-symbol");
    }

    if (record.finding === "post & core") {
      tooth.classList.add("has-post-core-symbol");
    }

    if (
      record.treatment &&
      record.finding === "Crown lengthening"
    ) {
      tooth.classList.add("has-lengthening-arrows");
    }

    if (record.treatment) {
      if (record.finding === "Watch" && record.whole) {
        tooth.closest(".tooth")
          .classList.add("has-watch-marker");
      }

      if (record.finding === "Extraction") {
        tooth.classList.add("extraction-planned");
      }

      if (["Implant", "implant"].includes(record.finding)) {
        tooth.classList.add("has-implant-symbol");
      }

      if (crownTreatments.includes(record.finding)) {
        markCrown(record.tooth, color);
      }

      if (fillingTreatments.includes(record.finding) && color) {
        record.surfaces.forEach(function(name) {
          const surface = tooth.querySelector(
            `.surface[data-surface="${name}"]`
          );

          if (surface) surface.style.fill = color;
        });
      }

      return;
    }

    if (record.whole) {
      if (positionFindings.includes(record.finding)) return;

      if (
        record.finding === "Bridge" &&
        record.bridgeTeeth
      ) {
        record.bridgeTeeth.forEach(function(number) {
          markCrown(number, color);
        });

        return;
      }

      if (
        ["PARL", "PARO", "ankylosis"].includes(record.finding)
      ) {
        const markers = document.querySelector(
          `.root-markers[data-tooth="${record.tooth}"]`
        );

        const alreadyPresent = Array.from(
          markers.children
        ).some(function(dot) {
          return dot.dataset.finding === record.finding;
        });

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

      if (record.finding === "implant") {
        tooth.classList.add("has-implant-symbol");
      }

      if (crownFindings.includes(record.finding)) {
        markCrown(record.tooth, color);
      }

      if (wholeClasses[record.finding]) {
        tooth.classList.add(wholeClasses[record.finding]);
      }

      if (record.finding === "root tip") {
        tooth.querySelector(".cervical-label").textContent = "R";
      }

      return;
    }

    record.surfaces.forEach(function(name) {
      const surface = tooth.querySelector(
        `.surface[data-surface="${name}"]`
      );

      if (!surface) return;

      if (surfaceClasses[record.finding]) {
        surface.classList.add(surfaceClasses[record.finding]);
      }

      if (
        ["composite", "amalgam", "sealant", "IRM"]
          .includes(record.finding) &&
        color
      ) {
        surface.style.fill = color;
      }
    });
  });

  renderPositions();
  renderBridges();
}

// ==========================================
// POSITIONS AND MOBILITY
// ==========================================

function renderPositions() {
  document.querySelectorAll(".position-display").forEach(
    function(display) {
      display.innerHTML = "";
    }
  );

  document.querySelectorAll(".tooth-number").forEach(
    function(number) {
      number.classList.remove("has-mobility");
    }
  );

  findings.forEach(function(record) {
    if (!positionFindings.includes(record.finding)) return;

    const display = document.querySelector(
      `.position-display[data-tooth="${record.tooth}"]`
    );

    if (!display) return;

    const item = document.createElement("span");

    item.className = "position-item";
    item.textContent =
      record.finding.charAt(0).toUpperCase() +
      record.finding.slice(1);

    display.appendChild(item);

    if (record.finding === "mobility") {
      const toothNumber = document.querySelector(
        `.tooth-number[data-tooth="${record.tooth}"]`
      );

      if (toothNumber) {
        toothNumber.classList.add("has-mobility");
      }
    }
  });
}

// ==========================================
// BRIDGE CONNECTORS AND PONTICS
// ==========================================

function renderBridges() {
  document.querySelectorAll(".bridge-overlay").forEach(
    function(overlay) {
      overlay.remove();
    }
  );

  const bridgeGroups = new Map();

  findings.filter(function(record) {
    return ["Bridge", "bridge"].includes(record.finding);
  }).forEach(function(record) {
    const key =
      (record.treatment ? "treatment-" : "finding-") +
      record.batchId;

    if (!bridgeGroups.has(key)) {
      bridgeGroups.set(key, {
        record: record,
        teeth: new Set()
      });
    }

    (record.bridgeTeeth || [record.tooth]).forEach(
      function(number) {
        bridgeGroups.get(key).teeth.add(number);
      }
    );
  });

  const ns = "http://www.w3.org/2000/svg";

  document.querySelectorAll(".arch").forEach(function(arch) {
    const bounds = arch.getBoundingClientRect();
    const overlay = document.createElementNS(ns, "svg");

    overlay.classList.add("bridge-overlay");
    overlay.setAttribute("width", arch.scrollWidth);
    overlay.setAttribute("height", arch.clientHeight);
    overlay.setAttribute("aria-hidden", "true");

    bridgeGroups.forEach(function(group) {
      const color = getRecordColor(group.record) || "#ffa726";

      const teeth = [...group.teeth]
        .map(function(number) {
          const card = arch.querySelector(
            `.tooth[data-tooth="${number}"]`
          );

          if (!card) return null;

          const diagram = card.querySelector(".tooth-diagram");
          const box = diagram.getBoundingClientRect();
          const scale = box.width / 120;
          const pontic = isToothMissing(number);

          if (!pontic) markCrown(number, color);

          return {
            x:
              box.left - bounds.left +
              arch.scrollLeft + box.width / 2,
            y:
              box.top - bounds.top +
              arch.scrollTop + 60 * scale,
            edge: pontic ? 5 : 54 * scale,
            pontic: pontic
          };
        })
        .filter(Boolean)
        .sort(function(a, b) {
          return a.x - b.x;
        });

      if (teeth.length < 2) return;

      for (let index = 0; index < teeth.length - 1; index++) {
        const left = teeth[index];
        const right = teeth[index + 1];
        const line = document.createElementNS(ns, "line");

        line.setAttribute("x1", left.x + left.edge);
        line.setAttribute("y1", left.y);
        line.setAttribute("x2", right.x - right.edge);
        line.setAttribute("y2", right.y);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke-linecap", "round");

        overlay.appendChild(line);
      }

      teeth.filter(function(tooth) {
        return tooth.pontic;
      }).forEach(function(tooth) {
        const circle = document.createElementNS(ns, "circle");

        circle.setAttribute("cx", tooth.x);
        circle.setAttribute("cy", tooth.y);
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", color);

        overlay.appendChild(circle);
      });
    });

    arch.appendChild(overlay);
  });
}

let bridgeResizeFrame;

window.addEventListener("resize", function() {
  cancelAnimationFrame(bridgeResizeFrame);
  bridgeResizeFrame = requestAnimationFrame(renderBridges);
});

// ==========================================
// CHART TEXT HELPERS
// ==========================================

function bridgeLabel(label) {
  if (typeof label === "string" && label.startsWith("#")) {
    return label.substring(1);
  }

  return label;
}

function formatSurfaceText(surfaces) {
  const order = [
    "M", "O", "I", "D", "B", "F", "L", "C"
  ];

  const sorted = [...surfaces].sort(function(a, b) {
    return order.indexOf(a) - order.indexOf(b);
  });

  if (sorted.length === 1 && sorted[0] === "C") {
    return "cervical";
  }

  const normalSurfaces = sorted.filter(function(surface) {
    return surface !== "C";
  });

  const hasCervical = sorted.includes("C");
  let text = normalSurfaces.join("");

  if (hasCervical) {
    text = text ? text + " cervical" : "cervical";
  }

  return text;
}

function highlightMobility(element) {
  const originalText = element.textContent;
  const parts = originalText.split(/(mobility)/gi);

  element.innerHTML = "";

  parts.forEach(function(part) {
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
  const surface = record.whole
    ? ""
    : formatSurfaceText(record.surfaces);

  const description = surface
    ? surface + " " + record.finding
    : record.finding;

  return record.treatment
    ? "[" + description + "]"
    : description;
}

function formatTreatmentRecord(record) {
  if (["Bridge", "bridge"].includes(record.finding)) {
    return isToothMissing(record.tooth)
      ? "FPD pontic"
      : "FPD abutment";
  }

  const surface = record.whole
    ? ""
    : formatSurfaceText(record.surfaces);

  return surface
    ? surface + " " + record.finding
    : record.finding;
}

// ==========================================
// EDITABLE CHART LINE
// ==========================================

function createChartLine(editKey, defaultText, removeRecords) {
  const entry = document.createElement("div");
  entry.className = "chart-entry";

  const text = document.createElement("span");

  text.className = "chart-text";
  text.contentEditable = "true";
  text.spellcheck = true;
  text.textContent = chartEdits[editKey] ?? defaultText;

  highlightMobility(text);

  text.addEventListener("input", function() {
    chartEdits[editKey] = text.textContent;
  });

  text.addEventListener("blur", function() {
    chartEdits[editKey] = text.textContent;
    highlightMobility(text);
  });

  const button = document.createElement("button");

  button.className = "delete-chart-line";
  button.textContent = "×";
  button.title = "Delete this chart line";

  button.addEventListener("click", function() {
    removeRecords();
    delete chartEdits[editKey];

    updateFindingButtons();
    renderFindings();
    renderChart();
  });

  entry.append(text, button);

  return entry;
}

// ==========================================
// BRIDGE CHART LINE: FINDINGS ONLY
// ==========================================

function renderBridgeChart(output) {
  const groups = new Map();

  findings.filter(function(record) {
    return !record.treatment &&
      ["Bridge", "bridge"].includes(record.finding);
  }).forEach(function(record) {
    const key =
      (record.treatment ? "treatment-" : "finding-") +
      record.batchId;

    if (!groups.has(key)) {
      groups.set(key, {
        records: [],
        teeth: new Set()
      });
    }

    const group = groups.get(key);

    group.records.push(record);

    (record.bridgeTeeth || [record.tooth]).forEach(
      function(number) {
        group.teeth.add(number);
      }
    );
  });

  groups.forEach(function(group, key) {
    const teeth = [...group.teeth].sort(function(a, b) {
      return a - b;
    });

    if (teeth.length < 2) return;

    const start = teeth[0];
    const end = teeth[teeth.length - 1];
    const text = "#" + start + "-" + end + " bridge";

    output.appendChild(
      createChartLine(
        "bridge-" + key,
        text,
        function() {
          findings = findings.filter(function(record) {
            return !group.records.includes(record);
          });
        }
      )
    );
  });
}

// ==========================================
// RENDER CHART
// ==========================================

function renderChart() {
  const output = document.getElementById("output");

  output.innerHTML = "";

  const missing = findings.filter(function(record) {
    return !record.treatment && record.finding === "missing";
  });

  if (missing.length) {
    const labels = [...new Set(
      missing.slice()
        .sort(function(a, b) {
          return a.tooth - b.tooth;
        })
        .map(function(record) {
          return record.toothLabel || getToothLabel(record.tooth);
        })
    )];

    output.appendChild(
      createChartLine(
        "missing-" + labels.join("|"),
        "Missing teeth: " + labels.join(", "),
        function() {
          findings = findings.filter(function(record) {
            return !missing.includes(record);
          });
        }
      )
    );
  }

  renderBridgeChart(output);

  const groups = {};

  findings.filter(function(record) {
    return record.treatment ||
      (
        !["Bridge", "bridge"].includes(record.finding) &&
        record.finding !== "missing"
      );
  }).forEach(function(record) {
    const label = record.toothLabel || getToothLabel(record.tooth);
    const key = record.tooth + "|" + label;

    if (!groups[key]) {
      groups[key] = {
        tooth: record.tooth,
        label: label,
        records: []
      };
    }

    groups[key].records.push(record);
  });

  Object.values(groups)
    .sort(function(a, b) {
      return a.tooth - b.tooth;
    })
    .forEach(function(group) {
      const findingText = group.records
        .filter(function(record) {
          return !record.treatment;
        })
        .map(formatChartRecord)
        .join("; ");

      const treatmentText = group.records
        .filter(function(record) {
          return record.treatment;
        })
        .map(formatTreatmentRecord)
        .join("; ");

      const text =
        group.label +
        (findingText ? ": " + findingText : "") +
        (treatmentText ? " [" + treatmentText + "]" : "");

      output.appendChild(
        createChartLine(
          "tooth-" + group.tooth + "-" + group.label,
          text,
          function() {
            findings = findings.filter(function(record) {
              return !group.records.includes(record);
            });
          }
        )
      );
    });
}

// Additional missing-teeth chart helper.
function renderMissingChart(output) {
  const missingRecords = findings.filter(function(record) {
    return record.finding === "missing";
  });

  if (missingRecords.length === 0) return;

  const labels = [...new Set(
    missingRecords.slice()
      .sort(function(a, b) {
        return a.tooth - b.tooth;
      })
      .map(function(record) {
        return record.toothLabel || getToothLabel(record.tooth);
      })
  )];

  const entry = document.createElement("div");
  entry.className = "chart-entry";

  const text = document.createElement("span");

  text.className = "chart-text";
  text.contentEditable = "true";
  text.spellcheck = true;

  text.textContent =
    chartEdits["missing-teeth"] ??
    "Missing teeth: " + labels.join(", ");

  text.addEventListener("input", function() {
    chartEdits["missing-teeth"] = text.textContent;
  });

  text.addEventListener("blur", function() {
    chartEdits["missing-teeth"] = text.textContent;
  });

  const deleteButton = document.createElement("button");

  deleteButton.className = "delete-chart-line";
  deleteButton.textContent = "×";
  deleteButton.title = "Delete all missing-tooth findings";

  deleteButton.addEventListener("click", function() {
    findings = findings.filter(function(record) {
      return record.finding !== "missing";
    });

    delete chartEdits["missing-teeth"];

    updateFindingButtons();
    renderFindings();
    renderChart();
  });

  entry.appendChild(text);
  entry.appendChild(deleteButton);
  output.appendChild(entry);
}

// ==========================================
// UNDO LAST
// ==========================================

document.getElementById("undo").addEventListener(
  "click",
  function() {
    if (findings.length === 0) return;

    const lastBatchId =
      findings[findings.length - 1].batchId;

    findings = findings.filter(function(record) {
      return record.batchId !== lastBatchId;
    });

    delete chartEdits["missing-teeth"];

    renderFindings();
    renderChart();
  }
);

// ==========================================
// COPY CHART
// ==========================================

document.getElementById("copyChart").addEventListener(
  "click",
  function() {
    const entries =
      document.querySelectorAll("#output .chart-text");

    if (entries.length === 0) {
      alert("The chart is empty.");
      return;
    }

    const text = Array.from(entries)
      .map(function(entry) {
        return entry.textContent;
      })
      .join("\n");

    navigator.clipboard.writeText(text).then(function() {
      const message = document.getElementById("copyMessage");

      message.textContent = "Chart copied!";

      setTimeout(function() {
        message.textContent = "";
      }, 2000);
    });
  }
);

// ==========================================
// FINDINGS KEYBOARD SHORTCUTS
// ==========================================

const findingShortcuts = {
  d: "decay",
  c: "composite",
  a: "amalgam",
  r: "RCT",
  z: "Zirconia crown",
  b: "Bridge",
  w: "wear",
  m: "missingMain",
  t: "root tip",
  p: "PFM crown",
  i: "incipient caries"
};

document.addEventListener("keydown", function(event) {
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.repeat ||
    event.isComposing
  ) {
    return;
  }

  const editingSelector =
    "input, textarea, select, " +
    "[contenteditable]:not([contenteditable='false']), " +
    "[role='textbox']";

  const active = document.activeElement;

  if (active && active.closest(editingSelector)) return;

  if (
    event.target instanceof Element &&
    event.target.closest(editingSelector)
  ) {
    return;
  }

  const name = findingShortcuts[event.key.toLowerCase()];

  if (!name) return;

  const button = name === "missingMain"
    ? document.getElementById("missingMain")
    : Array.from(document.querySelectorAll(".finding"))
        .find(function(button) {
          return button.dataset.name === name;
        });

  if (
    !button ||
    button.disabled ||
    selections.length === 0
  ) {
    return;
  }

  event.preventDefault();
  button.click();
});

// ==========================================
// AUTOMATIC LOCAL SAVE / RESTORE
// ==========================================

const odontogramStorageKey = "odontogram-autosave-v1";
let restoringOdontogram = false;

const autosaveMessage = document.createElement("div");

autosaveMessage.id = "autosaveMessage";
autosaveMessage.setAttribute("role", "status");

document.getElementById("copyMessage").after(autosaveMessage);

function saveOdontogram() {
  if (restoringOdontogram) return;

  const data = {
    version: 1,
    findings: findings,
    nextBatchId: nextBatchId,
    chartEdits: chartEdits,

    teeth: Array.from(
      document.querySelectorAll(".tooth")
    ).map(function(tooth) {
      return {
        number: Number(tooth.dataset.tooth),
        age: tooth.querySelector(".tooth-number").dataset.age,
        hidden: tooth.hidden
      };
    }),

    mode:
      document.querySelector(".dentition-button.active")
        ?.dataset.dentition || null
  };

  try {
    localStorage.setItem(
      odontogramStorageKey,
      JSON.stringify(data)
    );

    autosaveMessage.textContent = "Saved on this device.";
  } catch (error) {
    autosaveMessage.textContent =
      "Autosave unavailable. This browser could not save the chart.";
  }
}

function restoreOdontogram() {
  restoringOdontogram = true;

  try {
    const raw = localStorage.getItem(odontogramStorageKey);

    if (!raw) {
      autosaveMessage.textContent =
        "Autosave ready on this device.";

      return;
    }

    const data = JSON.parse(raw);

    if (
      data.version !== 1 ||
      !Array.isArray(data.findings) ||
      !Array.isArray(data.teeth)
    ) {
      throw new Error("Invalid saved chart");
    }

    const validFindings = data.findings.every(function(record) {
      return record &&
        Number.isInteger(record.tooth) &&
        record.tooth >= 1 &&
        record.tooth <= 32 &&
        typeof record.finding === "string" &&
        Array.isArray(record.surfaces) &&
        typeof record.whole === "boolean" &&
        Number.isInteger(record.batchId);
    });

    if (!validFindings) {
      throw new Error("Invalid saved findings");
    }

    findings = data.findings;

    chartEdits = Object.fromEntries(
      Object.entries(data.chartEdits || {})
        .filter(function(entry) {
          return typeof entry[1] === "string";
        })
    );

    nextBatchId = Math.max(
      Number(data.nextBatchId) || 1,
      1 + findings.reduce(function(max, record) {
        return Math.max(max, record.batchId);
      }, 0)
    );

    data.teeth.forEach(function(saved) {
      if (
        !Number.isInteger(saved.number) ||
        saved.number < 1 ||
        saved.number > 32
      ) {
        return;
      }

      setToothAge(
        saved.number,
        saved.age === "primary" ? "primary" : "permanent"
      );

      document.querySelector(
        `.tooth[data-tooth="${saved.number}"]`
      ).hidden = Boolean(saved.hidden);
    });

    document.querySelectorAll(".dentition-button").forEach(
      function(button) {
        const active =
          button.dataset.dentition === data.mode;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      }
    );

    selections = [];
    clearTemporarySelection();
    updateFindingButtons();
    renderFindings();
    renderChart();

    autosaveMessage.textContent = "Saved chart restored.";
  } catch (error) {
    autosaveMessage.textContent =
      "The saved chart could not be restored. " +
      "Your stored copy has not been changed.";
  } finally {
    restoringOdontogram = false;
  }
}

// Save after existing chart actions.
const renderChartBeforeAutosave = renderChart;

renderChart = function() {
  renderChartBeforeAutosave();
  saveOdontogram();
};

// Save chart text immediately while editing.
document.addEventListener("input", function(event) {
  if (event.target.closest(".chart-text")) {
    saveOdontogram();
  }
});

document.addEventListener("focusout", function(event) {
  if (event.target.closest(".chart-text")) {
    saveOdontogram();
  }
});

window.addEventListener("pagehide", saveOdontogram);

restoreOdontogram();

// ==========================================
// CLEAR ALL WITH CONFIRMATION
// ==========================================

const clearAllDialog = document.getElementById("clearAllDialog");

document.getElementById("clearAll").addEventListener(
  "click",
  function() {
    clearAllDialog.showModal();
  }
);

document.getElementById("cancelClearAll").addEventListener(
  "click",
  function() {
    clearAllDialog.close();
  }
);

document.getElementById("confirmClearAll").addEventListener(
  "click",
  function() {
    findings = [];
    chartEdits = {};
    selections = [];
    nextBatchId = 1;

    clearTemporarySelection();

    for (let number = 1; number <= 32; number++) {
      setToothAge(number, "permanent");
    }

    document.querySelectorAll(".dentition-button").forEach(
      function(button) {
        const active =
          button.dataset.dentition === "permanent";

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      }
    );

    document.getElementById("copyMessage").textContent = "";

    updateFindingButtons();
    renderFindings();

    // Save the empty chart so deleted data stays deleted.
    renderChart();

    clearAllDialog.close();
  }
);
