import numpy as np
import zmq
from itertools import chain
from time import sleep

LENGTH = 30


def setSpin(r):
    return np.random.choice([1]*(11+int(r*10)) + [0]*11)


class electron():
    def __init__(self, spin):
        self.spin = spin
        self.value = 200

    @property
    def spin(self):
        return self.spin

    def updateValue(self):
        self.value += (self.spin * 2 - 1) * 10
        if self.value < 0:
            self.doomed = True

    def updateSpin(self, r):
        self.spin = setSpin(r)

    @property
    def doomed(self):
        return self.doomed


A = np.ndarray((LENGTH, LENGTH), dtype=np.object)
for i in xrange(LENGTH):
    for j in xrange(LENGTH):
        A[i, j] = electron(setSpin(0))

def ratio(i, j):
    s = 0
    t = 0.
    if i > 0:
        s += A[i-1, j].spin
        t += 1
    if i < LENGTH-1:
        s += A[i+1, j].spin
        t += 1
    if j > 0:
        s += A[i, j-1].spin
        t += 1
    if j < LENGTH-1:
        s += A[i, j+1].spin
        t += 1
    return s/t

def update(lattice):
    for i in range(LENGTH):
        for j in range(LENGTH):
            lattice[i, j].updateSpin(ratio(i, j))
            lattice[i, j].updateValue()


def main():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://127.0.0.1:5557")
    in_socket = context.socket(zmq.PULL)
    in_socket.connect("tcp://127.0.0.1:9241")
    out_socket = context.socket(zmq.PUSH)
    out_socket.bind("tcp://127.0.0.1:9242")
    (message_type, session_id, data) = in_socket.recv_multipart()
    while True:
        st = socket.recv(10)
        if st == 'REQUEST':
            print "Request accepted."
            socket.send_pyobj([[[x.spin for x in y] for y in A], [[x.value for x in y] for y in A]])
            print "Response sent."
        update(A)
        out_socket.send_multipart('message',
                                  session_id,
                                  ''.join(map(str, list(chain.from_iterable(A)))))
        sleep(50)
#        socket_web.send(A)
#    socket_web.disconnect("tcp://127.0.0.1:5555")
    socket.unbind("tcp://127.0.0.1:5557")
    context.destroy()

if __name__ == '__main__':
    main()
