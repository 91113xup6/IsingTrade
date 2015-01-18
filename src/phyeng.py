#!/usr/bin/env python
"""
Usage: phyeng.py

This program runs a 2D Ising Model infinitely.
Spin and Value are sent through tcp://127.0.0.1:5557
via send_pyobj, both are 2D np arrays.

Communication is possible through tcp://127.0.0.1:5558
Command:
int -> temp
'RESET' -> initialise
'END' -> quit
"""

import numpy as np
import zmq
import threading
from time import sleep
from scipy.stats import rv_discrete

L = 60
T = 1000

def slice_(A):
    return  np.sum(A.reshape(10, 6, -1, 6).swapaxes(1,2).reshape(-1, 6, 6),(1,2)).reshape(10,10) // 18


def energy(mat):
    tot = np.sum(mat)*T
    # tot += map()
    return tot


def iter_(mat):
    sample = np.random.random((100, L, L))
    sample = sample // np.tanh(T/2000.)
    # probability = energy(np.logical_xor(mat, sample[i]))
    sample_change = np.logical_not(np.logical_xor(mat, sample))
    sample_energy = map(energy, sample_change)
    mat_energy = energy(mat)
    prob = np.exp(-(sample_energy-mat_energy)/T)
    prob /= np.sum(prob)
    dist = rv_discrete(values=(range(100), prob))
    return sample_change[dist.rvs()]


class lattice():
    def __init__(self):
        self.spin = np.random.random((L, L)) // 0.5
        self.value = np.zeros((L, L))
        self.value.fill(200)

    def updateValue(self):
        self.value += (self.spin * 2 - 1) * 10

    def updateSpin(self):
        self.spin = iter_(self.spin)



def phys_loop():
    while True:
        sleep(0.01)
        A.updateValue()
        A.updateSpin()


def main():
    global A
    A = lattice()
    t_phys = threading.Thread(target=phys_loop)
    t_phys.start()
    context = zmq.Context()
    # data_channel = context.socket(zmq.PUSH)
    # data_channel.bind("tcp://127.0.0.1:5557")
    # command_channel = context.socket(zmq.PULL)
    # command_channel.bind("tcp://127.0.0.1:5558")
    in_socket = context.socket(zmq.PULL)
    in_socket.connect("tcp://127.0.0.1:9241")
    out_socket = context.socket(zmq.PUSH)
    out_socket.connect("tcp://127.0.0.1:9242")
    (message_type, session_id, data) = in_socket.recv_multipart()
    while True:
        sleep(1)
        print session_id
        out_socket.send_multipart(['message', session_id,
                                   ''.join( map(lambda x: str(int(x)), slice_(A.spin).flatten() ) )])
    in_socket.close()
    out_socket.close()
    context.destroy()

if __name__ == '__main__':
    main()
