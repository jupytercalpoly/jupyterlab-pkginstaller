import { CodeCell, Cell } from '@jupyterlab/cells';

import { CellOutputModel } from './CellOutputModel';

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
  createCodeCell(options: CodeCell.IOptions, parent: StaticNotebook): CodeCell {
    console.log("HI");
      if(options.model.outputs) {
        for (let i = 0; i < options.model.outputs.length; i++) {
          let outputModel = (options.model.outputs.get(i) as CellOutputModel)
          if (outputModel._raw.output_type == "error") {
            console.log(outputModel._raw.evalue);
          };
        }
      }
      return new CodeCell(options).initializeState();
    }
}