# Специфікація для фронтенд-агента: демо-режим B2bar

Версія 1.0, 2026-11-05. Репозиторій: `LavkaTeam/frontend` (React 19, Vite, TypeScript, React Router 7, TanStack Query 5, Redux Toolkit, React Hook Form, Zod, CSS Modules, vitest). Документ самодостатній. Бекенд реалізує агент окремо за власною специфікацією; контракт API нижче зафіксований, працюй проти нього (до готовності бекенда використовуй моки, див. розділ 9).

> Мова UI: англійська (як весь сайт). Мова коду/комітів: англійська. Дотримуйся конвенцій репо: `@/` alias, `features/<name>`, CSS Modules, `useToast`, компоненти з `components/ui`.

---

## 1. Ціль

Додати до сайту **демо-режим**, який вмикається лише конфігом (`VITE_DEMO_MODE=true`) на окремому деплої `demo.b2bar.tech`. У ньому відвідувач без реєстрації одним кліком входить як покупець або продавець в уже наповнений кабінет, бачить, що це демо, може перемкнути роль, скинути дані й зрозуміло дізнається, коли демо закінчилось. **Прод-збірка (змінна не задана) має працювати точно як зараз**, без демо-коду в бандлі й без змін у поведінці.

Контекст: B2bar це B2B оптова платформа для HoReCa (портфоліо-проєкт, не живий бізнес). Бекенд у демо створює кожному відвідувачу ізольований «куточок» (тенант) з акаунтом обраної ролі та парним акаунтом протилежної ролі, товарами, замовленнями, документами, фінансами й аналітикою. Каталог («спільний світ») спільний і незмінний.

## 2. Межі

**Входить:** конфіг; API-шар `/api/demo/**`; сторінка `/demo` і вибір ролі; кнопки на Home/Login; банер з таймером; меню демо (switch role, reset, exit); мітка DEMO; обробка закінчення сесії; приховування недоступних у демо дій; підказки «Things to try»; noindex/title; обробка нових кодів помилок; тести; налаштування Vercel-проєкту.

**Не входить:** зміни бізнес-логіки кабінетів, нова адмін-UI, переписування auth, SSR/SEO-міграція.

## 3. Що вже є в репо (прив'язка)

| Тема | Де | Що важливо |
|---|---|---|
| API-клієнт | `src/shared/api/client.ts` | `apiUrl` з `VITE_API_URL`; `saveAuthTokens({token, refreshToken, user})` зберігає `token`, `refreshToken`, `authRole` у `localStorage` і шле `auth:change`; `clearAuthTokens()`; авто-refresh на 401 (не для `/auth/login`, `/auth/register`, `/auth/refresh`); при провалі refresh викликається `expireSession()` → подія `auth:logout`; помилки кидаються як `{error, code, details, status}` |
| Сесія | `src/hooks/useAuthSessionWatcher.ts` (змонтований у `Layout`) | на `auth:logout` чистить cart/favorites/queryClient і веде на `/login` з тостом «Your session has expired» |
| Стан авторизації | `src/hooks/useIsAuthenticated.ts` | `useIsAuthenticated`, `useIsAdmin`, `useIsShopper` через `useSyncExternalStore` |
| Користувач | `src/hooks/useUser.ts`, `src/api/user.ts`, `src/types/user.d.ts` | `UserResponse` |
| Логін | `src/hooks/useLoginHandler.ts` | `finishLogin`: `saveAuthTokens`, `invalidateQueries(['user'])`, `syncLocalUserData`, навігація на `state.from` або `/account` |
| Логаут | `src/hooks/useLogOutHandler.ts` | **`localStorage.clear()`** + `clearAuthTokens` + чистка Redux/Query, навігація `/`; не викликає `/auth/logout` |
| Помилки | `src/utils/error.ts`, `src/types/apiError.d.ts` | `getErrorCode`, `getRetryAfterSeconds`, `extractErrorMessage`; `ApiErrorCode` union |
| Роутер | `src/router/router.tsx` | lazy-сторінки + `Suspense`; `ProtectedRoute allowedRoles`; dev-маршрут за `import.meta.env.DEV` |
| Layout | `src/Layout/Layout.tsx` | `Header`, `main > Outlet`, `Footer`, `Toast` |
| Header | `src/components/Header/Header.tsx` | іконки Account/Favorites/Cart, logout |
| Кабінет | `src/pages/Account.tsx`, `src/features/account/shell/*` | вкладки за роллю (`model/accountTabs.ts`), онбординг-тур driver.js (`tour/*`, прапорець `done` у localStorage за userId) |
| Профіль | `src/features/account/profile/*` | форма профілю, зміна пароля (`components/ChangePassword`), завантаження лого/ліцензії |
| Auth-сторінки | `Login`, `Register`, `ForgotPassword`, `ResetPassword`, `VerifyEmail` | потрібно прибрати/замінити в демо |
| Адмінка | `/admin` (ADMIN) | у демо недоступна |
| Оплата | `/mock-payment/:batchId`, `/payment/*` | «демо-оплата» існуючої фічі, не плутати з демо-режимом; лишається як є |
| Збірка/CI | `package.json`: `lint`, `test:unit` (vitest), `build` (`tsc -b && vite build`); `.github/workflows/quality.yml` | усе має лишатись зеленим |
| Деплой | Vercel, `vercel.json` (SPA rewrite) | демо буде другим Vercel-проєктом з тим самим репо |

