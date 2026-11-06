# Промпт для запуску (скопіюй у Claude Code у репо `frontend`)

```
Прочитай /шлях/до/demo-frontend-spec-v1.1.md повністю (поклади файл у репо, наприклад docs/planning/). Реалізуй демо-режим фронтенду за ним, у порядку з розділу 8, на гілці feat/demo-mode від master. Правила: прод-збірка (без VITE_DEMO_MODE) не змінює поведінку і не містить демо-коду; демо лише під isDemoMode; блок «Що змінилось відносно v1.0» і розділи 5.2-5.3 обов'язкові; не вигадуй контракт, за розбіжності з бекендом (docs/9-demo-mode.md) зупинись і запитай. Перед PR: npm run lint, npm run test:unit, npm run build і VITE_DEMO_MODE=true npm run build зелені, grep по dist прод-збірки на "DEMO ENVIRONMENT" і "Explore as" порожній, ручний smoke із розділу 10. У PR опиши зміни, розбіжності й що не перевірено на живому бекенді.
```

---

# Специфікація для фронтенд-агента: демо-режим B2bar

Версія 1.1, 2026-11-06 (v1.0 від 2026-11-05 звірена з реалізованим бекендом, PR Lavka-Team/backend#18). Репозиторій: `LavkaTeam/frontend` (React 19, Vite, TypeScript, React Router 7, TanStack Query 5, Redux Toolkit, React Hook Form, Zod, CSS Modules, vitest). Документ самодостатній. Бекенд уже реалізований (PR Lavka-Team/backend#18, `docs/9-demo-mode.md`); контракт у розділі 5 звірений з ним. Якщо під час роботи знайдеш розбіжність із реальним бекендом, не вигадуй: зафіксуй у `features/demo/types.ts`, у фінальному звіті й іди за поведінкою бекенда.

> Мова UI: англійська (як весь сайт). Мова коду/комітів: англійська. Дотримуйся конвенцій репо: `@/` alias, `features/<name>`, CSS Modules, `useToast`, компоненти з `components/ui`.


> ## Що змінилось відносно v1.0 (має пріоритет над текстом нижче)
>
> v1.0 писалась до бекенда. Нижче те, що з'ясувалось після звірки з `docs/9-demo-mode.md` (PR #18) і з кодом фронтенду. Усі ці пункти вже внесені в текст розділів.
>
> **Нове, найважливіше (5.2 і 5.3 нижче):**
> 1. Токени мертвіють миттєво при reset, switch-role і DELETE session. Запити «в польоті» отримають 401, і наївний клієнт покаже модалку «Demo ended» або «session expired» під час звичайного перемикання ролі. Обов'язковий прапорець «перехід» (5.3).
> 2. Публічний `POST /demo/session` із простроченим токеном у `Authorization` може отримати 401 `DEMO_SESSION_EXPIRED` (фільтр перевіряє пісочницю токена; у документації бекенда це не описано, тому ПЕРЕВІР і не покладайся). Перед створенням нової сесії очищай токени.
> 3. `/demo/session` і `/demo/reset` ділять ліміт по IP (5 за 10 хв, 30 за добу). Подвійний клік або автоповтор POST спалює ліміт; «Reset» і «Start fresh» теж його витрачають. Ніколи не повторюй їх автоматично.
> 4. `DEMO_CAPACITY_REACHED` має два значення (стеля 600 с і «ще стартує» 30 с); `DEMO_LIMIT_REACHED.details.limit` має п'ять значень, одне з них у байтах.
> 5. TTL і ліміти змінні (власник може поставити 6 год на Atlas M0): брати з `/demo/info`.
> 6. Симулятор на бекенді рухає дані: товар на review → схвалюється за ~10 с, виплата ~1 хв, замовлення у спільних постачальників NEW→PROCESSING 2 хв → SHIPPED 5 хв (трек `DEMO-XXXX`) → DELIVERED 10 хв. Списки замовлень/товарів/виплат не оновлюються самі: підказки в «Things to try» мають це казати.
> 7. Щоб побачити замовлення покупця очима продавця пісочниці, треба замовляти у парного постачальника, а не у спільних (виправлено в 6.8).
>
> **Виправлення щодо репо (v1.0 помилялась або мовчала):**
> - Демо-акаунти завжди `VERIFIED`, а онбординг-тур стартує лише для `NOT_VERIFIED`: у демо тур сам не запуститься без правки `useAccountTour` (6.4 п.4).
> - Поле email уже `readOnly`, його не чіпати (6.7).
> - `ConfirmModal` не підходить для модалки закінчення: закривається кліком по фону і має лише дві кнопки. Робити власну з фокус-трапом, а `ConfirmModal` лишити для підтвердження reset.
> - Кнопка Logout у Header: у демо = Exit demo.
> - `DELETE /demo/session` існує, але викликати його треба ДО очищення токенів.
> - Мобільний overflow хедера вже є в репо до демо: критерій приймання виправлено на «банер не погіршує».
> - Компонент `Button` за замовчуванням `width: 100%`: у картках ролей перевизначай, інакше текст стискається.
> - vitest без jsdom: тести `client.ts` через `vi.stubGlobal` (10).
>
> **Перевір вручну (бекенд-док мовчить, ризики):**
> - Чи не ламають `<img>` на SVG-плейсхолдери з `DEMO_ASSET_BASE_URL` (`/demo-assets/products/<subcategory>.svg`) і завантажені лого/ліцензії з `/demo-assets/uploads/{key}`: пошукай у фронтенді код, що припускає Cloudinary (трансформації в URL, список дозволених доменів) і чи кнопка «View» ліцензії не чекає signed URL.
> - Чи не помиляється `Header`/`Account` на `GET /user/me` без `demo`: перевір, що поле `demo` приходить саме в `/user/me`, а не лише у відповіді сесії.
> - Пошук тексту й підказки потребують Atlas Search індекс на демо-БД; без нього помилка пошуку має показуватись м'яко (це перевірка деплою, коду не треба).

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

## 5. Контракт API (реалізований бекендом, PR #18; звірено)

### 5.1 Таблиця

Усі шляхи відносно `apiUrl`. Помилки в існуючому форматі `{ error, code, details }`.

| Метод | Шлях | Auth | Призначення |
|---|---|---|---|
| GET | `/demo/info` | ні | `{ enabled, tenantTtlHours, limits:{maxProducts,maxOrdersCreated,maxUploads,maxUploadBytes}, adminEnabled, seedVersion }` |
| POST | `/demo/session` | ні | тіло `{ role: 'BUYER'|'SELLER' }` → `201 DemoSessionResponse`. Role `ADMIN`/відсутня → `400 BAD_REQUEST`. Ліміт по IP (див. 5.2) |
| GET | `/demo/me` | так (лише демо-користувач; інакше `403 FORBIDDEN`: не викликати, якщо `!user.demo`) | `{ tenantId, role, createdAt, expiresAt, pairedUser:{id,role,companyName}, usage:{productsCreated,ordersCreated,uploadsCount} }` |
| POST | `/demo/switch-role` | так | → `200 DemoSessionResponse` для парного користувача |
| POST | `/demo/reset` | так | тіло (опц.) `{ role }` (за замовчуванням поточна) → `201 DemoSessionResponse`. Ділить ліміт по IP із `/demo/session` |
| DELETE | `/demo/session` | так | `204`, існує (не P1). Токени одразу перестають працювати |

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
| `DEMO_READ_ONLY` | 403 | «This action is disabled in the demo.» (toast). `details.action` називає дію (register, password…); також приходить за спробу змінити спільні (shared) дані, напр. прямий перехід на чужий товар |
| `DEMO_LIMIT_REACHED` | 409 | `details: { limit, max }`, де `limit` ∈ `products`, `orders`, `uploads`, `upload size in bytes`, `cart items`. Текст: «Demo limit reached: {limit} (max {max}).»; для `upload size in bytes` показувати «max {max/1048576} MB» |
| `DEMO_CAPACITY_REACHED` | 503 | Два випадки: стеля пісочниць (`retryAfterSeconds: 600`) і демо ще стартує (`retryAfterSeconds: 30`, перший запуск будує спільний світ). Текст «The demo is busy right now. Please try again in a few minutes.»; для ≤ 60 с можна «The demo is starting up…». Кнопка retry з відліком `details.retryAfterSeconds` |
| `TOO_MANY_REQUESTS` | 429 | На `/demo/session` і `/demo/reset` (разом: 5 за 10 хв і 30 за добу з одного IP). `Retry-After` + `details.retryAfterSeconds`; існуюча обробка `getRetryAfterSeconds` підходить |
| `DEMO_SESSION_EXPIRED` | 401 | Токен належить пісочниці, що протермінована, скинута reset-ом або завершена. Приходить і на `/auth/refresh` |

Важливо для клієнта: при 401 з `code === 'DEMO_SESSION_EXPIRED'` **не пробувати refresh** (refresh теж поверне цей код); одразу `expireDemoSession()`, але **не під час власного переходу** (switch/reset/exit), див. 5.3. Зміна в `client.ts`: у `request()` перед `canRefresh` перевір код 401-відповіді (клонуй response), інакше зациклення на провалі refresh. Також у `requestTokenRefresh`, якщо 401-відповідь містить `DEMO_SESSION_EXPIRED`, викликай демо-подію замість «звичайного» `expireSession`.

### 5.2 Ліміти, холодний старт, повтори

- `POST /demo/session` і `/demo/reset` не повторювати автоматично (React Query: `retry: false` для цих мутацій), блокувати повторний клік, поки йде запит.
- Холодний старт (Render free) 30-60 с: `fetch` без таймауту, UI показує «Waking up…» після 8 с (6.3). Перша відповідь може бути `503 DEMO_CAPACITY_REACHED` із `retryAfterSeconds: 30`, поки будується спільний світ.
- Створення пісочниці на бекенді ~50 мс, тож повільність це лише холодний старт, а не створення.
- Прострочення за TTL: бекенд відповідає 401 одразу, хоч стан «живий/мертвий» кешується до 30 с, тому клієнтський таймер (`expiresAt`) і 401 можуть розійтись на секунди; обидва шляхи ведуть в одну й ту саму подію (6.6).

### 5.3 Перехід між пісочницями (switch/reset/exit)

Старі токени перестають працювати вже в момент відповіді (`switch-role` піднімає `tokenVersion` користувача, `reset`/`DELETE` видаляють пісочницю). Запити, що ще летять зі старим токеном, отримають 401 (`INVALID_TOKEN` або `DEMO_SESSION_EXPIRED`) і через спробу refresh дійдуть до `expireSession()`/`expireDemoSession()`.

Вимога: у `client.ts` (або в `finishDemoSession`) модульний прапорець `demoTransition`. Поки він піднятий:
1. `queryClient.cancelQueries()` на початку переходу;
2. 401 від запитів зі старим токеном ігноруються (без refresh, без події `demo:expired`, без `auth:logout`);
3. нові токени зберігаються (`saveAuthTokens`) ДО будь-якого refetch, потім `queryClient.clear()` і `invalidateQueries(['user'])`;
4. прапорець знімається після цього.
Покрий це unit-тестом: 401 `DEMO_SESSION_EXPIRED` під час `demoTransition` не викликає `demo:expired`.

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
   Кнопка «Explore as Buyer/Seller». Під ними дрібно: «Your sandbox is private to you, resets on demand and is deleted after {ttl} hours.» (ttl = `/demo/info.tenantTtlHours`; не хардкодь 24: на Atlas M0 власник може поставити 6). Ліміти (`limits.*`) теж брати з `/demo/info`, не хардкодити.
3. Блок чесності: «This is a portfolio demo. Companies, products and people are fictional. No real orders, payments or emails are made.»
4. Посилання «Back to catalog».
5. Якщо користувач уже в демо-сесії: замість карток кнопки «Continue to my account» та «Start fresh».

Стани кнопки: idle → loading (spinner, текст «Preparing your sandbox…», довгий таймаут: якщо > 8 с, підпис «Waking up the demo server, this can take up to a minute…») → success (навігація) / error (toast + inline повідомлення за кодом з 5). Подвійний клік блокується.

### 6.4 Створення сесії (`useDemoSession`)

`finishDemoSession(response)`:
1. `saveAuthTokens({ token, refreshToken, user })` (як `useLoginHandler.finishLogin`).
2. `queryClient.clear()`, потім `invalidateQueries(['user'])`.
3. `dispatch(clearCart()); dispatch(clearFavorites())` перед синхронізацією; **не** викликати `syncLocalUserData` зі старим гостьовим кошиком, якщо це reset/switch (щоб чужі гостьові позиції не змішувались); для першого входу з анонімної сесії виклич `syncLocalUserData` як у логіні (гостьовий кошик переноситься, це нормально).
4. Онбординг-тур: `useAccountTour` запускає тур лише для `verificationStatus === 'NOT_VERIFIED'`, а демо-компанії завжди `VERIFIED`, тому **сам тур не стартує**. Потрібна правка: у демо запускати тур для `user.demo` (прапорець `done` за userId уже працює; нова пісочниця = новий userId).
5. Зберегти `demo.expiresAt`/`tenantId` не окремо: джерело істини `GET /user/me` (`demo`, `demoExpiresAt`) і `GET /demo/me`. Допускається `sessionStorage` для швидкого рендеру банера (try/catch).
6. Навігація: `state.from` або `/account` (для продавця вкладка `orders` за замовчуванням, для покупця `orders`: `/account?tab=orders`).

**switch-role:** `POST /demo/switch-role` → `finishDemoSession` → навігація на `/account?tab=orders`. Стан Redux кошика/вішліста чиститься (інший користувач).

**reset:** модалка підтвердження («All changes you made will be lost and a fresh sandbox will be created.») → `POST /demo/reset { role: поточна }` → `finishDemoSession` → тост «Demo data reset».

**exit:** спочатку `DELETE /demo/session` (потрібен токен, тому ДО `clearAuthTokens()`; best-effort, помилку ігноруй і її 401 не має показувати модалку «Demo ended»), потім `clearAuthTokens()`, чистка Redux/Query, **без** `localStorage.clear()` (див. 6.9), навігація `/demo`. Кнопка Logout у Header у демо = Exit demo (у `Header.tsx` це `div onClick={useLogOutHandler}`).

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
| `ChangePassword` (профіль) | рядок «Password» з «Edit password» рендерить `PersonalDetailsSection`, модалку `AccountProfileForm`; сховати «Edit password», показати `DemoHint`. Бекенд відповідає `403 DEMO_READ_ONLY` на `PUT /user/me/password` |
| Поле email у профілі | уже `readOnly: true` у `profileForm.constants.ts`; нічого міняти не треба, максимум підказка |
| Видалення акаунта (якщо є) | сховати |
| Завантаження ліцензії/лого | дозволено (бекенд має ліміти), показати підказку про 2 МБ із `/demo/info.limits`; помилки `PAYLOAD_TOO_LARGE`/`DEMO_LIMIT_REACHED` обробити існуючим механізмом + нові тексти |
| Вкладка `messages` (обидві ролі) | заглушка «coming soon»: у демо сховати вкладку (`ROLE_TABS` у `accountTabs.ts`; фільтр за `isDemoMode` у `AccountShell`, єдине місце, що читає `ROLE_TABS`) |
| Вхід адміна | не показувати |
| Створення товару/замовлення при `DEMO_LIMIT_REACHED` | показати повідомлення з `details` |
| Верифікація компанії | у демо компанія `VERIFIED`, UI не змінюємо; перевір, що онбординг/модалки верифікації не з'являються |

Загальний обробник: у глобальному обробнику помилок (де зараз `extractErrorMessage` показує тости) для `DEMO_READ_ONLY` показувати єдиний текст. Додавай мапінг демо-кодів в існуючий `extractErrorMessage` (`src/utils/error.ts`, там уже є єдине місце для текстів кодів), а не в окремі компоненти. Не додавай `if (isDemoMode)` у десятки компонентів: зроби `useIsDemoUser()` і застосовуй лише у перелічених місцях.

### 6.8 Підказки «Things to try»

`DemoGuide`: плаваюча кнопка «Things to try» (або панель у `DemoMenu`), що відкриває короткий чекліст залежно від ролі (тексти в `demoCopy.ts`, прапорці виконання не відстежувати, просто список):

**Seller:** 1) відкрий Orders і прийми нове замовлення, відвантаж з трек-номером; 2) згенеруй Invoice і Delivery Note, завантаж PDF (перше завантаження PDF рендериться на льоту, може тривати секунди); 3) Finances: баланс, транзакції, запит виплати (схвалюється автоматично приблизно за 1 хвилину); 4) Analytics: графік за рік; 5) My Products: відредагуй товар або створи новий з оптовими цінами (піде на review і автоматично схвалиться приблизно за 10 секунд); 6) перемкнись на Buyer view.
**Buyer:** 1) додай товари від двох постачальників у кошик; 2) checkout з різними способами оплати; 3) демо-оплата картки (є непроплачений пакет із 3 замовлень, його можна оплатити); 4) My Orders: статуси та документи, експорт XLSX; замовлення в «спільних» постачальників самі просуваються статусами приблизно за 10 хвилин; 5) щоб побачити замовлення очима продавця, замов товар у **свого парного постачальника** (його назва в `GET /demo/me` → `pairedUser.companyName`), потім перемкнись на Seller view. Замовлення в спільних постачальників продавець пісочниці не побачить.

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

