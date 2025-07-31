/* 
*	 Copyright 2025 Software GmbH (previously Software AG)
*    
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*    
*      http://www.apache.org/licenses/LICENSE-2.0
*    
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

import React from 'react';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


// Component Imports
import Welcome from './Components/general/Welcome';
import Overview from './Components/views/overview/Overview';
import Layout from './Components/general/Layout';
import AasForm from './Components/views/aas/AasForm';
import ErrorModal from './Components/general/ErrorModal';
import AasShow from './Components/views/aas/AasShow';
import Login from './Components/views/login/Login.js';
import ProtectedSite from './Components/views/login/ProtectedSite.js';
import useToken from './helper/useToken.js';
import AdminPanel from './Components/views/admin/AdminPanel.js';

// Helper and Context Imports
import { AasDataProvider } from './Components/AasDataContext.js';
import { fetchOneAasEdit as loaderEdit, fetchOneAasShow as loaderShow } from './helper/aasHelper';


function App() {
  const { token, setToken } = useToken();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout token={token} setToken={setToken}/>,
      errorElement: <ErrorModal />,
      children: [
        {
          index: true,
          element: <Welcome />,
        },
        {
          path: 'login',
          element: <Login setToken={setToken} />,
        },
        {
          path: 'admin',
          element: token ? <AdminPanel/> : <Login setToken={setToken} />
        }, 
        {
          path: 'aas',
          element: (
            <AasDataProvider>
              <Outlet />
            </AasDataProvider>
          ),
          children: [
            {
              index: true,
              element: <Overview token={token} />,
            },
            {
              path: 'edit',
              element: token ? <AasForm /> : <Login setToken={setToken} />,
              loader: loaderEdit,
            },
            {
              path: 'show',
              element: <AasShow />,
              loader: loaderShow,
            },
            {
              path: 'new',
              element: token ? <AasForm /> : <Login setToken={setToken} />,
            }
          ],
        },
      ],
    },
  ]);

  return (
    <div className="App" id="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
