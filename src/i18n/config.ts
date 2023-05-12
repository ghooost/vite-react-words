import aboutCustomerEn from "./assets/about.customer.en.html?raw";
import aboutDevEn from "./assets/about.dev.en.html?raw";
import aboutCustomerRu from "./assets/about.customer.ru.html?raw";
import aboutDevRu from "./assets/about.dev.ru.html?raw";

export const config = {
  version: 0.1,
  locales: {
    en: {
      messages: {
        quiz: "Quiz",
        setup: "Setup",
        about: "About",
        new: "New collection",
        name: "Name",
        noName: "No name",
        url: "URL",
        urlPlaceholder: "Google Sheet or Flickr Photoset",
        useInQuiz: "Use in quiz",
        words: "Words",
        reload: "Reload",
        correctAnswers: "Correct answers",
        reset: "Reset",
        update: "Update",
        delete: "Delete",
        listOfCollections: "List of collections",
        interface: "Interface",
        language: "Language",
        theme: "Theme",
        aboutCustomer: aboutCustomerEn,
        aboutDev: aboutDevEn,
      },
    },
    ru: {
      messages: {
        quiz: "Урок",
        setup: "Настройка",
        about: "Инфо",
        new: "Новая коллекция",
        name: "Название",
        noName: "Без названия",
        url: "URL",
        urlPlaceholder: "адрес таблицы Google или альбома Flickr",
        useInQuiz: "Использовать в уроке",
        words: "Задания в коллекции",
        reload: "загрузить",
        correctAnswers: "Правильных ответов",
        reset: "сбросить",
        update: "Сохранить",
        delete: "Удалить",
        listOfCollections: "Список коллекций",
        interface: "Интерфейс",
        language: "Язык",
        theme: "Тема",
        aboutCustomer: aboutCustomerRu,
        aboutDev: aboutDevRu,
      },
    },
  },
} as const;
