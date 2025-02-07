/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Button } from '@backstage/core-components';
import {
  coreComponentRefs,
  createComponentExtension,
} from '@backstage/frontend-plugin-api';
import { Box, Typography } from '@material-ui/core';
import React from 'react';

export function CustomNotFoundErrorPage() {
  return (
    <Box
      component="article"
      width="100%"
      height="100vh"
      display="grid"
      textAlign="center"
      alignContent="center"
      justifyContent="center"
      justifyItems="center"
    >
      <Typography variant="h1">404</Typography>
      <Typography color="textSecondary" paragraph style={{ width: 300 }}>
        Unable to locate this page. Please contact your support team if this
        page used to exist.
      </Typography>
      <Button
        variant="contained"
        to="/"
        style={{ marginTop: '1rem', width: 200 }}
      >
        Go home
      </Button>
    </Box>
  );
}

export default createComponentExtension({
  ref: coreComponentRefs.notFoundErrorPage,
  loader: { sync: () => CustomNotFoundErrorPage },
});
