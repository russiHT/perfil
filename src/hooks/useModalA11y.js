import { useCallback, useEffect, useRef } from 'react';
import { useLatest } from './useLatest';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * Comportamento de diálogo para os modais do site.
 *
 * Antes, nenhum dos modais fechava com Escape, nenhum fechava ao clicar fora,
 * nenhum tinha `role="dialog"` e o foco do teclado continuava passeando pela
 * página atrás do overlay. Este hook centraliza os quatro comportamentos:
 *
 *  - Escape fecha
 *  - clique no fundo fecha
 *  - Tab fica preso dentro do diálogo enquanto ele estiver aberto
 *  - o foco volta para o elemento que abriu o modal quando ele fecha
 *
 * Também assume o bloqueio de scroll do body, que antes era duplicado à mão
 * em alguns modais e ausente em outros.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @returns {{ containerRef: React.RefObject<HTMLElement>, handleBackdropClick: (e: React.MouseEvent) => void }}
 */
export function useModalA11y(isOpen, onClose) {
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);

  // `onClose` costuma ser uma arrow function inline, com identidade nova a cada
  // render. Guardá-la num ref mantém o efeito abaixo dependente apenas de
  // `isOpen` — caso contrário o foco seria reposicionado a cada re-render.
  const onCloseRef = useLatest(onClose);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab' || !containerRef.current) return;

      const focusables = Array.from(containerRef.current.querySelectorAll(FOCUSABLE));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Leva o foco para dentro do diálogo, a menos que o próprio modal já tenha
    // focado algo (o teste de digitação, por exemplo, foca o textarea).
    const focusTimer = setTimeout(() => {
      const container = containerRef.current;
      if (!container || container.contains(document.activeElement)) return;
      const target = container.querySelector('[data-autofocus]') || container.querySelector(FOCUSABLE);
      target?.focus?.();
    }, 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      clearTimeout(focusTimer);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onCloseRef]);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) onCloseRef.current?.();
  }, [onCloseRef]);

  return { containerRef, handleBackdropClick };
}

export default useModalA11y;
