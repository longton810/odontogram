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
  1, 2, 3, 4,
  5, 6, 7, 8,
  9, 10, 11, 12,
  13, 14, 15, 16
];


const mandibularTeeth = [
  32, 31, 30, 29,
  28, 27, 26, 25,
  24, 23, 22, 21,
  20, 19, 18, 17
];



// ==========================================
// PRIMARY TEETH
// ==========================================

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



// ==========================================
// POSITION FINDINGS
// ==========================================

const positionFindings = [
  "mobility",
  "tilted",
  "rotated",
  "super-eruption",
  "erupting"
];



// ==========================================
// CREATE ODONTOGRAM
// ==========================================

createArch(
  "maxillary",
  maxillaryTeeth
);


createArch(
  "mandibular",
  mandibularTeeth
);


updateFindingButtons();



// ==========================================
// CREATE ARCH
// ==========================================

function createArch(
  containerID,
  teeth
) {

  const container =
    document.getElementById(
      containerID
    );


  teeth.forEach(
    function(toothNumber, index) {

      const tooth =
        createTooth(
          toothNumber
        );


      if (index === 7) {

        tooth.classList.add(
          "midline"
        );

      }


      container.appendChild(
        tooth
      );

    }
  );

}



// ==========================================
// CREATE TOOTH
// ==========================================

function createTooth(
  toothNumber
) {

  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "tooth";


  wrapper.dataset.tooth =
    toothNumber;



  // Anterior teeth use I/F.
  // Posterior teeth use O/B.

  const isAnterior =
    anteriorTeeth.includes(
      toothNumber
    );


  const centerSurface =
    isAnterior
      ? "I"
      : "O";


  const outerSurface =
    isAnterior
      ? "F"
      : "B";



  // ========================================
  // MESIAL / DISTAL
  // Mesial always faces midline.
  // ========================================

  const isRightSide =

    (
      toothNumber >= 1 &&
      toothNumber <= 8
    )

    ||

    (
      toothNumber >= 25 &&
      toothNumber <= 32
    );


  const leftSurface =
    isRightSide
      ? "D"
      : "M";


  const rightSurface =
    isRightSide
      ? "M"
      : "D";



  // ========================================
  // BUCCAL/FACIAL / LINGUAL
  // ========================================

  const isMandibular =

    toothNumber >= 17 &&

    toothNumber <= 32;


  const topSurface =
    isMandibular
      ? "L"
      : outerSurface;


  const bottomSurface =
    isMandibular
      ? outerSurface
      : "L";



  // ========================================
  // ROUND TOOTH DIAGRAM
  // ========================================

  wrapper.innerHTML = `

    <svg
      class="tooth-diagram"
      viewBox="0 0 120 185"
      data-tooth="${toothNumber}"
    >


      <!-- TOP -->

      <path
        class="surface"
        data-surface="${topSurface}"
        d="
          M 20 20
          A 50 50 0 0 1 100 20
          L 78 42
          A 25 25 0 0 0 42 42
          Z
        ">
      </path>



      <!-- LEFT -->

      <path
        class="surface"
        data-surface="${leftSurface}"
        d="
          M 20 20
          L 42 42
          A 25 25 0 0 0 42 78
          L 20 100
          A 50 50 0 0 1 20 20
          Z
        ">
      </path>



      <!-- CENTER -->

      <circle
        class="surface"
        data-surface="${centerSurface}"
        cx="60"
        cy="60"
        r="25">
      </circle>



      <!-- RIGHT -->

      <path
        class="surface"
        data-surface="${rightSurface}"
        d="
          M 100 20
          A 50 50 0 0 1 100 100
          L 78 78
          A 25 25 0 0 0 78 42
          Z
        ">
      </path>



      <!-- BOTTOM -->

      <path
        class="surface"
        data-surface="${bottomSurface}"
        d="
          M 20 100
          L 42 78
          A 25 25 0 0 0 78 78
          L 100 100
          A 50 50 0 0 1 20 100
          Z
        ">
      </path>



      <!-- LABELS -->

      <text
        x="60"
        y="18">
        ${topSurface}
      </text>


      <text
        x="14"
        y="65">
        ${leftSurface}
      </text>


      <text
        x="60"
        y="65">
        ${centerSurface}
      </text>


      <text
        x="106"
        y="65">
        ${rightSurface}
      </text>


      <text
        x="60"
        y="113">
        ${bottomSurface}
      </text>



      <!-- CERVICAL -->

      <rect
        class="surface cervical-surface"
        data-surface="C"
        x="15"
        y="135"
        width="90"
        height="40"
        rx="3">
      </rect>


      <text
        class="cervical-label"
        x="60"
        y="155">
        C
      </text>

    </svg>



    <!-- TOOTH NUMBER -->

    <div
      class="tooth-number"
      data-tooth="${toothNumber}"
      data-age="permanent">
      #${toothNumber}
    </div>



    <!-- POSITION -->

    <div
      class="position-display"
      data-tooth="${toothNumber}">
    </div>

  `;


  return wrapper;

}



