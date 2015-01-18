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
	
}
