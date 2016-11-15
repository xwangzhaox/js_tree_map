function get_node_endpoint(object_id) {
		var node = $('[data-rect-object-id="'+object_id+'"]');
		var x = parseInt(node.attr("x"));
		var y = parseInt(node.attr("y"));
		var width = parseInt(node.attr("width"));
		var height = parseInt(node.attr("height"));
		return {"upPoint":{"x":x+width/2, "y":y},"downPoint":{"x":x+width/2,"y":y+height}}
	}

	function move_node_for_add(page) {
		// when create new box dom, move old to 150 right

		// move each node location
		$('[data-parent-id="'+page.parent_id+'"]').each(function(){
		 	$(this).children().each(function(index,element){
		 		if ($(element).prop("tagName")=="line") {
		 			x1 = parseInt($(element).attr("x1"));
		 			$(element).animate({x:parseInt($(element).attr("x1", x1+150))});
		 		}else{
		 			x = parseInt($(element).attr("x"));
		 			$(element).animate({x:parseInt($(element).attr("x", x+150))});
		 		}
		 	});
		});

		// move parent node location
		var sub_node_count = $('[data-parent-id="'+page.parent_id+'"]').length;
		var plus_x = sub_node_count * 75;
		$('[data-object-id="'+page.parent_id+'"]').children().each(function(index, element){
			// var x = parseInt($(element).attr("x"));
			if((30+plus_x)>0 && ($(element).prop("tagName")=="text")){
				$(element).attr("x", 60+plus_x);
			}else{
				$(element).attr("x", 30+plus_x);
			}
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
		move_node_for_add(page)
		rect_height = 50;
		height = 100;
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
			x: 30+5,
			y: height + 15,
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
			x: 60-5,
			y: height+45,
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
