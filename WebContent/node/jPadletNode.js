/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// jPadletNode ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

jPadletNode = function(param){
	var parentNode = param.parent;
	var text = param.text;
	var id = param.id;
	var index = param.index;
	var position = param.position;

	this.sibling = param.sibling;

	jPadletNode.superclass.call(this, parentNode, text, id, index, position);
	
	if (!this.attributes)
		this.attributes = {};

}

extend(jPadletNode, jMindMapNode);
jPadletNode.prototype.type = "jPadletNode";

/**
 * 필요한 Raphael Element를 만든다.
 */
jPadletNode.prototype.initElements = function() {
	this.body = RAPHAEL.rect();		
	this.text = RAPHAEL.text();		
	this.folderShape = RAPHAEL.circle(0, 0, FOLDER_RADIUS);
	
	// 그룹화하기 위해 반드시 불러야 한다. (인자 : 그룹화할 Element)
	this.wrapElements(this.body, this.text, this.folderShape);		
}

jPadletNode.prototype.create = function(){
	// 노드와 노드를 잇는 선 생성
//	this.connection = this.parent && jMap.layoutManager.connection(this.parent.body, this.body, "#000", this.isLeft());	
	this.connection = null;
	/*
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			this.connection = this.parent && new jLineBezier(this.parent, this);
			break;
		case "jTreeLayout" :
			this.connection = this.parent && new jLinePolygonal(this.parent, this);
			break;
		case "jTableLayout" :
			break;
		case "jFishboneLayout" :
			//this.connection = this.parent && new jLineBezier(this.parent, this);
			break;
		default :
			this.connection = this.parent && new jLineBezier(this.parent, this);
			break;
	}
	*/
	///////////////////////////////////////////////////
	// 노드 초기화	 : 노드 색상, 폰트 설정 등등
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	
	// 노드 모서리 둥글게
	body.attr({r: NODE_CORNER_ROUND, rx: NODE_CORNER_ROUND, ry: NODE_CORNER_ROUND});

	//Created from sibling node
	if (this.sibling) {
		var pl = this.sibling.getLocation();
		var sz = this.sibling.getSize();
		
		this.attributes['padlet_x'] = '' + (parseFloat(pl.x) + 0.0); 
		this.attributes['padlet_y'] = '' + (parseFloat(pl.y) + parseFloat(sz.height) + 20.0);

		this.setLocation(this.attributes['padlet_x'], this.attributes['padlet_y']);
		
	} else if (this.getParent()) { 	// 초기 위치
		var pl = this.getParent().getLocation();
		var sz = this.getParent().getSize();
		
		this.attributes['padlet_x'] = '' + (parseFloat(pl.x) + parseFloat(sz.width) + 20.0); 
		this.attributes['padlet_y'] = '' + (parseFloat(pl.y) + 0.0);

		this.setLocation(this.attributes['padlet_x'], this.attributes['padlet_y']);
	}
		
	// 초기 색상 입히기..		
	this.setBackgroundColorExecute(jMap.cfg.nodeDefalutColor);
	this.setTextColorExecute(jMap.cfg.textDefalutColor);
	this.setEdgeColorExecute(jMap.cfg.edgeDefalutColor, jMap.cfg.edgeDefalutWidth);
	var branchWidth = jMap.cfg.branchDefalutWidth;
	if(this.getDepth()==1) branchWidth = 8;
	this.setBranchExecute(jMap.cfg.branchDefalutColor, branchWidth, null);
	
	// 노드에 색상 입히기
//	if(typeof NodeTheme !== 'undefined'){
//		NodeTheme.wear(this);
//	}
	if(typeof NodeColorMix !== 'undefined'){
		NodeColorMix.rawDressColor(this);
	}
	
	// 폰트 설정
	//var fontSize = this.fontSize;
	var fontWeight = 400;
	var fontFamily = 'Malgun Gothic, 맑은고딕, Gulim, 굴림, Arial, sans-serif';
//	var fontColor = '#000';
	if(!this.getParent()) {
		this.fontSize = jMap.cfg.nodeFontSizes[0];
		fontWeight = '700';
	} else if(this.getParent() && this.getParent().isRootNode()) {
		this.fontSize = jMap.cfg.nodeFontSizes[1];
		fontWeight = '700';
	} else {
		this.fontSize = jMap.cfg.nodeFontSizes[2];
		fontWeight = '400';	
	}
	
	if(this.isRootNode()) {
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight});
	} else {
		text.attr({'font-family': fontFamily, 'font-size': this.fontSize, "font-weight": fontWeight, 'text-anchor': 'start'});
	}

	this.setTextExecute(this.plainText);
	///////////////////////////////////////////////////
}

