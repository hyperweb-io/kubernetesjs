import { add, mul, greet } from "../src";

test("add/mul/greet work", () => {
  expect(add(2, 3)).toBe(5);
  expect(mul(2, 3)).toBe(6);
  expect(greet("world")).toBe("hello, world");
});
