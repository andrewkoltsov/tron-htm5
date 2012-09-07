socket = null;
strings = {
    'connected': '[sys][time]%time%[/time]: You connected as [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: User [user]%name%[/user] connected.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: User [user]%name%[/user] exit.[/sys]'
};

function enable_chat() {
    socket = io.connect('/');
    socket.on('connect', function () {

    });
    socket.on('message', function (msg) {
        document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
        document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
    });

    document.querySelector('#input').onkeypress = function(e) {
        if (e.which == '13') {
            socket.send(escape(document.querySelector('#input').value));
            document.querySelector('#input').value = '';
        }
    };
    document.querySelector('#send').onclick = function() {
        socket.send(escape(document.querySelector('#input').value));
        document.querySelector('#input').value = '';
    };
}