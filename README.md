## node-red-contrib-resend-last-msg

A lightweight node that allows you to resend the last received message, by pressing a simple button. Especially useful for diagnostics.

## Install

Use the Manage Palette > Install option from the menu inside node-red

or

Run the following npm command in your Node-RED user directory (typically ~/.node-red):

```
npm install node-red-contrib-resend-last-msg
```

## Usage

When this node receives a msg via input it will pass it through and store it (using deep clone).
The node will resend the last received msg when the button is pressed.
In addition, the node also counts the received messages.

## License

Licensed under the [Apache License 2.0](LICENSE)

[Node-RED]: https://nodered.org/
