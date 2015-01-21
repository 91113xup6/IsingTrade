var N = 60, X, Y, Cash, Price = new Array(N), Market = new Array(N), Possession = new Array(N)/*Price = []*/;
function Init(){
	var table = document.createElement("TABLE");
	document.getElementById("display").appendChild(table);
	table.id = "TableDir";
	table.createCaption().innerHTML = "Direction";
	table.frame = "box";
	table.rules = "all";
	table.style.position = "absolute";
	table.style.left = "30pt";
	table.style.top = "20pt";
	table.style.height = "450pt";
	table.style.width = "450pt";
	//table.style.textAlign = "center";
	//table.style.tableLayout = "fixed";

	for(i = 0; i < N; i++){
		table.insertRow(0);
		for(j = 0; j < N; j++)
			table.rows[0].insertCell(0);
	}

	table = document.createElement("TABLE");
	document.getElementById("display").appendChild(table);
	table.id = "TablePrice";
	table.createCaption().innerHTML = "Price";
	table.frame = "box";
	table.rules = "all";
	table.style.position = "absolute";
	table.style.left = "520pt";
	table.style.top = "20pt";
	table.style.height = "450pt";
	table.style.width = "450pt";

	for(i = 0; i < N; i++){
		table.insertRow(0);
		for(j = 0; j < N; j++)
			table.rows[0].insertCell(0);
	}

	table = document.createElement("TABLE");
	document.getElementById("display").appendChild(table);
	table.id = "TablePossess";
	table.createCaption().innerHTML = "Possess";
	table.frame = "box";
	table.rules = "all";
	table.style.position = "absolute";
	table.style.left = "520pt";
	table.style.top = "520pt";
	table.style.height = "450pt";
	table.style.width = "450pt";

	for(i = 0; i < N; i++){
		table.insertRow(0);
		for(j = 0; j < N; j++)
			table.rows[0].insertCell(0);
	}

	for(i = 0; i < N; i++){
		Price[i] = new Array(N);
		Market[i] = new Array(N);
		Possession[i] = new Array(N);
	}
	for(i = 0; i < N; i++){
		for(j = 0; j < N; j++){
			Price[i][j] = Possession[i][j] = 0;
			Market[i][j] = 1000;
		}
	}
	document.getElementById("X").value = X = 1;
	document.getElementById("Y").value = Y = 1;
	document.getElementById("cash").value = Cash = 10000;
	document.getElementById("amount").value = 0;
}
function IsColor(x){
	if(x < 0)return 0;
	if(x > 255)return 255;
	return x;
}
function Change(){
	var tableDir = document.getElementById("TableDir"), tablePrice = document.getElementById("TablePrice");
	var red = 0, green = 0;
	for(i = 0; i < N; i++)
		for(j = 0; j < N; j++){
			if(Math.random() > 0.5){
				tableDir.rows[i].cells[j].style.backgroundColor = "rgb(255, 100, 100)";
				//tableDir.rows[i].cells[j].innerHTML = "¡ô";
				Price[i][j] += 20;
				
				red++;
			}
			else{
				tableDir.rows[i].cells[j].style.backgroundColor = "rgb(100, 255, 100)";
				//tableDir.rows[i].cells[j].innerHTML = "¡õ";
				Price[i][j] -= 20;

				green++;
			}
			tablePrice.rows[i].cells[j].style.backgroundColor = "rgb(" + IsColor(Price[i][j]) + ", " + IsColor(255 - Math.abs(Price[i][j])) + ", " + IsColor(-Price[i][j]);

		}
	document.getElementById("teamA").value = red;
	document.getElementById("teamB").value = green;
	document.getElementById("price").value = Price[Y - 1][X - 1];
	document.getElementById("market").value = Market[Y - 1][X - 1];
	document.getElementById("possession").value = Possession[Y - 1][X - 1];
}
setInterval(Change, 1000);
function DClick(){
	//document.getElementById("X").value = event.pageX;
	//document.getElementById("Y").value = event.pageY;
	document.getElementById("X").value = X = Math.floor((event.pageX - (event.pageX > 650?693:40)) / 600 * N) + 1;
	document.getElementById("Y").value = Y = Math.floor((event.pageY - (event.pageY > 700?711:44)) / 600 * N) + 1;
}
function Buy(){
	var amount = parseInt(document.getElementById("amount").value)
	if(amount <= 0){
		document.getElementById("status").value = "amount <= 0, the deal is canceled";
		return;
	}
	if(amount > Market[Y - 1][X - 1]){
		document.getElementById("status").value = "amount > market, the deal is canceled";
		return;
	}
	if(Price[Y - 1][X - 1] * amount > Cash){
		document.getElementById("status").value = "your money is not enough, the deal is canceled";
		return;
	}
	Possession[Y - 1][X - 1] += amount;
	document.getElementById("cash").value = Cash -= amount * Price[Y - 1][X - 1];
	document.getElementById("TablePossess").rows[Y - 1].cells[X - 1].style.backgroundColor = "rgb(100, 100, 100)";
	document.getElementById("status").value = "the deal is accepted";
}
function Sell(){
	var amount = parseInt(document.getElementById("amount").value)
	if(amount <= 0){
		document.getElementById("status").value = "amount <= 0, the deal is canceled";
		return;
	}
	if(amount > Possession[Y - 1][X - 1]){
		document.getElementById("status").value = "amount > your possess, the deal is canceled";
		return;
	}
	Possession[Y - 1][X - 1] -= amount;
	document.getElementById("cash").value = Cash += amount * Price[Y - 1][X - 1];
	document.getElementById("TablePossess").rows[Y - 1].cells[X - 1].style.backgroundColor = Possession[Y - 1][X - 1] == 0?"rgb(255, 255, 255)":"rgb(100, 100, 100)";
	document.getElementById("status").value = "the deal is accepted";
}
//X1:40 - 639 X2:693 - 1292 Y1:44 - 643 Y2:711 - 1310
