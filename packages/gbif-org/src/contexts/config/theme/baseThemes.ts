import { Theme } from "./theme";

export const defaultTheme: Partial<Theme> = {
  dense: true,
  primary: '#1393D8',
  fontSize: '15px',
  background: '#f1f5f8',
  paperBackground: '#ffffff',
  paperBorderColor: '#e5ebed',
  color: '#162d3d',
  isDarkTheme: false,
  fontFamily: '"Helvetica Neue", BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica", "Arial", sans-serif',
  borderRadius: 3,
  drawerZIndex: 1000,
  stickyOffset: '0px'
};

export const darkTheme: Partial<Theme> = {
  dense: true,
  primary: '#39af5d',
  fontSize: '14px',
  background: '#151515',
  paperBackground: '#2d2d2d',
  paperBackgroundElevated: '#3e3e3e',
  paperBorderColor: '#0b0d13',
  color: '#e3e5ea',
  isDarkTheme: true,
  fontFamily: 'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
  borderRadius: 3,
};