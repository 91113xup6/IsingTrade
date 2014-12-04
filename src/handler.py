import numpy as np
import zmq
import strategy
import time


def show_position():
    plt.imshow(position, interpolation='nearest', cmap='gray')
    plt.title('position')
    plt.show()


def process(message, state):
    # stg_yn = raw_input('Do you want to use a strategy?(y/[n]) ')

        # if yn_dict[stg_yn]:
        #     stg = raw_input('What strategy would you like to use? ')
        #     span = eval(raw_input('And for how many days, please? '))
        #     strategy(stg, span)

        # else:
        #     ope = raw_input("Okay. Maybe operate on your own?(y/[n]) ")
        #     if yn_dict[ope]:
        #         x = raw_input('Enter operation: ').split(' ')
        #         operation(x)
        #     else:
        #         oth = raw_input('Well, how may I help you then?'
        #                         '([Call it a day.]) ')
        #         if oth == 'quit':
        #             loop = False
        #         elif oth == 'show':
        #             show_position()
        print 'Money: ', account


def main():
    context = zmq.Context()
    socket_phy = context.socket(zmq.PULL)
    socket_order = context.socket(zmq.PULL)
    socket_phy.bind("tcp://localhost:5555")
    socket_order.bind("tcp://localhost:5556")
    global stg_yn
    # event loop
    while True:
        time.sleep(1)
        A = socket_phy.recv_pyobj()
        message = socket_order.recv()
        if message != '':
            process(message, A)
        socket.

if __name__ == '__main__':
    main()
