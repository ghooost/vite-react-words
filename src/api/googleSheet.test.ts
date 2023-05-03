import { afterEach, vi, describe, expect, it } from "vitest";
import * as GS from "./googleSheet";

const defFetch = global.fetch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createGSResponse = (data: any) => {
  return {
    text: () =>
      new Promise((resolve) =>
        resolve(`somethigsetResponse(${JSON.stringify(data)});`)
      ),
  };
};

describe("google Sheet", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = defFetch;
  });

  it("loadingGoogleSheet", async () => {
    const mockedData = {
      data: "some data",
    };
    global.fetch = vi.fn().mockResolvedValue(createGSResponse(mockedData));
    const data = await GS.loadGoogleSheet("testId");
    expect(data).toStrictEqual(mockedData);
  });

  it("loadTranslatedPairsFromGoogleSheet", async () => {
    const mockedData = {
      table: {
        rows: [
          { c: [{ v: "w1" }, { v: "t1" }] },
          { c: [{ v: "w2" }, { v: "t2" }] },
          { c: [{ v: "w3" }, { v: "t3" }] },
        ],
      },
    };
    global.fetch = vi.fn().mockResolvedValue(createGSResponse(mockedData));
    const words = await GS.loadTranslatedPairsFromGoogleSheet("testId");
    expect(words.length).toBe(3);
    expect(words[0]).toStrictEqual({
      orig: "w1",
      translation: "t1",
    });
    expect(words[1]).toStrictEqual({
      orig: "w2",
      translation: "t2",
    });
  });
});