## 4. Конфігурація

Створи `src/features/demo/config.ts`:

```ts
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
export const prodSiteUrl = import.meta.env.VITE_PROD_URL || 'https://b2bar.tech';
```

Додай типи в `src/vite-env.d.ts` (`VITE_DEMO_MODE`, `VITE_PROD_URL`, `VITE_DEMO_URL`). Створи `.env.example` (є `VITE_API_URL`, `VITE_DEMO_MODE`).

| Змінна | Демо (Vercel) | Прод |
|---|---|---|
| `VITE_API_URL` | `https://api.demo.b2bar.tech/api` | як зараз |
| `VITE_DEMO_MODE` | `true` | не задана |
| `VITE_PROD_URL` | `https://b2bar.tech` | — |
| `VITE_DEMO_URL` | — | (опц.) `https://demo.b2bar.tech`, якщо задано, у футері/хедері проду з'являється посилання «Try the demo» |

**Правило tree-shaking:** весь код демо імпортується лише з `src/features/demo/**` і підключається через умовні точки вигляду `isDemoMode && <DemoBanner />`. Для lazy-сторінок: `const DemoLanding = isDemoMode ? lazy(() => import(...)) : null`, як зроблено для `DevAuthPreview`. Критерій: прод-збірка не містить рядків «Explore as» і чанка demo (перевірити `grep` по `dist`).

## 5. Контракт API (бекенд реалізує; домовленість зафіксована)

Усі шляхи відносно `apiUrl`. Помилки в існуючому форматі `{ error, code, details }`.

| Метод | Шлях | Auth | Призначення |
|---|---|---|---|
| GET | `/demo/info` | ні | `{ enabled, tenantTtlHours, limits:{maxProducts,maxOrdersCreated,maxUploads,maxUploadBytes}, adminEnabled, seedVersion }` |
| POST | `/demo/session` | ні | тіло `{ role: 'BUYER'|'SELLER' }` → `201 DemoSessionResponse` |
| GET | `/demo/me` | так | `{ tenantId, role, createdAt, expiresAt, pairedUser:{id,role,companyName}, usage:{productsCreated,ordersCreated,uploadsCount} }` |
| POST | `/demo/switch-role` | так | → `200 DemoSessionResponse` для парного користувача |
| POST | `/demo/reset` | так | тіло (опц.) `{ role }` → `201 DemoSessionResponse` |
| DELETE | `/demo/session` | так | `204` (P1) |

`DemoSessionResponse`:

```ts
interface DemoSessionResponse {
  token: string;
  refreshToken: string;
  user: AuthResponse['user'] & { demo: true; demoExpiresAt: string };
  demo: { tenantId: string; role: 'BUYER'|'SELLER'; pairedRole: 'BUYER'|'SELLER'; createdAt: string; expiresAt: string };
}
```

