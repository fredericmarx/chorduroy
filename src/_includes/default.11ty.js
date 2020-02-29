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
  const fingerFactory = (name, index) => ({ name, index });
  const stringFactory = (string, index) => ({ ...string, index });
  const getFretByFinger = (finger, chordShape) => {
    const frettedString = chordShape.find(
      string => string.finger === finger.index + 1
    );
    return frettedString ? frettedString.fret : undefined;
  };
  const stringIsFrettedByFinger = (string, finger) =>
    string.finger === finger.index + 1;
  const fingerIsUsed = (finger, chordShape) =>
    chordShape.find(string => stringIsFrettedByFinger(string, finger)) && true;
  const listToText = (list, oxfordComma) =>
    list
      .map((item, i, arr) => {
        const isFirstItem = i === 0;
        const isLastItem = i + 1 === arr.length;
        const isOnlyItem = arr.length === 1;

        const maybeAnd = isLastItem && !isOnlyItem ? " and " : "";
        const maybeComma =
          isFirstItem || (isLastItem && !oxfordComma) ? "" : ", ";

        return maybeComma + maybeAnd + item;
      })
      .join("");

  const fingers = fingerNames.map((name, index) => fingerFactory(name, index));

  const result = fingers
    .filter(finger => fingerIsUsed(finger, chordShape))
    .map(finger => {
      const fret = getFretByFinger(finger, chordShape);
      const stringOrdinalNumbers = chordShape
        .map((string, index) => stringFactory(string, index))
        .filter(string => stringIsFrettedByFinger(string, finger))
        .map(string => getOrdinalNumber(string.index + 1));
      return `your ${finger.name} on the ${getOrdinalNumber(fret)} fret ${
        stringOrdinalNumbers.length === 1 ? "of" : "across"
      } the ${listToText(stringOrdinalNumbers)} string`;
    });

  return `Put ${listToText(result, true)}.`;
};

const renderChord = chord =>
  `<article>
    <h2>${chord.name}</h2>
    <ol class="list-reset grid">
    ${chord.shape
      .map(
        (string, i) => `<li
          class="${string.finger ? "finger" : ""}"
          style="grid-column: ${i + 1}; grid-row: ${
          string.fret === undefined ? "1" : string.fret + 1
        };">
          ${string.fret === undefined ? "" : string.finger || "0"}
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