jPadletNode.prototype.getSize = function(){
	return {width:this.body.getBBox().width, height:this.body.getBBox().height};
}

jPadletNode.prototype.setSize = function(width, height){
	this.body.attr({
		width: width,
		height: height
	});
}

/**
 * 노도의 좌표를 반환
 */
jPadletNode.prototype.getLocation = function(){
	return {x:this.body.getBBox().x, y:this.body.getBBox().y};
}

jPadletNode.prototype.setLocation = function(x, y){
	var body = this.body;

	if(x && !y){
		body.attr({x: x});
	} else if(!x && y) {
		body.attr({y: y});
	} else {
		body.attr({x: x, y: y});
	}
	
	
	this.updateNodeShapesPos();
}

/**
 * 노드의 크기를 계산한다.
 */
jPadletNode.prototype.CalcBodySize = function(){
	var width = 0;
	var height = 0;
	var hGap = TEXT_HGAP;
	var vGap = TEXT_VGAP;
		
	// Text 계산
	// 노드에 텍스트가 없으면 노드의 크기를 정할수 없다.
	if (this.getText() != "") {
		width += this.text.getBBox().width;
		height += this.text.getBBox().height;
	}
//	var tempText = false;
//	if (this.getText() == "") {
//		this.text.attr({
//			text: "_"
//		});
//		var tempText = true;
//	}
//	width += this.text.getBBox().width;
//	height += this.text.getBBox().height;	
//	if (tempText) {
//		this.text.attr({
//			text: ""
//		});		
//	}
	// img 계산
	if (this.img) {		
		width = (width < this.img.getBBox().width) ? this.img.getBBox().width : width;
		height += this.img.getBBox().height;
	}
	// foreignObj 계산
	if (this.foreignObjEl) {
		var foWidth = parseInt(this.foreignObjEl.getAttribute("width"));
		var foHeight = parseInt(this.foreignObjEl.getAttribute("height"));
		width = (width < foWidth) ? foWidth : width;
		height += foHeight;
	}
	// hyperlink 계산
	if(this.hyperlink)
		width += this.hyperlink.getBBox().width + hGap/2 ;

	// file 계산
	if(this.file)
		width += this.file.getBBox().width + hGap/2 ;
	
	// note 계산
	if(this.note)
		width += this.note.getBBox().width + hGap/2 ;
	
	// 만약 노드에 아무런 컨텐츠가 없다면. 글자를 임의로 넣어 크기수정
	if(width == 0 || height == 0) {
		this.text.attr({
			text: "_"
		});
		width += this.text.getBBox().width;
		height += this.text.getBBox().height;	
		this.text.attr({
			text: ""
		});
	}

	if(width < parseInt(jMap.cfg.default_node_size)) {
		width = parseInt(jMap.cfg.default_node_size);
	}
	
	this.setSize(
		width + hGap,	// 넓이
		height + vGap	// 높이
	);
	
//	this.updateNodeShapesPos();
}

/**
 * 노드가 갖고 있는 여러 도형들(body, text, folderShape...)의 위치를 재정렬 한다.
 */
