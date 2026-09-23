// Demo accounts behind the top-bar role switcher. Switching performs a real
// login, so the server still enforces each role's permissions.
// Set VITE_DEMO_SWITCH=false to hide the switcher (e.g. for a real deployment).

export const DEMO_SWITCH_ENABLED = import.meta.env.VITE_DEMO_SWITCH !== 'false';

export const DEMO_PASSWORD = 'demo1234';

export const DEMO_ACCOUNTS = {
  student: 'arjun.sharma@nitk.edu.in',
  industry: 'rahul.mehta@microsoft.demo',
  faculty: 'priya.nair@nitk.edu.in',
  institution: 'placement.nitk@edu.in',
};
