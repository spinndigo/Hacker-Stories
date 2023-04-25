import { PropsWithChildren, useRef, useEffect } from "react";

type InputEvent = React.ChangeEvent<HTMLInputElement>;
interface InputWithLabelProps {
  onInputChange(event: InputEvent): void;
  value: string;
  id: string;
  type?: string;
  isFocused?: boolean;
}

export const InputWithLabel: React.FC<
  PropsWithChildren<InputWithLabelProps>
> = ({
  onInputChange,
  value,
  id,
  type = "text",
  isFocused = false,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleChange = (event: InputEvent) => {
    onInputChange(event);
  };

  return (
    <>
      <label htmlFor={id}>{children}: </label>
      <input
        ref={inputRef}
        value={value}
        id={id}
        type={type}
        onChange={handleChange}
      />

      <p>
        {" "}
        Searching for <strong>{value}</strong>{" "}
      </p>
    </>
  );
};
