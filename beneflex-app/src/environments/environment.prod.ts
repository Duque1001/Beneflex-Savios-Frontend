export const environment = {
  production: true,

  // Backend (Nest en App Service)
  backendBaseUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net',

  // Si vas a proteger endpoints con MSAL interceptor, apunta al BACKEND (no directo a Functions)
  functionsApiBaseUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api',

  msal: {
    clientId: 'c2118f1c-4ac4-4251-84de-10a4274ee244',
    tenantId: '7f32fcbe-7a03-45a9-a3d0-2beb0fa0aaf7'
  }
};
