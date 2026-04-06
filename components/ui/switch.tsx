import * as React from 'react';
type Props = React.InputHTMLAttributes<HTMLInputElement> & { 
  checked?: boolean; 
  onCheckedChange?: (checked: boolean) => void; 
};
export function Switch({ checked, onCheckedChange, ...rest }: Props) {
  return (
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange?.(e.target.checked)} 
      {...rest} 
    />
  );
}