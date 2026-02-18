export const environment = {
  production: false,

  // BACKEND (App Service) local:
  functionsApiBaseUrl: 'http://localhost:3000/api',
  backendOrigin: 'http://localhost:3000/api',


  // Apuntar al BACKEND
  meApiUrl: 'http://localhost:3000/api/get-me',
  benefitsApiUrl: 'http://localhost:3000/api/get-user-benefits',
  createBenefitApiUrl: 'http://localhost:3000/api/create-benefit-request',
  myRequestsApiUrl: 'http://localhost:3000/api/get-my-requests',
  pendingRequestsApiUrl: 'http://localhost:3000/api/get-pending-requests',
  updateRequestStatusApiUrl: 'http://localhost:3000/api/update-request-status',

  msal: {
    clientId: 'c2118f1c-4ac4-4251-84de-10a4274ee244',
    tenantId: '7f32fcbe-7a03-45a9-a3d0-2beb0fa0aaf7'
  }
};
