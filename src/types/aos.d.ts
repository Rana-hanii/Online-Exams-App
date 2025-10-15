declare module 'aos' {
  const AOS: {
    init: (options?: Record<string, any>) => void;
    refresh: () => void;
    refreshHard: () => void;
  };
  export default AOS;
}
