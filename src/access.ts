// src/access.ts
export default function access(initialState: { auth?: API.OAuth | undefined }) {
  const { auth } = initialState || {};
  const map = auth?.authorities?.map((value) => {
    return { [value]: true };
  });
  return map || {};
}
