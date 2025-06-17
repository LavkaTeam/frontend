interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = ({ label, ...rest }: CheckboxProps) => {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input type='checkbox' {...rest} />
      {label}
    </label>
  );
};

export { Checkbox };
