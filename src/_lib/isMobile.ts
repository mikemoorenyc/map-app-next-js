// utils/isMobile.ts
export const isMobile = (userAgent:string) => {
  return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
};
