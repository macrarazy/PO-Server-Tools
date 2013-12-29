Commands.register('rules', function (info) {
    var template = Template('basic', 'Rules');
    template.register([
        "<b>1</b>) Do not spam or overuse CAPS. The bots can mute you for it.",
        "<b>2</b>) Do not flood or spam the chat. The bots can kick you for it.",
        "<b>3</b>) Do not complain about hax. It's part of the game.",
        "<b>4</b>) Do not time stall in a battle. 'Time Stalling' means you wait until your opponent forfeits by not making moves. If you are absent for a couple of minutes, say so.",
        "<b>5</b>) Do not troll. This is very, very annoying. Doing this will get you kicked, muted, or banned, on sight.",
        "<b>6</b>) Do not flame or insult. People don't like this.",
        "<b>7</b>) Sexism, racism, or anything similar is not allowed.",
        "<b>8</b>) Do not advertise. Links like pictures and videos are ok when they don't break the other rules.",
        "<b>9</b>) No obscene, pornographic, or illegal content. This will be an instant ban in most cases.",
        "<b>10</b>) Do not ask to be auth. Doing this will usually ruin your chances to ever be one.",
        "<b>11</b>) Do not mini-moderate. Mini-Moderating means you act like a moderator, while you're not. Contact an authority instead.",
        "<b>12</b>) Do not ban evade. Doing so will result in an instant (range)ban.",
        "<b>13</b>) Do not blackmail. This will result in an instant mute/ban/rangeban.",
        "<br/><b>If the server authority think it is necessary to punish someone, they are allowed to do so. Report them to higher powers if you think you have been abused.</b>",
        "The server authority <u>do not</u> have to apply these rules."
    ]);

    template.render(info.src, info.chan);
});
