import { ApiResponse, TranslatedPair } from "@store/collectionsSlice";

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

export const loadGoogleSheet = async (id: string) => {
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=&tq=select%20*`;
  let data = await fetch(url).then((response) => response.text());
  data = data.replace(/^.+setResponse\(/imsu, "");
  data = data.replace(/\);$/imsu, "");
  return JSON.parse(data) as GoogleSheetData;
};

export const loadTranslatedPairsFromGoogleSheetWithUrl = async (
  url?: string
): Promise<ApiResponse> => {
  try {
    const id = parseGoogleSheetId(url);
    if (!id) {
      throw Error(`Can't parse ids from the Url: ${url}`);
    }
    const data = await loadGoogleSheet(id);
    if (data === null) {
      throw Error(`Wrong response from Google`);
    }
    const words = data?.table.rows.reduce((acc, { c: cells }) => {
      if (cells.length < 2) {
        return acc;
      }
      if (!cells[0]?.v || !cells[1]?.v) {
        return acc;
      }
      acc.push({
        type: "word",
        orig: cells[0].v,
        translation: cells[1].v,
      });
      return acc;
    }, [] as TranslatedPair[]);

    return {
      errorMessage: "",
      data: words,
    };
  } catch (err) {
    return {
      errorMessage: (err as Error).message,
      data: [],
    };
  }
};

export const parseGoogleSheetId = (url?: string) => {
  if (!url) {
    return null;
  }
  const match = /docs\.google\.com\/spreadsheets\/d\/([^/]+)/i.exec(url);
  if (!match?.[1]) {
    return null;
  }
  return match[1].toString();
};

export const isGoogleSheetUrl = (url?: string) => {
  return parseGoogleSheetId(url) !== null;
};
