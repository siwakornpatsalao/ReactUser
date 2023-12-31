import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';
import BuildingStorefrontIcon from '@heroicons/react/24/solid/BuildingStorefrontIcon';
import CakeIcon from '@heroicons/react/24/solid/CakeIcon';
import PhotoIcon from '@heroicons/react/24/solid/PhotoIcon';
import DocIcon from '@heroicons/react/24/solid/NewspaperIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';


export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
/*   {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  }, */
/*   {
    title: 'Companies',
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  }, */
  {
    title: 'Order',
    path: '/order',
    icon: (
      <SvgIcon fontSize="small">
        <EyeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Menu',
    path: '/menu',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingStorefrontIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Addon',
    path: '/addon',
    icon: (
      <SvgIcon fontSize="small">
        <CakeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Promotion',
    path: '/promotion',
    icon: (
      <SvgIcon fontSize="small">
        <PhotoIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Report',
    path: '/report',
    icon: (
      <SvgIcon fontSize="small">
        <DocIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Index2',
    path: '/index2',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
/*   {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  }, */
  /* {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  }, */
  /* {
    title: 'Login',
    path: '/auth/login',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Register',
    path: '/auth/register',
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    )
  }, */
/*   {
    title: 'Error',
    path: '/404',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  } */
];