`user` має ту саму форму, що у відповіді логіну, тому передається в `saveAuthTokens` без змін. `UserResponse` (`GET /user/me`) отримує поля `demo?: boolean; demoExpiresAt?: string | null`.

Нові коди помилок (додай у `ApiErrorCode`):

| Код | HTTP | Значення для UI |
|---|---|---|
| `DEMO_SESSION_EXPIRED` | 401 | тенант видалено/протермінований → модалка «Demo ended» |
| `DEMO_READ_ONLY` | 403 | «This action is disabled in the demo.» (toast) |
| `DEMO_LIMIT_REACHED` | 409 | «Demo limit reached: {details.limit} (max {details.max}).» |
| `DEMO_CAPACITY_REACHED` | 503 | «The demo is busy right now. Please try again in a few minutes.» + кнопка retry з відліком `details.retryAfterSeconds` |
| `TOO_MANY_REQUESTS` | 429 | існуюча обробка з `Retry-After` |

Важливо для клієнта: при 401 з `code === 'DEMO_SESSION_EXPIRED'` **не пробувати refresh** (refresh теж поверне цей код); одразу `expireDemoSession()`. Зміна в `client.ts`: у `request()` перед `canRefresh` перевір код 401-відповіді (клонуй response), інакше зациклення на провалі refresh. Також у `requestTokenRefresh`, якщо 401-відповідь містить `DEMO_SESSION_EXPIRED`, викликай демо-подію замість «звичайного» `expireSession`.

## 6. Реалізація

### 6.1 Структура файлів

```
src/features/demo/
  config.ts                 isDemoMode, prod url
  api.ts                    getDemoInfo, createDemoSession, getDemoMe, switchDemoRole, resetDemo, endDemo
  types.ts                  DemoSessionResponse, DemoInfo, DemoMe
  hooks/
    useDemoSession.ts       мутації створення/switch/reset + finish (saveAuthTokens, чистка кешів, навігація)
    useDemoStatus.ts        isDemoUser (з useUser().demo), expiresAt, секунди до кінця
    useDemoExpiry.ts        слухає DEMO_EXPIRED_EVENT
  components/
    DemoBanner/             смуга зверху
    DemoBadge/              маленька мітка DEMO
    DemoMenu/               switch role / reset / exit
    DemoRoleCards/          дві картки вибору ролі
    DemoExpiredModal/       «Your demo has ended»
    DemoHint/               інлайн-підказка/тултип «disabled in demo»
    DemoGuide/              «Things to try» (панель)
  pages/
    DemoLanding.tsx         сторінка /demo
  model/
    demoEvents.ts           DEMO_EXPIRED_EVENT, dispatchDemoExpired
    demoCopy.ts             усі тексти в одному місці
  index.ts                  публічні експорти
```

### 6.2 Маршрути

У `router.tsx` (лише якщо `isDemoMode`): `{ path: '/demo', element: <DemoLanding /> }`. У демо-режимі:

- `/` (Home) лишається повноцінною (каталог видно анонімно); на Home зверху hero-блок CTA «Try B2bar as a Buyer / Seller» (компонент `DemoRoleCards compact`), якщо користувач не авторизований.
- `/login`: замінити форму на `DemoRoleCards` + текст «Accounts are created automatically in the demo. No password needed.» (Окремої форми логіну в демо немає; рекомендація: у `Login.tsx` `if (isDemoMode) return <DemoLoginPage />`.)
- `/register`, `/forgot-password`, `/reset-password`, `/verify-email`: у демо редірект на `/demo` (`<Navigate to="/demo" replace />`).
- `/admin`: ProtectedRoute і так не пустить BUYER/SELLER; додатково в демо при `AccessDenied` показати текст «The admin panel is not part of the demo.»

### 6.3 Сторінка `/demo` (`DemoLanding`)

