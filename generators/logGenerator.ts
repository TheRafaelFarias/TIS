import { ASTBody } from "../types";

export function logGenerator(expression: ASTBody) {
  if (expression.argument.type == "NumberArgument") {
    return `console.log(${expression.argument.value})\n`;
  }
  return `console.log("${expression.argument.value}")\n`;
}
