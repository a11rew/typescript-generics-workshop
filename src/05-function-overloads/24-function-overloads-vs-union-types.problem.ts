import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

type FunctionGenerator<T> = () => T;
type ObjFunctionGenerator<T> = {
  run: FunctionGenerator<T>;
};

function runGenerator<TGeneratorResult>(
  generator: FunctionGenerator<TGeneratorResult>
): TGeneratorResult;
function runGenerator<TGeneratorResult>(
  generator: ObjFunctionGenerator<TGeneratorResult>
): TGeneratorResult;
function runGenerator(
  generator: FunctionGenerator<unknown> | ObjFunctionGenerator<unknown>
) {
  if (typeof generator === "function") {
    return generator();
  }
  return generator.run();
}

it("Should accept an object where the generator is a function", () => {
  const result = runGenerator({
    run: () => "hello",
  });

  expect(result).toBe("hello");

  type test1 = Expect<Equal<typeof result, string>>;
});

it("Should accept an object where the generator is a function", () => {
  const result = runGenerator(() => "hello");

  expect(result).toBe("hello");

  type test1 = Expect<Equal<typeof result, string>>;
});
