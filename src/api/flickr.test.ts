import { afterEach, vi, describe, expect, it } from "vitest";
import * as api from "./flickr";

const defFetch = global.fetch;
const defUser = "198281950@N04";
const defSet = "72177720308121319";
const defUrl = `https://www.flickr.com/photos/${defUser}/sets/${defSet}/`;

const createFlickrResponse = (data: unknown) => {
  return {
    text: () => new Promise((resolve) => resolve(JSON.stringify(data))),
  };
};

describe("Flickr API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = defFetch;
  });

  it("parseFlickrId", () => {
    expect(api.parseFlickrId()).toBeNull();
    expect(api.parseFlickrId("somestring")).toBeNull();
    expect(api.parseFlickrId(defUrl)).toEqual({
      userId: defUser,
      photoSetId: defSet,
    });
  });

  it("isFlickrPhotoSetUrl", () => {
    expect(api.isFlickrPhotoSetUrl()).toBeFalsy();
    expect(api.isFlickrPhotoSetUrl("somestring")).toBeFalsy();
    expect(api.isFlickrPhotoSetUrl(defUrl)).toBeTruthy();
  });

  it("loadFlickrPhotoSet", async () => {
    const mockedData = {
      data: "some data",
    };
    global.fetch = vi.fn().mockResolvedValue(createFlickrResponse(mockedData));
    const data = await api.loadFlickrPhotoSet(defUser, defSet);
    expect(data).toEqual(mockedData);
  });

  it("loadTranslatedPairsFromFlickrWithUrl", async () => {
    const mockedData = {
      photoset: {
        photo: [
          {
            id: "id",
            secret: "secret",
            server: "server",
            title: "title",
            ispublic: 1,
          },
          {
            id: "id",
            secret: "secret",
            server: "server",
            title: "title",
            ispublic: 1,
          },
        ],
      },
      stat: "ok",
      title: "title",
    };
    global.fetch = vi.fn().mockResolvedValue(createFlickrResponse(mockedData));
    const data1 = await api.loadTranslatedPairsFromFlickrWithUrl("testId");
    expect(data1).toEqual({
      errorMessage: `Can't parse ids from the Url: testId`,
      data: [],
    });
    const data2 = await api.loadTranslatedPairsFromFlickrWithUrl(defUrl);
    expect(data2).toEqual({
      errorMessage: "",
      data: [
        {
          type: "image",
          url: `https://live.staticflickr.com/server/id_secret_w.jpg`,
          orig: "title",
          translation: "title",
        },
        {
          type: "image",
          url: `https://live.staticflickr.com/server/id_secret_w.jpg`,
          orig: "title",
          translation: "title",
        },
      ],
    });
  });
});
