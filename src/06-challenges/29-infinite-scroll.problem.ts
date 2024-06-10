import { expect, it } from "vitest";
import { Equal, Expect, Prettify } from "../helpers/type-utils";

type Rows = Record<string, any>[] | Promise<Record<string, any>[]>;

const makeInfiniteScroll = <
  TResult extends Rows,
  TInitialRows extends Rows,
  TRow extends Awaited<TResult> extends never[]
    ? Awaited<TInitialRows> extends never[]
      ? never
      : Awaited<TInitialRows>
    : Awaited<TResult>
>(params: {
  fetchRows: (...args: any) => TResult;
  initialRows?: TInitialRows;
  key: keyof TRow[number];
}) => {
  const data = (params.initialRows || []) as TRow;

  const scroll = async () => {
    const rows = await params.fetchRows();
    data.push(...rows);
  };

  return {
    scroll,
    getRows: () => data,
  };
};

it("Should fetch more data when scrolling", async () => {
  const table = makeInfiniteScroll({
    key: "id",
    fetchRows: () => Promise.resolve([{ id: 1, name: "John" }]),
  });

  await table.scroll();

  await table.scroll();

  expect(table.getRows()).toEqual([
    { id: 1, name: "John" },
    { id: 1, name: "John" },
  ]);
});

it("Should ensure that the key is one of the properties of the row", () => {
  makeInfiniteScroll({
    // @ts-expect-error
    key: "name",
    fetchRows: () =>
      Promise.resolve([
        {
          id: "1",
        },
      ]),
  });
});

it("Should allow you to pass initialRows", () => {
  const { getRows } = makeInfiniteScroll({
    key: "id",
    initialRows: [
      {
        id: 1,
        name: "John",
      },
    ],
    fetchRows: () => Promise.resolve([]),
  });

  const rows = getRows();

  expect(rows).toEqual([
    {
      id: 1,
      name: "John",
    },
  ]);

  type tests = [
    Expect<Equal<typeof rows, Array<{ id: number; name: string }>>>
  ];
});
