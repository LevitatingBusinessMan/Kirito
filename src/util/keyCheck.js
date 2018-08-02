module.exports = function(Kirito) {
    for (var keyName in Kirito.config.keys) {
        let key = Kirito.config.keys[keyName];
        let disabledCommands = [];
        if (!key) {
            for (var commandName in Kirito.commands) {
                if (Kirito.commands[commandName].conf.requires.includes(keyName)) {
                    Kirito.commands[commandName].conf.disabled = true;
                    disabledCommands.push(commandName);
                }
            }
            Kirito.log('warn',`The ${keyName} key is missing, disabled commands: ${disabledCommands.join(', ')}`)
        }
    }
}