// src/access.ts
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default (initialState: {
  settings?: LayoutSettings;
  currentUser?: API.CurrentUserVO;
}) => {
  const hasRoutes = initialState?.currentUser?.authorities || [];

  // const map = hasRoutes?.map((value) => {
  //   return { [value]: true };
  // });

  return {
    authorityFilter:  (route: { name: string; authority?: string[] | string }) => {
      const { authority } = route;
      // 数组处理
      if (Array.isArray(authority)) {
        if (authority.some((item) => hasRoutes?.includes(item))) {
          return true;
        }
      } else if (typeof authority === 'string' && hasRoutes?.includes(authority)) {
        return true;
      }
      return false;
    },
    hashRoles:  (roles: string[]): boolean =>  {
      // 数组处理
      if (Array.isArray(roles)) {
        if (roles.some((item) => hasRoutes?.includes(item))) {
          return true;
        }
      }
      return false;
    }

  };
}
