import { createApp } from '@backstage/frontend-app-api';
import homePlugin, {
  titleExtensionDataRef,
} from '@backstage/plugin-home/alpha';
import techRadarPlugin from '@backstage/plugin-tech-radar/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import React from 'react';
import notFoundErrorPage from './examples/notFoundErrorPageExtension';
import { pagesPlugin } from './examples/pagesPlugin';

import { FlatRoutes } from '@backstage/core-app-api';
import { convertLegacyApp } from '@backstage/core-compat-api';
import { SignInPage } from '@backstage/core-components';
import {
  configApiRef,
  createApiFactory,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import {
  coreExtensionData,
  createApiExtension,
  createExtension,
  createExtensionOverrides,
  createSignInPageExtension,
} from '@backstage/frontend-plugin-api';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import { Route } from 'react-router';
import { homePage } from './HomePage';

/*

# Notes

TODO:
 - proper createApp
 - connect extensions and plugins, provide method?
 - higher level API for creating standard extensions + higher order framework API for creating those?
 - extension config schema + validation
 - figure out how to resolve configured extension ref to runtime value, e.g. '@backstage/plugin-graphiql#GraphiqlPage'
 - make sure all shorthands work + tests
 - figure out package structure / how to ship, frontend-plugin-api/frontend-app-api
 - figure out routing, useRouteRef in the new system
 - Legacy plugins / interop
 - dynamic updates, runtime API

*/

/* core */

// const discoverPackages = async () => {
//   // stub for now, deferring package discovery til later
//   return ['@backstage/plugin-graphiql'];
// };

/* graphiql package */

/* app.tsx */

const homePageExtension = createExtension({
  name: 'myhomepage',
  attachTo: { id: 'home', input: 'props' },
  output: {
    children: coreExtensionData.reactElement,
    title: titleExtensionDataRef,
  },
  factory() {
    return { children: homePage, title: 'just a title' };
  },
});

const signInPage = createSignInPageExtension({
  name: 'guest',
  loader: async () => props =>
    (
      <SignInPage
        {...props}
        provider={{
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Sign in using GitHub',
          apiRef: githubAuthApiRef,
        }}
      />
    ),
});

const scmAuthExtension = createApiExtension({
  factory: ScmAuth.createDefaultApiFactory(),
});

const scmIntegrationApi = createApiExtension({
  factory: createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
});

const collectedLegacyPlugins = convertLegacyApp(
  <FlatRoutes>
    <Route path="/catalog-import" element={<CatalogImportPage />} />
  </FlatRoutes>,
);

const app = createApp({
  features: [
    pagesPlugin,
    techRadarPlugin,
    techdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    ...collectedLegacyPlugins,
    createExtensionOverrides({
      extensions: [
        homePageExtension,
        scmAuthExtension,
        scmIntegrationApi,
        signInPage,
        notFoundErrorPage,
      ],
    }),
  ],
  /* Handled through config instead */
  // bindRoutes({ bind }) {
  //   bind(pagesPlugin.externalRoutes, { pageX: pagesPlugin.routes.pageX });
  // },
});

// const legacyApp = createLegacyApp({ plugins: [legacyGraphiqlPlugin] });

export default app.createRoot();

// const routes = (
//   <FlatRoutes>
//     {/* <Route path="/" element={<Navigate to="catalog" />} />
//     <Route path="/catalog" element={<CatalogIndexPage />} />
//     <Route
//       path="/catalog/:namespace/:kind/:name"
//       element={<CatalogEntityPage />}
//     >
//       <EntityLayout>
//         <EntityLayout.Route path="/" title="Overview">
//           <Grid container spacing={3} alignItems="stretch">
//             <Grid item md={6} xs={12}>
//               <EntityAboutCard variant="gridItem" />
//             </Grid>

//             <Grid item md={4} xs={12}>
//               <EntityLinksCard />
//             </Grid>
//           </Grid>
//         </EntityLayout.Route>

//         <EntityLayout.Route path="/todos" title="TODOs">
//           <EntityTodoContent />
//         </EntityLayout.Route>
//       </EntityLayout>
//     </Route>
//     <Route
//       path="/catalog-import"
//       element={
//           <CatalogImportPage />
//       }
//     /> */}
//     {/* <Route
//       path="/tech-radar"
//       element={<TechRadarPage width={1500} height={800} />}
//     /> */}
//     <Route path="/graphiql" element={<GraphiQLPage />} />
//   </FlatRoutes>
// );

// export default app.createRoot(
//   <>
//     {/* <AlertDisplay transientTimeoutMs={2500} />
//     <OAuthRequestDialog /> */}
//     <AppRouter>{routes}</AppRouter>
//   </>,
// );
