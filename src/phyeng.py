import numpy as np
import zmq

INFORMATION_RETRIEVABLE = 5
LENGTH = 10
account = 10000

position = [[0 for x in range(LENGTH)]
            for x in range(LENGTH)]
remember = [[[0 for x in range(LENGTH)]
            for x in range(LENGTH)]
            for x in range(INFORMATION_RETRIEVABLE)]


class electron():
    def __init__(self, spin):
        self.spin = spin
        self.value = 200

    @property
    def spin(self):
        return self.spin

    def updateValue(self):
        self.value += self.spin * 10
        if self.value < 0:
            self.doomed = True

    def updateSpin(self):
        self.spin = setSpin()

    @property
    def doomed(self):
        return self.doomed


A = [[electron(np.random.randint(2)*2-1) for x in range(LENGTH)]
     for x in range(LENGTH)]


def update(lattice):
    # a queue for last n days of information
    for i in range(-INFORMATION_RETRIEVABLE+1, 0):
        remember[-i] = remember[-i-1]

    for i in range(LENGTH):
        for j in range(LENGTH):
            remember[0][i, j] = lattice[i, j].value
            lattice[i, j].updateSpin()
            lattice[i, j].updateValue()


def main():
    context = zmq.Context()
    socket = context.socket(zmq.PUSH)
    socket.connect("tcp://127.0.0.1:5555")
    socket_todj = context.socket(zmq.REP)
    socket_todj.connect("tcp://127.0.0.1:5557")
    while True:
        # potential flooding the channel
        st = socket_todj.recv()
        if st == 'REQUEST':
            socket_todj.send_pyobj([[x.spin for x in y] for y in A])

if __name__ == '__main__':
    main()
