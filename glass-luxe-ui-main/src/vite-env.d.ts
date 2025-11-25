/// <reference types="vite/client" />

// Type declarations for vite-imagetools
declare module '*?w=*&h=*&format=*&quality=*' {
  const value: string;
  export default value;
}

declare module '*?format=webp*' {
  const value: string;
  export default value;
}

declare module '*?w=*' {
  const value: string;
  export default value;
}
