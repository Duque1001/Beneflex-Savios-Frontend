import { environment } from '../../../environments/environment';

export const API = {
  base: `${environment.backendBaseUrl}/api`,
  me: () => `${API.base}/me`,
  benefits: () => `${API.base}/benefits`,
  createBenefitRequest: () => `${API.base}/create-benefit-request`,
  myRequests: () => `${API.base}/get-my-requests`,
  pendingRequests: () => `${API.base}/get-pending-requests`,
  updateRequestStatus: () => `${API.base}/update-request-status`,
};
