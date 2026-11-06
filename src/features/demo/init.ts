import { setErrorMessageResolver } from '@/utils/error';

import { isDemoMock } from './config';
import { installDemoAuthInterceptor } from './model/demoAuthInterceptor';
import { getDemoErrorMessage } from './model/demoErrors';

const TITLE_PREFIX = '[DEMO] ';

// Keeps "[DEMO] " in front of the tab title, whoever sets the title later.
const keepTitlePrefix = () => {
  const apply = () => {
    if (!document.title.startsWith(TITLE_PREFIX)) {
      document.title = `${TITLE_PREFIX}${document.title}`;
    }
  };

  apply();

  const titleElement = document.querySelector('title');
  if (titleElement) {
    new MutationObserver(apply).observe(titleElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
};

// Runs once before the app renders, on the demo deployment only.
export const initDemo = async () => {
  installDemoAuthInterceptor();
  setErrorMessageResolver(getDemoErrorMessage);
  keepTitlePrefix();

  if (isDemoMock) {
    const { installDemoMock } = await import('./mock');
    installDemoMock();
  }
};
