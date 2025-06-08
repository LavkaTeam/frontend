export interface HeroCard {
  img: string;
  alt: string;
  title: string;
  text: string;
}

export const heroCards: HeroCard[] = [
  {
    img: './images/heroCard1.jpg',
    alt: 'Lots of bottles with alcohol on the floor',
    title: 'B2Bar — B2B marketplace for professional alcohol sourcing',
    text: 'A unified platform connecting producers, importers, and distributors of alcoholic beverages. Transparent terms, real-time stock availability, direct contracts, and streamlined logistics for businesses.',
  },
  {
    img: './images/heroCard2.jpg',
    alt: 'A Man and woman talking around boxes of alcohols',
    title: 'Built for Producers, Importers & Distributors',
    text: "Whether you're managing inventory or sourcing new brands, B2Bar simplifies your workflow and connects you directly to trusted partners.",
  },
  {
    img: './images/heroCard3.jpg',
    alt: 'A Man working on laptop with technologies',
    title: 'Streamlined Sourcing Process',
    text: 'Forget endless email threads. Get instant stock updates, negotiate directly, and finalize contracts — all in one platform.',
  },
  {
    img: './images/heroCard4.jpg',
    alt: 'A Laptop and truck with alcohol behind',
    title: 'Logistics You Can Rely On',
    text: 'Integrated logistics management helps you plan shipments, track orders, and reduce delays — locally and internationally.',
  },
];
