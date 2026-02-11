import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';

interface PageSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const PageSection = ({
  title,
  children,
  className,
}: PageSectionProps) => {
  return (
    <section className={className}>
      {title && (
        <>
          <div className='container'>
            <HeadingH3>{title}</HeadingH3>
          </div>
          <Space height='32px' />
        </>
      )}
      {children}
    </section>
  );
};
