var sock = new SockJS('http://localhost:57242/data');
sock.onopen = function() {
    console.log('open');

};
sock.onmessage = function (e) {
    console.log('message', e.data);

    var msg = JSON.parse(e.data);
    switch (msg.Action) {
        case "RequestAuth":
            console.log('auth');
            var payload = { "Action": "AuthStatus" };
            if (localStorage.account) {
                payload.account = localStorage.account;
                sock.send(JSON.stringify(payload));
            }
            else {
                payload.account = "Guest";
                sock.send(JSON.stringify(payload));
                $('#loginloader').hide(100, function () {
                    $('#loginbox').show(200);
                });
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
sock.onclose = function() {
    console.log('close');
};
$(document).ready(function () {


    $('#loginbutton').click(function () {


        $('#loginbox').hide(100, function () {
            $('#loader').show(200);
            var payload = { "Action": "DoAuth", "Data": {
                "User": "Gutti",
                "Pass": "Gatti"
            }
            };
            sock.send(JSON.stringify(payload));
        });
        return false;
    });

});