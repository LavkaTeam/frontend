import { useEffect } from 'react';

const SITE_NAME = 'B2Bar';
const DEFAULT_TITLE = 'B2Bar - Alcohol marketplace';

const getDescriptionTag = () => {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');

  if (!tag) {
    tag = document.createElement('meta');
    tag.name = 'description';
    document.head.appendChild(tag);
  }

  return tag;
};

/**
 * Sets the tab title ("FAQ | B2Bar") and the meta description of a page.
 * Both are restored when the page unmounts, so pages without the hook keep
 * the defaults from index.html.
 */
const useDocumentTitle = (title: string, description?: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  useEffect(() => {
    if (!description) return undefined;

    const tag = getDescriptionTag();
    const previousDescription = tag.content;
    tag.content = description;

    return () => {
      tag.content = previousDescription;
    };
  }, [description]);
};

export { useDocumentTitle };
