import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // Define custom properties for route meta here (optional)
    requiresAuth?: boolean;
  }
}
