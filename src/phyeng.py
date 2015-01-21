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


def slice_(A, L):
    return np.sum(A.reshape(10, L/10, -1, L/10)
                  .swapaxes(1, 2)
                  .reshape(-1, L/10, L/10), (1, 2)).reshape(10, 10) // (L**2/200)


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
    mat = mat * 2 - 1
    return np.sum(mat)*B + np.sum(np.abs(np.diff(mat))) + np.sum(np.abs(np.diff(mat.T)))


class lattice():
    def __init__(self):
        self.spin = np.random.random((L, L)) // 0.5
        self.value = np.zeros((L, L))
        self.value.fill(200)

    def updateValue(self):
        self.value += (self.spin * 2 - 1) * 10

    def updateSpin(self):
        self.spin = iter_(self.spin, T, B)


def phys_loop():
    try:
        while True:
            sleep(0.001)
            A.updateValue()
            A.updateSpin()
    except KeyboardInterrupt:
        raise SystemExit


def command_loop():
    try:
        while True:
            sleep(1)
            # non blocking recv
    except KeyboardInterrupt:
        pass


def main():
    # plt.ion()
    # fig = plt.figure()
    # ax = fig.add_subplot(111)
    global A
    A = lattice()
    t_phys = threading.Thread(target=phys_loop)
    # t_phys = Process(target=phys_loop)
    t_phys.start()
    context = zmq.Context()
    # command_channel = context.socket(zmq.PULL)
    # command_channel.bind("tcp://127.0.0.1:5558")
    # t_command = threading.Thread(target=command_loop)
    # t_command.start()
    in_socket = context.socket(zmq.PULL)
    in_socket.connect("tcp://127.0.0.1:9241")
    out_socket = context.socket(zmq.PUSH)
    out_socket.connect("tcp://127.0.0.1:9242")
    (message_type, session_id, data) = in_socket.recv_multipart()
    try:
        while True:
            sleep(1)
            out_socket.send_multipart(['message', session_id,
                                       ''.join(map(lambda x: str(int(x)),
                                                   slice_(A.spin).flatten()))])
    except KeyboardInterrupt:
        pass
    in_socket.close()
    out_socket.close()
    context.destroy()

if __name__ == '__main__':
    main()
