Окей тепер дай детальну специфікацію для фронтенду як оперувати цими документами. Тобто після створення замовлення, потім для створення
наступних документів і так дальше. Повністю все детально

• Нижче повна frontend-специфікація по роботі з документами в поточній backend-реалізації.

Загальна модель
Документи живуть всередині order flow. Для фронтенду це означає:

- документи прив’язані до конкретного order
- список документів доступний окремим endpoint’ом
- також документи тепер приходять всередині OrderResponse
- скачування йде тільки через backend endpoint
- PURCHASE_ORDER генерується автоматично
- DELIVERY_NOTE генерується автоматично після trackingNumber або SHIPPED
- INVOICE і PROFORMA_INVOICE поки не активні

Document DTO
Фронтенд працює з таким shape:

{
"id": "string",
"orderId": "string",
"type": "PURCHASE_ORDER",
"status": "GENERATED",
"documentNumber": "PO-ORD-2026-0001",
"fileName": "PO-ORD-2026-0001.pdf",
"generatedAt": "2026-06-30T10:00:00",
"errorMessage": null
}

type:

- PURCHASE_ORDER
- DELIVERY_NOTE
- PROFORMA_INVOICE
- INVOICE

status:

- PENDING
- GENERATED
- FAILED

———

1. Що фронтенд отримує після створення замовлення

Endpoint:

POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

Після checkout backend:

1. створює один або кілька orders
2. для кожного order пробує згенерувати PURCHASE_ORDER
3. повертає масив OrderResponseDto

Тепер OrderResponseDto містить:

- всі поля order
- documents: OrderDocumentDto[]

Приклад:

[
{
"id": "order-1",
"orderNumber": "ORD-2026-06-30-ABCD1234",
"orderStatus": "NEW",
"paymentStatus": "AWAITING_PAYMENT",
"paymentMethod": "INVOICE",
"documents": [
{
"id": "doc-1",
"orderId": "order-1",
"type": "PURCHASE_ORDER",
"status": "GENERATED",
"documentNumber": "PO-ORD-2026-06-30-ABCD1234",
"fileName": "PO-ORD-2026-06-30-ABCD1234.pdf",
"generatedAt": "2026-06-30T13:30:00",
"errorMessage": null
}
]
}
]

Можливі варіанти:

- documents містить PURCHASE_ORDER зі статусом GENERATED
- documents містить PURCHASE_ORDER зі статусом FAILED
- documents може бути порожнім лише якщо на момент відповіді документ ще не знайшовся в БД, але в поточній реалізації зазвичай він уже
  буде

Що робити у UI після checkout:

- показати success screen / order created
- якщо orders кілька, показати список orders
- у кожному order одразу показати блок Documents
- якщо є PURCHASE_ORDER зі статусом GENERATED, показати кнопку Download
- якщо FAILED, показати Document generation failed
- якщо PENDING, показати Generating...

———

2. Як будувати Order Details

Endpoint:

GET /api/orders/{orderId}
Authorization: Bearer <token>

GET /api/orders/{orderId} теж повертає documents.

Тобто для сторінки details можна:

- або використати documents прямо з GET /api/orders/{id}
- або окремо рефетчити GET /api/orders/{id}/documents

Рекомендований frontend-flow:

1. відкрити order details через GET /api/orders/{id}
2. відрендерити основні дані order
3. відрендерити секцію Documents
4. для актуалізації документів можна окремо періодично або вручну викликати GET /api/orders/{id}/documents

———

3. Окремий endpoint списку документів

Endpoint:

GET /api/orders/{orderId}/documents
Authorization: Bearer <token>

Response:

[
{
"id": "doc-1",
"orderId": "order-1",
"type": "PURCHASE_ORDER",
"status": "GENERATED",
"documentNumber": "PO-ORD-2026-06-30-ABCD1234",
"fileName": "PO-ORD-2026-06-30-ABCD1234.pdf",
"generatedAt": "2026-06-30T13:30:00",
"errorMessage": null
}
]

