export { renderers } from '../../renderers.mjs';

const GET = async ({ cookies, redirect }) => {
  cookies.delete("admin_session", { path: "/" });
  return redirect("/admin", 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
