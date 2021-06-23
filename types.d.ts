export interface IToken {
  type: string;
  value: string;
}

export interface IAST {
  type: string;
  body: ASTBody[];
}

export interface ASTBody {
  type: string,
  name: string,
  argument: {
    type: string,
    value: any
  }
}