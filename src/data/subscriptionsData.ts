export interface Subscription {
  id: string;
  title: string;
  description: string;
}

export const subscriptionsData: Subscription[] = [
  {
    id: 'news',
    title: 'Receive news',
    description:
      'Stay informed with the latest updates about our brand — including product launches, company announcements, service improvements, and insider insights. Be the first to know what’s new and what’s coming soon.',
  },
  {
    id: 'offers',
    title: 'Receive personalized offers',
    description:
      'Get access to exclusive deals and promotions tailored just for you. Based on your preferences and shopping habits, we’ll send curated discounts and handpicked product suggestions that match your style and needs.',
  },
  {
    id: 'updates',
    title: 'Receive order status updates',
    description:
      'Keep track of your purchases with real-time updates on your order progress — from confirmation and processing to shipping, delivery, and any changes along the way. Never miss an important update about your order.',
  },
  {
    id: 'discounts',
    title: 'Over 40%',
    description:
      'Unlock access to powerful offers with discounts of over 40% on select items. Includes our most intense and high-proof selections like premium absinthe and strong spirits for true connoisseurs.',
  },
];
