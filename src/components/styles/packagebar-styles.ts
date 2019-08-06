import { style } from 'typestyle';

export namespace PackageBarStyleClasses {
  export const packageContainer = style({
    backgroundColor: 'var(--md-blue-700)'
  });
  export const pipButton = style({
    backgroundColor: 'var(--md-blue-700)',
    color: '#fff',
    border: 'none',
    padding: '2px',
    width: '20px',
    margin: 2
  });
}