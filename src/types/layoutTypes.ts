// src/types/layoutTypes.ts

export interface HeaderConfig {
  logoSrc: string;
  logoWidthSm: number;
  logoHeightSm: number;
  logoWidthLg: number;
  logoHeightLg: number;
  mainTitle: string;
  subtitle: string;
  department: string;
}

export interface FooterConfig {
  copyrightYear: number;
  authors: string[];
  imprintUrl: string;
  privacyUrl: string;
}