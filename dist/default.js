//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = /* @__PURE__ */ ((n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)))((/* @__PURE__ */ o(((e, t) => {
	t.exports = {};
})))(), 1);
function l() {
	let e = c.default.resolve(process.cwd(), "src");
	return {
		name: "keychord",
		resolveId(t) {
			if (!t.startsWith("@/")) return;
			let n = t.slice(2), r = [
				c.default.join(e, n),
				c.default.join(e, n + ".ts"),
				c.default.join(e, n + ".tsx"),
				c.default.join(e, n + ".js"),
				c.default.join(e, n + ".jsx"),
				c.default.join(e, n, "index.ts"),
				c.default.join(e, n, "index.tsx")
			];
			for (let e of r) if (c.default.existsSync(e)) return e;
			throw Error(`Cannot resolve ${t}`);
		}
	};
}
//#endregion
export { l as default };
