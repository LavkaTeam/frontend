import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { StatCard } from '@/components/ui/StatCards';

import type { AnalyticsStatViewModel } from '../../model/analytics.utils';

interface AnalyticsStatCardProps {
  stat: AnalyticsStatViewModel;
}

const AnalyticsStatCard = ({ stat }: AnalyticsStatCardProps) => (
  <StatCard
    label={stat.label}
    accent={stat.accent}
    value={
      <AnimatedNumber
        value={stat.numericValue}
        formatter={stat.formatValue}
        precision='integer'
      />
    }
  />
);

export { AnalyticsStatCard };
