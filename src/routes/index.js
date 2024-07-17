import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import Loadable from 'ui-component/Loadable';
import useAuth from 'hooks/useAuth';
import AttendanceRoutes, { AttendancePlaceholderRoutes } from './AttendanceRoutes';
import CompanyRoutes from './CompanyRoutes';
import PackageRoutes, { PackagePlaceholderRoutes } from './PackageRoutes';
import ClassRoutes, { ClassPlaceholderRoutes } from './ClassRoutes';
import GroupRoutes, { GroupPlaceholderRoutes } from './GroupRoutes';
import TeacherAttendanceRoutes, { TeacherAttendancePlaceholderRoutes } from './TeacherAttendanceRoutes';

// project imports
import { COMPANIES, MODULES, SUBSCRIPTION_STATUSES } from 'store/constant';

const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));
// const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication1/Login1')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { modules, user, organization } = useAuth();
    const userOrgId = user?.orgId;
    const isAdmin = user?.isAdmin;

    // Default routes
    let privateRoutes = [{ path: '/', element: <PagesLanding /> }, AuthenticationRoutes, LoginRoutes, MainRoutes];
    let placeholderRoutes = [{ path: '/', element: <PagesLanding /> }, AuthenticationRoutes, LoginRoutes, MainRoutes, AttendanceRoutes, TeacherAttendancePlaceholderRoutes, CompanyRoutes, PackagePlaceholderRoutes, ClassPlaceholderRoutes, GroupPlaceholderRoutes];

    // Admin Conditions
    if (isAdmin == true) {
        // Filter out path === '/company/company-list' from children array
        if (userOrgId !== COMPANIES.TECHMOU) {
            const updatedCompanyChildren = CompanyRoutes.children.filter(child => child.path !== '/company/company-list');

            // Create an updated CompanyRoutes object
            const updatedCompanyRoutes = {
                ...CompanyRoutes,
                children: updatedCompanyChildren
            };

            // Merge updatedCompanyRoutes into privateRoutes
            privateRoutes.push(updatedCompanyRoutes);
        } else if (userOrgId === COMPANIES.TECHMOU) {
            privateRoutes.push(CompanyRoutes);
        }

        // Main Routes
        privateRoutes.push(MainRoutes);
    } else {
        // Filter out path === '/user/account-profile/new-user' and '/company/company-profile' from children array
        const updatedMainChildren = MainRoutes.children.filter(child =>
            child.path !== '/user/account-profile/new-user' &&
            child.path !== '/company/company-profile'
        );

        // Create an updated MainRoutes object
        const updatedMainRoutes = {
            ...MainRoutes,
            children: updatedMainChildren
        };

        // Merge updatedMainRoutes into privateRoutes
        privateRoutes.push(updatedMainRoutes);
    }

    // Check subscription status
    const premium = organization?.subscriptionStatus === SUBSCRIPTION_STATUSES.PREMIUM ? true : true;

    // Check if user is logged in and is premium acc
    if (user !== null && user !== undefined && modules !== null && modules !== undefined && organization !== null && organization !== undefined && premium === true) {
        for (const moduleKey of Object.keys(MODULES)) {
            const moduleId = MODULES[moduleKey];
            const foundElement = modules.find(element => element.id === moduleId);

            if (foundElement) {
                handleFoundElement(moduleKey, privateRoutes);
            } else {
                handleNoElement(moduleKey, privateRoutes);
            }
        }
    }

    function handleFoundElement(moduleKey, privateRoutes) {
        switch (moduleKey) {
            case 'PACKAGE':
                privateRoutes.push(...[PackageRoutes]);
                break;
            case 'GROUP':
                privateRoutes.push(...[GroupRoutes]);
                break;
            case 'CLASS':
                privateRoutes.push(...[ClassRoutes]);
                break;
            case 'ATTENDANCE':
                privateRoutes.push(...[AttendanceRoutes]);
                break;
            case 'TEACHER ATTENDANCE':
                privateRoutes.push(...[TeacherAttendanceRoutes]);
                break;
            // Add more cases as needed
            default:
                break;
        }
    }

    function handleNoElement(moduleKey, privateRoutes) {
        switch (moduleKey) {
            case 'PACKAGE':
                privateRoutes.push(...[PackagePlaceholderRoutes]);
                break;
            case 'GROUP':
                privateRoutes.push(...[GroupPlaceholderRoutes]);
                break;
            case 'CLASS':
                privateRoutes.push(...[ClassPlaceholderRoutes]);
                break;
            case 'ATTENDANCE':
                privateRoutes.push(...[AttendancePlaceholderRoutes]);
                break;
            case 'TEACHER ATTENDANCE':
                privateRoutes.push(...[TeacherAttendancePlaceholderRoutes]);
                break;
            // Add more cases as needed
            default:
                break;
        }
    }

    // // Robin's WUSHU
    // if (userOrgId === COMPANIES.WUSHU) {
    //     privateRoutes.push(...[PackageRoutes, AttendanceRoutes, GroupRoutes]);
    // }

    // // Dvotion
    // if (userOrgId === COMPANIES.DVOTION) {
    //     privateRoutes.push(...[PackageRoutes, AttendanceRoutes, ClassRoutes]);
    // }

    // // Techmou
    // if (userOrgId === COMPANIES.TECHMOU) {
    //     privateRoutes.push(...[PackageRoutes, AttendanceRoutes, GroupRoutes, ClassRoutes]);
    // }

    // return useRoutes([{ path: '/', element: <PagesLanding /> }, AuthenticationRoutes, LoginRoutes, MainRoutes, AttendanceRoutes, CompanyRoutes, PackageRoutes, ClassRoutes, GroupRoutes]);
    let allRoutes

    // Check if user is logged in
    if (user !== null && user !== undefined && modules !== null && modules !== undefined && organization !== null && organization !== undefined) {
        if (premium === true) {
            allRoutes = privateRoutes
        } else {
            allRoutes = placeholderRoutes
        }
    } else {
        allRoutes = placeholderRoutes
    }
    return useRoutes(allRoutes);
}