Коли використовувати:

- якщо order details треба оновити без повного refetch order
- якщо треба polling після статусних змін
- якщо треба окремий reusable documents widget

Рекомендація:

- в order details тримати documents як окремий query state
- після будь-якої document-related дії робити refetch цього endpoint’а

———

4. Як скачувати документ

Endpoint:

GET /api/orders/{orderId}/documents/{documentId}/download
Authorization: Bearer <token>

Response:

- 200 OK
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="PO-....pdf"

Frontend behavior:

- не відкривати Cloudinary URL напряму
- качати тільки через backend endpoint
- якщо робите через browser navigation, токен має бути доступний через auth mechanism вашого клієнта
- якщо через fetch/axios, треба працювати з blob

Приклад:

async function downloadOrderDocument(orderId: string, documentId: string, token: string) {
const res = await fetch(`/api/orders/${orderId}/documents/${documentId}/download`, {
method: 'GET',
headers: {
Authorization: `Bearer ${token}`
}
});

    if (!res.ok) {
      throw new Error('Failed to download document');
    }

    const blob = await res.blob();
    const disposition = res.headers.get('Content-Disposition');
    const fileNameMatch = disposition?.match(/filename="(.+)"/);
    const fileName = fileNameMatch?.[1] ?? 'document.pdf';

    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

}

UI правила:

- Download кнопка тільки для status === GENERATED
- для PENDING кнопку disable
- для FAILED показати помилку і, якщо це seller/admin use case, можна показати Regenerate

———

5. Автоматична генерація Purchase Order

Frontend нічого окремо не викликає.

Тригер:

- POST /api/orders

Що треба відобразити:

- після checkout документ може бути:
  - GENERATED
  - FAILED
  - PENDING

UI логіка:

- якщо GENERATED: Purchase Order ready
- якщо PENDING: Purchase Order is being generated
- якщо FAILED: Purchase Order generation failed

Для стабільного UX після checkout:

1. отримали response
2. показали orders
3. якщо в будь-якого PURCHASE_ORDER статус PENDING, зробили polling GET /api/orders/{id}/documents кожні 3-5 сек
4. stop polling коли:
   - документ став GENERATED
   - документ став FAILED
   - таймаут, наприклад 30-60 сек

———

6. Як з’являється Delivery Note

DELIVERY_NOTE створюється автоматично якщо:

- seller/admin додав trackingNumber
- або seller/admin змінив orderStatus на SHIPPED

Endpoint оновлення статусу:

PATCH /api/orders/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

Body:

{
"orderStatus": "SHIPPED",
"paymentStatus": "AWAITING_PAYMENT",
"trackingNumber": "TRK-123"
}

Можливі сценарії:

1. Додався тільки trackingNumber

{
"trackingNumber": "TRK-123"
}

2. Статус став SHIPPED

{
"orderStatus": "SHIPPED"
}

3. Обидва разом

{
"orderStatus": "SHIPPED",
"trackingNumber": "TRK-123"
}

Що робить фронтенд після успішного PATCH:

1. оновлює локальний order
2. рефетчить GET /api/orders/{id}/documents
3. шукає DELIVERY_NOTE
4. показує:

- GENERATED -> кнопка download
- PENDING -> generating state
- FAILED -> warning/error state

Важливо:

- backend не згенерує DELIVERY_NOTE, якщо немає trackingNumber
- тому frontend не повинен показувати кнопку Generate Delivery Note, якщо tracking ще відсутній, окрім admin debug flow

———

7. Manual generation

Endpoint:

POST /api/orders/{orderId}/documents/generate
Authorization: Bearer <token>
Content-Type: application/json

Body:

{
"type": "PURCHASE_ORDER",
"force": false
}

Підтримувані кейси:

- seller/admin generate DELIVERY_NOTE
- debug/demo
- admin force regenerate

Правила:

