import { prodSiteUrl } from '../../config';
import { demoCopy } from '../../model/demoCopy';

import styles from './DemoFooterNote.module.css';

// Footer line of the demo.
const DemoFooterNote = () => (
  <p className={styles.note}>
    {demoCopy.footer.note}{' '}
    <a href={prodSiteUrl} className={styles.link} rel='noopener noreferrer'>
      {demoCopy.footer.site}
    </a>
  </p>
);

export default DemoFooterNote;
