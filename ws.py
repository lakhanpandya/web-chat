import tornado.ioloop
import tornado.web
import tornado.websocket

from tornado.options import define, options, parse_command_line

define("port", default=8888, type=int)

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    connections = set()

    def open(self, *args):
        print "New connection"
        self.connections.add(self)
        self.write_message("Welcome!")

    def on_message(self, message):
        print "New message {}".format(message)
        for con in self.connections:
            con.write_message(message)

    def on_close(self):
        self.connections.remove(self)
        print "Connection closed"


app = tornado.web.Application([
    (r'/', IndexHandler),
    (r'/ws/', WebSocketHandler),
])


if __name__ == '__main__':
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()