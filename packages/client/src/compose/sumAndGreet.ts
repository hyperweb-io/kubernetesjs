import { add, greet } from "@pagebond/my-first";

export const sumAndGreet = (a: number, b: number, name: string) =>
  `${greet(name)} — sum=${add(a, b)}`;
