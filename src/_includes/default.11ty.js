const fingerNames = ["index finger", "middle finger", "ring finger", "pinky"];

const getOrdinalNumber = number => {
  const ordinalNumbers = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eigth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth"
  ];

  if (ordinalNumbers[number - 1]) return ordinalNumbers[number - 1];
  if (number.toString().slice(-1) === "1") return `${number}st`;
  if (number.toString().slice(-1) === "2") return `${number}nd`;
  if (number.toString().slice(-1) === "3") return `${number}rd`;
  return `${number}th`;
};

const constructSentence = chordShape => {
  const result = chordShape
    .map((string, index) => ({ ...string, index }))
    .filter(string => string.finger)
    .sort((a, b) => a.finger - b.finger)
    .map((string, i, arr) => {
      const isLastItem = i + 1 === arr.length;
      const isOnlyItem = arr.length === 1;

      return `${isLastItem && !isOnlyItem ? "and " : ""}your ${
        fingerNames[string.finger - 1]
      } on the ${getOrdinalNumber(string.fret)} fret of the ${getOrdinalNumber(
        string.index + 1
      )} string${!isLastItem ? ",</span> <span>" : ""}`;
    })
    .join("");
  return `<span>Put ${result}.</span>`;
};

const renderChord = chord =>
  `<article>
    <h2>${chord.name}</h2>
    <ol class="list-reset grid">
    ${chord.shape
      .map(
        (string, i) => `<li
          class="${string.finger ? "finger" : ""}"
          style="grid-column: ${i + 1}; grid-row: ${string.fret + 1};">
          ${string.finger || 0}
        </li>`
      )
      .join("")}
    </ol>
    <p>${constructSentence(chord.shape)}</p>
  </article>`;

const renderChords = chords =>
  `${chords.map(chord => renderChord(chord)).join("")}`;

module.exports = ({ chords, content, title }) => `
<!doctype html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/css/main.css">
  </head>

  <body>
    ${content}
    ${renderChords(chords)}
    <script src="/js/main.js"></script>
  </body>
</html>`;