// ==========================================
// GET TOOTH LABEL
// ==========================================

function getToothLabel(
  toothNumber
) {

  const numberElement =
    document.querySelector(

      `.tooth-number[data-tooth="${toothNumber}"]`

    );


  if (

    numberElement &&

    numberElement.dataset.age ===
    "primary"

  ) {

    return (
      "#" +
      primaryToothMap[
        toothNumber
      ]
    );

  }


  return (
    "#" +
    toothNumber
  );

}



// ==========================================
// SURFACE CLICK
// ==========================================

document.addEventListener(
  "click",
  function(event) {

    const surface =
      event.target.closest(
        ".surface"
      );


    if (!surface) {
      return;
    }


    const svg =
      surface.closest(
        ".tooth-diagram"
      );


    const toothNumber =
      Number(
        svg.dataset.tooth
      );


    const surfaceName =
      surface.dataset.surface;



    if (
      hasWholeSelections()
    ) {

      clearTemporarySelection();

      selections = [];

    }



    let toothSelection =
      selections.find(
        function(item) {

          return (

            item.tooth ===
            toothNumber

            &&

            item.whole ===
            false

          );

        }
      );



    if (!toothSelection) {

      toothSelection = {

        tooth:
          toothNumber,

        surfaces:
          [],

        whole:
          false

      };


      selections.push(
        toothSelection
      );

    }



    if (
      toothSelection.surfaces.includes(
        surfaceName
      )
    ) {

      toothSelection.surfaces =
        toothSelection.surfaces.filter(
          function(item) {

            return (
              item !==
              surfaceName
            );

          }
        );


      surface.classList.remove(
        "selected"
      );

    }

    else {

      toothSelection.surfaces.push(
        surfaceName
      );


      surface.classList.add(
        "selected"
      );

    }



    if (
      toothSelection.surfaces.length === 0
    ) {

      selections =
        selections.filter(
          function(item) {

            return (
              item !==
              toothSelection
            );

          }
        );

    }


    updateFindingButtons();

  }
);



// ==========================================
// TOOTH NUMBER CLICK
// ==========================================

document.addEventListener(
  "click",
  function(event) {

    const number =
      event.target.closest(
        ".tooth-number"
      );


    if (!number) {
      return;
    }


    const toothNumber =
      Number(
        number.dataset.tooth
      );



    if (
      hasSurfaceSelections()
    ) {

      clearTemporarySelection();

      selections = [];

    }



    const existing =
      selections.find(
        function(item) {

          return (

            item.tooth ===
            toothNumber

            &&

            item.whole ===
            true

          );

        }
      );



    if (existing) {

      selections =
        selections.filter(
          function(item) {

            return (
              item !==
              existing
            );

          }
        );


      number.classList.remove(
        "selected"
      );

    }

    else {

      selections.push({

        tooth:
          toothNumber,

        surfaces:
          [],

        whole:
          true

      });


      number.classList.add(
        "selected"
      );

    }


    updateFindingButtons();

  }
);



// ==========================================
// SELECTION HELPERS
// ==========================================

