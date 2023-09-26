module.exports = function (RED) {
  "use strict";
  const { scheduleTask } = require("cronosjs");

  function ResendLastMsgNode(config) {
    RED.nodes.createNode(this, config);

    let node = this;
    node.status({ fill: "", shape: "", text: "" });

    let data = new Map();

    let msgPayloadOnly = config.msgPayloadOnly;
    if (msgPayloadOnly === undefined) msgPayloadOnly = false;

    let showInputCounter = config.showInputCounter;
    if (showInputCounter === undefined) showInputCounter = true;

    let resetCounter = config.resetCounter;
    if (resetCounter === undefined) resetCounter = false;

    let cronExpression = config.crontab;
    let task = null;

    if (showInputCounter && resetCounter) {
      task = scheduleTask(cronExpression, () => {
        data.set("countIN", 0);
        node.status({ fill: "yellow", shape: "dot", text: 0 });
      });
    }

    data.set("redMSG", {});
    data.set("countIN", 0);

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
        if (msgPayloadOnly)
          data.set("redMSG", { payload: RED.util.cloneMessage(msg.payload) });
        else data.set("redMSG", RED.util.cloneMessage(msg));

        counter++;
        data.set("countIN", counter);

        if (showInputCounter)
          node.status({ fill: "blue", shape: "dot", text: counter });
        else node.status({ fill: "", shape: "", text: "" });
      }

      node.send(msg);
    });

    node.on("close", function () {
      node.status({ fill: "", shape: "", text: "" });

      task.stop();
      done();
    });
  }

  RED.nodes.registerType("resend last", ResendLastMsgNode);
};
