import { CodeCell, Cell } from '@jupyterlab/cells';

import {
  NotebookPanel, StaticNotebook
} from '@jupyterlab/notebook';

export default class ContentFactoryEditor extends NotebookPanel.ContentFactory {
  constructor(options?: Cell.ContentFactory.IOptions | undefined) {
      super(options);
  }

  /**
   * Create a new code cell.
   * @param options 
   * @param parent 
   */
  createCodeCell(options: CodeCell.IOptions,parent: StaticNotebook): CodeCell {
      if(options.model.outputs) {
        for (let i = 0; i < options.model.outputs.length; i++) {
          console.log(options.model.outputs.get(i).changed);
        }
      }
      return new CodeCell(options).initializeState();
    }
}