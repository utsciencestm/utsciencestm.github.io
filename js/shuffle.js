function shuffle(array, seed) {
  var rng = new Math.seedrandom(seed);
  // rng = Math.random
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}