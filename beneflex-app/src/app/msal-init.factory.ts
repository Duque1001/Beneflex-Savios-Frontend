import { MsalService } from '@azure/msal-angular';

export function msalInitializerFactory(msal: MsalService) {
  return async () => {
    // 1) Inicializa MSAL (obligatorio en msal-browser v3+)
    await msal.instance.initialize();

    // 2) Procesa el redirect UNA sola vez aquí (evita doble canje del code)
    const result = await msal.instance.handleRedirectPromise();

    if (result?.account) {
      msal.instance.setActiveAccount(result.account);
    } else {
      const accounts = msal.instance.getAllAccounts();
      if (accounts.length) msal.instance.setActiveAccount(accounts[0]);
    }
  };
}
