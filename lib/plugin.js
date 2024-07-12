const getNodeEnv = () => {
  if (typeof process === 'undefined' || !process) {
    return null;
  }

  return process.env ? process.env.NODE_ENV : null;
}

const camelize = s => s.replace(/-./g, x=>x[1].toUpperCase())


const plugin = {
  // --------------------------------------------------------------------------------------
  constants: {
  },

  async _loadModule(moduleName, url) {
    const camelcaseModuleName = camelize(moduleName);
    const titleCaseModuleName = camelcaseModuleName.substring(0, 1).toUpperCase() + camelcaseModuleName.substring(1);

    if (this[`_haveLoaded${titleCaseModuleName}`]) {
      return;
    }

    if (getNodeEnv() === 'test') {
      const module = await import(moduleName);

      window[camelcaseModuleName] = module;
      return;
    }

    return new Promise(resolve => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", url || `https://unpkg.com/${moduleName}`)
      script.addEventListener("load", function() {
        this[`_haveLoaded${titleCaseModuleName}`] = true;
        resolve(true);
      });
      document.body.appendChild(script);
    })
  },

  async _loadDateFNS (){
    if (getNodeEnv() === 'test') {
      const dateFns = await import('date-fns');

      window.dateFns = dateFns;
      return;
    }
    // console.log("ENV", process.env)
    // console.log("window", window)
    if (this._haveLoadedDateFNS) return Promise.resolve(true);

    return new Promise(resolve => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", "https://unpkg.com/date-fns/cdn.min.js")
      script.addEventListener("load", function() {
        this._haveLoadedDateFNS = true;
        resolve(true);
      });
      document.body.appendChild(script);
    })
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#insertText
  insertText: {
    "Test Plugin": {
      async run (app) {
        try {
          await this._loadModule('date-fns', 'https://unpkg.com/date-fns/cdn.min.js')
          const dateFns = window.dateFns;
          
          return `Hello world! ${dateFns.format(new Date(), "'Today is a' eeee")}`;
        } catch (e) {
          console.error("ERROR", e);
        }
      },
      check (app) {
        return app.context.taskUUID ? "Click me so hard" : "Da-te dreq"
      }
    }
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#noteOption
  noteOption: {
  },

  // --------------------------------------------------------------------------
  // https://www.amplenote.com/help/developing_amplenote_plugins#replaceText
  replaceText: {
  },

  // There are several other entry points available, check them out here: https://www.amplenote.com/help/developing_amplenote_plugins#Actions
  // You can delete any of the insertText/noteOptions/replaceText keys if you don't need them
};
export default plugin;
