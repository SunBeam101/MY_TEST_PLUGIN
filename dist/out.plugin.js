(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // lib/plugin.js
  var getNodeEnv = () => {
    if (typeof process === "undefined" || !process) {
      return null;
    }
    return process.env ? "development" : null;
  };
  var camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());
  var plugin = {
    // --------------------------------------------------------------------------------------
    constants: {},
    async _loadModule(moduleName, url) {
      const camelcaseModuleName = camelize(moduleName);
      const titleCaseModuleName = camelcaseModuleName.substring(0, 1).toUpperCase() + camelcaseModuleName.substring(1);
      console.log("CAMEL", camelcaseModuleName);
      console.log("TITLE", titleCaseModuleName);
      if (this[`_haveLoaded${titleCaseModuleName}`]) {
        return;
      }
      if (getNodeEnv() === "test") {
        const module = await import(moduleName);
        window[camelcaseModuleName] = module;
        return;
      }
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url || `https://unpkg.com/${moduleName}`);
        script.addEventListener("load", function() {
          this[`_haveLoaded${titleCaseModuleName}`] = true;
          resolve(true);
        });
        document.body.appendChild(script);
      });
    },
    async _loadDateFNS() {
      if (getNodeEnv() === "test") {
        const dateFns = await import("date-fns");
        window.dateFns = dateFns;
        return;
      }
      if (this._haveLoadedDateFNS) return Promise.resolve(true);
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "https://unpkg.com/date-fns/cdn.min.js");
        script.addEventListener("load", function() {
          this._haveLoadedDateFNS = true;
          resolve(true);
        });
        document.body.appendChild(script);
      });
    },
    // --------------------------------------------------------------------------
    // https://www.amplenote.com/help/developing_amplenote_plugins#insertText
    insertText: {
      "Test Plugin": {
        async run(app) {
          try {
            await this._loadModule("date-fns", "https://unpkg.com/date-fns/cdn.min.js");
            const dateFns = window.dateFns;
            return `Hello world! ${dateFns.format(/* @__PURE__ */ new Date(), "'Today is a' eeee")}`;
          } catch (e) {
            console.error("ERROR", e);
          }
        },
        check(app) {
          return app.context.taskUUID ? "Click me so hard" : "Da-te dreq";
        }
      }
    },
    // --------------------------------------------------------------------------
    // https://www.amplenote.com/help/developing_amplenote_plugins#noteOption
    noteOption: {},
    // --------------------------------------------------------------------------
    // https://www.amplenote.com/help/developing_amplenote_plugins#replaceText
    replaceText: {}
    // There are several other entry points available, check them out here: https://www.amplenote.com/help/developing_amplenote_plugins#Actions
    // You can delete any of the insertText/noteOptions/replaceText keys if you don't need them
  };
  var plugin_default = plugin;
  return plugin;
})()
