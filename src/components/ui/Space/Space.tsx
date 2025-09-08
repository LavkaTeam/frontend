interface SpaceProps {
  height?: '32px' | '16px';
}

const Space = ({ height }: SpaceProps) => {
  return <div style={{ paddingTop: height }}></div>;
};

export { Space };
