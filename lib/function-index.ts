import { GenType } from './gen-type';
import { Import } from './imports';
import { OperationVariant } from './operation-variant';
import { Options } from './options';

/**
 * Represents the function index
 */
export class FunctionIndex extends GenType {

  constructor(functions: Array<{
    service: string;
    operations: OperationVariant[];
  }>, options: Options) {
    super('functions', n => n, options);

    functions.forEach(fn => {
      fn.operations.forEach(operation => {
        this.addImport(operation);
        this.addImport(new Import(
          operation.paramsType,
          operation.paramsType,
          operation.paramsType,
          operation.importPath,
          operation.importFile
        ));
      });
    });

    this.updateImports();
  }

  protected skipImport(): boolean {
    return false;
  }

  protected initPathToRoot(): string {
    return './';
  }
}
