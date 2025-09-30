import * as React from 'react';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
};

// forwardRef so callers like form can pass `ref`
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...rest }, ref) => {
    return <label ref={ref} className={className} {...rest} />;
  }
);
Label.displayName = 'Label';