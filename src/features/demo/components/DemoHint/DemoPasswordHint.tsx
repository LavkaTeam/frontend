import { demoCopy } from '../../model/demoCopy';
import DemoHint from './DemoHint';

// Instead of "Edit password": the backend answers 403 DEMO_READ_ONLY to it.
const DemoPasswordHint = () => <DemoHint>{demoCopy.hints.password}</DemoHint>;

export default DemoPasswordHint;
