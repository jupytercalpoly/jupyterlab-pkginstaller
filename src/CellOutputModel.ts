import { IOutputModel } from '@jupyterlab/rendermime';

import {
  JSONObject,
  JSONValue,
  ReadonlyJSONObject
} from '@phosphor/coreutils';

import { ISignal, Signal } from '@phosphor/signaling';

import { nbformat } from '@jupyterlab/coreutils';

import { IObservableJSON } from '@jupyterlab/observables';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

/**
 * The default implementation of a notebook output model.
 */
export class CellOutputModel implements IOutputModel {
  /**
   * Construct a new output model.
   */
  constructor(options: IOutputModel.IOptions) {
    //let { data, metadata, trusted } = Private.getBundleOptions(options);
    //this._data = new ObservableJSON({ values: data as JSONObject });
    // this._rawData = data;
    // this._metadata = new ObservableJSON({ values: metadata as JSONObject });
    // this._rawMetadata = metadata;
    // this.trusted = trusted;
    // Make a copy of the data.
    let value = options.value;
    for (let key in value) {
      // Ignore data and metadata that were stripped.
      switch (key) {
        case 'data':
        case 'metadata':
          break;
        default:
          // this._raw[key] = Private.extract(value, key);
      }
    }
    this.type = value.output_type;
    if (nbformat.isExecuteResult(value)) {
      this.executionCount = value.execution_count;
    } else {
      this.executionCount = null;
    }
  }

  /**
   * A signal emitted when the output model changes.
   */
  get changed(): ISignal<this, void> {
    return this._changed;
  }

  /**
   * The output type.
   */
  readonly type: string;

  /**
   * The execution count.
   */
  readonly executionCount: nbformat.ExecutionCount;

  /**
   * Whether the model is trusted.
   */
  readonly trusted: boolean;

  /**
   * Dispose of the resources used by the output model.
   */
  dispose(): void {
    this._data.dispose();
    this._metadata.dispose();
    Signal.clearData(this);
  }

  /**
   * The data associated with the model.
   */
  get data(): ReadonlyJSONObject {
    return this._rawData;
  }

  /**
   * The metadata associated with the model.
   */
  get metadata(): ReadonlyJSONObject {
    return this._rawMetadata;
  }

  /**
   * Set the data associated with the model.
   *
   * #### Notes
   * Depending on the implementation of the mime model,
   * this call may or may not have deferred effects,
   */
  setData(options: IRenderMime.IMimeModel.ISetDataOptions): void {
    if (options.data) {
      this._updateObservable(this._data, options.data);
      this._rawData = options.data;
    }
    if (options.metadata) {
      this._updateObservable(this._metadata, options.metadata);
      this._rawMetadata = options.metadata;
    }
    this._changed.emit(void 0);
  }

  /**
   * Serialize the model to JSON.
   */
  toJSON(): nbformat.IOutput {
    let output: JSONValue = {};
    // for (let key in this._raw) {
    //   output[key] = Private.extract(this._raw, key);
    // }
    switch (this.type) {
      case 'display_data':
      case 'execute_result':
      case 'update_display_data':
        output['data'] = this.data as JSONObject;
        output['metadata'] = this.metadata as JSONObject;
        break;
      default:
        break;
    }
    // Remove transient data.
    delete output['transient'];
    return output as nbformat.IOutput;
  }

  /**
   * Update an observable JSON object using a readonly JSON object.
   */
  private _updateObservable(
    observable: IObservableJSON,
    data: ReadonlyJSONObject
  ) {
    let oldKeys = observable.keys();
    let newKeys = Object.keys(data);

    // Handle removed keys.
    for (let key of oldKeys) {
      if (newKeys.indexOf(key) === -1) {
        observable.delete(key);
      }
    }

    // Handle changed data.
    for (let key of newKeys) {
      let oldValue = observable.get(key);
      let newValue = data[key];
      if (oldValue !== newValue) {
        observable.set(key, newValue as JSONValue);
      }
    }
  }

  private _changed = new Signal<this, void>(this);
  public _raw: JSONObject = {};
  private _rawMetadata: ReadonlyJSONObject;
  private _rawData: ReadonlyJSONObject;
  private _data: IObservableJSON;
  private _metadata: IObservableJSON;
}