import { TranslatedPair } from "@store/collectionsSlice";

const apiKey = "6d40fcf1f1b4ce6b06c93461bbabd7ff";

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
  stat: string;
  title: string;
}

export const loadFlickrPhotoSet = async (
  userId: string,
  photosetId: string
) => {
  const url = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${photosetId}&user_id=${userId}&format=json&nojsoncallback=1&auth_token=72157720881668553-e1c0d03b1a9ee1cc&api_sig=63043e7af22f42ff39153fa46db3651c`;
  try {
    const data = await fetch(url).then((response) => response.text());
    return JSON.parse(data) as FlickrPhotoSet;
  } catch (_) {
    return null;
  }
};

// https://www.flickr.com/photos/198281950@N04/albums/72177720308121319/with/52880824056/
export const loadTranslatedPairsFromFlickrWithUrl = async (url?: string) => {
  const id = parseFlickrId(url);
  if (id === null) {
    return null;
  }
  const data = await loadFlickrPhotoSet(id.userId, id.photoSetId);
  if (!data?.photoset.photo) {
    return null;
  }

  if (data.stat !== "ok") {
    return null;
  }

  return data.photoset.photo
    .filter(({ ispublic }) => ispublic === 1)
    .map(({ id, secret, server, title }) => {
      return {
        type: "image",
        url: `https://live.staticflickr.com/${server}/${id}_${secret}_w.jpg`,
        orig: title,
        translation: title,
      };
    }) as TranslatedPair[];
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