function hasWholeSelections() {

  return selections.some(
    function(item) {

      return (
        item.whole === true
      );

    }
  );

}


function hasSurfaceSelections() {

  return selections.some(
    function(item) {

      return (
        item.whole === false
      );

    }
  );

}



// ==========================================
// MISSING CHECK
// ==========================================

function isToothMissing(
  toothNumber
) {

  return findings.some(
    function(record) {

      return (

        record.tooth ===
        toothNumber

        &&

        record.whole ===
        true

        &&

        record.finding ===
        "missing"

      );

    }
  );

}



// ==========================================
// UPDATE FINDING BUTTONS
// ==========================================

function updateFindingButtons() {

  const surfaceButtons =
    document.querySelectorAll(
      ".surface-finding"
    );


  const wholeButtons =
    document.querySelectorAll(
      ".whole-finding"
    );


  const missingButton =
    document.getElementById(
      "missingMain"
    );



  if (
    selections.length === 0
  ) {

    surfaceButtons.forEach(
      function(button) {

        button.disabled =
          true;

      }
    );


    wholeButtons.forEach(
      function(button) {

        button.disabled =
          true;

      }
    );


    missingButton.textContent =
      "Missing";


    missingButton.dataset.name =
      "missing";


    return;

  }



  if (
    hasSurfaceSelections()
  ) {

    surfaceButtons.forEach(
      function(button) {

        button.disabled =
          false;

      }
    );


    wholeButtons.forEach(
      function(button) {

        button.disabled =
          true;

      }
    );


    missingButton.textContent =
      "Missing";


    missingButton.dataset.name =
      "missing";


    return;

  }



  surfaceButtons.forEach(
    function(button) {

      button.disabled =
        true;

    }
  );


  wholeButtons.forEach(
    function(button) {

      button.disabled =
        false;

    }
  );



  const allSelectedAreMissing =
    selections.every(
      function(selection) {

        return isToothMissing(
          selection.tooth
        );

      }
    );



  if (
    allSelectedAreMissing
  ) {

    missingButton.textContent =
      "Unmissing";


    missingButton.dataset.name =
      "unmissing";

  }

  else {

    missingButton.textContent =
      "Missing";


    missingButton.dataset.name =
      "missing";

  }

}



// ==========================================
// FINDING BUTTONS
// ==========================================

document
  .querySelectorAll(
    ".finding"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          if (
            selections.length === 0
          ) {
            return;
          }


          const finding =
            this.dataset.name;



          // ==================================
          // UNMISSING
          // ==================================

          if (
            finding ===
            "unmissing"
          ) {

            const selectedToothNumbers =
              selections.map(
                function(selection) {

                  return (
                    selection.tooth
                  );

                }
              );



            findings =
              findings.filter(
                function(record) {

                  return !(

                    selectedToothNumbers.includes(
                      record.tooth
                    )

                    &&

                    record.whole ===
                    true

                    &&

                    record.finding ===
                    "missing"

                  );

                }
              );



            clearTemporarySelection();

            selections = [];

            updateFindingButtons();

            renderFindings();

            renderChart();

            return;

          }



          const batchId =
            nextBatchId++;



          // ==================================
          // BRIDGE
          // ==================================

          if (
            finding ===
            "Bridge"
          ) {

            const selectedTeeth =
              selections
                .map(
                  function(selection) {

                    return (
                      selection.tooth
                    );

                  }
                )
                .sort(
                  function(a, b) {

                    return (
                      a - b
                    );

                  }
                );



            if (
              selectedTeeth.length < 2
            ) {

              alert(
                "Please select at least two teeth for a bridge."
              );

              return;

            }



            const bridgeStart =
              selectedTeeth[0];


            const bridgeEnd =
              selectedTeeth[
                selectedTeeth.length - 1
              ];



            findings.push({

              tooth:
                bridgeStart,

              bridgeTeeth:
                selectedTeeth,

              bridgeStart:
                bridgeStart,

              bridgeEnd:
                bridgeEnd,

              bridgeStartLabel:
                getToothLabel(
                  bridgeStart
                ),

              bridgeEndLabel:
                getToothLabel(
                  bridgeEnd
                ),

              surfaces:
                [],

              whole:
                true,

              finding:
                "Bridge",

              batchId:
                batchId

            });

          }


          // ==================================
          // OTHER FINDINGS
          // ==================================

          else {

            selections.forEach(
              function(selection) {

                findings.push({

                  tooth:
                    selection.tooth,

                  toothLabel:
                    getToothLabel(
                      selection.tooth
                    ),

                  surfaces:
                    [
                      ...selection.surfaces
                    ],

                  whole:
                    selection.whole,

                  finding:
                    finding,

                  batchId:
                    batchId

                });

              }
            );

          }



          clearTemporarySelection();

          selections = [];

          updateFindingButtons();

          renderFindings();

          renderChart();

        }
      );

    }
  );



