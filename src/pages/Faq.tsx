import { Link } from 'react-router-dom';

import { StaticPage, StaticSection } from '@/components/StaticPage';
import { Accordion } from '@/components/ui/Accordion';
import { faqGroups } from '@/data/faqData';

import styles from './StaticPages.module.css';

const Faq = () => (
  <StaticPage
    title='FAQ'
    eyebrow='Help'
    description='Answers about ordering, verification, payments, account security and order documents on B2bar.'
    intro={
      <p>
        Answers to the questions buyers and sellers ask most. Can’t find yours?
        Visit the <Link to='/support'>Support Center</Link>.
      </p>
    }
  >
    <nav className={styles.jumpLinks} aria-label='FAQ sections'>
      {faqGroups.map((group) => (
        <a key={group.id} href={`#${group.id}`} className={styles.jumpLink}>
          {group.title}
        </a>
      ))}
    </nav>

    {faqGroups.map((group) => (
      <StaticSection key={group.id} id={group.id} title={group.title}>
        <Accordion items={group.items} />
      </StaticSection>
    ))}
  </StaticPage>
);

export default Faq;
