import { z } from 'zod';

export const SUPPORT_TOPICS = [
  { value: 'ordering', label: 'Ordering and checkout' },
  { value: 'selling', label: 'Selling on B2bar' },
  { value: 'verification', label: 'Company verification' },
  { value: 'account', label: 'Account and security' },
  { value: 'documents', label: 'Order documents' },
  { value: 'other', label: 'Something else' },
] as const;

type SupportTopic = (typeof SUPPORT_TOPICS)[number]['value'];

const topicValues = SUPPORT_TOPICS.map((topic) => topic.value) as [
  SupportTopic,
  ...SupportTopic[],
];

const supportSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Enter at least 2 characters')
    .max(100, 'Use at most 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  topic: z.enum(topicValues, {
    errorMap: () => ({ message: 'Choose a topic' }),
  }),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .min(20, 'Describe the question in at least 20 characters')
    .max(2000, 'Use at most 2000 characters'),
});

export { supportSchema };
export type SupportFormSchema = z.infer<typeof supportSchema>;
