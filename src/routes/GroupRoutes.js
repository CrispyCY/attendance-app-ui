import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// group
const NewGroup = Loadable(lazy(() => import('views/group/group-profile/NewGroup')));
const GroupList = Loadable(lazy(() => import('views/group/group-list')));
const EditGroup = Loadable(lazy(() => import('views/group/group-profile/EditGroup')));
const Placeholder = Loadable(lazy(() => import('views/placeholder')));

// ==============================|| CLASS ROUTING ||============================== //

const GroupRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/group/edit-group/:id',
            element: <EditGroup />
        },
        {
            path: '/group/new-group',
            element: <NewGroup />
        },
        {
            path: '/group/group-list/',
            element: <GroupList />
        },
    ]
};

export default GroupRoutes;

export const GroupPlaceholderRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/group/edit-group/:id',
            element: <Placeholder />
        },
        {
            path: '/group/new-group',
            element: <Placeholder />
        },
        {
            path: '/group/group-list/',
            element: <Placeholder />
        },
    ]
};
