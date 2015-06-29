if (!localStorage.getItem("player_id")){
    // TODO actually transfer this to server-side
    localStorage.setItem("player_id", makeid());
}
var poll_match_settimeout;

function poll_match() {
    clearTimeout(poll_match_settimeout);
    jQuery.ajax({
        url: "http://127.0.0.1:8001/get_match_details",
        dataType: "json",
        type: "POST",
        data: {
            player_id: localStorage.getItem("player_id"),
            room_code: localStorage.getItem("room_code")
        },
        error: function (e) {
            if (e.responseJSON && e.responseJSON.message) {
                alert(e.responseJSON.message);
            }
            else {
                console.log("error trying to poll match", e);
                //alert("Error while trying to poll match");
            }
        },
        success:function (data) {
            $(".waiting_for_match_num_players").text(data.data.number_of_players);
            var poll_match_delay = 3000;
            if (data.data.match_in_progress) {
                $(".match_in_progress_gametype").text(data.data.gametype);
                $(".match_rules_lives_per_spawn").text(data.data.lives_per_spawn);
                $(".match_rules_length").text(data.data.match_length + " minutes");

                var respawn_timer_text = data.data.respawn_timer + " seconds";
                if (data.data.respawn_timer == -1) {
                    respawn_timer_text = "disabled";
                }
                $(".match_rules_respawn_timer").text(respawn_timer_text);
                var scores_htmlz = "";
                for (var i=0; i<data.data.players.length; i++) {
                    if (data.data.players[i]['player_id'] == localStorage.getItem("player_id")) {
                        scores_htmlz += '<tr bgcolor="#add8e6">';
                    }
                    else {
                        scores_htmlz += '<tr>';
                    }
                    scores_htmlz += '<th scope="row">'+(i+1)+'</th><td>'+data.data.players[i]['alias']+'</td><td>'+data.data.players[i]['score']+'</td></tr>';
                }
                $("#match_in_progress_scores").html(scores_htmlz);
                var countdown_seconds_left = data.data.match_countdown - data.data.match_seconds_elapsed;
                $("#match_begins_timer").text(countdown_seconds_left);
                if (data.data.match_seconds_left > 0) {
                    var match_time_left_seconds = (data.data.match_seconds_left % 60).toString();
                    if (match_time_left_seconds.length == 1) {
                        match_time_left_seconds = "0" + match_time_left_seconds;
                    }
                    var match_time_left_minutes = (Math.floor(data.data.match_seconds_left / 60)).toString();
                    $(".match_time_left").text(match_time_left_minutes + ":" + match_time_left_seconds);
                }
                else {
                    $(".match_time_left").text("Game Over!");
                }

                if (countdown_seconds_left > 0) {
                    if ($('#match_about_to_start').css('display') == 'none') {
                        $(".full_page").hide();
                        $("#match_about_to_start").show();
                    }
                    poll_match_delay = 300;
                }
                else {
                    if ($('#match_in_progress').css('display') == 'none') {
                        $(".full_page").hide();
                        $("#match_in_progress").show();
                    }
                }
            }
            clearTimeout(poll_match_settimeout);
            poll_match_settimeout = setTimeout("poll_match()", poll_match_delay);
        }
    });
}

function start_match() {
    var post_data = {
        player_id: localStorage.getItem("player_id"),
        room_code: localStorage.getItem("room_code"),
        gametype: jQuery("#match_config_gametype").val(),
        lives_per_spawn: jQuery("#match_config_lives_per_spawn").val(),
        match_countdown: jQuery("#match_config_countdown").val(),
        match_length: jQuery("#match_config_length").val(),
        respawn_timer: -1,
    };
    if ($('#match_config_respawn_enabled').prop('checked')) {
        post_data['respawn_timer'] = jQuery("#match_config_respawn_timer").val();
    }
    if (!parseInt(post_data['lives_per_spawn'])) {
        post_data['lives_per_spawn'] = 1;
    }
    if (!parseInt(post_data['match_countdown'])) {
        post_data['match_countdown'] = 10;
    }
    if (!parseInt(post_data['match_length'])) {
        post_data['match_length'] = 15;
    }
    jQuery.ajax({
        url: "http://127.0.0.1:8001/start_match",
        dataType: "json",
        type: "POST",
        data: post_data,
        error: function (e) {
            console.log("error", e);
            alert("Error while trying to start match!");
        },
        success:function (data) {
            poll_match();
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
            url: "http://127.0.0.1:8001/create_room",
            dataType: "json",
            type: "POST",
            data: {
                player_id: localStorage.getItem("player_id"),
                room_code: jQuery("#create_room_room_code").val(),
                gametype: jQuery("#create_room_gametype").val(),
                locked_down: jQuery("#create_room_locked_down").val(),
            },
            error: function (e) {
                if (e.responseJSON && e.responseJSON.message) {
                    alert(e.responseJSON.message);
                }
                else {
                    console.log("error", e);
                    alert("Error while trying to create room");
                }
                $("#create_or_join_room_div").show();
            },
            success:function (data) {
                localStorage.setItem("room_code", data.data.room_code);
                $("#waiting_for_match_to_start").show();
                if (data.data.creator_player_id == localStorage.getItem("player_id")) {
                    $("#waiting_for_match_to_start_nonadmin").hide();
                    $("#waiting_for_match_to_start_admin").show();
                }
                else {
                    $("#waiting_for_match_to_start_nonadmin").show();
                    $("#waiting_for_match_to_start_admin").hide();
                }
                poll_match();
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
            url: "http://127.0.0.1:8001/add_player_to_room", // https://sage-lasertag-api.herokuapp.com
            dataType: "json",
            type: "POST",
            data: {
                player_id: localStorage.getItem("player_id"),
                room_code: jQuery("#join_room_room_code").val(),
            },
            error: function (e) {
                if (e.responseJSON && e.responseJSON.message) {
                    alert(e.responseJSON.message);
                }
                else {
                    console.log("error", e);
                    alert("Error while trying to join existing room");
                }
                $("#create_or_join_room_div").show();
            },
            success:function (data) {
                localStorage.setItem("room_code", data.data.room_code);
                $("#waiting_for_match_to_start").show();
                if (data.data.creator_player_id == localStorage.getItem("player_id")) {
                    $("#waiting_for_match_to_start_nonadmin").hide();
                    $("#waiting_for_match_to_start_admin").show();
                }
                else {
                    $("#waiting_for_match_to_start_nonadmin").show();
                    $("#waiting_for_match_to_start_admin").hide();
                }
                poll_match();
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
