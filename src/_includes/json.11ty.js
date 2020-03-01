module.exports = ({ chords: unsortedChords }) => {
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

  return `${JSON.stringify(chords, null, 2)}`;
};
