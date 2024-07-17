import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// package
const NewPackage = Loadable(lazy(() => import('views/package/package-profile/NewPackage')));
const PackageList = Loadable(lazy(() => import('views/package/package-list')));
const PurchasePackage = Loadable(lazy(() => import('views/package/purchase')));
const EditPackage = Loadable(lazy(() => import('views/package/package-profile/EditPackage')));
const Placeholder = Loadable(lazy(() => import('views/placeholder')));

// ==============================|| PACKAGE ROUTING ||============================== //

const PackageRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/package/edit-package/:id',
            element: <EditPackage />
        },
        {
            path: '/package/new-package',
            element: <NewPackage />
        },
        {
            path: '/package/package-list/',
            element: <PackageList />
        },
        {
            path: '/package/purchase-package/:packageId',
            element: <PurchasePackage />
        },
    ]
};

export default PackageRoutes;

export const PackagePlaceholderRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/package/edit-package/:id',
            element: <Placeholder />
        },
        {
            path: '/package/new-package',
            element: <Placeholder />
        },
        {
            path: '/package/package-list/',
            element: <Placeholder />
        },
        {
            path: '/package/purchase-package/:packageId',
            element: <Placeholder />
        },
    ]
};