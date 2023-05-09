import { afterEach, vi, describe, expect, it, beforeEach } from "vitest";
import * as CS from "./collectionsSlice";
import { configureStore } from "@reduxjs/toolkit";

const defFetch = global.fetch;
const defLocalStorage = global.localStorage;

let store = configureStore({
  reducer: {
    collections: CS.default,
  },
});

describe("collectionsSlice", () => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        collections: CS.default,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = defFetch;
    global.localStorage = defLocalStorage;
  });

  it("loadCollections - no saved data", async () => {
    global.localStorage = {
      ...defLocalStorage,
      getItem: vi.fn().mockReturnValue(null),
    };

    const data = await store.dispatch(CS.loadCollections());
    expect(data.payload).toBe(CS.defaultCollections);
    expect(global.localStorage.getItem).toBeCalledWith("collections");
  });

  it("loadCollections - restore saved data", async () => {
    const check = [
      {
        id: "def",
        isSelected: true,
        name: "some",
        url: "url",
        state: "empty",
      },
    ];

    global.localStorage = {
      ...defLocalStorage,
      getItem: vi.fn().mockReturnValue(JSON.stringify(check)),
    };

    const data = await store.dispatch(CS.loadCollections());
    expect(data.payload).toEqual(check);
    expect(global.localStorage.getItem).toBeCalledWith("collections");
  });
});
