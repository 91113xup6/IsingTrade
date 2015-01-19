import sys
import zmq
import numpy as np
from PyQt4 import QtGui
from PyQt4 import QtCore
from matplotlib.figure import Figure
from matplotlib.backends.backend_qt4agg import FigureCanvasQTAgg as FigureCanvas


class Qt4MplCanvas(FigureCanvas):
    def __init__(self, socket):
        self.socket = socket
        self.fig = Figure(figsize=(24, 8))
        self.axes1 = self.fig.add_subplot(121)
        self.axes1.matshow(np.zeros((30, 30)), cmap='RdYlGn')
        self.axes2 = self.fig.add_subplot(122)
        self.axes2.matshow(np.zeros((30, 30)), cmap='gray')

        FigureCanvas.__init__(self, self.fig)

    def updateMat(self):
        socket.send(b"REQUEST")
        obj = socket.recv_pyobj()
        self.axes1.clear()
        self.axes1.hold(True)
        self.axes1.matshow(obj[0], cmap='RdYlGn')
        self.axes2.clear()
        self.axes2.hold(True)
        self.axes2.matshow(obj[1], cmap='gray')
        self.draw()


if __name__ == '__main__':
    context = zmq.Context()
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://127.0.0.1:5557")
    print "Connected to channel tcp://127.0.0.1:5557"

    qApp = QtGui.QApplication(sys.argv)
    w = QtGui.QWidget()
    layout = QtGui.QGridLayout()
    w.setLayout(layout)

    exitButton = QtGui.QPushButton("Exit")
    updateButton = QtGui.QPushButton("Update")
    mpl = Qt4MplCanvas(socket)
    QtCore.QObject.connect(updateButton, QtCore.SIGNAL("clicked()"), mpl.updateMat)
    QtCore.QObject.connect(exitButton, QtCore.SIGNAL("clicked()"), qApp.exit)
    layout.addWidget(updateButton, 0, 0)
    layout.addWidget(exitButton, 2, 0)
    layout.addWidget(mpl, 0, 1, 3, 1)
    w.show()
    sys.exit(qApp.exec_())

    socket.disconnect("tcp://127.0.0.1:5557")
    context.destroy()
