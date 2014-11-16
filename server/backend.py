import numpy as np
import matplotlib.pyplot as plt

LENGTH = 10
account = 10000
position = np.array([[0]*LENGTH]*LENGTH)


class electron():
    def __init__(self, spin):
        self.spin = spin
        self.value = 200

    @property
    def spin(self):
        return self.spin

    def updateValue(self):
        self.value += self.spin * 10

    def updateSpin(self):
        self.spin = setSpin()


def operation(order, account, position):
    if order[0] == 'purchase':
        i, j = eval(order[1]), eval(order[2])
        print 'You choose to purchase (%d, %d)' % (i, j)
        account -= A[i, j].value
        position[i, j] += 1
    elif order[0] == 'sell':
        i, j = eval(order[1]), eval(order[2])
        if position[i, j] > 0:
            print 'You choose to sell (%d, %d)' % (i, j)
            account += A[i, j].value
            position[i, j] -= 1
        else:
            print 'You don\'t have this stock!'
    else:
        print 'Invalid order.'
    return account, position

# def strategy:


def setSpin():
    return np.random.randint(2)*2-1


A = np.matrix([[electron(setSpin())]*LENGTH]*LENGTH)

for i in range(LENGTH):
    for j in range(LENGTH):
        A[i, j] = electron(setSpin())

if __name__ == '__main__':
    while True:
        for i in range(LENGTH):
            for j in range(LENGTH):
                A[i, j].updateSpin()
                A[i, j].updateValue()
        x = raw_input('Enter operation:').split(' ')
        account, position = operation(x, account, position)
        print 'Money: ', account
        mat = np.matrix([[A[i, j].value for j in range(LENGTH)]
                        for i in range(LENGTH)])
        plt.imshow(mat, interpolation='nearest', cmap='RdYlGn')
        plt.show()
