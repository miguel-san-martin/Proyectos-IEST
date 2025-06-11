# Proyectos

## Contraloria

## Escolares

### Programas de liderazgo 

Funciones: Filtrado de alumnos , controlar prospectos, bajas etc.
Ruta:
https://sie.iest.edu.mx/app/escolar/P_Vertice_V2/registrovertice_V2/programas-liderazgo






## Shared
### alert-dialog
```
  selector: shrd-alert-dialog

  @Input() msj?: string = 'Undefinited';
  @Output() actionYes:EventEmitter<any> = new EventEmitter();
  @Output() actionNo:EventEmitter<any> = new EventEmitter();
```

![Captura de pantalla 2024-05-03 103332](https://github.com/miguel-san-martin/pagares-reinscripciones/assets/160758616/b5546f71-6516-41b6-9c54-7b6b5ecff4be)

### SideNavComponent
```
  selector: 'shrd-side-nav',

  {
    "name": "Toga",
    "img": "school",
    "sub_nodes": [
      {
        "name": "Consulta Toga",
        "path": "./masiva",
        "img": "search"
      }
    ]
  }

```
Este componente no recibe parametros pero lee un json alojado en assets/index.json en el se pone la ruta, la imagen y el nombre.
Se pueden hacer tiles expansibles o no expansibles quitando la propiedad sub_nodes

![image](https://github.com/miguel-san-martin/pagares-reinscripciones/assets/160758616/27156eca-0c56-487c-a0f8-f23452b5f89e)


### Tabla contraloria (DEPRECIADO)
```
  selector: 'shrd-tabla',

  @Input({required: true}) tableHead!: HeaderTable[];
  @Input({required: true}) data!: any[];
  @Input() checkList: boolean = false;
  @Input() requiereIndex: boolean = false;

  Recibe los encabzados en forma de array,
  La data que va a recibir
  checklist para activar un checkbox y el indices

  export interface HeaderTable {
    label: string,
    namePropiedad: string,
    checklist?: string
  }


```
![image](https://github.com/miguel-san-martin/pagares-reinscripciones/assets/160758616/3c5e0145-a05c-4643-bf26-8b5e9bcf30c1)



