// Switching role, resetting and leaving the demo kill the old tokens the
// moment the server answers. Requests still in flight with them get 401, and
// without this flag the client would take that for a lost session and show
// "Your demo has ended" in the middle of a normal switch.
let depth = 0;

export const isDemoTransition = () => depth > 0;

export const runDemoTransition = async <T>(work: () => Promise<T>) => {
  depth += 1;

  try {
    return await work();
  } finally {
    depth -= 1;
  }
};
