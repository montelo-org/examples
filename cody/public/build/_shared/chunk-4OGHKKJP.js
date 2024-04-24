import {
  __commonJS
} from "/build/_shared/chunk-PNG5AS42.js";

// node_modules/refractor/lang/hsts.js
var require_hsts = __commonJS({
  "node_modules/refractor/lang/hsts.js"(exports, module) {
    module.exports = hsts;
    hsts.displayName = "hsts";
    hsts.aliases = [];
    function hsts(Prism) {
      Prism.languages.hsts = {
        directive: {
          pattern: /\b(?:includeSubDomains|max-age|preload)(?=[\s;=]|$)/i,
          alias: "property"
        },
        operator: /=/,
        punctuation: /;/
      };
    }
  }
});

export {
  require_hsts
};
//# sourceMappingURL=/build/_shared/chunk-4OGHKKJP.js.map
