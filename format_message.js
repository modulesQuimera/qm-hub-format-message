module.exports = function(RED) {

    // "use strict";
    function format_messageNode(config) {
        RED.nodes.createNode(this, config);
        // this.message_in = config.message_in;
        this.message_ref = config.message_ref;
        this.message_target = config.message_target;
        var node = this;

        node.on('input', function(msg, send, done) {
            var globalContext = node.context().global;
            var currentMode = globalContext.get("currentMode");
            var command = {
                type: "processing_modular_V1_0",
                slot: 1,
                method: "format_message",
                message_in: "",
                message_ref: node.message_ref,
                step_message_target: node.message_target,
                get_output:{ message_in: "message_received" },
                compare: {},
            };
            var file = globalContext.get("exportFile");
            var slot = globalContext.get("slot");
            if(!(slot === "begin" || slot === "end")){
                if(currentMode == "test"){
                    file.slots[slot].jig_test.push(command);
                }
                else{
                    file.slots[slot].jig_error.push(command);
                }
            }
            else{
                if(slot === "begin"){
                    file.slots[0].jig_test.push(command);
                    // file.begin.push(command);
                }
                else{
                    file.slots[3].jig_test.push(command);
                    // file.end.push(command);
                }
            }
            globalContext.set("exportFile", file);
            console.log(command);
            send(msg);
        });
    }
    RED.nodes.registerType("format_message", format_messageNode);
};