// ==========================================
// CHANGE AGE
// ==========================================

document
  .getElementById(
    "changeAge"
  )
  .addEventListener(
    "click",
    function() {

      if (

        selections.length === 0

        ||

        !hasWholeSelections()

      ) {

        alert(
          "Please select one or more tooth numbers first."
        );

        return;

      }



      selections.forEach(
        function(selection) {

          const toothNumber =
            selection.tooth;



          if (
            !primaryToothMap[
              toothNumber
            ]
          ) {

            return;

          }



          const numberElement =
            document.querySelector(

              `.tooth-number[data-tooth="${toothNumber}"]`

            );


          if (!numberElement) {
            return;
          }



          const primaryLetter =
            primaryToothMap[
              toothNumber
            ];


          const isPrimary =

            numberElement.dataset.age ===
            "primary";



          if (isPrimary) {

            numberElement.textContent =
              "#" +
              toothNumber;


            numberElement.dataset.age =
              "permanent";

          }

          else {

            numberElement.textContent =
              "#" +
              primaryLetter;


            numberElement.dataset.age =
              "primary";

          }

        }
      );



      clearTemporarySelection();

      selections = [];

      updateFindingButtons();

    }
  );



// ==========================================
// RENDER ODONTOGRAM
// ==========================================

function renderFindings() {


  // Reset C / R labels.

  document
    .querySelectorAll(
      ".cervical-label"
    )
    .forEach(
      function(label) {

        label.textContent =
          "C";

      }
    );



  // Clear surface classes.

  document
    .querySelectorAll(
      ".surface"
    )
    .forEach(
      function(surface) {

        surface.classList.remove(

          "stain",

          "caries",

          "incipient-caries",

          "recurrent-caries",

          "gross-caries",

          "composite",

          "amalgam",

          "sealant",

          "irm",

          "wear",

          "abfraction",

          "erosion",

          "crack-line",

          "broken"

        );

      }
    );



  // Clear whole-tooth classes.

  document
    .querySelectorAll(
      ".tooth-diagram"
    )
    .forEach(
      function(tooth) {

        tooth.classList.remove(

          "zirconia-crown",

          "pfm-crown",

          "metal-crown",

          "bridge",

          "rct",

          "post-core",

          "implant",

          "missing",

          "root-tip"

        );

      }
    );



  findings.forEach(
    function(record) {


      // =====================================
      // WHOLE TOOTH
      // =====================================

      if (
        record.whole
      ) {


        // Position findings do not
        // change the tooth diagram.

        if (
          positionFindings.includes(
            record.finding
          )
        ) {

          return;

        }



        // ===================================
        // BRIDGE
        // ===================================

        if (

          record.finding ===
          "Bridge"

          &&

          record.bridgeTeeth

        ) {

          record.bridgeTeeth.forEach(
            function(toothNumber) {

              const bridgeTooth =
                document.querySelector(

                  `.tooth-diagram[data-tooth="${toothNumber}"]`

                );


              if (
                bridgeTooth
              ) {

                bridgeTooth.classList.add(
                  "bridge"
                );

              }

            }
          );


          return;

        }



        const tooth =
          document.querySelector(

            `.tooth-diagram[data-tooth="${record.tooth}"]`

          );


        if (!tooth) {
          return;
        }



        const wholeClasses = {

          "Zirconia crown":
            "zirconia-crown",

          "PFM crown":
            "pfm-crown",

          "Metal crown":
            "metal-crown",

          "RCT":
            "rct",

          "post & core":
            "post-core",

          "implant":
            "implant",

          "missing":
            "missing",

          "root tip":
            "root-tip"

        };



        if (
          wholeClasses[
            record.finding
          ]
        ) {

          tooth.classList.add(

            wholeClasses[
              record.finding
            ]

          );

        }



        // Root Tip changes C to R.

        if (
          record.finding ===
          "root tip"
        ) {

          const rootLabel =
            tooth.querySelector(
              ".cervical-label"
            );


          if (rootLabel) {

            rootLabel.textContent =
              "R";

          }

        }


        return;

      }



      // =====================================
      // SURFACE FINDINGS
      // =====================================

      record.surfaces.forEach(
        function(surfaceName) {

          const surface =
            document.querySelector(

              `.tooth-diagram[data-tooth="${record.tooth}"] .surface[data-surface="${surfaceName}"]`

            );


          if (!surface) {
            return;
          }



          const surfaceClasses = {

            "stain":
              "stain",

            "caries":
              "caries",

            "cavity":
              "caries",

            "incipient caries":
              "incipient-caries",

            "recurrent caries":
              "recurrent-caries",

            "gross caries":
              "gross-caries",

            "composite":
              "composite",

            "amalgam":
              "amalgam",

            "sealant":
              "sealant",

            "IRM":
              "irm",

            "wear":
              "wear",

            "abfraction":
              "abfraction",

            "erosion":
              "erosion",

            "crack line":
              "crack-line",

            "broken":
              "broken"

          };



          if (
            surfaceClasses[
              record.finding
            ]
          ) {

            surface.classList.add(

              surfaceClasses[
                record.finding
              ]

            );

          }

        }
      );

    }
  );



  renderPositions();

}



