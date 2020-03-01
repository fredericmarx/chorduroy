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

const getFancyNumeral = number => String.fromCharCode(number - 1 + 10122);

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
  const stringIsPlayed = string => string.fret !== undefined;
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

  const stringInstructions = chordShape => {
    const mutedStringNames = chordShape
      .map((string, index) => stringFactory(string, index))
      .filter(string => !stringIsPlayed(string))
      .map(string => getOrdinalNumber(string.index + 1));

    if (mutedStringNames.length === 0) return "";

    return `<p>Play all strings, except the ${listToText(
      mutedStringNames
    )}.</p>`;
  };

  return `<p>Put ${listToText(result, true)}.</p>${stringInstructions(
    chordShape
  )}`;
};

const renderLinkList = (chords, currentChord, className, listItemClassName) => {
  const list = chords
    .map(chord => {
      const isCurrentChord = chord.name === currentChord.name;
      const url = `/${chord.name.toLowerCase()}`;
      if (isCurrentChord) {
        return `<li class="${listItemClassName}">${chord.name}</li>`;
      } else {
        return `<li class="${listItemClassName}"><a href="${url}">${chord.name}</a></li>`;
      }
    })
    .join("");
  return `<ul class="${className}">${list}</ul>`;
};

const renderChord = chord =>
  `<figure>
    <div role="img" aria-labelledby="${chord.name}-caption">
      <ol class="list-reset fretboard">
        ${chord.shape
          .map(
            (string, i) => `<li
              class="${string.finger ? "finger" : ""}"
              style="grid-column: ${i + 1}; grid-row: ${
              string.fret === undefined ? "1" : string.fret + 1
            };">
              ${(() => {
                if (string.fret === undefined) return "";
                if (string.finger === undefined) return "●";
                return getFancyNumeral(string.finger);
              })()}
            </li>`
          )
          .join("")}
        </ol>
      </div>
      <figcaption id="${chord.name}-caption">
        ${constructSentence(chord.shape)}
      </figcaption>
    </figure>`;

module.exports = ({ chord: activeChord, chords: unsortedChords, title }) => {
  const chords = unsortedChords.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  const chord = activeChord || chords[0];
  return `
    <!doctype html>
    <html class="no-js" lang="en">
      <head>
        <meta charset="utf-8">
        <title>${chord ? `${chord.name}: ` : ""}Chorduroy</title>
        <meta name="description" content="An accessible chord shape reference for guitar.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/main.css">
      </head>

      <body>
        <header>
          <h1>${chord ? chord.name : title}</h1>
          ${renderLinkList(
            chords.filter(item => item.name.startsWith(chord.name.charAt(0))),
            chord,
            "list-reset",
            "inline-block mr-1sp"
          )}
          ${renderLinkList(
            chords.filter(chord => chord.name.length === 1),
            chord,
            "list-reset small",
            "inline-block mr-1sp"
          )}
        </header>
        <main>
          ${chord ? renderChord(chord, chords) : ""}
        </main>
        <footer class="small">
          <p><a href="/">Chorduroy</a> is an accessible chord shape reference for guitar made by <a rel="author" href="https://twitter.com/fredericmarx">Frederic Marx</a>.</p>
          <h2>All chords</h2>
          ${renderLinkList(chords, chord, "list-reset")}
        </footer>
      </body>
    </html>`;
};