Вміст:
1. Заголовок «Explore B2bar with a ready-made demo account», підзаголовок: що це за платформа (1-2 речення).
2. Дві великі картки (`DemoRoleCards`):
   - **Buyer** «A bar or restaurant ordering from several suppliers»: що побачиш: каталог, кошик, checkout у кількох постачальників, замовлення, документи.
   - **Seller** «A supplier managing products and orders»: товари, замовлення з життєвим циклом, документи, фінанси, аналітика.
   Кнопка «Explore as Buyer/Seller». Під ними дрібно: «Your sandbox is private to you, resets on demand and is deleted after {ttl} hours.» (ttl з `/demo/info`, fallback 24).
3. Блок чесності: «This is a portfolio demo. Companies, products and people are fictional. No real orders, payments or emails are made.»
4. Посилання «Back to catalog».
5. Якщо користувач уже в демо-сесії: замість карток кнопки «Continue to my account» та «Start fresh».

Стани кнопки: idle → loading (spinner, текст «Preparing your sandbox…», довгий таймаут: якщо > 8 с, підпис «Waking up the demo server, this can take up to a minute…») → success (навігація) / error (toast + inline повідомлення за кодом з 5). Подвійний клік блокується.

### 6.4 Створення сесії (`useDemoSession`)

`finishDemoSession(response)`:
1. `saveAuthTokens({ token, refreshToken, user })` (як `useLoginHandler.finishLogin`).
2. `queryClient.clear()`, потім `invalidateQueries(['user'])`.
3. `dispatch(clearCart()); dispatch(clearFavorites())` перед синхронізацією; **не** викликати `syncLocalUserData` зі старим гостьовим кошиком, якщо це reset/switch (щоб чужі гостьові позиції не змішувались); для першого входу з анонімної сесії виклич `syncLocalUserData` як у логіні (гостьовий кошик переноситься, це нормально).
4. Скинути прапорець онбординг-туру для нового userId не потрібно (userId новий), але у демо тур має запускатись автоматично; перевір `useAccountTour`.
5. Зберегти `demo.expiresAt`/`tenantId` не окремо: джерело істини `GET /user/me` (`demo`, `demoExpiresAt`) і `GET /demo/me`. Допускається `sessionStorage` для швидкого рендеру банера (try/catch).
6. Навігація: `state.from` або `/account` (для продавця вкладка `orders` за замовчуванням, для покупця `orders`: `/account?tab=orders`).

**switch-role:** `POST /demo/switch-role` → `finishDemoSession` → навігація на `/account?tab=orders`. Стан Redux кошика/вішліста чиститься (інший користувач).

**reset:** модалка підтвердження («All changes you made will be lost and a fresh sandbox will be created.») → `POST /demo/reset { role: поточна }` → `finishDemoSession` → тост «Demo data reset».

**exit:** `clearAuthTokens()`, чистка Redux/Query, **без** `localStorage.clear()` (див. 6.9), навігація `/demo`. Якщо бекенд підтримує `DELETE /demo/session`, викликай його best-effort (ігноруй помилку).

### 6.5 Банер і мітка DEMO

- `DemoBanner` у `Layout` над `Header` (завжди в демо-режимі, і для аноніма, і для авторизованого). Кольорова смуга (контрастна, не червона): «DEMO ENVIRONMENT · Fictional data · No real orders, payments or emails».
- Для демо-користувача додатково: «You are exploring as {Seller|Buyer}» + таймер «Sandbox deleted in 23h 12m» (оновлення раз на хвилину; при < 10 хв підсвітка) + `DemoMenu` (кнопки: **Switch to {Buyer|Seller} view**, **Reset my demo**, **Exit demo**) + посилання «Things to try».
- Банер адаптивний: на вузьких екранах згортається в один рядок «DEMO · {time left} · Menu». Не має ламати mobile-хедер (в репо відомі проблеми overflow на мобільному хедері/футері: перевір на 360 px).
- `DemoBadge` «DEMO» поруч із логотипом у `Header` і в `<title>` (`useEffect`: `document.title = '[DEMO] ' + title` один раз при завантаженні).
- Футер у демо: рядок «Portfolio demo. Not a real marketplace.» + посилання на прод-сайт/LinkedIn (`prodSiteUrl`).