// ==========================================
// RENDER POSITIONS
// ==========================================

function renderPositions() {


  document
    .querySelectorAll(
      ".position-display"
    )
    .forEach(
      function(display) {

        display.innerHTML =
          "";

      }
    );



  document
    .querySelectorAll(
      ".tooth-number"
    )
    .forEach(
      function(number) {

        number.classList.remove(
          "has-mobility"
        );

      }
    );



  findings.forEach(
    function(record) {

      if (
        !positionFindings.includes(
          record.finding
        )
      ) {

        return;

      }



      const display =
        document.querySelector(

          `.position-display[data-tooth="${record.tooth}"]`

        );


      if (!display) {
        return;
      }



      const item =
        document.createElement(
          "span"
        );


      item.className =
        "position-item";


      item.textContent =

        record.finding
          .charAt(0)
          .toUpperCase()

        +

        record.finding.slice(1);



      display.appendChild(
        item
      );



      // Mobility circles number red.

      if (
        record.finding ===
        "mobility"
      ) {

        const toothNumber =
          document.querySelector(

            `.tooth-number[data-tooth="${record.tooth}"]`

          );


        if (
          toothNumber
        ) {

          toothNumber.classList.add(
            "has-mobility"
          );

        }

      }

    }
  );

}



// ==========================================
// BRIDGE LABEL
// ==========================================

function bridgeLabel(
  label
) {

  if (

    typeof label ===
    "string"

    &&

    label.startsWith("#")

  ) {

    return (
      label.substring(1)
    );

  }


  return label;

}



// ==========================================
// FORMAT SURFACE TEXT
//
// C on odontogram becomes
// "cervical" in chart.
// ==========================================