Другий Vercel-проєкт з того ж репо та гілки `master`: змінні з розділу 4, домен `demo.b2bar.tech`. На бекенді `DEMO_ALLOWED_ORIGINS` має містити `https://demo.b2bar.tech`, інакше CORS заблокує всі запити. `vercel.json` без змін (SPA rewrite). Прод-проєкт не чіпати. (Налаштування DNS/доменів робить Nazarii; в README додай секцію «Demo deployment» зі змінними.)

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

## 9. Розробка без доступного бекенда (мок лише для DEV)

Додай `VITE_DEMO_MOCK=true` (лише для `import.meta.env.DEV`): `src/features/demo/mock.ts` підміняє `api.ts` фабрикою відповідей (`DemoSessionResponse` з фейковими токенами) за зразком існуючого `/dev/auth` (`pages/DevAuthPreview.tsx`, request-функції в хуках підміняються параметром). Це лише для локальної перевірки UI-станів (idle/loading/slow/error/expired); у прод/демо-збірках мок вирізається (`import.meta.env.DEV`).

Контрактний тест: перевіряй типи `DemoSessionResponse` проти прикладу з розділу 5 (проста fixture-перевірка Zod-схемою; Zod вже в проєкті).

## 10. Тестування

**Unit (vitest, поряд із наявними тестами):**
- `isDemoMode` вимкнено: `DemoBanner`/кнопки не рендеряться (можна тестувати чисті функції/хелпери без DOM, якщо в проєкті немає testing-library; не додавай важких залежностей без потреби, достатньо jsdom + react-dom/test-utils або перевірки логіки в хуках/утилітах).
- Обробка помилок: `DEMO_SESSION_EXPIRED` → подія, без запиту refresh (мок `fetch`); також коли його повертає `/auth/refresh`; і **не** подія під час switch/reset/exit; `DEMO_READ_ONLY`, `DEMO_LIMIT_REACHED` (у т.ч. `upload size in bytes`), `DEMO_CAPACITY_REACHED` (600 і 30 с) дають правильні тексти.
- Тестове середовище: vitest у проєкті працює в `node` (без jsdom і testing-library), `window`/`localStorage`/`fetch` у тестах `client.ts` треба підміняти через `vi.stubGlobal`; не додавай jsdom/testing-library заради цього, тестуй чисту логіку.
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
5. Ширина 360 px: банер не додає горизонтального скролу. Увага: у репо вже є overflow мобільного хедера (відомий дефект, `scrollWidth` ≈ 1100 на 360 px і без демо); порівнюй із базовою лінією без демо, не виправляй хедер у цьому завданні.
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
8. Мобільна версія (360 px): банер не збільшує overflow порівняно з базовою лінією.
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
