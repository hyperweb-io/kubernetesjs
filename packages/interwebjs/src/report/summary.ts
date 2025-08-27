import { add, mul } from "@pagebond/my-first";
import { sumAndGreet } from "@pagebond/my-second";

export const summary = (a: number, b: number, name: string) => {
  const sum = add(a, b);
  const product = mul(a, b);
  const greetLine = sumAndGreet(a, b, name);
  return { sum, product, greetLine };
};
