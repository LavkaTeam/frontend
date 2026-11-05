import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';

interface PageSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  // Anchor for links such as "/#discover".
  id?: string;
}

export const PageSection = ({
  title,
  children,
  className,
  id,
}: PageSectionProps) => {
  return (
    <section id={id} className={className}>
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
