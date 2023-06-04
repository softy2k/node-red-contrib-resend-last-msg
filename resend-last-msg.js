module.exports = function (RED) {
  "use strict";

  function ResendLastMsgNode(config) {
    RED.nodes.createNode(this, config);

    let node = this;
    let data = new Map();

    let showInputCounter = config.showInputCounter;

    data.set("countIN", 0);
    data.set("redMSG", {});

    node.on("input", function (msg) {
      let counter = data.get("countIN");

      if (Object.keys(msg).length === 1) {
        if (counter === 0) {
          node.status({
            fill: "red",
            shape: "dot",
            text: "Nothing to resend",
          });
          this.error("Nothing to resend", msg);
          return;
        } else {
          const savedMsg = data.get("redMSG");
          node.status({ fill: "green", shape: "dot", text: "Resend Last" });

          msg = RED.util.cloneMessage(savedMsg);
        }
      } else {
        counter++;
        data.set("countIN", counter);

        if (showInputCounter)
          node.status({ fill: "blue", shape: "dot", text: counter });
        else node.status({ fill: "", shape: "", text: "" });

        data.set("redMSG", RED.util.cloneMessage(msg));
      }

      node.send(msg);
    });

    node.on("close", function () {
      node.status({ fill: "", shape: "", text: "" });
    });
  }
  RED.nodes.registerType("resend last", ResendLastMsgNode);
};
