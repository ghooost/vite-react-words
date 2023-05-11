# What is this?

This is a foreign words trainer. You can see it [here](https://ghooost.github.io/vite-react-words/). In the Quiz mode, a word (or a picture) and several translation options are shown. If you answer correctly, the next word (or phrase) is displayed and so on.

# Word collections

You can manage word collections in the Setup. Each collection has a name (just a name, it's only needed to find the collection in the list) and an URL of Google Sheet or Flickr Album.

# Google Sheet

Words and translations are initially stored in Google Sheets documents and imported from there when needed. Thus, to add a word collection, you need to:

- Create a Google Sheets document
- Fill it with words (cells in column A) and translations (cells in column B)
- Allow anyone to view the document
- Copy and paste URL to the collection properties
- Mark the collection with a star

# Flickr album

Instead of using Google Sheets, you can use a Flickr album with pictures. In this case, during the Quiz mode, an image will be shown, and answer options will be generated from the titles of the pictures. So,

- Upload pictures to Flickr
- Collect them in an album
  make sure the album is set to be viewable by everyone
- Copy the album link from your browser's address bar. Note that the link should look something like this:
  https://www.flickr.com/photos/xxxx/albums/yyyy
  Flickr can shorten links, and in the Share window, it offers shortened links. However, we need the full links because we can use them to obtain your User Id and the album Id.
- Paste the URL into the collection properties
- Mark the collection with a star

# Example Google Sheets

- [Finnish Numbers](https://docs.google.com/spreadsheets/d/1jBgmXRnafIlAe4zAgZRAGdkBJw-ySHRfza5FPH4HNII/edit#gid=0)
- [Finnish times](https://docs.google.com/spreadsheets/d/19URjKxbfUYtexfvENRGP8M1c-zKecPD2SfZBOpnHE0Q/edit#gid=0)

# Example Flickr album

- [Random Images](https://www.flickr.com/photos/198281950@N04/sets/72177720308121319/)

# Collections with stars

Words from collections marked with stars participate in the quiz.

# Statistics

In the collection settings, you can view the statistics of correct answers and reset it.

# Results saving

Your results and collections are saved on your computer. You can clear them by resetting localStorage in your browser settings.

# Motivation

The foreign words trainer itself is not particularly useful. Although I made it for myself to learn Finnish. However, the main benefit is to create a simple showcase application in React/Redux/TypeScript, configure the environment, linters, tests, and a simple CI for GitHub Pages.

# Tooling

React, Redux, TypeScript, ReactRouter, Vite, Vitest, Scorebook, light/dark themes support.
Google Sheet API, Flickr API, i18n with TypeScript support.

# Mobile and desktop interfaces

There are differences in the Setup section. I deliberately refused to use media queries in favor of subscribing to changes in window sizes and the useIsMobile hook. You can see the code in src/components/IsMobile.
