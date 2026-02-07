export interface GridColumn<T> {
  key: Extract<keyof T, string>;
  header: string;
  cell?: (row: T) => string;
}

export interface GridConfig<T> {
    title: string;
    columns: GridColumn<T>[];
    showCreate?: boolean;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}
