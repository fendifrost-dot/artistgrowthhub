import * as React from 'react';

// Allow known variants + any string (so shadcn variants compile)
type Variant = 'default' | 'outline' | 'ghost' | 'secondary' | (string & {});
// Allow known sizes + any string (shadcn often uses "icon")
type Size = 'sm' | 'md' | 'lg' | 'icon' | string;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
};

export function buttonVariants(opts?: { variant?: Variant; size?: Size; className?: string }) {
  const { variant = 'default', size = 'md', className = '' } = opts || {};
  const base = 'rounded focus:outline-none';
  const varCls =
    variant === 'outline'
      ? 'border bg-transparent'
      : variant === 'ghost'
      ? 'bg-transparent'
      : variant === 'secondary'
      ? 'bg-gray-700 text-white'
      : 'bg-gray-200 text-gray-900';
  const sizeCls =
    size === 'sm' ? 'text-sm px-2 py-1' : size === 'lg' ? 'text-base px-4 py-2' : 'text-sm px-3 py-1.5';
  return [base, varCls, sizeCls, className].join(' ').trim();
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className = '', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...rest}
      />
    );
  }
);

Button.displayName = 'Button';