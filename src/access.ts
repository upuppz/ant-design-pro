// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUserVO | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
