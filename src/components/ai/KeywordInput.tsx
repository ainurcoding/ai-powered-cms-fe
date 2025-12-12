import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
  className?: string;
  maxKeywords?: number;
}

export const KeywordInput = ({
  keywords,
  onChange,
  placeholder = 'Type keyword and press Enter...',
  className,
  maxKeywords = 5,
}: KeywordInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    } else if (
      e.key === 'Backspace' &&
      inputValue === '' &&
      keywords.length > 0
    ) {
      // Remove last keyword if backspace on empty input
      removeKeyword(keywords.length - 1);
    }
  };

  const addKeyword = () => {
    const trimmed = inputValue.trim();
    if (
      trimmed &&
      !keywords.includes(trimmed) &&
      keywords.length < maxKeywords
    ) {
      onChange([...keywords, trimmed]);
      setInputValue('');
    } else if (keywords.length >= maxKeywords) {
      // Show warning if max keywords reached
      setInputValue('');
    }
  };

  const removeKeyword = (index: number) => {
    onChange(keywords.filter((_, i) => i !== index));
  };

  const canAddMore = keywords.length < maxKeywords;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Keywords chips di atas input */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="hover:bg-primary/80 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${keyword}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input field */}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          canAddMore ? placeholder : `Maximum ${maxKeywords} keywords reached`
        }
        disabled={!canAddMore}
        className={cn(!canAddMore && 'cursor-not-allowed opacity-50')}
      />

      {/* Info text */}
      <p className="text-muted-foreground text-xs">
        {keywords.length}/{maxKeywords} keywords
        {keywords.length >= maxKeywords && ' (maximum reached)'}
      </p>
    </div>
  );
};
