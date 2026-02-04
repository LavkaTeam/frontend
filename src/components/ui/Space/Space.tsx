interface SpaceProps {
  height?: string | number;
}

const Space = ({ height }: SpaceProps) => {
  return <div style={{ paddingTop: height }}></div>;
};

export { Space };