### 6.6 Закінчення сесії

`DEMO_EXPIRED_EVENT` диспатчиться: (а) клієнтом при 401 `DEMO_SESSION_EXPIRED` (див. розділ 5), (б) таймером, коли `expiresAt` минув (перевірка кожну хвилину, без агресивних запитів).

`useDemoExpiry` (у `Layout`) слухає подію: `clearAuthTokens()` (без `localStorage.clear()`), чистить Redux/Query, **не** показує звичайний тост «session expired» і не веде на `/login` (у демо `useAuthSessionWatcher` має ігнорувати цей випадок: якщо `isDemoMode`, делегує `useDemoExpiry`). Показує `DemoExpiredModal`: «Your demo has ended. Sandboxes are deleted after {ttl} hours. Start a new one in one click.» Кнопки: «Explore as Buyer», «Explore as Seller» (створюють нову сесію), «Back to catalog». Модалка не закривається кліком поза нею, поки користувач не вибрав дію (крім «Back to catalog»).

Попереджувальний тост за 5 хвилин до кінця: «Your demo sandbox ends in 5 minutes.» (один раз за сесію).

### 6.7 Приховування/заміна недоступних у демо дій

Бекенд відповість `403 DEMO_READ_ONLY`, але UI має не доводити до помилки. У `isDemoMode` / для `user.demo`:

| Місце | Дія |
|---|---|
| Header | немає кнопок Register/Login; для анонімів кнопка «Try demo» → `/demo` |
| `ChangePassword` (профіль) | ховати блок або показувати `DemoHint` «Password changes are disabled in the demo.» |
| Поле email у профілі | readonly + підказка |
| Видалення акаунта (якщо є) | сховати |
| Завантаження ліцензії/лого | дозволено (бекенд має ліміти), показати підказку про 2 МБ із `/demo/info.limits`; помилки `PAYLOAD_TOO_LARGE`/`DEMO_LIMIT_REACHED` обробити існуючим механізмом + нові тексти |
| Вкладка `messages` (обидві ролі) | заглушка «coming soon»: у демо сховати вкладку (див. `ROLE_TABS` у `accountTabs.ts`; фільтрувати за `isDemoMode`) |
| Вхід адміна | не показувати |
| Створення товару/замовлення при `DEMO_LIMIT_REACHED` | показати повідомлення з `details` |
| Верифікація компанії | у демо компанія `VERIFIED`, UI не змінюємо; перевір, що онбординг/модалки верифікації не з'являються |

Загальний обробник: у глобальному обробнику помилок (де зараз `extractErrorMessage` показує тости) для `DEMO_READ_ONLY` показувати єдиний текст. Не додавай `if (isDemoMode)` у десятки компонентів: зроби `useIsDemoUser()` і застосовуй лише у перелічених місцях.

### 6.8 Підказки «Things to try»

`DemoGuide`: плаваюча кнопка «Things to try» (або панель у `DemoMenu`), що відкриває короткий чекліст залежно від ролі (тексти в `demoCopy.ts`, прапорці виконання не відстежувати, просто список):

**Seller:** 1) відкрий Orders і прийми нове замовлення, відвантаж з трек-номером; 2) згенеруй Invoice і Delivery Note, завантаж PDF; 3) Finances: баланс, транзакції, запит виплати; 4) Analytics: графік за рік; 5) My Products: створи товар з оптовими цінами (піде на review і автоматично схвалиться); 6) перемкнись на Buyer view.
**Buyer:** 1) додай товари від двох постачальників у кошик; 2) checkout з різними способами оплати; 3) демо-оплата картки; 4) My Orders: статуси та документи, експорт XLSX; 5) перемкнись на Seller view і подивись те саме замовлення з боку продавця.

Існуючий онбординг-тур (`driver.js`) лишається; у демо запускається один раз для нового userId. Переконайся, що тур не конфліктує з банером (offset зверху).

### 6.9 Сумісність з існуючим кодом (баги, які треба врахувати)

