const renderChord = chord =>
  `<section>
    <h2>${chord.name}</h2>
    <ol class="list-reset grid">
    ${chord.shape.map(string => `<li>${string.fret}</li>`).join("")}
    </ol>
  </section>`;
const renderChords = chords =>
  `${chords.map(chord => renderChord(chord)).join("")}`;

module.exports = ({ chords, content }) => `
<!doctype html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/css/main.css">
  </head>

  <body>
    ${content}
    <hr>
    ${renderChords(chords)}
    <script src="/js/main.js"></script>
  </body>
</html>`;
