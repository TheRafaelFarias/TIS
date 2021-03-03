import fs from "fs"

interface IToken {
  type: string
  value: string
}

interface IAST {
  type: string
  body: any
}

function lexer(code: string): Array<IToken> {
  return code.split(/\s+/)
    .filter(t => t.length > 0)
    .map(t => {
      if (t.includes("(")) {
        return { type: 'function', value: t }
      }
      else if (t.includes(")")) {
        return { type: 'end', value: t }
      }
      else {
        return { type: 'argument', value: t }
      }
    })
}

function parser(tokens: Array<IToken>): IAST {
  const AST = {
    type: 'Runner',
    body: [] as any
  }

  while (tokens.length > 0) {
    const currentToken = tokens.shift()

    if (currentToken?.type === "function") {
      switch (currentToken.value) {
        case "log(":
          const expression = {
            type: "CallerExpression",
            name: "Printar",
            argument: {} as any
          }


          const argumentFiltered = tokens.map(token => {
            return token.type == "argument" ? token.value : ""
          })
          const argument = argumentFiltered.join().replace(/,/g, " ")

          expression.argument = {
            type: "StringArgument",
            value: argument.toString()
          }

          AST.body.push(expression)
      }
    }
  }

  return AST
}

function logGenerator(ast: IAST) {
  return `console.log("${ast.body[0].argument.value}")`
}

function compilerAndWriter() {
  const runFunction = fs.readFileSync("./code.txt").toString()
  const lexed = lexer(runFunction)
  const parsed = parser(lexed)

  fs.writeFileSync("runner.js", logGenerator(parsed))
}

compilerAndWriter()