// src/access.ts
export default function access(initialState: { hasRoutes?: string[] }) {
  const { hasRoutes } = initialState || {};
  const map = hasRoutes?.map((value) => {
    return { [value]: true };
  });

  const authorityFilter = (route: { name: string; authority?: string[] | string }) => {
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
  };
  return { authorityFilter, ...map };
}
