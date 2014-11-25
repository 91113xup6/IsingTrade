var t = 0, fx, c;

function F(x, y){
	return 150 * Math.sin(x * 2 * Math.PI / 100) * Math.sin(y * 2 * Math.PI / 100) * Math.cos(0.5 * t);
}
function DrawDot(x, y){
	c.beginPath();
	if(fx > 0)
		c.strokeStyle = "rgb(255, 0, 0)";
	else
		c.strokeStyle = "rgb(0, 0, 255)";
	c.arc(x, y, 1, 0, 2 * Math.PI);
	c.stroke();
}
function Init(){
	setInterval("Draw();", 200);
	Draw();
}
function Draw(){
	c = (document.getElementsByTagName("canvas"))[0].getContext("2d");
	c.clearRect(0, 0, 1000, 1000);
	var i, j;
	for(i=0;i<100;i++)
		for(j=0;j<100;j++){
			fx = F(i, j);
			DrawDot(400 + 3 * i - (1.8 * j), 150 + fx + (2.4 * j));
		}
	t++;
}