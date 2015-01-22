#!/usr/bin/env python
"""
Usage: phyeng.py

This program runs a 2D Ising Model infinitely.
Spin matrix is sent through tcp://127.0.0.1:9242
to a sockjsproxy, which then convert it to a websocket
Communication is possible through tcp://127.0.0.1:5558
Command:
int -> temp
'RESET' -> initialise
'END' -> quit
"""

import numpy as np
import zmq
import threading
# from multiprocessing import Process
from time import sleep
from scipy.stats import rv_discrete
# import matplotlib.pyplot as plt

# from numba import jit
L = 20
T = 10
B = 0


def slice_(A):
    return np.sum(A.reshape(10, L/10, -1, L/10)
                  .swapaxes(1, 2)
                  .reshape(-1, L/10, L/10), (1, 2)).reshape(10, 10) // (L**2/199.)


# @jit
def iter_(mat, T, B):
    L = mat.shape[0]
    sample = np.random.random((100, L, L))
    sample = sample // np.tanh(T/2000.)
    sample_change = np.logical_not(np.logical_xor(mat, sample))
    sample_energy = list(map(energy, sample_change, np.ones(100)*B))
    mat_energy = energy(mat, B)
    prob = np.exp(-(sample_energy-np.ones(100)*mat_energy)*L**2/T/3600)
    prob /= np.sum(prob)
    dist = rv_discrete(values=(range(100), prob))
    return sample_change[dist.rvs()]


# @jit
def energy(mat, B):
    return np.sum(mat*2-1)*B + np.sum(np.abs(np.diff(mat*2-1))) + np.sum(np.abs(np.diff((mat*2-1).T)))


class lattice():
    def __init__(self):
        self.spin = np.random.random((L, L)) // 0.5
        self.value = np.zeros((L, L))
        self.value.fill(200)

    def updateValue(self):
        self.value += (self.spin * 2 - 1) * .1

    def updateSpin(self):
        self.spin = iter_(self.spin, T, B)


def phys_loop():
    try:
        while True:
            sleep(.001)
            A.updateValue()
            A.updateSpin()
            # print(A.spin)
            # print(''.join(map(lambda x: str(int(x)),
            #                                              slice_(A.spin).flatten())))
    except KeyboardInterrupt:
        raise SystemExit


def command_loop():
    command_channel = context.socket(zmq.PULL)
    command_channel.bind("tcp://127.0.0.1:5558")
    global T
    global B
    try:
        while True:
            sleep(.01)
            order = command_channel.recv_string()
            if order[0] == 'T':
                T = eval(order[1:])
            elif order[0] == 'B':
                B = eval(order[1:])    
    except KeyboardInterrupt:
        pass


def in_loop():
    in_socket = context.socket(zmq.PULL)
    in_socket.connect("tcp://127.0.0.1:9241")
    global display_id
    global session_id
    global sent
    global A
    try:
        while True:
            sleep(.01)
            (message_type, session_id, data) = in_socket.recv_multipart()
            print("msg: "+message_type)
            if message_type == b'connect':#.encode('utf-8'):
                sent = True
                A = lattice()
            if message_type == b'disconnect':#.encode('utf-8'):
                sent = False

    except KeyboardInterrupt:
        pass


def din_loop():
    din_socket = context.socket(zmq.PULL)
    din_socket.connect("tcp://127.0.0.1:9240")
    global dsent
    global dsession_id
    try:
        while True:
            sleep(.01)
            (dmessage_type, dsession_id, ddata) = din_socket.recv_multipart()
            # print("dmsg: "+dmessage_type)
            if dmessage_type == b'connect':#.encode('utf-8'):
                dsent = True
            if dmessage_type == b'disconnect':#.encode('utf-8'):
                dsent = False

    except KeyboardInterrupt:
        pass


def main():
    global display_id
    display_id = False
    global sent
    global dsent
    sent = False
    dsent = False
    # plt.ion()
    # fig = plt.figure()
    # ax = fig.add_subplot(111)
    global A
    A = lattice()
    t_phys = threading.Thread(target=phys_loop)
    # t_phys = Process(target=phys_loop)
    t_phys.start()
    global context
    context = zmq.Context()
    t_command = threading.Thread(target=command_loop)
    t_command.start()
    t_in = threading.Thread(target=in_loop)
    t_in.start()
    t_din = threading.Thread(target=din_loop)
    t_din.start()
    out_socket = context.socket(zmq.PUSH)
    out_socket.connect("tcp://127.0.0.1:9242")
    display_socket = context.socket(zmq.PUSH)
    display_socket.connect("tcp://127.0.0.1:9243")
    # (message_type, session_id, data) = in_socket.recv_multipart()
    # sent = True
    # print("received.")
    try:
        while True:
            sleep(1)
            if dsent:
                display_socket.send_multipart(['message'.encode('utf-8'), dsession_id,
                                           bytes(''.join(map(lambda x: str(int(x)),
                                                             slice_(A.spin).flatten()))
                                                 +','.join(map(lambda x: str(int(x)),
                                                             slice_(A.value).flatten()))
                                                 , 'utf-8')
                                   ])

            if sent:
                out_socket.send_multipart(['message'.encode('utf-8'), session_id,
                                           bytes(''.join(map(lambda x: str(int(x)),
                                                             slice_(A.spin).flatten()))
                                                 +','.join(map(lambda x: str(int(x)),
                                                             slice_(A.value).flatten()))
                                                 , 'utf-8')
                                   ])
    except KeyboardInterrupt:
        pass
    # in_socket.close()
    # out_socket.close()
    context.destroy()

if __name__ == '__main__':
    main()
