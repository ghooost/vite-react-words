# What is this?

This is a foreign words trainer. You can see it [here](https://ghooost.github.io/vite-react-words/). In the Quiz mode, a word and several translation options are shown. If you answer correctly, the next word (or phrase) is displayed and so on.

# Word collections.

You can manage word collections in the Setup. Each collection has a name (just a name, it's only needed to find the collection in the list) and a Google Sheet ID.

# Google Sheet

Words and translations are initially stored in Google Sheets documents and imported from there when needed. Thus, to add a word collection, you need to:

- Create a Google Sheets document
- Fill it with words (cells in column A) and translations (cells in column B)
- Allow anyone to view the document
- Add the collection with the ID of your document
- Mark the collection with a star

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

# Mobile and desktop interfaces

There are differences in the Setup section. I deliberately refused to use media queries in favor of subscribing to changes in window sizes and the useIsMobile hook. You can see the code in src/components/IsMobile.
