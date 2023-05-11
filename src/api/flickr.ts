import { ApiResponse, TranslatedPair } from "@store/collectionsSlice";

const apiKey = import.meta.env.VITE_FLICKR_API_KEY;

interface Photo {
  id: string;
  secret: string;
  server: string;
  title: string;
  ispublic: number;
}

interface FlickrPhotoSet {
  photoset: {
    photo: Photo[];
  };
  stat: "ok";
  title: string;
}

interface FlickrError {
  stat: "fail";
  message: string;
}

type FlickrAnswer = FlickrPhotoSet | FlickrError;

export const loadFlickrPhotoSet = async (
  userId: string,
  photosetId: string
) => {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${photosetId}&user_id=${userId}&format=json&nojsoncallback=1`;
  const data = await fetch(url).then((response) => response.text());
  return JSON.parse(data) as FlickrAnswer;
};

export const loadTranslatedPairsFromFlickrWithUrl = async (
  url?: string
): Promise<ApiResponse> => {
  try {
    const id = parseFlickrId(url);
    if (id === null) {
      throw Error(`Can't parse ids from the Url: ${url}`);
    }
    const data = await loadFlickrPhotoSet(id.userId, id.photoSetId);
    if (!data) {
      throw Error(`Wrong response from Flickr`);
    }
    if (data.stat !== "ok") {
      throw Error(data.message ?? `Wrong response from Flickr`);
    }

    const photos = data.photoset.photo
      .filter(({ ispublic }) => ispublic === 1)
      .map(({ id, secret, server, title }) => {
        return {
          type: "image",
          url: `https://live.staticflickr.com/${server}/${id}_${secret}_w.jpg`,
          orig: title,
          translation: title,
        };
      }) as TranslatedPair[];

    return {
      errorMessage: "",
      data: photos,
    };
  } catch (err) {
    return {
      errorMessage: (err as Error).message,
      data: [],
    };
  }
};

export const parseFlickrId = (url?: string) => {
  if (!url) {
    return null;
  }
  const match = /www\.flickr\.com\/photos\/([^/]+)\/[^/]+\/(\d+)/i.exec(url);
  if (!match?.[1] || !match?.[2]) {
    return null;
  }

  return {
    userId: match[1],
    photoSetId: match[2],
  };
};

export const isFlickrPhotoSetUrl = (url?: string) => {
  return parseFlickrId(url) !== null;
};
