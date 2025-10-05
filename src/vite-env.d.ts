/// <reference types="vite/client" />

// CSS 파일을 side-effect import로 허용
declare module '*.css';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss';

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}