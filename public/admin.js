var sock = new SockJS('/data');
sock.onopen = function() {
    console.log('open');

};
sock.onmessage = function (e) {
    var msg = JSON.parse(e.data);
    console.log(e.data);
    switch (msg.Action) {
        case "Ack":
            var payload = { "Action": "SendUsers" };

            sock.send(JSON.stringify(payload));
            break;

        case "UserList":
            console.log(msg.data.users);
            for (var i in msg.data.users) {
                $('#UserTable > tbody:last').append('<tr><td>' + i + '</td><td>' + msg.data.users[i].name + '</td><td>' + msg.data.users[i].username + '</td><td>' + msg.data.users[i].password + '</td></tr>');
            }
            for (var i in msg.data.users[1].log) {
                $('#TimeTable > tbody:last').append('<tr><td>' + i + '</td><td>' + msg.data.users[1].log[i].inn + '</td><td>' + msg.data.users[1].log[i].ut + '</td><td>' + msg.data.users[1].log[i].ut + '</td></tr>');
            }
            break;

        case "AuthOk":
            console.log('AuthOK');
            $('#loader').hide(100, function () {
                boot();
            });
            break;
    }
};
sock.onclose = function () {
    console.log('close');
};