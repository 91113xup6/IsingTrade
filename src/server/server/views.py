from django.http import HttpResponse
import zmq
main_page = open("index.html")


def my_homepage(request):
    context = zmq.Context()
    socket = context.socket(zmq.REQ)
    socket.bind("tcp://127.0.0.1:5557")
    socket.send('REQUEST')
    html = main_page.read()
    message = socket.recv_pyobj()
    print message
    # return HttpResponse(html)
