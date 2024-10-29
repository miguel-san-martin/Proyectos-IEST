/**
 * Los valores especificados aquí serán reemplazados al momento de la
 * construcción del proyecto por los contenidos en el archivo
 * `enviroment.prod.ts` u otro a elección.
 *
 * La lista completa de archivos que siguen este comportamiento puede ser
 * encontrada en `angular.json`.
 */
export const environment = {
  /**
   * Bandera para indicar si el entorno es un ambiente de producción o no.
   */
  production: false,
  /**
   * URL del servidor donde se está ejecutando el proyecto.
   */
  server: 'http://localhost/',
  /**
   * URL absoluta del proyecto incluyendo subdirectorios.
   */
  url: 'http://localhost:4200',
  /**
   * Nombre del proyecto.
   */
  project: 'registro-logistica',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`,
 * `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a
 * negative impact on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
