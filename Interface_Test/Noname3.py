from Tkinter import *
import threading
import random

N = 300
M = 100
Map = []
for i in range(0, N):
    Map.append([])
    for j in range(0, M):
        Map[i].append(False)
for i in range(0, N):
    Map[i][0] = True
master = Tk()
w = Canvas(master, width = 800, height = 500)
w.pack()
IfCon = True
def Run():
    global x, y, IfCon
    x = random.randint(0, N - 1)
    y = M - 1
    #print str(x) + ' ' + str(y)
    while True:
        #print str(x) + ' ' + str(y)
        if y >= 2 * M or x < 0 or x >= N:
            break
        elif y >= M:
            None
        elif (x != 0 and Map[x - 1][y]) or (x != N - 1 and Map[x + 1][y]) or (y != M - 1 and Map[x][y + 1]) or Map[x][y - 1]:
            Map[x][y] = True
            w.create_oval(2 * x - 1, 4 * y - 2, 2 * x + 1, 4 * y + 2, fill = "black")
            if y == M - 1:
                IfCon = False
            break
        global mov
        mov = random.randint(0, 4)
        if mov == 0:
            y += 1
        elif mov == 1 or mov == 2:
            y -= 1
        elif mov == 3:
            x += 1
        else:
            x -= 1
    if IfCon:
        global t        #Notice: use global variable!
        t = threading.Timer(0.1, Run)
        t.start()
 
Run()

mainloop()
