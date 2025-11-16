# Проект: Модератор

Система управления объявлениями для модерации, [тестовое задание на стажировку в Авито](https://github.com/avito-tech/tech-internship/blob/main/Tech%20Internships/Frontend/Frontend-trainee-assignment-autumn-2025/Frontend-trainee-assignment-autumn-2025.md).

## Оглавление

1. [Структура проекта](#структура-проекта)
2. [Зависимости](#зависимости)
3. [Установка и запуск frontend части](#установка-и-запуск-frontend-части)
4. [Запуск проекта](#запуск-проекта)
5. [Тестирование](#тестирование)

## Структура проекта

```
frontend/src/
│
├── api/
│   ├── api-client.ts       # HTTP клиент (AxiosInstance)
│   ├── ads-api.ts          # API запросы для объявлений
│   ├── moderators-api.ts   # API запросы для модераторов
│   └── stats-api.ts        # API запросы для статистики
│
├── components/             # UI компоненты
│   ├── filters/            # Компоненты фильтров
│   │   ├── category-filter.tsx
│   │   ├── price-range-filter.tsx
│   │   ├── status-filter.tsx
│   │   └── index.ts
│   ├── stats/              # Компоненты статистики
│   │   ├── stat-card.tsx
│   │   ├── custom-bar-chart-tooltip.tsx
│   │   └── index.ts
│   ├── icons/              # Иконки
│   ├── ui/                 # UI элементы от shadcn/ui
│   ├── item-card.tsx       # Карточка объявления
│   ├── item-sortings.tsx   # Сортировка объявлений
│   ├── search-bar.tsx      # Поисковая строка
│   ├── status-badge.tsx    # Бейдж статуса
│   ├── priority-badge.tsx  # Бейдж приоритета
│   ├── image-gallery.tsx   # Галерея изображений
│   ├── mode-toggle.tsx     # Переключатель темы
│   └── theme-provider.tsx  # Провайдер темы
│
├── layouts/                # Лэйауты
│   └── main-layout.tsx
│
├── lib/                    # Вспомогательные утилиты
│   └── utils.ts            # Общие функции-хелперы
│
├── pages/                  # Страницы приложения
│   ├── main-page.tsx       # Главная страница (список объявлений)
│   ├── item-page.tsx       # Страница детального просмотра объявления
│   ├── stats-page.tsx      # Страница статистики
│   └── not-found-page.tsx  # Страница 404
│
├── shared/                 # Общие модули
│   ├── hooks/              # Кастомные хуки
│   │   ├── use-debounce-callback/
│   │   └── index.ts
│   └── types/              # Типы TypeScript
│       ├── ads.ts
│       ├── moderator.ts
│       ├── stats.ts
│       ├── consts.ts
│       ├── shared.ts
│       └── index.ts
│
├── tests/                  # Тесты
│   └── setup.ts            # Конфиг тестов
│
├── index.css               # Глобальные стили (+ Tailwind/shadcn)
├── main.tsx                # Точка входа
└── vite-env.d.ts           # Типы Vite

backend/                 # Серверная часть приложения
```

## Зависимости

Зависимости, относящиеся к обязательным тех. требованиям:

- [React 19](https://react.dev)
- [React Router](https://reactrouter.com/start/declarative/installation)

Необязательные технологии с пояснением выбора:

- [TypeScript](https://www.typescriptlang.org) - суперсет JavaScript (компилятор), предоставляющий статическую типизацию. С ним работать и быстрее, и приятнее.

- [Vite](https://vitejs.dev) - Наилучший инструмент для настройки среды разработки, удобно начинать проект, намного быстрее чем webpack.

- [TanStack Query (React Query)](https://tanstack.com/query) - Библиотека для управления серверным состоянием. Упрощает работу с API, предоставляет кэширование, автоматическую синхронизацию и обновление данных.

- [Tailwind CSS](https://tailwindcss.com) - Удобное решение для стилизации сайтов. Атомарные классы очень просты в применении. Также от части является дизайн системой с хорошими цветами, паддингами и т. д.

- [shadcn/ui](https://ui.shadcn.com) - Библиотека компонент с минималистичным оформлением по умолчанию. Под капотом Radix UI (который является очень доступной headless библиотекой компонент). Сами компоненты скачиваются прямиком в проект - в папку `/src/components/ui/`, что позволяет их кастомизировать как угодно.

- [reactuse](https://siberiacancode.github.io/reactuse) - Библиотека хуков с такой же философией как и у `shadcn/ui` - нужен хук? Добавляй скриптом его прямо себе в кодовую базу.

- [Axios](https://axios-http.com) - HTTP клиент для работы с API. Удобный интерфейс, поддержка interceptors, автоматическая сериализация JSON.

- [Recharts](https://recharts.org) - Библиотека для построения графиков и диаграмм на основе React и D3. Используется для отображения статистики модератора.

- [React Hotkeys Hook](https://react-hotkeys-hook.vercel.app) - Хук для работы с горячими клавишами. Позволяет легко добавлять keyboard shortcuts в приложение.

- [Lucide React](https://lucide.dev) - Библиотека иконок для React. Красивые, современные иконки с поддержкой tree-shaking.

- [date-fns](https://date-fns.org) - Современная библиотека для работы с датами. Легковесная альтернатива moment.js.

- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/) - Библиотеки для Unit-тестирования. Vitest - быстрый тестовый раннер, совместимый с Vite. React Testing Library - лучшие практики для тестирования React компонентов.

- [ESLint](https://eslint.org/) - Помогает ловить ошибки в коде на этапах компиляции/написания кода

- [Prettier](https://prettier.io/) - Помогает соблюдать consistency в написании кода

## Установка и запуск frontend части

⚠️ Для настройки API в фронтенд-приложении, нужно создать файл `.env` в папке frontend и добавить следующую строку:

```
VITE_API=http://localhost:3001/api/v1
```

1. **Клонировать репозиторий**

   ```bash
   git clone git@github.com:Kreoniz/item-listing-moderation-system-avito.git
   cd item-listing-moderation-system-avito/frontend
   ```

2. **Установить зависимости**

   ```bash
   pnpm install
   ```

3. **Запустить в режиме разработки**

   ```bash
   pnpm dev
   ```

4. **Доступные npm-скрипты**
   - Запуск в режиме разработки: `pnpm dev`
   - Сборка для production: `pnpm build`
   - Линтинг кода: `pnpm lint`
   - Форматирование кода: `pnpm format`
   - Запуск тестов: `pnpm test`
   - Запуск тестов с UI: `pnpm test:ui`

## Запуск проекта

⚠️ Для настройки API в фронтенд-приложении, нужно создать файл `.env` в папке frontend и добавить следующую строку:

```
VITE_API=http://localhost:3001/api/v1
```

Проект можно запустить локально:

1. **Запустить backend сервер**

   ```bash
   cd ../backend
   npm install
   npm start
   ```

   Сервер будет доступен по адресу: `http://localhost:3001`

2. **Запустить frontend**

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

   Приложение будет доступно по адресу: `http://localhost:5173`

## Тестирование

В проекте используются [Vitest](https://vitest.dev) и [React Testing Library](https://testing-library.com/) для написания unit-тестов компонентов.

### Запуск тестов

```bash
# Запуск тестов в watch режиме
pnpm test

# Запуск тестов с UI интерфейсом
pnpm test:ui
```

### Написанные тесты

- **StatusBadge** - тесты для компонента отображения статуса объявления
- **PriorityBadge** - тесты для компонента отображения приоритета объявления
- **SearchBar** - тесты для поисковой строки с debounce функциональностью
- **StatCard** - тесты для карточки статистики
- **ItemCard** - тесты для карточки объявления, включая навигацию и выбор

Все тесты находятся рядом с соответствующими компонентами в файлах с расширением `.test.tsx`.
