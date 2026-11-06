import { useDemoInfo } from '../../hooks/useDemoInfo';
import { bytesToMegabytes, demoCopy } from '../../model/demoCopy';
import DemoHint from './DemoHint';

// The size limit of demo uploads, from the server settings.
const DemoUploadHint = () => {
  const { data } = useDemoInfo();

  if (!data) return null;

  return (
    <DemoHint>
      {demoCopy.hints.uploads(bytesToMegabytes(data.limits.maxUploadBytes))}
    </DemoHint>
  );
};

export default DemoUploadHint;
