import { style } from 'typestyle';

export namespace PackageBarStyleClasses {
  export const packageContainer = style({
    backgroundColor: '#F2F2F2',
    padding: 20,
  });
  export const pipButton = style({
    backgroundColor: 'var(--md-blue-700)',
    color: '#fff',
    border: 'none',
    padding: '2px 10px',
    margin: 2
  });
  export const packageInput = style({
    border: '1px solid var(--md-grey-400)',
    padding: 8,
  });
  export const packageLabel = style({
    textTransform: 'uppercase',
  });
  export const title = style({
    fontSize: 16,
    fontWeight: 'bold',
  });
}