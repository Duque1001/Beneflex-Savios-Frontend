export const environment = {
  production: true,

  // BACKEND en Azure (App Service):
  functionsApiBaseUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api',

  meApiUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api/get-me',
  benefitsApiUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api/get-user-benefits',
  createBenefitApiUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api/create-benefit-request',
  myRequestsApiUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api/get-my-requests',
  pendingRequestsApiUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api/get-pending-requests',
  updateRequestStatusApiUrl: 'https://beneflex-savios-backend-facxcadmesfcekbz.westcentralus-01.azurewebsites.net/api/update-request-status',

  msal: {
    clientId: 'c2118f1c-4ac4-4251-84de-10a4274ee244',
    tenantId: '7f32fcbe-7a03-45a9-a3d0-2beb0fa0aaf7'
  }
};
