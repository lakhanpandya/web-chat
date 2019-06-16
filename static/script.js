var ws = null;
var addNewMessage = null;
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
        addNewMessage = function (text, sender) {
            var $messages, message;
            $messages = $('.messages');
            message_side = 'left';
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
            $('.message_input').val('');
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                ws.send(getMessageText());
                $('.message_input').val('');
            }
        });
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
            addNewMessage(msg.data, 'other');
        }
    } else {
        alert('Your browser does not support WebSocket!');
    }
}