- PURCHASE_ORDER можна генерувати, якщо order існує
- DELIVERY_NOTE можна генерувати тільки якщо є trackingNumber
- INVOICE і PROFORMA_INVOICE зараз повернуть помилку
- force=true зараз дозволений тільки ADMIN

Успішна відповідь:

{
"id": "doc-1",
"orderId": "order-1",
"type": "PURCHASE_ORDER",
"status": "GENERATED",
"documentNumber": "PO-ORD-2026-06-30-ABCD1234",
"fileName": "PO-ORD-2026-06-30-ABCD1234.pdf",
"generatedAt": "2026-06-30T13:30:00",
"errorMessage": null
}

Frontend use cases:

1. Retry після FAILED

{
"type": "PURCHASE_ORDER",
"force": false
}

2. Admin regenerate

{
"type": "PURCHASE_ORDER",
"force": true
}

3. Seller generate delivery note manually

{
"type": "DELIVERY_NOTE",
"force": false
}

Поведінка UI:

- на кнопку Generate / Regenerate ставити loading
- після успіху робити refetch documents
- якщо прийшов FAILED, показати errorMessage
- якщо 403, показати You do not have permission
- якщо 400 для delivery note, показати Tracking number required

———

8. Ролі і що їм показувати

Buyer:

- бачить свої orders
- бачить documents
- може скачувати GENERATED
- не повинен бачити manual generate для DELIVERY_NOTE
- зазвичай не повинен бачити force regenerate

Seller:

- бачить orders де він seller
- бачить documents
- може скачувати
- може оновлювати статус/tracking
- може manually generate DELIVERY_NOTE
- може manually generate PURCHASE_ORDER без force
- не може force=true

Admin:

- бачить всі документи будь-якого order
- може скачувати
- може оновлювати status/tracking
- може manual generate
- може force regenerate

———

9. Рекомендований UI для секції Documents

Для кожного документа показувати:

- human label
- documentNumber
- status
- generatedAt
- errorMessage якщо є
- primary action

Мапінг label:

- PURCHASE_ORDER -> Purchase Order
- DELIVERY_NOTE -> Delivery Note
- PROFORMA_INVOICE -> Proforma Invoice
- INVOICE -> Invoice

Мапінг статусів:

- PENDING -> Generating
- GENERATED -> Ready
- FAILED -> Failed

Дії:

- GENERATED -> Download
- FAILED -> Retry або Regenerate
- PENDING -> disabled button / spinner

———

10. Рекомендований порядок дій на фронті

Після checkout

1. виклик POST /api/orders
2. показати отримані orders
3. в кожному order прочитати documents
4. якщо PURCHASE_ORDER ще не GENERATED, запустити polling GET /api/orders/{id}/documents

На order details

1. виклик GET /api/orders/{id}
2. відрендерити documents
3. при ручній генерації або після статусних змін робити GET /api/orders/{id}/documents

Після оновлення tracking/status

1. виклик PATCH /api/orders/{id}/status
2. одразу refetch order details
3. окремо refetch documents
4. якщо DELIVERY_NOTE у PENDING, short polling до фінального статусу

При download

1. дозволяти кнопку тільки для GENERATED
2. викликати backend download endpoint
3. зберігати blob як файл

———

11. Обробка помилок

400 Bad Request

- Document type is required
- Delivery note requires tracking number
- This document type is not enabled yet

Показ у UI:

- inline error в documents section
- toast для user action

403 Forbidden

- немає прав на generate/download/view

404 Not Found

- order не існує
- document не існує

409 Conflict

- document ще не готовий до скачування

500

- backend/storage проблема

Для FAILED документів завжди дивитися errorMessage.

———

12. Що зараз не треба робити на фронті

- не будувати flow для INVOICE/PROFORMA_INVOICE
- не зберігати або показувати прямі Cloudinary links
- не чекати, що документи глобальні, вони тільки в контексті order
- не припускати, що документ завжди один; у order може бути кілька типів документів

  status: DocumentStatus;
  documentNumber: string;
  fileName: string;
  };

———

