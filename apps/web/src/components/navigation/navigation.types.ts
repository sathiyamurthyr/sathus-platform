export type NavState = 'IDLE' | 'OPENING' | 'OPEN' | 'CLOSING';

export type NavEvent =
  | 'mouseenter'
  | 'mouseleave'
  | 'focus'
  | 'blur'
  | 'escape'
  | 'outsideClick'
  | 'navigation';
