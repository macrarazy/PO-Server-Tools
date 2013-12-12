Commands.register('commands', function (info) {
    var template = Template('command', 'Commands');
    template.register([
        ['help', 'Displays a list of helpful topics.'],
        ['usercommands', 'Displays a list of commands for users.'],
        // messagecommands, stylecommands, iconcommands
        ['channelcommands', 'Displays a list of commands for channels.'],
        ['tourcommands', 'Displays a list of commands for tournaments.']
    ]);
    
    // modcommands, admincommands, ownercommands
    template.render(info.src, info.chan);
});