14. Мінімальний frontend acceptance checklist

- після checkout видно PURCHASE_ORDER
- GENERATED документ можна скачати
- FAILED документ показує помилку
- seller/admin після tracking або SHIPPED бачить DELIVERY_NOTE
- buyer не бачить seller-only actions
- admin може force regenerate
- список документів оновлюється без reload сторінки

Якщо хочеш, я можу одразу після цього дати ще й готовий frontend integration contract у вигляді:

1. React Query hooks
2. TypeScript interfaces
3. UI states для DocumentsPanel
4. приклад компонента для order details.

› Окей дивись мені після успішного створення замовлення на фронті треба показувати вікно типу що успішно створено і показувати список
замовлень і накладні до них, типу ось так: Як показувати після checkout

Після успішного checkout показати не “один order”, а:

Order created successfully

3 supplier orders were created:

- Order ORD-001 — Vador — $420 (тут не лише total, але і повністю все типу по subtotal, totaltax, totalweight, totalitems, можливо ще
  щось є корисне що треба показати то показуй) — Purchase Order ready
- Order ORD-002 — GoodWine — $180 — Purchase Order ready
- Order ORD-003 — Barline — $260 — Purchase Order generating

І для кожного:

[View order] [Download Purchase Order].

Зараз бекенд таке повертає чи ні? Якщо ні то виконай і імплементуй щоб воно так працювало

• Так, зараз бекенд це вже повертає, і додатково імплементувати під цей сценарій нічого не потрібно.

Після POST /api/orders бекенд повертає масив orders, а в кожному order уже є:

- orderNumber
- sellerName
- sellerCompany
- summary.totalItems
- summary.totalWeight
- summary.subtotal
- summary.totalTax
- summary.shippingCost
- summary.grandTotal
- documents[]

Це зібрано в src/main/java/ua/teamchallenge/lavka/service/OrderService.java:51 і src/main/java/ua/teamchallenge/lavka/dto/
OrderResponseDto.java:22. Після checkout backend не просто створює orders, а ще й enrich’ить кожен response документами, тому фронт може
одразу будувати твоє success modal/list UI.

Тобто frontend вже може робити так:

- показати Order created successfully
- взяти response.length і показати 3 supplier orders were created
- для кожного order показати orderNumber, sellerName або sellerCompany
- взяти з summary:
  - subtotal
  - totalTax
  - totalWeight
  - totalItems
  - shippingCost
  - grandTotal

- знайти в documents документ з type === "PURCHASE_ORDER"
- по його status показати:
  - GENERATED -> Purchase Order ready
  - PENDING -> Purchase Order generating
  - FAILED -> Purchase Order failed

Для кнопок:

- [View order] -> вести на /orders/{id}
- [Download Purchase Order] -> викликати GET /api/orders/{orderId}/documents/{documentId}/download, тільки якщо статус GENERATED

Приклад shape response після checkout по суті вже такий:

[
{
"id": "order-1",
"orderNumber": "ORD-2026-06-30-ABCD1234",
"sellerName": "Vador",
"sellerCompany": "Vador LLC",
"summary": {
"totalItems": 12,
"totalWeight": 28.5,
"subtotal": 400,
"totalTax": 20,
"shippingCost": 0,
"grandTotal": 420
},
"documents": [
{
"id": "doc-1",
"type": "PURCHASE_ORDER",
"status": "GENERATED",
"documentNumber": "PO-ORD-2026-06-30-ABCD1234",
"fileName": "PO-ORD-2026-06-30-ABCD1234.pdf"
}
]
}
]

Єдине, що раджу на фронті:

- для PENDING не показувати активний download
- якщо документ ще не GENERATED, зробити polling GET /api/orders/{id}/documents
- для label брати sellerCompany ?? sellerName

Якщо хочеш, я можу зараз одразу дати тобі готовий exact frontend contract для цього success modal:

- TypeScript type
- mapper для Purchase Order ready/generating/failed
- готовий render shape для списку orders після checkout.
