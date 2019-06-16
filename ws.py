import tornado.ioloop
import tornado.web
import tornado.websocket
import os

from tornado.options import define, options, parse_command_line

define("port", default=8080, type=int)

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("i2.html")


class WebSocketHandler(tornado.websocket.WebSocketHandler):
    connections = set()

    def check_origin(self, origin):
        return True

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


settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
        # "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
        # "login_url": "/login",
        "xsrf_cookies": True,
        "debug":True
    }

app = tornado.web.Application([
    (r'/', IndexHandler),
    (r'/ws/', WebSocketHandler),
], **settings)


if __name__ == '__main__':
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()