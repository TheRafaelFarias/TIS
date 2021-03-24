import fs from "fs";
import readline from "readline";
import { once } from "events";

interface IToken {
  type: string;
  value: string;
}

interface IAST {
  type: string;
  body: any[];
}

async function lexer(code: fs.ReadStream): Promise<Array<IToken[]>> {
  const lineReader: Promise<Array<IToken[]>> = new Promise(
    (resolve, reject) => {
      const readInterface = readline.createInterface({
        input: code,
      });

      let tokens = new Array();

      readInterface.on("line", (line) => {
        const token = line
          .split(/\s+/)
          .filter((t) => t.length > 0)
          .map((t) => {
            if (t.includes("(")) {
              return { type: "function", value: t };
            } else if (t.includes(")")) {
              return { type: "end", value: t };
            } else {
              return { type: "argument", value: t };
            }
          });

        tokens.push(token);
      });

      once(readInterface, "close").then(() => resolve(tokens));
    }
  );

  return await lineReader;
}

function parser(tokens: Array<IToken[]>) {
  const AST = {
    type: "Runner",
    body: [] as any,
  };

  while (tokens.length > 0) {
    const currentTokenList = tokens.shift();
    const currentToken = currentTokenList?.values();

    if (currentToken != null) {
      currentTokenList?.forEach((token) => {
        if (token.type === "function") {
          switch (token.value) {
            case "log(":
              const expression = {
                type: "CallerExpression",
                name: "Printar",
                argument: {} as any,
              };

              const argumentFiltered = currentTokenList.map((token) => {
                return token.type == "argument" ? token.value : "";
              });
              const argument = argumentFiltered.join().replace(/,/g, " ");

              expression.argument = {
                type: "StringArgument",
                value: argument.toString(),
              };

              AST.body.push(expression);
          }
        }
      });
    }
  }

  return AST;
}

function logGenerator(ast: IAST) {
  const values = ast.body.map((value) => {
    return `console.log("${value.argument.value}")\n`;
  });
  return values.toString().split(",").join(" ");
}

function compilerAndWriter() {
  const runFunction = fs.createReadStream("./code.txt");
  lexer(runFunction).then((value) => {
    const parsed = parser(value);
    const generated = logGenerator(parsed);
    fs.writeFileSync("runner.js", generated.toString());
  });
}

compilerAndWriter();