function formatSurfaceText(
  surfaces
) {

  const order = [
    "M",
    "O",
    "I",
    "D",
    "B",
    "F",
    "L",
    "C"
  ];


  const sorted =
    [
      ...surfaces
    ];


  sorted.sort(
    function(a, b) {

      return (

        order.indexOf(a)

        -

        order.indexOf(b)

      );

    }
  );



  if (

    sorted.length === 1

    &&

    sorted[0] === "C"

  ) {

    return "cervical";

  }



  const normalSurfaces =
    sorted.filter(
      function(surface) {

        return (
          surface !== "C"
        );

      }
    );


  const hasCervical =
    sorted.includes(
      "C"
    );


  let text =
    normalSurfaces.join("");



  if (
    hasCervical
  ) {

    if (text) {

      text +=
        " cervical";

    }

    else {

      text =
        "cervical";

    }

  }


  return text;

}



// ==========================================
// MOBILITY CHART FORMAT
// ==========================================

function highlightMobility(
  element
) {

  const originalText =
    element.textContent;


  const parts =
    originalText.split(
      /(mobility)/gi
    );


  element.innerHTML =
    "";



  parts.forEach(
    function(part) {

      if (
        part.toLowerCase() ===
        "mobility"
      ) {

        const mobility =
          document.createElement(
            "span"
          );


        mobility.className =
          "chart-mobility";


        mobility.textContent =
          part;


        element.appendChild(
          mobility
        );

      }

      else {

        element.appendChild(

          document.createTextNode(
            part
          )

        );

      }

    }
  );

}



// ==========================================
// RENDER CHART
// ==========================================

function renderChart() {

  const output =
    document.getElementById(
      "output"
    );


  output.innerHTML =
    "";



  // ========================================
  // BRIDGES
  // ========================================

  findings
    .filter(
      function(record) {

        return (
          record.finding ===
          "Bridge"
        );

      }
    )
    .forEach(
      function(record) {


        const entry =
          document.createElement(
            "div"
          );


        entry.className =
          "chart-entry";



        const editKey =
          "bridge-" +
          record.batchId;



        const defaultText =

          "#" +

          bridgeLabel(

            record.bridgeStartLabel ||

            "#" +
            record.bridgeStart

          )

          +

          "-"

          +

          bridgeLabel(

            record.bridgeEndLabel ||

            "#" +
            record.bridgeEnd

          )

          +

          ": bridge";



        const text =
          document.createElement(
            "span"
          );


        text.className =
          "chart-text";


        text.contentEditable =
          "true";


        text.spellcheck =
          true;



        text.textContent =

          chartEdits[
            editKey
          ]

          ??

          defaultText;



        highlightMobility(
          text
        );



        text.addEventListener(
          "input",
          function() {

            chartEdits[
              editKey
            ] =
              text.textContent;

          }
        );



        text.addEventListener(
          "blur",
          function() {

            chartEdits[
              editKey
            ] =
              text.textContent;


            highlightMobility(
              text
            );

          }
        );



        const deleteButton =
          document.createElement(
            "button"
          );


        deleteButton.className =
          "delete-chart-line";


        deleteButton.textContent =
          "×";


        deleteButton.title =
          "Delete this chart line";



        deleteButton.addEventListener(
          "click",
          function() {

            findings =
              findings.filter(
                function(item) {

                  return (
                    item !==
                    record
                  );

                }
              );


            delete chartEdits[
              editKey
            ];


            renderFindings();

            renderChart();

          }
        );



        entry.appendChild(
          text
        );


        entry.appendChild(
          deleteButton
        );


        output.appendChild(
          entry
        );

      }
    );



  // ========================================
  // REGULAR FINDINGS
  // ========================================

  const grouped =
    {};



  findings
    .filter(
      function(record) {

        return (
          record.finding !==
          "Bridge"
        );

      }
    )
    .forEach(
      function(record) {

        const label =

          record.toothLabel

          ||

          getToothLabel(
            record.tooth
          );



        const groupKey =

          record.tooth

          +

          "|"

          +

          label;



        if (
          !grouped[
            groupKey
          ]
        ) {

          grouped[
            groupKey
          ] = {

            tooth:
              record.tooth,

            label:
              label,

            records:
              []

          };

        }



        grouped[
          groupKey
        ]
          .records
          .push(
            record
          );

      }
    );



  const groups =
    Object
      .values(
        grouped
      )
      .sort(
        function(a, b) {

          return (
            a.tooth -
            b.tooth
          );

        }
      );



  groups.forEach(
    function(group) {

      const descriptions =
        [];



      group.records.forEach(
        function(record) {

          let description =
            "";



          if (
            record.whole
          ) {

            description =
              record.finding;

          }

          else {

            const surfaceText =
              formatSurfaceText(
                record.surfaces
              );


            description =

              surfaceText

              +

              " "

              +

              record.finding;

          }



          descriptions.push(
            description
          );

        }
      );



      const entry =
        document.createElement(
          "div"
        );


      entry.className =
        "chart-entry";



      const editKey =

        "tooth-"

        +

        group.tooth

        +

        "-"

        +

        group.label;



      const defaultText =

        group.label

        +

        ": "

        +

        descriptions.join(
          "; "
        );



      const text =
        document.createElement(
          "span"
        );


      text.className =
        "chart-text";


      text.contentEditable =
        "true";


      text.spellcheck =
        true;



      text.textContent =

        chartEdits[
          editKey
        ]

        ??

        defaultText;



      highlightMobility(
        text
      );



      text.addEventListener(
        "input",
        function() {

          chartEdits[
            editKey
          ] =
            text.textContent;

        }
      );



      text.addEventListener(
        "blur",
        function() {

          chartEdits[
            editKey
          ] =
            text.textContent;


          highlightMobility(
            text
          );

        }
      );



      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.className =
        "delete-chart-line";


      deleteButton.textContent =
        "×";


      deleteButton.title =
        "Delete this chart line";



      deleteButton.addEventListener(
        "click",
        function() {

          findings =
            findings.filter(
              function(record) {

                return !group.records.includes(
                  record
                );

              }
            );


          delete chartEdits[
            editKey
          ];


          renderFindings();

          renderChart();

        }
      );



      entry.appendChild(
        text
      );


      entry.appendChild(
        deleteButton
      );


      output.appendChild(
        entry
      );

    }
  );

}



