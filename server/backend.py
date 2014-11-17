import numpy as np
import matplotlib.pyplot as plt
# import json

LENGTH = 10
account = 10000
position = np.array([[0]*LENGTH]*LENGTH)
remember = np.array([[200]*LENGTH]*LENGTH)
# current = {'account':account,'position':position}


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


def do_reversion(account, position):
    update(A)
    for i in range(LENGTH):
        for j in range(LENGTH):
            if A[i, j].value < remember[i, j] and account > A[i, j].value:
                account, position = operation(['purchase',
                                               str(i), str(j)],
                                              account, position)
            elif A[i, j].value > remember[i, j] and position[i, j] > 0:
                account, position = operation(['sell',
                                               str(i), str(j)],
                                              account, position)
                remember[i, j] = A[i, j].value
    return account, position

stg_dict = {'reversion': do_reversion}


def operation(order, account, position):
    if order[0] == ('purchase' or 'p'):
        i, j = eval(order[1]), eval(order[2])
        if not stg_yn:
            print 'You choose to purchase (%d, %d)' % (i, j)
        account -= A[i, j].value
        position[i, j] += 1
    elif order[0] == ('sell' or 's'):
        i, j = eval(order[1]), eval(order[2])
        if position[i, j] > 0:
            if not stg_yn:
                print 'You choose to sell (%d, %d)' % (i, j)
            account += A[i, j].value
            position[i, j] -= 1
        else:
            if not stg_yn:
                print 'You don\'t have this stock!'
    else:
        print 'Invalid order.'
    if not stg_yn:
        show_position()
    return account, position


def show_position():
    plt.imshow(position, interpolation='nearest', cmap='gray')
    plt.title('position')
    plt.show()


def strategy(stg, n, account, position):
    for i in range(n):
        account, position = stg_dict[stg](account, position)
    return account, position


def setSpin():
    return np.random.randint(2)*2-1


A = np.matrix([[electron(setSpin())]*LENGTH]*LENGTH)

for i in range(LENGTH):
    for j in range(LENGTH):
        A[i, j] = electron(setSpin())


def update(lattice):
    for i in range(LENGTH):
        for j in range(LENGTH):
            lattice[i, j].updateSpin()
            lattice[i, j].updateValue()

yn_dict = {'y': True, 'Yes': True, 'Y': True,
           'n': False, 'No': False, 'N': False, '': False}
span = 0
stg = ''
if __name__ == '__main__':
    # main loop for every day
    while True:
        # start of the day -- update stocks
        # maybe we can have other mechanism as well
        update(A)
        if span > 0:
            account, position = strategy(stg, span, account, position)
            span -= 1
            continue

        stg_yn = raw_input('Do you want to use a strategy?(y/[n]) ')

        if yn_dict[stg_yn]:
            stg = raw_input('What strategy would you like to use? ')
            span = eval(raw_input('And for how many days, please? '))
            account, position = strategy(stg, span, account, position)

        else:
            ope = raw_input("Okay. Maybe operate on your own?(y/[n]) ")
            if yn_dict[ope]:
                x = raw_input('Enter operation: ').split(' ')
                account, position = operation(x, account, position)
            else:
                oth = raw_input('Well, how may I help you then?'
                                '([Call it a day.]) ')
                if oth == 'quit':
                    loop = False
                elif oth == 'show':
                    show_position()
        print 'Money: ', account
        # with open('save.json', 'w') as output:
        #     json.dump(current, output)
        mat = np.matrix([[A[i, j].value for j in range(LENGTH)]
                        for i in range(LENGTH)])
        plt.imshow(mat, interpolation='nearest', cmap='RdYlGn')
        plt.title('Stocks')
        plt.show()
