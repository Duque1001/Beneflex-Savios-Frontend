export const environment = {
  production: true,

  // Backend (Nest en App Service)
  backendBaseUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net',

  // Si vas a proteger endpoints con MSAL interceptor, apunta al BACKEND (no directo a Functions)
  functionsApiBaseUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api',

  msal: {
    clientId: 'TU_CLIENT_ID',
    tenantId: 'TU_TENANT_ID',
  }
};