1. `useLogOutHandler` робить `localStorage.clear()`: у демо це зніме також прапорці туру/підказок. Для демо-виходу використовуй окремий `exitDemo()` без `localStorage.clear()`; прод-логаут не чіпай.
2. `useAuthSessionWatcher` у демо не повинен вести на `/login` при `DEMO_SESSION_EXPIRED` (див. 6.6). Для інших 401 (невалідний токен) у демо вести на `/demo`, а не `/login`.
3. Хедер вважає користувача авторизованим за наявністю `token`; після `DEMO_SESSION_EXPIRED` токени мають бути очищені до показу модалки, щоб не було «зомбі»-стану.
4. Гостьові кошик/вішліст у Redux/localStorage: при switch/reset чистити (інакше позиції з попереднього тенанта потраплять у чужий).
5. `ProtectedRoute` залежить від `useUser`; після `saveAuthTokens` обов'язково `invalidateQueries(['user'])`, інакше зловить старого користувача.
6. `MockPayment` (існуюча демо-оплата) лишається; у `demoCopy` називай режим «demo environment/sandbox», а оплату «demo payment», щоб не плутати.

### 6.10 SEO/метадані (лише демо)

- У демо-збірці додай `<meta name="robots" content="noindex, nofollow">` (динамічно при `isDemoMode` у `main.tsx` або через Vite `transformIndexHtml` плагін за `process.env.VITE_DEMO_MODE`).
- Додай `public/robots.txt` для демо: `User-agent: *\nDisallow: /` (через build-крок або умовний плагін; у прод robots не чіпати).
- `document.title` з префіксом `[DEMO]`.
- Open Graph не потрібен.

### 6.11 Деплой на Vercel

Другий Vercel-проєкт з того ж репо та гілки `master`: змінні з розділу 4, домен `demo.b2bar.tech`. `vercel.json` без змін (SPA rewrite). Прод-проєкт не чіпати. (Налаштування DNS/доменів робить Nazarii; в README додай секцію «Demo deployment» зі змінними.)

## 7. UX-деталі й тексти

Усі рядки в `model/demoCopy.ts`. Тон: короткий, чесний, англійською. Не використовувати слова «free trial», «signup». Кнопки: «Explore as Buyer», «Explore as Seller», «Switch to Seller view», «Reset my demo», «Exit demo», «Things to try». Доступність: банер `role="status"`, модалки з фокус-трапом (використай існуючий `ConfirmModal`, якщо підходить), кнопки з `aria-busy` під час завантаження, контраст AA.

## 8. Порядок робіт

1. Конфіг `isDemoMode`, типи env, `.env.example`, структура `features/demo`, `demoCopy`.
2. API-шар, типи, нові `ApiErrorCode`, обробка в `client.ts` (`DEMO_SESSION_EXPIRED` без refresh) + unit-тест.
3. `useDemoSession` (create/switch/reset/exit) + `finishDemoSession`.
4. `DemoRoleCards`, `DemoLanding`, маршрут `/demo`, заміна `/login` і редіректи `/register` тощо.
5. `DemoBanner`, `DemoBadge`, `DemoMenu`, таймер; підключення в `Layout`/`Header`/`Footer`; мобільна адаптація.
6. `DemoExpiredModal` + `useDemoExpiry`, правка `useAuthSessionWatcher`.
7. Приховування недоступних дій (6.7), фільтр вкладки `messages`.
8. `DemoGuide`.
9. noindex/robots/title, README, `.env.example`.
10. Тести, перевірка прод-збірки, ручний smoke (розділ 10).

## 9. Розробка без готового бекенда

Додай `VITE_DEMO_MOCK=true` (лише для `import.meta.env.DEV`): `src/features/demo/mock.ts` підміняє `api.ts` фабрикою відповідей (`DemoSessionResponse` з фейковими токенами) за зразком існуючого `/dev/auth` (`pages/DevAuthPreview.tsx`, request-функції в хуках підміняються параметром). Це лише для локальної перевірки UI-станів (idle/loading/slow/error/expired); у прод/демо-збірках мок вирізається (`import.meta.env.DEV`).

