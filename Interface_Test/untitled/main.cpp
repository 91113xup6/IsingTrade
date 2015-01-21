#include <QApplication>
#include <QWidget>
#include <QPainter>
#include <QTimer>

int N = 1300, M = 300;
bool map[1300][300];
class PainterWidget : public QWidget {
protected:
    void paintEvent(QPaintEvent*);
};
void PainterWidget::paintEvent(QPaintEvent *event) {
    QPainter painter(this);

    painter.setBrush(Qt::black);

    for(int i = 0;i < M;i++)
        for(int j = 0;j < N;j++)
            if(map[j][i])
                painter.drawEllipse(j - 1, 2 * (i - 1), 2, 2);

}
/*int i = 50, j = 50;
void PainterWidget::paintEvent(QPaintEvent *event) {
    QPainter painter(this);

    painter.setBrush(Qt::black);
    painter.drawEllipse(i, j, 2, 2);
    i += 10;
    j += 10;
}*/

int main(int argc, char *argv[]) {
    for(int i = 0;i < N;i++)map[i][0] = 1;
    bool IfCon = true;
    int x, y;
    while(IfCon){
        x = qrand() % N;
        y = M - 1;
        while(true){
            if(y >= 2 * M || x < 0 || x >= N)break;
            else if(y >= M);
            else{
                if(	(x != 0 && map[x - 1][y]) || (x != N - 1 && map[x + 1][y]) || \
                    (y != M - 1 && map[x][y + 1]) || map[x][y - 1]){
                    map[x][y] = 1;

                    if(y == M - 1)
                        IfCon = 0;
                    break;
                }
            }
            switch(qrand() % 5){
                case 0:
                    y++;	break;
                case 1:
                case 4:
                    y--;	break;
                case 2:
                    x--;	break;
                case 3:
                    x++;	break;

            }
        }
    }

    QApplication app(argc, argv);

    PainterWidget pWidget;
    pWidget.setWindowTitle("QPainter");
    pWidget.resize(1300, 700);
    pWidget.show();

    /*QTimer *timer = new QTimer;
    timer->start(100);
    QObject::connect(timer, SIGNAL(timeout()), &pWidget, SLOT(update()));
    //timer->stop();*/


    return app.exec();
}
