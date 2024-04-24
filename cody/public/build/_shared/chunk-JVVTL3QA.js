import {
  createHotContext
} from "/build/_shared/chunk-JMQ5UUVC.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/context/socket.tsx
var import_react = __toESM(require_react());
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/context/socket.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/context/socket.tsx"
  );
  import.meta.hot.lastModified = "1712192322426.98";
}
var SocketContext = (0, import_react.createContext)(void 0);
function useSocket() {
  _s();
  return (0, import_react.useContext)(SocketContext);
}
_s(useSocket, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function SocketProvider({
  socket,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SocketContext.Provider, { value: socket, children }, void 0, false, {
    fileName: "app/context/socket.tsx",
    lineNumber: 33,
    columnNumber: 10
  }, this);
}
_c = SocketProvider;
var _c;
$RefreshReg$(_c, "SocketProvider");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  useSocket,
  SocketProvider
};
//# sourceMappingURL=/build/_shared/chunk-JVVTL3QA.js.map
