import * as React from 'react';

type CommonDiv = React.HTMLAttributes<HTMLDivElement> & { className?: string };

type SelectRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children?: React.ReactNode;
};

export function Select({ value, defaultValue, onValueChange, children }: SelectRootProps) {
  // minimal stub; caller can manage state externally
  return <div data-select-root data-value={value ?? defaultValue}>{children}</div>;
}

export function SelectTrigger(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} />;
}

export function SelectValue(props: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} />;
}

export function SelectContent(props: CommonDiv) {
  return <div {...props} />;
}

type SelectItemProps = React.HTMLAttributes<HTMLDivElement> & { value: string; className?: string };

export function SelectItem({ value, children, className = '', ...rest }: SelectItemProps) {
  return (
    <div role="option" aria-selected="false" data-value={value} className={className} {...rest}>
      {children}
    </div>
  );
}