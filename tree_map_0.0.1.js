  function addNode(node){
    var parent_node = getFirstSubNodePosition(node);
    // confirm group exist
    var g = $('g[data-object-id=' + node.parent_id + ']').first();
    if(g.length>0){
      initNode(g, parent_node.x, parent_node.y, node);
      addLine(node);
    }else{
      // 如果是第二个元素，则新建group的时候，父级group的object-id应该为空
      var parent_node = $('use[data-object-id=' + node.parent_id + ']').first();
      if(node.parent_id == 0){parent_node = $('use[data-object-id=0]')}
      addGroup(parent_node, node.parent_id);
      addNode(node);
    }
    moveNodeForNew(node)
  }

  function addGroup(e, object_id = "", inner = false){
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var g = $(g).attr({
      class: "group",
      "data-object-id": object_id
    })
    if(inner){
      $(e).append(g);
    }else{
      $(e).after(g);
    }
  }

  function addLine(node) {
    var parent_node_position = getParentNodeDownCenterPoint(node.parent_id)
    var new_node = getParentNodeDownCenterPoint(node.object_id)

    var lineObj = document.createElementNS("http://www.w3.org/2000/svg","line"); 
    var line = $(lineObj).attr({
      x1: parent_node_position.downPoint.x,
      y1: parent_node_position.downPoint.y,
      x2: new_node.upPoint.x,
      y2: new_node.upPoint.y,
      "data-object-id": node.object_id,
      "data-parent-id": node.parent_id,
      style: "stroke:rgb(99,99,99);stroke-width:2"
    });
    $('g[data-object-id=' + node.parent_id + ']').append(line);
  }

  function Node(parent_id, object_id, title, url, node_class, node_id, xpath) {
    this.parent_id = parent_id;
    this.object_id = object_id
    this.title = title;
    this.url = url;
    this.node_class = node_class;
    this.node_id = node_id;
    this.xpath = xpath;
  }

  function initNode( g, x = 975, y = 15, node ){
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS(null, "x", x);
    use.setAttributeNS(null, "y", y);
    use.setAttributeNS(null, "onclick", "opacityDistinguish(this)")
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#node');
      // init text
    var textObj = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textObj.setAttributeNS(null, "onclick", "opacityDistinguish(this)")
    var text = $(textObj).attr({
      x: x+25,
      y: y+30,
      style: "font-family:sans-serif; font-size:14pt;",
    });
    if ( g == null ) {
      addGroup(svg(), "", true)
      use.setAttributeNS(null, "data-object-id", 0);
      $(text).text("根节点");
      $('g.group').first().append(use);  
      $('g.group').first().append(text);  
    } else {
      use.setAttributeNS(null, "data-object-id", node.object_id);
      use.setAttributeNS(null, "data-parent-id", node.parent_id);
      text.attr({
      "data-text-object-id": node.object_id,
      "data-text-parent-id": node.parent_id,
      "data-text-url": node.url});
      $(text).text(node.title);
      $(g).append(use);
      $(g).append(text);
    }
  }

  function svg(){
    return document.getElementsByTagName("svg")[0];
  }

  // get node position
  function getParentNodeDownCenterPoint(object_id) {
    var node = $('use[data-object-id="'+object_id+'"]');
    var x = parseInt(node.attr("x"));
    var y = parseInt(node.attr("y"));
    var width = 100;
    var height = 50;
    return {"upPoint":{"x":x+width/2, "y":y},"downPoint":{"x":x+width/2,"y":y+height}}
  }

  function subNodeCount(node){
    return $("g[data-object-id='"+ node.parent_id +"']>use").length
  }

  function getFirstSubNodePosition(node){
    var info = getParentNodeDownCenterPoint(node.parent_id)
    return {"x": info.downPoint.x - (100 * subNodeCount(node) + (subNodeCount(node)-1) * 50)/2, "y": (info.downPoint.y+50)}
  }

  // move for new node
  function moveNodeForNew(node) {
    // when create new box dom, move pass to 150 right
    var first_sub_node_x = getFirstSubNodePosition(node).x;
    // move each node position
    // add paret node, then sub node change position
    // add sub   node, then parent node do not change position
    $('g[data-object-id="'+node.parent_id+'"]>use').each(function(index_g, element_g){
      var x = first_sub_node_x + index_g * 150;
      $(element_g).attr("x", x);
    });
    $('g[data-object-id="'+node.parent_id+'"]>text').each(function(index_g, element_g){
      var x = first_sub_node_x + index_g * 150;
      $(element_g).attr("x", x+30);
    });
    $('g[data-object-id="'+node.parent_id+'"]>line').each(function(index_g, element_g){
      var x = first_sub_node_x + index_g * 150;
      $(element_g).attr("x2", x+50);
    });
    // moving px
    var px = 0;
    $('use[data-object-id="'+node.object_id+'"]').parent().find('g').children('use').each(function(index_g, element_g){
      var x = parseInt($(element_g).attr("x"));
      px = x - parseInt($(element_g).attr("x"));
      $(element_g).attr("x", x-75);
    });
    $('use[data-object-id="'+node.object_id+'"]').parent().find('g').children('text').each(function(index_g, element_g){
      var x = parseInt($(element_g).attr("x"));
      $(element_g).attr("x", x-75);
    });
    $('use[data-object-id="'+node.object_id+'"]').parent().find('g').children('line').each(function(index_g, element_g){
      var x1 = parseInt($(element_g).attr("x1"));
      var x2 = parseInt($(element_g).attr("x2"));
      $(element_g).attr("x1", x1-75);
      $(element_g).attr("x2", x2-75);
    });
  }

  function opacityDistinguish(dom){
    //$("use").css({'opacity': 0.2, 'z-index': 5, 'position': 'absolute'});
    //$(dom).parents().children("use, line").css({'opacity': 0.6, 'z-index': 9, 'position': 'absolute'});
    //$(dom).css({'opacity': 1, 'z-index': 99, 'position': 'absolute'});
    $("use").css({'opacity': 0.2, 'z-index': 5, 'position': 'absolute'});
    $("use, line").css({'stroke': '#333', 'stroke-width': 1});
    $(dom).parents().children("use, line").css({'opacity': 0.8, 'z-index': 9, 'position': 'absolute', 'stroke': 'red', 'stroke-width': 2});
    $(dom).css({'opacity': 1, 'z-index': 99, 'position': 'absolute'});
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
