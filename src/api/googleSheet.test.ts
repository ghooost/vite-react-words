import { beforeEach, afterEach, vi, describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import * as GS from "./googleSheet";

const fakeLoadedData = () => ({
  table: {
    rows: [],
  },
});

describe("Gogle Sheet API", () => {
  beforeEach(() => {
    const fakeDom = new JSDOM("<!DOCTYPE html><html></html>");
    GS.setSettings(
      fakeDom.window as GS.GoogledWindow,
      fakeDom.window.document,
      []
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createDataPromise", async () => {
    const id = "test1";
    const promise = GS.createDataPromise(id);
    const settings = GS.getSettings();
    expect(settings.cache.length).eq(1);
    const item = settings.cache[0];
    expect(item.promise).toStrictEqual(promise);
    expect(item.id).toBe(id);
    const googleSheetData = fakeLoadedData();
    expect(item.funcResolve).toBeTypeOf("function");
    item.funcResolve?.(googleSheetData);
    const data = await item.promise;
    expect(data).toBe(data);
  });

  it("initApi", async () => {
    const cb = vi.fn();
    GS.initApi(cb);
    const settings = GS.getSettings();
    expect(settings.window?.google).toBeDefined();
    const data = fakeLoadedData();
    settings.window?.google?.visualization.Query.setResponse(data);
    expect(cb).toBeCalledWith(data);
    const cb2 = vi.fn();
    GS.initApi(cb2);
    settings.window?.google?.visualization.Query.setResponse(data);
    expect(cb).toBeCalledTimes(2);
    expect(cb2).not.toBeCalled();
  });
});
