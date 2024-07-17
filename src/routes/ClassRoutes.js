import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// class
const NewClass = Loadable(lazy(() => import('views/class/class-profile/NewClass')));
const ClassList = Loadable(lazy(() => import('views/class/class-list')));
const EditClass = Loadable(lazy(() => import('views/class/class-profile/EditClass')));
const Placeholder = Loadable(lazy(() => import('views/placeholder')));

// ==============================|| CLASS ROUTING ||============================== //

const ClassRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/class/edit-class/:id',
            element: <EditClass />
        },
        {
            path: '/class/new-class',
            element: <NewClass />
        },
        {
            path: '/class/class-list/',
            element: <ClassList />
        },
    ]
};

export default ClassRoutes;

export const ClassPlaceholderRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/class/edit-class/:id',
            element: <Placeholder />
        },
        {
            path: '/class/new-class',
            element: <Placeholder />
        },
        {
            path: '/class/class-list/',
            element: <Placeholder />
        },
    ]
};
