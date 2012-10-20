var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');
var mongoose = require('mongoose'), db = mongoose.createConnection('localhost', 'timetrack');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {



    //Db Ok load models
    var userschema = new mongoose.Schema({
        name: String,
        username: String,
        password: String,
        type: String,
        log: [{ id: String, inn: Date, ut: Date}]
    });

    var user = db.model('ponduser', userschema);

    //Initiate sockjs
    var sockjs_opts = { sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js" };
    var sockjs_data = sockjs.createServer(sockjs_opts);


    sockjs_data.on('connection', function (conn) {
        conn.write('{ "Action": "Ack" }');
        conn.on('data', function (message) {
            var msg = JSON.parse(message);
            switch (msg.Action) {
                //Admin           
                case "SendUsers":
                    //Send users TBD authentication
                    payload = { "Action": "UserList", data: {} };
                    user.find(function (err, users) {
                        if (err) {
                            conn.write('err');
                        }
                        payload.data.users = users;
                        conn.write(JSON.stringify(payload));
                    });
                    break;


                case "SampleTimes":
                    var logobj = [];
                    for (var i = 0; i < 10; i++) {
                            logobj[i] = { "id": i, "inn": Date.now(), "ut": Date.now() + 400000 };
                        }
                    user.findOne({ username: "rango" }).update({log:logobj});
                   break;
                case "Register":
                    var TempUser = new user({ name: "Rango the lizard", username: 'rango', password: "1234", type: "2", log: [] });
                    TempUser.save(function (err) {
                        if (err) {
                            conn.write('err2'); //Todo Log|Display Error
                        }
                        conn.write('ok');
                    });
                    var TempUser = new user({ name: "Spyro the dragon", username: 'flamez', password: "0000", type: "2", log: [] });
                    TempUser.save(function (err) {
                        if (err) {
                            conn.write('err2'); //Todo Log|Display Error
                        }
                        conn.write('ok');
                    });
                    break;
                case "Purge":
                    user.collection.drop();
                    break;
                case "ListUsers":

                    user.find(function (err, users) {
                        if (err) {
                            conn.write('err1');
                        }
                        conn.write(JSON.stringify(users));
                    });
                    break;
                case "Find":

                    break;
                case "DevUp":
                    //Am i alive
                    conn.write('I am alive!');
                    break;
            }
        });
    });










    // 2. Static files server
    var static_directory = new node_static.Server(__dirname);

    // 3. Usual http stuff
    var server = http.createServer();
    server.addListener('request', function (req, res) {
        static_directory.serve(req, res);
    });
    server.addListener('upgrade', function (req, res) {
        res.end();
    });

    sockjs_data.installHandlers(server, { prefix: '/data' });

    console.log(' [*] Listening on 0.0.0.0:9999');
    server.listen(process.env.PORT || 8080);
});


