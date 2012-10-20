var sock = new SockJS('/data');
sock.onopen = function() {
    console.log('open');

};
sock.onmessage = function (e) {
    $('#Respons').append(e.data + "<br>");
};
sock.onclose = function() {
    console.log('close');
};
$(document).ready(function () {

    $('#Send').click(function(){
        sock.send( $('#Query').val());
        $('#Query').val('');
    })
});