const publicView = require("./Public.svelte");
const threadView = require("./Thread.svelte");

patchfox.package({
  name: "hub",
  publicView,
  threadView,
  view: publicView,
  menu: {
    group: "Hub",
    items: [
      {
        label: "Public feed",
        event: "package:go",
        data: {
          pkg: "hub",
          view: "publicView"
        }
      }
    ]
  }
})