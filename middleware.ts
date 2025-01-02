import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Make the UploadThing webhook endpoint public
  publicRoutes: ["/api/uploadthing"],
  
  // Optional: If you have other public routes, include them here
  // publicRoutes: ["/api/uploadthing", "/api/other-public-route"],
  
  // Protect all other routes that start with /api
  apiRoutes: ["/api(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
