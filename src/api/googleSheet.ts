// I can't load sheets data in parallel, that's why
// there is a queue

type Status = "waiting" | "loading" | "ready" | "error";

// GoogleSheet types
interface GoogleSheetCell {
  v: string;
}

interface GoogleSheetRow {
  c: GoogleSheetCell[];
}

export interface GoogleSheetData {
  table: {
    rows: GoogleSheetRow[];
  };
}

export interface CacheItem {
  id: string;
  status: Status;
  promise: Promise<GoogleSheetData>;
  funcResolve?: (data: GoogleSheetData) => void;
  funcReject?: (reason?: string) => void;
}

type InitApiCallback = (data: GoogleSheetData) => void;

export type GoogledWindow = {
  google?: {
    visualization: {
      Query: {
        setResponse: InitApiCallback;
      };
    };
  };
};

interface Settings {
  window?: GoogledWindow;
  document?: Document;
  cache: CacheItem[];
}

const settings: Settings = {
  cache: [],
};

// to make tests painless
export const setSettings = (
  winObj?: GoogledWindow,
  docObj?: Document,
  cache?: CacheItem[]
) => {
  if (winObj) {
    settings.window = winObj;
  }
  if (docObj) {
    settings.document = docObj;
  }
  if (cache) {
    settings.cache = cache;
  }
};

export const getSettings = () => settings;

export const loadGoogleSheet = (id: string) => {
  const promise = createDataPromise(id);
  touchTheQueue();
  return promise;
};
// utils that can be tested
export const createDataPromise = (id: string) => {
  const { cache } = settings;
  const item = cache.find(({ id: itemId }) => id === itemId);
  if (item) {
    return item.promise;
  }
  let funcResolve;
  let funcReject;
  const newItem: CacheItem = {
    id,
    status: "waiting",
    promise: new Promise((resolve, reject) => {
      funcResolve = resolve;
      funcReject = reject;
    }),
  };
  newItem.funcResolve = funcResolve;
  newItem.funcReject = funcReject;
  cache.push(newItem);
  return newItem.promise;
};

export const initApi = (cbFunc: InitApiCallback) => {
  const { window } = settings;
  if (window?.google || !window) {
    return;
  }
  window.google = {
    visualization: {
      Query: {
        setResponse: (data: GoogleSheetData) => {
          cbFunc(data);
        },
      },
    },
  };
};

export const touchTheQueue = () => {
  const { cache } = settings;
  const itemThatLoading = cache.find(({ status }) => status === "loading");
  if (itemThatLoading) {
    return;
  }
  const itemToLoad = cache.find(({ status }) => status === "waiting");
  if (!itemToLoad) {
    return;
  }
  initApi(onSheetLoaded);
  itemToLoad.status = "loading";
  startLoading(itemToLoad.id);
};

const startLoading = (id: string) => {
  const { document } = settings;
  if (!document) {
    return;
  }
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=&tq=select%20*`;
  const node = document.createElement("script");
  node.src = url;
  document.head.appendChild(node);
};

const onSheetLoaded = (data: GoogleSheetData) => {
  const { cache } = settings;
  const itemThatLoading = cache.find(({ status }) => status === "loading");
  if (itemThatLoading && itemThatLoading.funcResolve) {
    itemThatLoading.status = "ready";
    itemThatLoading.funcResolve(data);
  }
  touchTheQueue();
};
