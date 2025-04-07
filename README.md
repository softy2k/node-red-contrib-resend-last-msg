## node-red-contrib-resend-last-msg

A lightweight Node-RED node that allows you to resend the last received message by pressing a simple button. The node can also be controlled via an incoming message using ```msg._ResendLastMsg```


## Installation

You can install this node using the Node-RED palette manager:

1. Open Node-RED
2. Navigate to **Manage Palette > Install**
3. Search for `node-red-contrib-resend-last-msg` and install it

Alternatively, install it manually using npm:

```sh
npm install node-red-contrib-resend-last-msg
```

Run this command in your Node-RED user directory (typically `~/.node-red`).

## Usage

When this node receives a `msg` via input, it will:
- Pass it through to the output
- Store the message using a deep clone

The node will resend the last received message when the button is pressed.

### Options:
- **Resend only `msg.payload`** (optional)
- **Message Counter**: The node counts received messages, and the counter can reset automatically based on configured time and days of the week.


### Node Control (Version >= 1.1.0)
The node can also be controlled via an incoming message using `msg._ResendLastMsg`. This control property is not forwarded by the Resend Node.


### 1. Resend Last Message

Resend the entire message:
```json
msg._ResendLastMsg = {
    "resend": true
}
```

Resend only `msg.payload`:
```json
msg._ResendLastMsg = {
    "resend": "payload"
}
```

Resend a specific property, e.g., `msg.otherMsg`:
```json
msg._ResendLastMsg = {
    "resend": "otherMsg"
}
```

### 2. Reset Stored Message

Resets the stored message and counter:
```json
msg._ResendLastMsg = {
    "reset": true
}
```

### 3. Set Counter

Sets the message counter to a specific number:
```json
msg._ResendLastMsg = {
    "setCounter": 10
}
```

- The `setCounter` option can be used together with other control options.
- It accepts only positive numbers; otherwise, it defaults to `0`.


## Examples
Examples are provided using the default node-red way, i.e. use ```import``` in the editor menu and look for examples in the ```node-red-contrib-resend-last-msg``` package


## Usage Examples
The examples are available in the *examples* folder. You can import it directly from Node-RED.


## Example Flow

```json
[{"id":"8fba11ffe589acaf","type":"debug","z":"4ba6e23a9c2f889b","name":"Output","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":700,"y":1200,"wires":[]},{"id":"56900aa1d07a63cd","type":"inject","z":"4ba6e23a9c2f889b","name":"Generate Multiple Msg","props":[{"p":"payload"},{"p":"otherMsg","v":"Other message","vt":"str"},{"p":"someNumber","v":"123","vt":"num"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":240,"y":1080,"wires":[["f212fd37654926cc"]]},{"id":"f212fd37654926cc","type":"resend last","z":"4ba6e23a9c2f889b","name":"","msgPayloadOnly":false,"showInputCounter":true,"resetCounter":false,"repeat":"","crontab":"00 00 * * *","x":545,"y":1200,"wires":[["8fba11ffe589acaf"]],"l":false},{"id":"f20de8b47f441836","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1200,"wires":[["fbe4bbb65988e829"]]},{"id":"fbe4bbb65988e829","type":"function","z":"4ba6e23a9c2f889b","name":"Resend All","func":"msg._ResendLastMsg = {\n    resend: true,   // will resend entire msg\n}\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":290,"y":1200,"wires":[["f212fd37654926cc"]]},{"id":"e4e55ce091a87ee4","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1380,"wires":[["bbc7a8acb76a69e4"]]},{"id":"bbc7a8acb76a69e4","type":"function","z":"4ba6e23a9c2f889b","name":"Reset Msg","func":"msg._ResendLastMsg = {\n    reset: true, // reset (delete) entire stored msg and set counter to 0\n}\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":290,"y":1380,"wires":[["f212fd37654926cc"]]},{"id":"c3cf1e27e9304a28","type":"inject","z":"4ba6e23a9c2f889b","name":"Generate Payload Only","props":[{"p":"payload"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":240,"y":1120,"wires":[["f212fd37654926cc"]]},{"id":"33de9c16e24f8a1c","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1280,"wires":[["6407db61b7b27616"]]},{"id":"6407db61b7b27616","type":"function","z":"4ba6e23a9c2f889b","name":"otherMsg Only","func":"msg._ResendLastMsg = {\n    resend: 'otherMsg', // will resend only msg.otherMsg\n}\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":300,"y":1280,"wires":[["f212fd37654926cc"]]},{"id":"2ec40bfbe5d41840","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1460,"wires":[["77019a09790b2c04"]]},{"id":"77019a09790b2c04","type":"function","z":"4ba6e23a9c2f889b","name":"Combined Options","func":"msg._ResendLastMsg = {\n    resend: true,\n    setCounter: 20,   \n}\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":310,"y":1460,"wires":[["f212fd37654926cc"]]},{"id":"6f89ef4930c39348","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1520,"wires":[["1b762a0c92fe5231"]]},{"id":"1b762a0c92fe5231","type":"function","z":"4ba6e23a9c2f889b","name":"Invalid Msg","func":"msg._ResendLastMsg = {} // invalid config message (must have at least one key)\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":290,"y":1520,"wires":[["f212fd37654926cc"]]},{"id":"1caf71f8cc8dcd45","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1240,"wires":[["d6a12d45572735f6"]]},{"id":"d6a12d45572735f6","type":"function","z":"4ba6e23a9c2f889b","name":"Payload Only","func":"msg._ResendLastMsg = {\n    resend: 'payload',  // will resend only msg.payload\n}\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":290,"y":1240,"wires":[["f212fd37654926cc"]]},{"id":"ffc2c14fd266379d","type":"function","z":"4ba6e23a9c2f889b","name":"Set Counter","func":"msg._ResendLastMsg = {\n    setCounter: 10,\n}\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":290,"y":1420,"wires":[["f212fd37654926cc"]]},{"id":"a411696ba0fe85fa","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1320,"wires":[["1cdf57a6e9421246"]]},{"id":"1cdf57a6e9421246","type":"function","z":"4ba6e23a9c2f889b","name":"Invalid Key","func":"msg._ResendLastMsg = {\n    resend: 'abcd',  // msg.abcd does not exist and will trigger an error\n}\n\n\n\nreturn msg;","outputs":1,"timeout":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":290,"y":1320,"wires":[["f212fd37654926cc"]]},{"id":"b8fda9f8df9c403b","type":"inject","z":"4ba6e23a9c2f889b","name":"Send","props":[],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":1420,"wires":[["ffc2c14fd266379d"]]}]
```

## License

Licensed under the [Apache License 2.0](LICENSE).

[Node-RED]: https://nodered.org/
