import type { Article } from '@/types/article';

// Editorial articles behind the Discover cards (discoverData.ts) and the
// accessories lead card on the home page. Text stays with what the cards say
// plus general category knowledge: no figures, prices or partnership claims.
export const articles: Article[] = [
  {
    slug: 'irish-cream',
    path: '/discover/irish-cream',
    title: 'Affordable Irish Cream Innovations',
    date: '2026-09-15',
    cover: '/images/discoverCard1.webp',
    excerpt:
      'Ballycastle, Aldi’s in-house brand, has widened its range of Irish cream liqueurs with new flavours such as Birthday Cake and Strawberries.',
    relatedCategory: 'STRONG_DRINKS',
    body: [
      {
        type: 'paragraph',
        text: 'Irish cream has long been a quiet regular on the back bar: a bottle that comes out for coffee, desserts and the festive season. Ballycastle, the in-house brand of the discount chain Aldi, is giving the category a more playful turn with new flavoured versions of its Irish cream liqueur, including Birthday Cake and Strawberries.',
      },
      { type: 'heading', text: 'Why flavoured cream liqueurs travel well' },
      {
        type: 'paragraph',
        text: 'Cream liqueurs are easy to understand for guests who do not drink spirits neat. A dessert-style flavour turns a familiar bottle into something guests ask about, and it fits menus where drinks and sweets meet: brunch, afternoon service, dessert pairings and seasonal specials.',
      },
      { type: 'heading', text: 'How venues can use them' },
      {
        type: 'list',
        items: [
          'Over ice as an after-dinner drink, served in a small rocks glass.',
          'In milkshake-style cocktails and frozen drinks with ice cream.',
          'Poured over or alongside desserts as a simple pairing.',
          'In hot chocolate or coffee for the colder months.',
        ],
      },
      { type: 'heading', text: 'Notes for buyers' },
      {
        type: 'paragraph',
        text: 'Cream liqueurs contain dairy, so storage matters: keep bottles away from heat and direct light, check the producer’s guidance on shelf life after opening, and rotate stock so older bottles are used first. Flavoured editions work best as a focused addition next to a classic Irish cream rather than a replacement for it.',
      },
      {
        type: 'paragraph',
        text: 'Staff can help the bottle sell: a short tasting for the team and one suggested serve on the menu are usually enough for guests to try a new flavour. Seasonal flavours also give a reason to refresh the dessert drinks list without reworking the whole bar.',
      },
      {
        type: 'paragraph',
        text: 'Looking for liqueurs for your list? Browse the strong drinks on B2bar and compare suppliers and wholesale prices in one place.',
      },
    ],
  },
  {
    slug: 'nemiroff',
    path: '/discover/nemiroff',
    title: 'Nemiroff De Luxe',
    date: '2026-09-22',
    cover: '/images/discoverCard2.webp',
    excerpt:
      'Nemiroff De Luxe, a Ukrainian vodka distilled from local wheat, keeps its place in the premium vodka segment.',
    relatedCategory: 'STRONG_DRINKS',
    body: [
      {
        type: 'paragraph',
        text: 'Nemiroff is a vodka brand from Ukraine, and De Luxe sits in the premium part of its range. The vodka is distilled from high-quality local wheat, which shapes the soft, rounded profile that premium wheat vodkas are known for.',
      },
      { type: 'heading', text: 'What wheat brings to vodka' },
      {
        type: 'paragraph',
        text: 'Vodka can be made from many raw materials, and the base leaves a mark even after distillation and filtration. Wheat vodkas are usually described as smooth and slightly sweet on the palate, which makes them a comfortable choice both for sipping chilled and for mixing.',
      },
      { type: 'heading', text: 'Serving ideas for bars and restaurants' },
      {
        type: 'list',
        items: [
          'Ice cold and neat, served with simple snacks in the Eastern European tradition.',
          'In clean, spirit-forward drinks such as a vodka martini.',
          'In long drinks with tonic, soda or fresh juice.',
          'As the base of house signature cocktails where a neutral spirit lets other flavours lead.',
        ],
      },
      { type: 'heading', text: 'Building a vodka shelf' },
      {
        type: 'paragraph',
        text: 'Most venues need a vodka for the well and one or two bottles for guests who order by name. A premium wheat vodka fits the second role: it is recognisable on the back bar and versatile enough to work across the cocktail list. Keep a few bottles in the freezer or a chiller for neat serves.',
      },
      {
        type: 'paragraph',
        text: 'For cocktails, a clean premium vodka lets fruit, herbs and bitters show through, while for neat serves its texture is what guests notice first. Listing the brand by name on the menu helps guests who already know it and invites others to try it.',
      },
      {
        type: 'paragraph',
        text: 'Compare vodkas and other strong drinks from several suppliers on B2bar, with wholesale price tiers shown on each product.',
      },
    ],
  },
  {
    slug: 'fre-pinot',
    path: '/discover/fre-pinot',
    title: 'FRE Pinot Grigio',
    date: '2026-10-01',
    cover: '/images/discoverCard3.webp',
    excerpt:
      'From California’s wine country, FRE offers an alcohol-removed Pinot Grigio for guests who want wine without the alcohol.',
    relatedCategory: 'WINE',
    body: [
      {
        type: 'paragraph',
        text: 'FRE comes from the heart of California’s wine country and focuses on alcohol-removed wines. Its Pinot Grigio is a fresh take on a classic white: the wine is made first, and the alcohol is removed afterwards, so the drink keeps a wine character rather than tasting like grape juice.',
      },
      { type: 'heading', text: 'Why venues add alcohol-removed wine' },
      {
        type: 'paragraph',
        text: 'More guests choose not to drink alcohol on some occasions: drivers, business lunches, or simply a lighter evening. Offering them a real glass of wine, rather than only soft drinks, keeps them part of the table and gives the menu an option that many lists still miss.',
      },
      { type: 'heading', text: 'How to serve it' },
      {
        type: 'list',
        items: [
          'Well chilled, in the same glass as the regular white wines.',
          'By the glass, listed next to the alcoholic whites rather than in a separate corner of the menu.',
          'With light dishes that suit Pinot Grigio: salads, seafood and fresh cheeses.',
          'As a base for low-alcohol spritzes with soda and citrus.',
        ],
      },
      { type: 'heading', text: 'Storage and service tips' },
      {
        type: 'paragraph',
        text: 'Treat an opened bottle like any white wine: close it, keep it cold and follow the producer’s guidance on how long it stays fresh. Train the team to describe it as alcohol-removed wine, so guests know exactly what they are ordering.',
      },
      {
        type: 'paragraph',
        text: 'Staff should know how it differs from a regular Pinot Grigio: the same light, fresh style, with the alcohol removed. A clear short note on the menu, such as alcohol-removed white wine, helps guests choose without asking.',
      },
      {
        type: 'paragraph',
        text: 'Browse wines on B2bar to build a list that covers every guest, from classic whites to alcohol-free choices.',
      },
    ],
  },
  {
    slug: 'accessories',
    path: '/accessories',
    title: 'Style in the Details: Alcohol Accessories That Set the Mood',
    date: '2026-10-08',
    cover: '/images/AccessoriesCard.webp',
    excerpt:
      'Bar accessories are more than tools: glassware, serving gear and small details turn an ordinary drink into a ritual.',
    relatedCategory: 'BARWARE_ACCESSORIES',
    body: [
      {
        type: 'paragraph',
        text: 'In hospitality, the taste of a drink is only part of the experience. How it is served matters too: the glass in the hand, the way it is poured, the ice and the small details on the table. Bar accessories are the tools that turn an ordinary evening into a stylish ritual.',
      },
      { type: 'heading', text: 'Glassware first' },
      {
        type: 'paragraph',
        text: 'The right glass supports the drink. Stemmed glasses keep white wine and sparkling cool in the hand, wide rocks glasses suit spirits over ice, and tall highball glasses keep long drinks lively. A consistent glass range also makes service faster and the bar look tidy.',
      },
      { type: 'heading', text: 'Tools that speed up service' },
      {
        type: 'list',
        items: [
          'Jiggers for consistent pours and predictable costs per drink.',
          'Shakers, mixing glasses and bar spoons for the cocktail list.',
          'Strainers, muddlers and peelers for clean, fresh garnishes.',
          'Bottle openers and wine keys within easy reach at every station.',
        ],
      },
      { type: 'heading', text: 'Chilling and serving gear' },
      {
        type: 'paragraph',
        text: 'Ice buckets, wine coolers and chillers keep bottles at the right temperature at the table. Trays, pourers and serving boards help the team carry and present drinks safely during busy hours.',
      },
      { type: 'heading', text: 'Details that set the mood' },
      {
        type: 'paragraph',
        text: 'Coasters, decor items and well-chosen serving pieces give a venue its own character. They are a small investment compared with furniture or equipment, yet guests notice them with every drink.',
      },
      {
        type: 'paragraph',
        text: 'When restocking, buy in sets that match the menu and replace chipped or worn items early: a damaged glass is the first thing a guest sees, and a missing tool slows the whole bar down during service.',
      },
      {
        type: 'paragraph',
        text: 'Find glassware, bar tools, chillers and serving gear in the accessories category on B2bar.',
      },
    ],
  },
];

export const getArticleBySlug = (slug?: string) =>
  articles.find((article) => article.slug === slug);
