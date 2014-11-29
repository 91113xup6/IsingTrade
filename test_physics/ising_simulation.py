import numpy as np
import matplotlib.pyplot as plt
from pyqtgraph.Qt import QtGui, QtCore
import pyqtgraph as pg
import scipy.ndimage as ndi
# from matplotlib import animation

app = QtGui.QApplication([])

win = pg.GraphicsWindow()
win.setWindowTitle('Ising Model in 2D')
vb = win.addViewBox()
img = pg.ImageItem()
vb.addItem(img)
vb.setAspectLocked()


T = 1
fig = plt.figure()
L = 50
a = np.matrix([[0]*L]*L)

for i in range(L):
        for j in range(L/2):
                a[i, j] = 1
#                 a[i, j] = np.random.randint(2)

tmp = a


def update():
        img.setImage()

timer = QtCore.QTimer()
timer.timeout.connect(update)
timer.start(50)


def neighbor(a, i, j):
        tmp = []
        tmp += [a[np.mod(i-1, L), j]]
        tmp += [a[np.mod(i+1, L), j]]
        tmp += [a[i, np.mod(j-1, L)]]
        tmp += [a[i, np.mod(j+1, L)]]
        return tmp


def dice(c, T):
        count_trans = {0: 0, 1: 10, 2: 15, 3: 50, 4: 100}
        false_count = 100
        true_count = count_trans[c] + 10 * T
        return np.random.choice([True]*true_count+[False]*false_count)


def iter(a):
        for i in range(L):
                for j in range(L):
                        count = 0
                        for x in neighbor(a, i, j):
                                if a[i, j] != x:
                                        count += 1
                        change = dice(count, T)
                        if change:
                                tmp[i, j] = 1 - a[i, j]
        for i in range(L):
                for j in range(L):
                        a[i, j] = tmp[i, j]


# im = plt.imshow(a)
# def updatefig(i):
#         iter(a)
#         tmp = plt.imshow(a, interpolation='nearest')
#         im.set_array(tmp)
#         return im,

ims = []
for i in range(100):
        iter(a)
        plt.title('T = ' + str(T))
        im = plt.imshow(a.tolist(), interpolation='nearest', cmap='RdYlGn')
        ims.append([im])

ani = animation.ArtistAnimation(fig, ims, interval=500*(1+1/(T+1)), blit=False)
# ani.save('ising.mp4')
plt.show()


if __name__ == '__main__':
        import sys
        if (sys.flags.interactive != 1) or not hasattr(QtCore, 'PYQT_VERSION'):
                QtGui.QApplication.instance().exec_()
