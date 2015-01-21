var map = new Array(50);
for(i = 0;i < 50;i++)
	map[i] = new Array(50);

for(i = 0;i < 50 ;i++)
	for(j = 0;j < 50;j++)
		map[i][j] = false;

function Init(){
	var Canvas = document.getElementsByTagName("canvas");
    var Draw = Canvas[0].getContext("2d");
	Draw.fillStyle = "rgb(0, 0, 255)";
	Draw.fillRect(50, 50, 550, 550);
	Draw.beginPath();
	Draw.moveTo(50, 50);
	Draw.lineTo(50, 550);
	Draw.lineTo(550, 550);
	Draw.lineTo(550, 50);
	Draw.lineTo(50, 50);
	for(i = 0;i < 50;i++){
		Draw.moveTo(50 + 10 * i, 50);
		Draw.lineTo(50 + 10 * i, 550);
	}
	for(i = 0;i < 50;i++){
		Draw.moveTo(50, 50 + 10 * i);
		Draw.lineTo(550, 50 + 10 * i);
	}
	Draw.stroke();
	
}
function Enter(){
	var Canvas = document.getElementsByTagName("canvas");
    var Draw = Canvas[0].getContext("2d");
	var x = parseInt(document.getElementById("x").value);
	var y = parseInt(document.getElementById("y").value);
	if(map[x][y])
		Draw.fillStyle = "rgb(0, 0, 255)";
	else
		Draw.fillStyle = "rgb(255, 0, 0)";
	Draw.fillRect(50 + x * 10 + 1, 50 + y * 10 + 1, 8, 8);
	map[x][y] = !map[x][y];
}

