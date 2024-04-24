import {
  require_lua
} from "/build/_shared/chunk-IWFLW7YN.js";
import {
  require_markup_templating
} from "/build/_shared/chunk-FDPXNRAA.js";
import {
  __commonJS
} from "/build/_shared/chunk-PNG5AS42.js";

// node_modules/refractor/lang/etlua.js
var require_etlua = __commonJS({
  "node_modules/refractor/lang/etlua.js"(exports, module) {
    var refractorLua = require_lua();
    var refractorMarkupTemplating = require_markup_templating();
    module.exports = etlua;
    etlua.displayName = "etlua";
    etlua.aliases = [];
    function etlua(Prism) {
      Prism.register(refractorLua);
      Prism.register(refractorMarkupTemplating);
      (function(Prism2) {
        Prism2.languages.etlua = {
          delimiter: {
            pattern: /^<%[-=]?|-?%>$/,
            alias: "punctuation"
          },
          "language-lua": {
            pattern: /[\s\S]+/,
            inside: Prism2.languages.lua
          }
        };
        Prism2.hooks.add("before-tokenize", function(env) {
          var pattern = /<%[\s\S]+?%>/g;
          Prism2.languages["markup-templating"].buildPlaceholders(
            env,
            "etlua",
            pattern
          );
        });
        Prism2.hooks.add("after-tokenize", function(env) {
          Prism2.languages["markup-templating"].tokenizePlaceholders(env, "etlua");
        });
      })(Prism);
    }
  }
});

export {
  require_etlua
};
//# sourceMappingURL=/build/_shared/chunk-P4YXX546.js.map
