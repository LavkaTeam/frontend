import {
  SUPPORT_TOPICS,
  type SupportFormSchema,
} from '@/schemas/supportSchema';

export const SUPPORT_EMAIL = 'support@b2bar.tech';

/**
 * There is no support endpoint yet, so the form opens the user's mail app
 * with the request prefilled. Replace with an API call when one exists.
 */
export const buildSupportMailto = ({
  name,
  email,
  topic,
  message,
}: SupportFormSchema) => {
  const topicLabel =
    SUPPORT_TOPICS.find((item) => item.value === topic)?.label ?? topic;
  const subject = `[${topicLabel}] Support request from ${name}`;
  const body = `${message}\n\n---\nName: ${name}\nEmail: ${email}\nTopic: ${topicLabel}`;

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
};
