import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ObjExcelFileService {
  exportAsExcelFile(
    json: any,
    fileName: string,
    mapeoColumnas: { [key: string]: string },
  ): void {
    json = this.mapeo(json, mapeoColumnas);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}.xlsx`);
  }

  private mapeo(json: any[], mapeo: { [key: string]: string }) {
    return json.map((item) => {
      const fila: any = {};
      for (const key in mapeo) {
        fila[mapeo[key]] = item[key];
      }
      return fila;
    });
  }
}
