if (!localStorage.getItem("player_id")){
    localStorage.setItem("player_id", makeid());
}

function create_room_setup() {
    $(".full_page").hide();
    $("#create_room_div").show();
}

function create_room_submit() {
    jQuery.ajax({
        url: "https://sage-lasertag-api.herokuapp.com/add_player_to_room",
        dataType: "json",
        type: "POST",
        data: {
            player_id: localStorage.getItem("player_id"),
            room_code: jQuery("#join_room_room_code").val(),
        },
        error: function (e) {
            console.log("error", e);
            alert("Error while trying to join existing room");
        },
        success:function (data) {

        }
    });
}

function join_existing_room_setup() {
    $(".full_page").hide();
    $("#join_room_div").show();
}

function join_existing_room_submit() {
    jQuery.ajax({
        url: "https://sage-lasertag-api.herokuapp.com/add_player_to_room",
        dataType: "json",
        type: "POST",
        data: {
            player_id: localStorage.getItem("player_id"),
            room_code: jQuery("#join_room_room_code").val(),
        },
        error: function (e) {
            console.log("error", e);
            alert("Error while trying to join existing room");
        },
        success:function (data) {

        }
    });
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
