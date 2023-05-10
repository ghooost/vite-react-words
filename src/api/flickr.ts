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
  try {
    const data = await fetch(url).then((response) => response.text());
    return JSON.parse(data) as FlickrAnswer;
  } catch (_) {
    return null;
  }
};

// https://www.flickr.com/photos/198281950@N04/albums/72177720308121319/with/52880824056/
export const loadTranslatedPairsFromFlickrWithUrl = async (
  url?: string
): Promise<ApiResponse> => {
  const id = parseFlickrId(url);
  if (id === null) {
    return {
      errorMessage: `Can't parse ids from the Url: ${url}`,
      data: [],
    };
  }
  const data = await loadFlickrPhotoSet(id.userId, id.photoSetId);
  if (!data) {
    return {
      errorMessage: `Wrong response from Flickr`,
      data: [],
    };
  }
  if (data.stat === "fail") {
    return {
      errorMessage: data.message,
      data: [],
    };
  }
  if (data.stat !== "ok") {
    return {
      errorMessage: `Wrong response from Flickr`,
      data: [],
    };
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
