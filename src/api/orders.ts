// import { fetchData } from './fetchData';

// const getAllUserOrders = (userId: number): Promise<unknown[]> => {
//   return fetchData<unknown[]>(`/orders/api/orders/user/${userId}`, {
//     method: 'GET',
//   });
// };

// const getOrderById = (orderId: number): Promise<unknown[]> => {
//   return fetchData<unknown[]>(`/api/orders/api/orders/${orderId}`, {
//     method: 'GET',
//   });
// };

// interface PostOrderData {
//   id: string;
//   name: string;
//   lastName: string;
//   email: string;
//   password: string;
//   productIds: string[];
//   companyName: string;
//   registration_Number: string;
//   liquor_License: string;
//   tax_ID: string;
//   vat_Number: string;
//   bank_Name: string;
//   iban: string;
//   bic: string;
//   telephoneNumber: string;
//   role: 'BUYER';
// }

// const postOrder = (options: RequestInit = {}): Promise<unknown[]> => {
//   const orderData: PostOrderData = {
//     id: '00231',
//     name: 'Nazarii',
//     lastName: 'Fito',
//     email: 'testEmail3@gmail.com',
//     password: '1234567A',
//     productIds: ['68c81f7dd7d1beaa347439b2'],
//     companyName: 'Craft and Style',
//     registration_Number: '',
//     liquor_License: '',
//     tax_ID: '',
//     vat_Number: '',
//     bank_Name: '',
//     iban: '',
//     bic: '',
//     telephoneNumber: '+380991234567',
//     role: 'BUYER',
//   };

//   // Отримуємо токен і забезпечуємо, що він є рядком
//   const token = localStorage.getItem('token');
//   const headers: Record<string, string> | undefined = token
//     ? { Authorization: token, 'Content-Type': 'application/json' }
//     : { 'Content-Type': 'application/json' };

//   return fetchData<unknown[]>(`/orders/create`, {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify(orderData),
//     ...options,
//   });
// };

// export { getAllUserOrders, getOrderById, postOrder };
