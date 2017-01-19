function get_node_endpoint(object_id) {
	var node = $('[data-rect-object-id="'+object_id+'"]');
	var x = parseInt(node.attr("x"));
	var y = parseInt(node.attr("y"));
	var width = parseInt(node.attr("width"));
	var height = parseInt(node.attr("height"));
	return {"upPoint":{"x":x+width/2, "y":y},"downPoint":{"x":x+width/2,"y":y+height}}
}

function sub_node_count(page){
	return $("[data-parent-id='"+ page.parent_id +"'").length
}

function get_first_sub_node_x(page){
	var info = get_node_endpoint(page.parent_id)
	return info.downPoint.x - (100 * sub_node_count(page) + (sub_node_count(page)-1) * 50)/2
}

function move_node_for_add(page) {
	// when create new box dom, move old to 150 right

	var first_sub_node_x = get_first_sub_node_x(page);
	// move each node location
	$('[data-parent-id="'+page.parent_id+'"]').each(function(index_g, element_g){
		// if(index_g==0){index_g++}
		var x = first_sub_node_x + index_g * 150;
		$(element_g).children().each(function(i, element_child){
			if ($(element_child).prop("tagName")=="line") {
	 			$(element_child).attr("x1", x+50);
	 		}else if($(element_child).prop("tagName")=="text"){
	 			$(element_child).attr("x", x+50);
	 		}else{
	 			$(element_child).attr("x", x);
	 		}
		});
	});
}



// move line top location
function move_lines(object_id) {
	var parent_node_downPoint_x = parseInt($('[data-rect-object-id="'+object_id+'"]').attr("x"))+50;
	$('[data-line-parent-id="'+object_id+'"]').each(function(index, element){
		var x1 = parseInt($(element).attr("x1"));
		var x2 = parseInt($(element).attr("x2"));
		$(element).attr("x2", parent_node_downPoint_x);
	});
}

function add_box_dom(page) {
	var parent_node = $('[data-rect-object-id="'+ page.parent_id +'"]')
	var parent_node_location = {x: parseInt(parent_node.attr("x")), y: parseInt(parent_node.attr("y"))+100}

	rect_height = 50;
	// insert g tag
	var gObj = document.createElementNS("http://www.w3.org/2000/svg","g"); 
	var g = $(gObj).attr({
		class: "page",
		"data-object-id": page.object_id,
		"data-parent-id": page.parent_id,
		"data-url": page.url
	});
	$('#pic').append(g);
	// insert rect tag
	var rectObj = document.createElementNS("http://www.w3.org/2000/svg","rect"); 
	var rect = $(rectObj).attr({
		x: get_first_sub_node_x(page),
		y: parent_node_location.y,
		width: 100,
		height: rect_height,
		stroke: "black",
		fill: "#ccc",
		"data-rect-object-id": page.object_id,
		"data-rect-parent-id": page.parent_id,
		"data-rect-url": page.url
	});
	$(gObj).append(rect);
	// insert text tag
	var textObj = document.createElementNS("http://www.w3.org/2000/svg","text"); 
	var text = $(textObj).attr({
		x: parent_node_location.x+25,
		y: parent_node_location.y+30,
		"text-anchor": "middle",
		style: "font-family:sans-serif; font-size:14pt;",
		"data-text-object-id": page.object_id,
		"data-text-parent-id": page.parent_id,
		"data-text-url": page.url
	});
	$(text).text(page.title);
	$(gObj).append(text);
	// draw line
	// if where has parent node, get it's upPoint and downPoint
	var parent_node_size = $('[data-parent-id="'+1001+'"]').length;
	if(parent_node_size > 0){
		// down = get_node_endpoint(page.parent_id).downPoint;
		// add_line($('[data-object-id='+page.parent_id+']'), down.x, down.y, false);
		up = get_node_endpoint(page.object_id).upPoint;
		add_line(page, up.x, up.y);
	}
	move_node_for_add(page)
	move_lines(page.parent_id);
}

// location
// true: upLine
// false: downLine
function add_line(page, x, y) {
	var dom = $('[data-object-id='+page.object_id+']')
	var lineObj = document.createElementNS("http://www.w3.org/2000/svg","line"); 
	var line = $(lineObj).attr({
		x1: x,
		y1: y,
		x2: x,
		y2: y-50,
		"data-line-object-id": page.object_id,
		"data-line-parent-id": page.parent_id,
		"data-line-url": page.url,
		style: "stroke:rgb(99,99,99);stroke-width:2"
	});
	$(dom).append(line);
}

function Page(parent_id, object_id, title, url) {
	this.parent_id = parent_id;
	this.object_id = object_id
	this.title = title;
	this.url = url;
}

function bigger(){
  var size = getViewBoxSize();
  var new_size = new Array(size[0]+(size[2]*0.1)/2, size[1]+(size[3]*0.1)/2, size[2]-size[2]*0.1, size[3]-size[3]*0.1);
  svg().setAttribute("viewBox", new_size.join(" "));
}

function smaller(){
  var size = getViewBoxSize();
  var new_size = new Array(size[0]-(size[2]*0.1)/2, size[1]-(size[3]*0.1)/2, size[2]+size[2]*0.1, size[3]+size[3]*0.1);
  svg().setAttribute("viewBox", new_size.join(" "));
}

function getViewBoxSize(){
  var current_size = svg().getAttribute("viewBox");
  var size = new Array( Number(current_size.split(" ")[0]), Number(current_size.split(" ")[1]), Number(current_size.split(" ")[2]), Number(current_size.split(" ")[3]))
  return size
}

function svg(){
  return document.getElementsByTagName("svg")[0];
}

