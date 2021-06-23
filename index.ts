import fs from "fs";
import { logGenerator } from "./generators/logGenerator";
import { lexer } from "./lexer";
import { parser } from "./parser";

function compilerAndWriter() {
  const runFunction = fs.createReadStream("./code.txt");
  lexer(runFunction).then((value) => {
    const parsed = parser(value);

    const file = fs.createWriteStream("runner.js");
    parsed.body.map((expression) => {
      if (expression.name == "Print") {
        file.write(logGenerator(expression));
      }
    });
  });
}

compilerAndWriter();
