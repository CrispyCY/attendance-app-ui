import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// company
const CompanyList = Loadable(lazy(() => import('views/company/company-list')));
const CompanyProfile = Loadable(lazy(() => import('views/company/company-profile')));

// ==============================|| COMPANY ROUTING ||============================== //

const CompanyRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/company/company-list',
            element: <CompanyList />
        },
        {
            path: '/company/company-profile/:id',
            element: <CompanyProfile />
        },
    ]
};

export default CompanyRoutes;
