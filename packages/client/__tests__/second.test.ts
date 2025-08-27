import { sumAndGreet, double } from "../src";

test("sumAndGreet/double work", () => {
  expect(double(4)).toBe(8);
  expect(sumAndGreet(2, 3, "dev")).toBe("hello, dev — sum=5");
});
