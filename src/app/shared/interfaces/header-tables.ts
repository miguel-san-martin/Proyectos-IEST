export interface HeaderTable {
  label: string;
  namePropiedad: string;
  maxSpan?: string;
  checklist?: string;
  currency?: string;
  button?: Button[];
  disable?: boolean;
}

export interface Button {
  label?: string;
  type?: number;
  fun?: () => void;
  menu?: Menu[];
}

export interface Menu {
  label?: string;
  fun: () => void;
}
