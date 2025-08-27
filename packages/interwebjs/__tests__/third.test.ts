import { summary, triple } from "../src";

test("summary/triple work across packages", () => {
  const s = summary(2, 3, "dev");
  expect(s).toEqual({
    sum: 5,
    product: 6,
    greetLine: "hello, dev — sum=5"
  });
  expect(triple(3)).toBe(9);
});
