// export interface User {

interface User {
  name: string;
}

function useUser(): { user: User } {
  const user = {
    name: 'guest',
  };

  // Тимчасове значення, потім підтягнемо з беку
  return { user };
}

export { useUser };