Контрактний тест: перевіряй типи `DemoSessionResponse` проти прикладу з розділу 5 (проста fixture-перевірка Zod-схемою; Zod вже в проєкті).

## 10. Тестування

**Unit (vitest, поряд із наявними тестами):**
- `isDemoMode` вимкнено: `DemoBanner`/кнопки не рендеряться (можна тестувати чисті функції/хелпери без DOM, якщо в проєкті немає testing-library; не додавай важких залежностей без потреби, достатньо jsdom + react-dom/test-utils або перевірки логіки в хуках/утилітах).
- Обробка помилок: `DEMO_SESSION_EXPIRED` → подія, без запиту refresh (мок `fetch`); `DEMO_READ_ONLY`, `DEMO_LIMIT_REACHED`, `DEMO_CAPACITY_REACHED` дають правильні тексти.
- `finishDemoSession`: викликає `saveAuthTokens`, чистить кеш, не викликає `localStorage.clear()`.
- Форматування таймера (23h 12m, < 10 хв, 0).
- Zod-валідація фікстури `DemoSessionResponse`.

**Перевірки CI:** `npm run lint`, `npm run test:unit`, `npm run build` зелені в обох режимах: `npm run build` і `VITE_DEMO_MODE=true npm run build`.

**Прод-регресія:** у прод-збірці `dist/` не містить рядків `Explore as`, `DEMO ENVIRONMENT`, `/demo`-чанка (`grep -r "DEMO ENVIRONMENT" dist` порожньо).

**Ручний smoke (на демо або з моком):**
1. Анонім: видно банер, каталог, CTA, `/demo`.
2. Explore as Seller: кабінет з даними; swich → Buyer; reset; exit.
3. Slow-режим (мок 15 с): текст «Waking up the demo server…».
4. Примусове закінчення (мок/ручне видалення токена): модалка, нова сесія в один клік.
5. Ширина 360 px: банер і хедер без горизонтального скролу.
6. Заборонені дії: немає форми пароля/реєстрації; прямий перехід на `/register` веде на `/demo`.
7. Другий браузер: окремі дані.

## 11. Критерії приймання

1. `VITE_DEMO_MODE` не задано: сайт поводиться як раніше, демо-коду в бандлі немає.
2. `VITE_DEMO_MODE=true`: банер видно всюди, `/demo` працює, кнопки ролей створюють сесію й ведуть у кабінет.
3. Є switch role, reset (з підтвердженням), exit; кошик/вішліст не «протікають» між сесіями.
4. Таймер і попередження, модалка закінчення працюють; немає редіректу на `/login` у демо.
5. Реєстрація, логін формою, відновлення пароля, зміна пароля недоступні й не показуються.
6. Усі нові коди помилок мають зрозумілі повідомлення.
7. Вкладки Messages приховані в демо.
8. Мобільна версія (360 px) без overflow через банер.
9. `noindex`, `[DEMO]` у title, `robots.txt` у демо-збірці.
10. lint, unit, build зелені в обох режимах; README описує деплой демо.

## 12. Ризики

| Ризик | Захід |
|---|---|
| Демо-код потрапляє в прод-бандл | умовні lazy-імпорти за `isDemoMode`, перевірка `grep` по `dist` |
| Цикл refresh при `DEMO_SESSION_EXPIRED` | спеціальна обробка в `client.ts` (розділ 5) і unit-тест |
| Старі дані попередньої сесії в Redux/Query | повна чистка при switch/reset/exit/expire |
| Холодний старт демо-бекенда (Render) | довгий таймаут, текст «Waking up…», retry |
| Мобільний banner ламає хедер | тест на 360 px, згортання банера |
| `localStorage.clear()` у прод-логауті | не чіпати прод-логаут; у демо окремий `exitDemo` |
| Відвідувач плутає демо з реальним сервісом | банер, мітка, футер, `[DEMO]` у title, noindex |
| Бекенд-контракт зміниться | усі типи й коди в одному місці (`features/demo/types.ts`), зміни тільки там |
