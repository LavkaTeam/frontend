interface SpaceProps {
  height?: '85px' | '40px' | '32px' | '24px' | '16px';
}

const Space = ({ height }: SpaceProps) => {
  return <div style={{ paddingTop: height }}></div>;
};

export { Space };
