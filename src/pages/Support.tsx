import { useId, useState } from 'react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { InputField } from '@/components/Form/InputField/InputField';
import {
  CardGrid,
  InfoCard,
  StaticPage,
  StaticSection,
} from '@/components/StaticPage';
import { Button } from '@/components/ui/Button';
import { DropdownField } from '@/components/ui/DropdownField';
import { Label } from '@/components/ui/Label';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import {
  SUPPORT_TOPICS,
  supportSchema,
  type SupportFormSchema,
} from '@/schemas/supportSchema';
import { buildSupportMailto, SUPPORT_EMAIL } from '@/utils/supportMailto';

import styles from './Support.module.css';

const QUICK_LINKS = [
  {
    title: 'FAQ',
    to: '/faq',
    text: 'Ordering, payments, verification, account security and documents.',
  },
  {
    title: 'How to Become a Seller',
    to: '/become-a-seller',
    text: 'Registration, company profile, licence and the review.',
  },
  {
    title: 'Rules for Sellers',
    to: '/seller-rules',
    text: 'Products, orders, platform fee, payouts and documents.',
  },
];

const SupportForm = () => {
  const messageId = useId();
  const [isOpened, setIsOpened] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<SupportFormSchema>({
    resolver: zodResolver(supportSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = (data: SupportFormSchema) => {
    window.location.href = buildSupportMailto(data);
    setIsOpened(true);
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.row}>
        <InputField
          id='support-name'
          label='Name'
          autoComplete='name'
          placeholder='Your name'
          error={errors.name?.message}
          {...register('name')}
        />
        <InputField
          id='support-email'
          label='Email'
          type='email'
          autoComplete='email'
          placeholder='you@company.com'
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <Controller
        control={control}
        name='topic'
        render={({ field }) => (
          <DropdownField
            label='Topic'
            placeholder='Choose a topic'
            value={field.value ?? ''}
            options={SUPPORT_TOPICS.map((topic) => ({ ...topic }))}
            error={errors.topic?.message}
            onSelect={(value) => field.onChange(value)}
          />
        )}
      />

      <div className={styles.field}>
        <Label htmlFor={messageId}>Message</Label>
        <textarea
          id={messageId}
          rows={6}
          placeholder='How can we help?'
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          className={`${styles.textarea} ${errors.message ? styles.textareaInvalid : ''}`}
          {...register('message')}
        />
        {errors.message ? (
          <p id={`${messageId}-error`} className={styles.error} role='alert'>
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div className={styles.actions}>
        <Button type='submit'>Open in your email app</Button>
        <p className={styles.hint}>
          {isOpened
            ? 'Your email app should open with the message ready. Nothing happened? Write to '
            : 'The form prepares an email to '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          {isOpened ? '.' : ' in your email app.'}
        </p>
      </div>
    </form>
  );
};

const Support = () => (
  <StaticPage
    title='Support Center'
    eyebrow='Help'
    description='Get help with B2bar: FAQ, seller guides and a contact form that writes to support@b2bar.tech.'
    intro={
      <p>
        Most answers are in the guides below. For anything else, write to{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or use the form.
      </p>
    }
  >
    <StaticSection id='guides' title='Start here' variant='plain'>
      <CardGrid>
        {QUICK_LINKS.map((link) => (
          <InfoCard
            key={link.to}
            title={link.title}
            to={link.to}
            linkLabel='Open'
          >
            <p>{link.text}</p>
          </InfoCard>
        ))}
      </CardGrid>
    </StaticSection>

    <StaticSection id='contact' title='Contact support'>
      <p>
        Tell us what happened and, if it is about an order, add the order
        number.
      </p>
      <SupportForm />
    </StaticSection>
  </StaticPage>
);

export default Support;
