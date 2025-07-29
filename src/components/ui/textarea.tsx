import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const newHeight = Math.min(event.target.scrollHeight, 200);
        textareaRef.current.style.height = `${newHeight}px`;
      }
      if (props.onChange) {
        props.onChange(event);
      }
    };
    
    // Combine refs
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    React.useEffect(() => {
        const currentRef = internalRef.current;
        if(currentRef){
            currentRef.style.height = 'auto';
            const newHeight = Math.min(currentRef.scrollHeight, 200);
            currentRef.style.height = `${newHeight}px`;
        }
    }, [props.value])


    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-y-auto',
          className
        )}
        ref={(node) => {
            internalRef.current = node;
            if (textareaRef.current) {
                (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            }
        }}
        onInput={handleInput}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
