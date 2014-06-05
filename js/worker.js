importScripts("lodash.min.js",
              "bind_polyfill.js",
              "grid.js",
              "tile.js",
              "game_manager.js",
              "move_simulator.js",
              "expectimax.js");

onmessage = function (oEvent) {
  var fakeGameManager = {
    grid: {
      serialize: function() { return oEvent.data.grid; },
    },
    score: oEvent.data.score
  };

  var moveSimulator = new MoveSimulator(fakeGameManager);
  var node = new Node(moveSimulator, true);
  var result;

  result = expectimax(node, 4);
  console.log(JSON.stringify(result, null, 2));

  postMessage(result);
};

function heuristic(node) {
  if (!node.moveSimulator.movesAvailable()) {
    return -1E+100;
  }

  var alpha = 0;
  alpha += node.moveSimulator.score;

  var value = 0;
  node.moveSimulator.grid.eachCell(function(x, y, tile) {
    if (tile) {
      if (tile.value === "24Magnesium") {
        alpha -= 1E+20;
      }
      if (tile.value !== "56Iron") {
        value = Math.max(value, node.moveSimulator.pointValues[tile.value]);
      }
    }
  });

  alpha += value * 1000;


  return alpha;
}
