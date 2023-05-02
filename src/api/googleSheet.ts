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

export interface TranslatedPair {
  orig: string;
  translation: string;
}

export const loadGoogleSheet = async (id: string) => {
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=&tq=select%20*`;
  try {
    let data = await fetch(url).then((response) => response.text());
    data = data.replace(/^.+setResponse\(/imsu, "");
    data = data.replace(/\);$/imsu, "");
    return JSON.parse(data) as GoogleSheetData;
  } catch (_) {
    return null;
  }
};

export const loadTranslatedPairsFromGoogleSheet = async (id: string) => {
  const data = await loadGoogleSheet(id);
  if (data === null) {
    return [];
  }
  return data?.table.rows.reduce((acc, { c: cells }) => {
    if (cells.length < 2) {
      return acc;
    }
    if (!cells[0]?.v || !cells[1]?.v) {
      return acc;
    }
    acc.push({
      orig: cells[0].v,
      translation: cells[1].v,
    });
    return acc;
  }, [] as TranslatedPair[]);
};
