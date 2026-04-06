import * as React from 'react';
type Variant = 'default' | 'outline' | 'secondary';
type Props = React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant };
export function Badge({ variant = 'default', className = '', ...rest }: Props) {
  const variantCls =
    variant === 'outline'  ? 'border px-2 py-0.5 rounded' :
    variant === 'secondary'? 'bg-gray-700 text-white px-2 py-0.5 rounded' :
                              'bg-gray-200 text-gray-900 px-2 py-0.5 rounded';
  return <span className={`${variantCls} ${className}`} {...rest} />;
}