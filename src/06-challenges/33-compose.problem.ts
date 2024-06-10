import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

type Func = (input: any) => any;
type ReduceMember<PrevFunc extends Func> = (input: ReturnType<PrevFunc>) => any;

export function compose<Func1 extends Func, Func2 extends ReduceMember<Func1>>(
  ...funcs: [Func1, Func2]
): Func2;
export function compose<
  Func1 extends Func,
  Func2 extends ReduceMember<Func1>,
  Func3 extends ReduceMember<Func2>
>(...funcs: [Func1, Func2, Func3]): Func3;
export function compose<
  Func1 extends Func,
  Func2 extends ReduceMember<Func1>,
  Func3 extends ReduceMember<Func2>,
  Func4 extends ReduceMember<Func3>
>(...funcs: [Func1, Func2, Func3, Func4]): Func4;
export function compose<
  Func1 extends Func,
  Func2 extends ReduceMember<Func1>,
  Func3 extends ReduceMember<Func2>,
  Func4 extends ReduceMember<Func3>,
  Func5 extends ReduceMember<Func4>
>(...funcs: [Func1, Func2, Func3, Func4, Func5]): Func5;
export function compose<TFuncs extends Array<(input: any) => any>>(
  ...funcs: TFuncs
) {
  return (input: any) => {
    return funcs.reduce((acc, fn) => fn(acc), input);
  };
}

const addOne = (num: number) => {
  return num + 1;
};

const addTwoAndStringify = compose(addOne, addOne, String);

it("Should compose multiple functions together", () => {
  const result = addTwoAndStringify(4);

  expect(result).toEqual("6");

  type tests = [Expect<Equal<typeof result, string>>];
});

it("Should error when the input to a function is not typed correctly", () => {
  const stringifyThenAddOne = compose(
    // addOne takes in a number - so it shouldn't be allowed after
    // a function that returns a string!
    // @ts-expect-error
    String,
    addOne
  );
});
