import { afterEach, vi, describe, expect, it } from "vitest";
import * as GS from "./googleSheet";

const defFetch = global.fetch;
const defId = "1jBgmXRnafIlAe4zAgZRAGdkBJw-ySHRfza5FPH4HNII";
const defUrl = `https://docs.google.com/spreadsheets/d/${defId}/edit#gid=0`;

const createGSResponse = (data: unknown) => {
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

  it("parseGoogleSheetId", () => {
    expect(GS.parseGoogleSheetId()).toBeNull();
    expect(GS.parseGoogleSheetId("somestring")).toBeNull();
    expect(GS.parseGoogleSheetId(defUrl)).toBe(defId);
  });

  it("isGoogleSheetUrl", () => {
    expect(GS.isGoogleSheetUrl()).toBeFalsy();
    expect(GS.isGoogleSheetUrl("somestring")).toBeFalsy();
    expect(GS.isGoogleSheetUrl(defUrl)).toBeTruthy();
  });

  it("loadGoogleSheet", async () => {
    const mockedData = {
      data: "some data",
    };
    global.fetch = vi.fn().mockResolvedValue(createGSResponse(mockedData));
    const data = await GS.loadGoogleSheet(defId);
    expect(data).toEqual(mockedData);
    expect(global.fetch).toBeCalledWith(
      `https://docs.google.com/spreadsheets/d/${defId}/gviz/tq?tqx=out:json&sheet=&tq=select%20*`
    );
  });

  it("loadTranslatedPairsFromGoogleSheetWithUrl", async () => {
    const mockedData = {
      table: {
        rows: [
          {
            c: [{ v: "a1" }, { v: "b1" }],
          },
          {
            c: [{ v: "a2" }, { v: "b2" }],
          },
        ],
      },
    };
    global.fetch = vi.fn().mockResolvedValue(createGSResponse(mockedData));
    const data1 = await GS.loadTranslatedPairsFromGoogleSheetWithUrl("testId");
    expect(data1).toEqual({
      errorMessage: `Can't parse ids from the Url: testId`,
      data: [],
    });
    const data2 = await GS.loadTranslatedPairsFromGoogleSheetWithUrl(defUrl);
    expect(data2).toEqual({
      errorMessage: "",
      data: [
        {
          type: "word",
          orig: "a1",
          translation: "b1",
        },
        {
          type: "word",
          orig: "a2",
          translation: "b2",
        },
      ],
    });
  });
});
