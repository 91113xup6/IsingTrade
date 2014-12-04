import MySqLdb

stg_yn = False
yn_dict = {'y': True, 'Yes': True, 'Y': True,
           'n': False, 'No': False, 'N': False, '': False}


def __init__(account, position, A):
    return None


def strategy(stg, n):
    global account, position
    "do strategy"
    for i in range(n):
        stg_dict[stg]()


def operation(order):
    global account, position, stg_yn
    "do operation"
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


def do_reversion(account, position, A, remember):
    LENGTH = len(A)
    # update(A)
    for i in range(LENGTH):
        for j in range(LENGTH):
            if A[i, j].value < remember[0][i, j] and account > A[i, j].value:
                operation(['purchase', str(i), str(j)])
            elif A[i, j].value > remember[0][i, j] and position[i, j] > 0:
                operation(['sell', str(i), str(j)])


def do_succgain(t):
    return None


stg_dict = {'reversion': do_reversion,
            'successive gain': do_succgain}
