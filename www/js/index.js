if (!localStorage.getItem("player_id")){
    localStorage.setItem("player_id", makeid());
}

function start_match() {
    jQuery.ajax({
        url: "https://sage-lasertag-api.herokuapp.com/start_match",
        dataType: "json",
        type: "POST",
        data: {
            player_id: localStorage.getItem("player_id"),
            room_code: localStorage.getItem("room_code"),
            gametype: jQuery("#match_config_gametype").val(),
            locked_down: jQuery("#match_config_locked_down").val(),
        },
        error: function (e) {
            console.log("error", e);
            alert("Error while trying to start match!");
        },
        success:function (data) {

        }
    });
}

function create_room_submit() {
    if (!jQuery("#create_room_room_code").val()) {
        alert("Must enter room code!");
    }
    else {
        $(".full_page").hide();
        jQuery.ajax({
            url: "https://sage-lasertag-api.herokuapp.com/create_room",
            dataType: "json",
            type: "POST",
            data: {
                player_id: localStorage.getItem("player_id"),
                room_code: jQuery("#create_room_room_code").val(),
                gametype: jQuery("#create_room_gametype").val(),
                locked_down: jQuery("#create_room_locked_down").val(),
            },
            error: function (e) {
                console.log("error", e);
                alert("Error while trying to create room");
                $("#create_or_join_room_div").show();
            },
            success:function (data) {
                //TODO set this from the return data instead
                localStorage.setItem("room_code", jQuery("#create_room_room_code").val());
                $("#waiting_for_match_to_start").show();
            }
        });
    }
}

function join_existing_room_submit() {
    if (!jQuery("#join_room_room_code").val()) {
        alert("Must enter room code!");
    }
    else {
        $(".full_page").hide();
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
                $("#create_or_join_room_div").show();
            },
            success:function (data) {
                //TODO set this from the return data instead
                localStorage.setItem("room_code", jQuery("#join_room_room_code").val());
                $("#waiting_for_match_to_start").show();
            }
        });
    }
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
