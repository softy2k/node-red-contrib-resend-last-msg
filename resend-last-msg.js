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

      if ("_ResendLastMsg" in msg) {
        const resendOptions = msg._ResendLastMsg || {};
        const resendKeys = Object.keys(resendOptions).length;

        if (resendKeys > 0) {
          if ("setCounter" in resendOptions) {
            const newCounter = Math.max(
              parseInt(resendOptions.setCounter, 10) || 0,
              0
            );
            data.set("countIN", newCounter);
            node.status({ fill: "yellow", shape: "dot", text: newCounter });
            if (resendKeys === 1) return; // Exit if this was the only option
          }

          const savedMsg = data.get("redMSG");
          const hasSavedMsg = Object.keys(savedMsg || {}).length > 0;

          if (resendOptions.resend) {
            if (!hasSavedMsg) {
              node.status({
                fill: "yellow",
                shape: "dot",
                text: "Nothing to resend",
              });
              node.error("Nothing to resend", msg);
              return;
            }

            if (resendOptions.resend === true) {
              node.status({ fill: "green", shape: "dot", text: "Resend All" });
              node.send(RED.util.cloneMessage(savedMsg));
            } else if (resendOptions.resend in savedMsg) {
              node.status({
                fill: "blue",
                shape: "dot",
                text: `Resend ${resendOptions.resend}`,
              });
              node.send({
                [resendOptions.resend]: savedMsg[resendOptions.resend],
              });
            } else {
              node.status({
                fill: "yellow",
                shape: "dot",
                text: "Invalid Resend Key",
              });
              node.error(
                `Requested key '${resendOptions.resend}' does not exist in saved message`,
                msg
              );
            }
            return;
          }

          if (resendOptions.reset) {
            data.set("redMSG", undefined);
            data.set("countIN", 0);
            node.status({ fill: "red", shape: "dot", text: "Reset Msg" });
            return;
          }

          node.status({ fill: "yellow", shape: "dot", text: "Nothing to do" });
          return;
        } else {
          node.status({
            fill: "yellow",
            shape: "dot",
            text: "Empty config msg",
          });
          node.error(`msg._ResendLastMsg is empty`);
          return;
        }
      }

      if (Object.keys(msg).length === 1) {
        if (counter === 0) {
          node.status({ fill: "red", shape: "dot", text: "Nothing to resend" });
          node.error("Nothing to resend", msg);
          return;
        }

        msg = RED.util.cloneMessage(data.get("redMSG")); // Restoring Previous Message
        node.status({ fill: "green", shape: "dot", text: "Resend Last" });
      } else {
        // Storing new message
        data.set(
          "redMSG",
          msgPayloadOnly
            ? { payload: RED.util.cloneMessage(msg.payload) }
            : RED.util.cloneMessage(msg)
        );

        counter++;
        data.set("countIN", counter);

        if (showInputCounter)
          node.status({ fill: "blue", shape: "dot", text: counter });
        else node.status({ fill: "", shape: "", text: "" });
      }

      node.send(msg); // Sending Message
    });

    node.on("close", function () {
      node.status({ fill: "", shape: "", text: "" });

      task.stop();
      done();
    });
  }

  RED.nodes.registerType("resend last", ResendLastMsgNode);
};
