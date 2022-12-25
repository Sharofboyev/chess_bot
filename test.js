const pgnParser = require("pgn-parser");
const result = pgnParser.parse(`[Event "?"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "*"]
[SetUp "1"]
[FEN "8/2r5/3k4/8/5K2/8/8/8 b - - 0 1"]

1... Ke7 2. Ke5 Rc6 * *`);
console.log(result[0]);
