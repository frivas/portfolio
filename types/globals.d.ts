// Shapes shared by the page scripts. Type-only: lives outside sites/, so it never deploys.
interface Project {
  name: string; tagline: string; description: string; stack: string[];
  url: string; repo?: string; kind: "site" | "landing"; shot: string; year: string | number;
}
declare var PROJECTS: Project[];
interface Window { PROJECTS: Project[] }
