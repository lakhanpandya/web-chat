var ws = null;
var sendMessage = null;
var mySpace = function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, sender) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            if (sender === 'self') {
                message_side = 'right';
            } else {
                message_side = 'left';
            }
            // message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            ws.send(getMessageText());
            // return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                ws.send(getMessageText());
                // return sendMessage(getMessageText());
            }
        });
        // sendMessage('Hello Philip! :)');
        // setTimeout(function () {
        //     return sendMessage('Hi Sandy! How are you?');
        // }, 1000);
        // return setTimeout(function () {
        //     return sendMessage('I\'m fine, thank you!');
        // }, 2000);
    });
}.call(this);

function init() {
    if ("WebSocket" in window) {
        ws = new WebSocket("ws://127.0.0.1:8080/ws/");
        ws.onopen = function() {
            console.log("Connection is opened");
        }
        ws.onclose = function() {
            console.log("Connection is closed");
        }
        ws.onmessage = function(msg) {
            // var element = document.createElement("div");
            // element.appendChild(document.createTextNode(msg.data));
            // document.getElementById('display').appendChild(element);
            sendMessage(msg.data, 'other');
        }
    } else {
        alert('Your browser doenst support WebSocket!');
    }
}

function send() {
    ws.send(document.getElementById("txt").value);
    document.getElementById("txt").value = "";
}

function isEnter(e) {
    alert(e.keyCode)
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"

        document.getElementById("btnSend").click();
    }
}