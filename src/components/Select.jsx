import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function Select({
  options,
  placeholder = 'Select...',
  value,
  onChange,
  disabled = false,
  className = '',
}) {
  const autoId = useId();
  const listboxId = `${autoId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, maxHeight: 240, openAbove: false });

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const findNextEnabled = (from, direction) => {
    let idx = from;
    for (let i = 0; i < options.length; i++) {
      idx = (idx + direction + options.length) % options.length;
      if (!options[idx].disabled) return idx;
    }
    return -1;
  };

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const maxH = 240;
    const openAbove = spaceBelow < maxH + 8 && spaceAbove > spaceBelow;
    setDropdownPos({
      top: openAbove ? rect.top - 4 : rect.bottom + 4,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
      width: rect.width,
      maxHeight: openAbove ? Math.min(maxH, spaceAbove - 8) : Math.min(maxH, spaceBelow - 8),
      openAbove,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) setIsOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') { setIsOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    dropdownRef.current?.querySelector(`[data-index="${highlightedIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, highlightedIndex]);

  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : findNextEnabled(-1, 1));
  };

  const closeDropdown = () => { setIsOpen(false); setHighlightedIndex(-1); };

  const handleSelect = (val) => {
    onChange?.(val);
    closeDropdown();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter': case ' ': case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) { openDropdown(); }
        else if (highlightedIndex >= 0) {
          if (e.key === 'Enter' || e.key === ' ') handleSelect(options[highlightedIndex].value);
          else setHighlightedIndex(findNextEnabled(highlightedIndex, 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) openDropdown();
        else if (highlightedIndex >= 0) setHighlightedIndex(findNextEnabled(highlightedIndex, -1));
        break;
      case 'Home':
        if (isOpen) { e.preventDefault(); setHighlightedIndex(findNextEnabled(-1, 1)); }
        break;
      case 'End':
        if (isOpen) { e.preventDefault(); setHighlightedIndex(findNextEnabled(options.length, -1)); }
        break;
      case 'Escape':
        if (isOpen) { e.preventDefault(); closeDropdown(); }
        break;
      default:
        if (isOpen && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const char = e.key.toLowerCase();
          const start = highlightedIndex >= 0 ? highlightedIndex + 1 : 0;
          for (let i = 0; i < options.length; i++) {
            const idx = (start + i) % options.length;
            if (!options[idx].disabled && options[idx].label.toLowerCase().startsWith(char)) {
              setHighlightedIndex(idx);
              break;
            }
          }
        }
    }
  };

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-3 bg-white border rounded-lg text-sm text-left transition-all duration-150 flex items-center justify-between gap-2 ${
          isOpen
            ? 'border-black ring-1 ring-black'
            : 'border-gray-200 hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`truncate ${selectedOption ? 'text-black' : 'text-gray-400'}`}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-auto"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            minWidth: dropdownPos.width,
            maxHeight: dropdownPos.maxHeight,
            transform: dropdownPos.openAbove ? 'translateY(-100%)' : undefined,
          }}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <div
                key={option.value}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onMouseDown={(e) => { e.preventDefault(); if (!option.disabled) handleSelect(option.value); }}
                onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none transition-colors ${
                  option.disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : isSelected
                      ? 'bg-gray-50 text-black font-medium'
                      : isHighlighted
                        ? 'bg-gray-50 text-black'
                        : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex-1 truncate">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 text-black" />}
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}