jPadletNode.prototype.updateNodeShapesPos = function(){
	var hGap = TEXT_HGAP;
	var vGap = TEXT_VGAP;
	var currentHeightPos = 0;	// 0에서 부터 요소들의 height따라 위치를 계산에 필요한 변수
	
	var body = this.body;
	var text = this.text;
	var folderShape = this.folderShape;
	var img = this.img;
	var hyperlink = this.hyperlink;
	var note = this.note;
	var file = this.file;
	var foreignObj = this.foreignObjEl;	
	// body의 x, y
	var x = body.getBBox().x;
	var y = body.getBBox().y;
	
	// folder표시 위치
	var fold_x = 0
	var fold_y = 0;
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			fold_x = this.isLeft()? x : x + this.body.getBBox().width;
			fold_y = y + this.body.getBBox().height / 2;
			break;
		case "jTreeLayout" :
			fold_x = x + this.body.getBBox().width / 2;
			fold_y = y + this.body.getBBox().height;
			break;
		case "jFishboneLayout" :
			fold_x = this.isLeft()? x : x + this.body.getBBox().width;
			fold_y = y + this.body.getBBox().height / 2;
			break;
		default :
			fold_x = x;
			fold_y = y;
			break;
	}
	this.folderShape.attr({cx: fold_x, cy: fold_y});
	
	// img 위치
	if (img) {
		var img_x = x + hGap/2;
		var img_y = y + vGap/2;
		
		if(this.isRootNode()) {
			img_x += (body.getBBox().width / 2) - (img.getBBox().width / 2) - hGap / 2;
		}
		
		img.attr({x: img_x, y: img_y});
		currentHeightPos += img.getBBox().height;
	}
	// foreignObj
	if (foreignObj) {
		var ob_x = x + hGap/2;
		var ob_y = y + currentHeightPos + vGap/2;		
		currentHeightPos += parseInt(foreignObj.getAttribute("height"));
		foreignObj.setAttribute("x", ob_x);
		foreignObj.setAttribute("y", ob_y);
	}
	// 텍스트 위치
	if (text) {
		var text_x = x + hGap/2;
		var text_y = y + (vGap + text.getBBox().height) / 2; //this.body.getBBox().height / 2;
		if (this.isRootNode()) {
			text_x += body.getBBox().width / 2 - hGap / 2;
		}
		text_y += currentHeightPos;	
		text.attr({x: text_x, y: text_y});
		
	}	

	// 첨부들 위치
	var attach_x = this.getLocation().x + this.getSize().width;
	if (note) {
		attach_x = attach_x - note.getBBox().width - 3;
		var note_y = this.getLocation().y + (this.getSize().height - note.getBBox().height) / 2;		
		note && note.attr({x: attach_x, y: note_y});
	}

	if (file) {
		attach_x = attach_x - file.getBBox().width - 3;
		var file_y = this.getLocation().y + (this.getSize().height - file.getBBox().height) / 2;		
		file && file.attr({x: attach_x, y: file_y});
	}
	
	if (hyperlink) {
		attach_x = attach_x - hyperlink.getBBox().width - 3;
		var hyper_y = this.getLocation().y + (this.getSize().height - hyperlink.getBBox().height) / 2;		
		hyperlink && hyperlink.attr({x: attach_x, y: hyper_y});
	}
	
//	this.connection && jMap.layoutManager.connection(this.connection, null, null, this.isLeft());
	this.connection && this.connection.updateLine();
}

jPadletNode.prototype.getInputPort = function(){
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.height;
	}
	
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft && this.isLeft()) {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x - 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		case "jTreeLayout" :
			if(this.isRootNode()) return {x: body.x + body_width / 2, y: body.y + body_height};
			return {x: body.x + body_width / 2, y: body.y};
			break;	// 의미없는 break
		case "jRotateLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft && this.isLeft()) {
				return {x: body.x - 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x - 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		case "jTableLayout" :
			if(this.isRootNode()) return {x: body.x + body_width / 2, y: body.y + body_height};
			return {x: body.x + body_width / 2, y: body.y};
			break;	// 의미없는 break
		case "jFishboneLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft && this.isLeft()) {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x - 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		default :
			return {x: body.x, y: body.y};
			break;	// 의미없는 break
	}
}

jPadletNode.prototype.getOutputPort = function(){
	var body = this.body.getBBox();    
	
	var body_width = 0;
	var body_height = 0;
	if(isFinite(body.width) && !isNaN(body.width)){
		body_width = body.width;
	}
	if(isFinite(body.height) && !isNaN(body.height)){
		body_height = body.height;
	}
	
	switch(jMap.layoutManager.type) {
		case "jMindMapLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft()) {
				return {x: body.x - 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		case "jTreeLayout" :
			return {x: body.x + body_width / 2, y: body.y + body_height};
			break;	// 의미없는 break
		case "jRotateLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft && this.isLeft()) {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break	
		case "jTableLayout" :
			return {x: body.x + body_width / 2, y: body.y + body_height};
			break;	// 의미없는 break
		case "jFishboneLayout" :
			if(this.isRootNode()) {
				return {x: body.x + body_width / 2, y: body.y + body_height / 2};
			}
			
			if (this.isLeft()) {
				return {x: body.x - 1, y: body.y + body_height / 2};
			} else {
				return {x: body.x + body_width + 1, y: body.y + body_height / 2};
			}
			break;	// 의미없는 break
		default :
			return {x: body.x, y: body.y};
			break;	// 의미없는 break
	}
}

jPadletNode.prototype.toString = function () {
    return "jPadletNode";
}


jPadletNode.prototype.relativeCoordinateExecute = function(dx, dy) {
	this.attributes['padlet_x'] = parseFloat('' + this.attributes['padlet_x']) + dx;
	this.attributes['padlet_y'] = parseFloat('' + this.attributes['padlet_y']) + dy;
	
	jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(this);
	jMap.layoutManager.layout(true);
}