import { includesSome } from "./helpers";
import { IAST, IToken } from "./types";

export function parser(tokens: Array<IToken[]>) {
  const AST: IAST = {
    type: "Runner",
    body: [],
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
                name: "Print",
                argument: {} as any,
              };

              const argumentFiltered = currentTokenList.map((token) => {
                return token.type == "argument" ? token.value : "";
              });

              const argument = argumentFiltered
                .join()
                .replace(/,/g, " ")
                .slice(1, -1);

              if (
                includesSome(argument, ["+", "-", "/", "*"]) &&
                isFinite(parseInt(argument))
              ) {
                argument.split(/\+/).map((t) => {
                  expression.argument = {
                    type: "NumberArgument",
                    value: argument,
                  };
                });
                AST.body.push(expression);
                return;
              } else {
                expression.argument = {
                  type: "StringArgument",
                  value: argument.toString(),
                };

                AST.body.push(expression);
              }
          }
        }
      });
    }
  }

  return AST;
}
