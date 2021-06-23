import fs from "fs";
import readline from "readline";
import { once } from "events";
import { IToken } from "./types";

export async function lexer(code: fs.ReadStream): Promise<Array<IToken[]>> {
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
