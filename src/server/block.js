var red, green


function Init(){
	var table = document.createElement("TABLE");
	document.body.appendChild(table);
	table.id = "TablePrice";
	var capt = table.createCaption();
	capt.innerHTML = "Price"
	table.frame = "box";
	table.rules = "all";
	table.style.position = "absolute";
	table.style.top = "20pt";
	table.style.height = "400pt";
	table.style.width = "400pt";
	table.style.textAlign = "center";
	table.style.fontSize = "8px";
	table.style.tableLayout = "fixed";

	for(i = 0; i < 50; i++){
		table.insertRow(0);
		for(j = 0; j < 50; j++)
			table.rows[0].insertCell(0);
	}
	table = document.createElement("TABLE");
	document.body.appendChild(table);
	table.id = "TablePossess";
	capt = table.createCaption();
	capt.innerHTML = "Possess"
	table.frame = "box";
	table.rules = "all";
	table.style.position = "absolute";
	table.style.left = "500pt";
	table.style.top = "20pt";
	table.style.height = "400pt";
	table.style.width = "400pt";
	table.style.textAlign = "center";
	table.style.fontSize = "8px";
	table.style.tableLayout = "fixed";

	for(i = 0; i < 50; i++){
		table.insertRow(0);
		for(j = 0; j < 50; j++)
			table.rows[0].insertCell(0);
	}

}
function change(){
	var table = document.getElementById("TablePrice");
	red = green = 0;
	for(i = 0; i < 50; i++)
		for(j = 0; j < 50; j++){
			if(Math.random() > 0.5){
				table.rows[i].cells[j].style.backgroundColor = "rgb(255, 100, 100)";
				//table.rows[i].cells[j].innerHTML = "¡ô";
				red++;
			}
			else{
				table.rows[i].cells[j].style.backgroundColor = "rgb(100, 255, 100)";
				//table.rows[i].cells[j].innerHTML = "¡õ";
				green++;
			}
		}
	document.getElementById("teamA").value = String(red);
	document.getElementById("teamB").value = String(green);
}
setInterval(change, 1000);