// ==========================================
// CLEAR TEMPORARY SELECTION
// ==========================================

function clearTemporarySelection() {

  document
    .querySelectorAll(
      ".surface.selected"
    )
    .forEach(
      function(surface) {

        surface.classList.remove(
          "selected"
        );

      }
    );



  document
    .querySelectorAll(
      ".tooth-number.selected"
    )
    .forEach(
      function(number) {

        number.classList.remove(
          "selected"
        );

      }
    );

}



// ==========================================
// UNDO
// ==========================================

document
  .getElementById(
    "undo"
  )
  .addEventListener(
    "click",
    function() {

      if (
        findings.length === 0
      ) {

        return;

      }



      const lastBatchId =
        findings[
          findings.length - 1
        ].batchId;



      findings =
        findings.filter(
          function(record) {

            return (
              record.batchId !==
              lastBatchId
            );

          }
        );



      renderFindings();

      renderChart();

    }
  );



// ==========================================
// COPY CHART
// ==========================================

document
  .getElementById(
    "copyChart"
  )
  .addEventListener(
    "click",
    function() {

      const entries =
        document.querySelectorAll(
          "#output .chart-text"
        );



      if (
        entries.length === 0
      ) {

        alert(
          "The chart is empty."
        );

        return;

      }



      const text =
        Array
          .from(
            entries
          )
          .map(
            function(entry) {

              return (
                entry.textContent
              );

            }
          )
          .join(
            "\n"
          );



      navigator.clipboard
        .writeText(
          text
        )
        .then(
          function() {

            const message =
              document.getElementById(
                "copyMessage"
              );


            message.textContent =
              "Chart copied!";


            setTimeout(
              function() {

                message.textContent =
                  "";

              },

              2000
            );

          }
        );

    }
  );
document.getElementById("clearAllBtn").addEventListener("click", function () {

  const confirmed = confirm(
    "Are you sure you want to clear the entire odontogram?"
  );

  if (!confirmed) {
    return;
  }

  clearAllOdontogram();
});
