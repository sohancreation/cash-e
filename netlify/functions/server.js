import server from "../../dist/server/server.js";

export default async (request, context) => {
  try {
    // Pipe the standard Request directly into the compiled TanStack Start server
    return await server.fetch(request, {}, {});
  } catch (error) {
    console.error("Netlify Function SSR Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
