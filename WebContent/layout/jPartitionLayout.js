/**
 *
 * @author Nguyen Van Hoang (nvhoangag@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com)
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

///////////////////////////////////////////////////////////////////////////////
/////////////////////    jPartitionController    ////////////////////////
///////////////////////////////////////////////////////////////////////////////
jPartitionController = function(map) {
	jPartitionController.superclass.call(this, map);
};
extend(jPartitionController, JinoController);

jPartitionController.prototype.type = "jPartitionController";

jPartitionController.prototype.startNodeEdit = function(node) {
	if (this.nodeEditor == undefined || this.nodeEditor == null || node.removed) {
		return false;
	}

	if (!jMap.isAllowNodeEdit(node)) {
		return false;
	}

	if (STAT_NODEEDIT) this.stopNodeEdit(true);

	if(ISMOBILE) navbarMenusToggle(false);

	STAT_NODEEDIT = true;

	this.nodeEditor.setAttribute("nodeID", node.id);

	var oInput = this.nodeEditor;
	var centerLocation = jMap.layoutManager.getCenterLocation();

	oInput.style.fontFamily = node.text.attr()['font-family'];
	oInput.style.fontSize = jMap.cfg.nodeFontSizes[2] * this.map.cfg.scale + "px";
	oInput.style.textAlign = 'left';

	var width = node.pWidth * jMap.cfg.scale;
	var height = node.pHeight * jMap.cfg.scale;
	var left = centerLocation.x + (jMap.layoutManager.x(node.y) * jMap.cfg.scale) + (jMap.layoutManager.width - jMap.layoutManager.width * jMap.cfg.scale) / 2;
	var top = centerLocation.y + (jMap.layoutManager.y(node.x) * jMap.cfg.scale) - (jMap.layoutManager.marginTop - jMap.layoutManager.marginTop * jMap.cfg.scale) + (jMap.layoutManager.height - jMap.layoutManager.height * jMap.cfg.scale) / 2;

	oInput.style.display = "";
	oInput.style.minWidth = width + "px";
	oInput.style.maxWidth = width + "px";
	oInput.style.width = width + "px";
	oInput.style.height = height + "px";
	oInput.style.left = left + "px";
	oInput.style.top = top + "px";
	oInput.style.zIndex = 999;

	oInput.value = node.getText();
	oInput.focus();

	return true;

	// // =========================================================
	// var nodeAttach = jMap.nodeAttachMenu[0];
	// var offset = node.getPopoverLocation();
	// if($("div#edit-menu div#content").css("display") == "block"){
	// 	$("div#edit-menu div#text_space").hide();
	// 	$("div#edit-menu div#content").hide();
	// }
	
	// $("#popupEditBox_text").val("");
	// $("#popupEditBox_text").val(node.plainText);

	// if(offset.left + $('#nodePopupEditBox').width() > $(window).width()) {
	// 	offset.left = $(window).width() - $('#nodePopupEditBox').width() - 10;
	// }
	
	// if(ISMOBILE || supportsTouch) {
	// 	$("#nodePopupEditBox").css({
	// 		'display' : 'block',
	// 		'left' : "0px",
	// 		'top' : "0px",
	// 		'width' : "100%",
	// 		'bottom' : "auto"
	// 	})
	// } else {
	// 	$("#nodePopupEditBox").css({
	// 		'display' : 'block',
	// 		'left' : offset.left + "px",
	// 		'top' : offset.top + "px",
	// 		'width' : 300 + "px",
	// 		'bottom' : "auto"
	// 	})
	// }
	// nodeAttach.style.display = "inline-block";
	
	// return true;
};

jPartitionController.prototype.foldingAction = function(node) {
	if (jMap.jDebug) console.log('foldingAction');
};

jPartitionController.prototype.resetCoordinateAction = function(node) {
	if (jMap.jDebug) console.log('resetCoordinateAction');
};

jPartitionController.prototype.foldingAllAction = function() {
	if (jMap.jDebug) console.log('foldingAllAction');
};

jPartitionController.prototype.unfoldingAllAction = function() {
	if (jMap.jDebug) console.log('unfoldingAllAction');
};

jPartitionController.prototype.pasteAction = function(selected) {
	if(!jMap.saveAction.isAlive()) {
		return null;
	}

	if (!selected)
		selected = jMap.getSelected();

	// 선택한 노드에 클립보드에 있는 노드들을 붙인다.
	var pasteNodes = jMap.loadManager.pasteNode(selected, jMap.clipboardManager.getClipboardText());

	var postPasteProcess = function() {
		// 붙여넣기한 노드를 저장
		// 붙여넣기는 이미 데이터가 있기 때문에 저장후에 화면에 렌더링 할 수 있지만
		// 붙여넣기 하는 과정중에 POSITION 속성은 새로 만들어 지기 때문에 (다른 속성도?)
		// 렌더링된 후에 저장하는 것이다.
		for (var i = 0; i < pasteNodes.length; i++) {
			jMap.saveAction.pasteAction(pasteNodes[i]);
		}

		// 레이지 로딩일 경우, 자식들을 모두 삭제 한다.
		// 위에서 이미 서버에 저장되어 있고,
		// 붙여넣은 노드의 로딩은 모두 레이지로딩으로 한다.
		if (jMap.cfg.lazyLoading) {
			for (var i = 0; i < pasteNodes.length; i++) {
				var children = pasteNodes[i].getChildren();
				for (var c = children.length - 1; c >= 0; c--) {
					children[c].removeExecute();
				}
			}
		}

		// 이벤트 리스너를 위한 데이터
		// copy&paste의 경우 노드 아이디가 다시 만들어지기 때문에
		var sendXml = "<clipboard>";
		for (var i = 0; i < pasteNodes.length; i++) {
			var xml = pasteNodes[i].toXML();
			sendXml += xml;
		}
		sendXml += "</clipboard>";

		// 이벤트 리스너 호출
		jMap.fireActionListener(ACTIONS.ACTION_NODE_PASTE, selected, sendXml);

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(selected);
		jMap.layoutManager.layout(true);

		jMap.arcTweenNode.zoomExecute(0);
	}

	if (jMap.loadManager.imageLoading.length == 0) {
		postPasteProcess();
	} else {
		var loaded = jMap.addActionListener(ACTIONS.ACTION_NODE_IMAGELOADED, function() {
			postPasteProcess();
			// 이미지로더 리스너는 삭제!!! 중요.
			jMap.removeActionListener(loaded);
		});
	}
};

jPartitionController.prototype.deleteAction = function() {
	// var result = confirm("선택한 토픽을 삭제하시겠습니까?");
	
	// if(result){
		var selectedNodes = jMap.getSelecteds();
		for (var i = 0; i < selectedNodes.length; i++) {
			if (!jMap.isAllowNodeEdit(selectedNodes[i])) {
				return false;
			}
		}

		var node = null;
		var parentNode = null;
		var indexPos = -1;
		while (node = selectedNodes.pop()) {
			parentNode = node.getParent();
			indexPos = node.getIndexPos();

			node.popover.container.remove();
			node.remove();
		}

		if (parentNode) {
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(parentNode);
			jMap.layoutManager.layout(true);

			// 노드를 삭제후 적정한 노드위치로 포커싱
			if (indexPos != -1) {
				if (parentNode.getChildren().length <= 0) {
					parentNode.focus();
				} else {
					if (parentNode.getChildren().length > indexPos) {
						parentNode.getChildren()[indexPos].focus();
					} else {
						parentNode.getChildren()[parentNode.getChildren().length - 1].focus();
					}
				}

			}
			if (jMap.nodes[jMap.arcTweenNode.id]) {
				jMap.arcTweenNode.zoomExecute();
			} else {
				jMap.getRootNode().screenFocus();
			}
		} else {
			jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
			jMap.getRootNode().screenFocus();
		}
	// }else{
	// 	return false;
	// }
};

jPartitionController.prototype.insertAction = function() {
	var node = jMap.getSelecteds().getLastElement();
	if (node) {
		J_NODE_CREATING = node;
		var param = {
			parent : node
		};
		var newNode = jMap.createNodeWithCtrl(param);

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
		jMap.layoutManager.layout(true);

		jMap.arcTweenNode.zoomExecute(0).end(function() {
			JinoUtil.waitingDialogClose();
			newNode.focus(true);
			// if(!(ISMOBILE || supportsTouch)){
				jMap.controller.startNodeEdit(newNode);
			// }
		});
	}
};

jPartitionController.prototype.insertSiblingAction = function() {
	// FireFox의 엔터키 버그?? 다른 이벤트에서 기대하지 않은 이벤트 발생...
	if (BrowserDetect.browser == "Firefox") {
		jMap.keyEnterHit = 0;
	}

	var selectedNode = jMap.getSelecteds().getLastElement();
	var node = selectedNode && selectedNode.parent;
	if (node) {
		J_NODE_CREATING = selectedNode;
		// 폴딩 필요할까? 필요없음.
		var index = selectedNode.getIndexPos() + 1;
		var position = null;
		// Root노드 자식에서 추가될 경우 왼쪽 오른쪽 고려
		if (selectedNode.position && selectedNode.getParent().isRootNode())
			position = selectedNode.position;
		var param = {
			parent : node,
			index : index,
			position : position
		};
		var newNode = jMap.createNodeWithCtrl(param);

		jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(newNode.parent);
		jMap.layoutManager.layout(true);

		jMap.arcTweenNode.zoomExecute(0).end(function() {
			JinoUtil.waitingDialogClose();
			newNode.focus(true);
			// if(!(ISMOBILE || supportsTouch)){
				jMap.controller.startNodeEdit(newNode);
			// }
		});
	}
};

///////////////////////////////////////////////////////////////////////////////
////////////////////    jPartitionControllerGuest    ////////////////////
///////////////////////////////////////////////////////////////////////////////
jPartitionControllerGuest = function(map) {
	jPartitionControllerGuest.superclass.call(this, map);
};
extend(jPartitionControllerGuest, JinoControllerGuest);

jPartitionControllerGuest.prototype.type = "jPartitionControllerGuest";

jPartitionControllerGuest.prototype.foldingAction = function(node) {
	if(jMap.jDebug) console.log('foldingAction');
};

jPartitionControllerGuest.prototype.resetCoordinateAction = function(node) {
	if(jMap.jDebug) console.log('resetCoordinateAction');
};

jPartitionControllerGuest.prototype.foldingAllAction = function() {
	if(jMap.jDebug) console.log('foldingAllAction');
};

jPartitionControllerGuest.prototype.unfoldingAllAction = function() {
	if(jMap.jDebug) console.log('unfoldingAllAction');
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////    jPartitionLayout    //////////////////////////
///////////////////////////////////////////////////////////////////////////////
jPartitionLayout = function(map) {
	var self = this;

	map.controller = map.mode ? new jPartitionController(map) : new jPartitionControllerGuest(map);

	self.map = map;
	self.HGAP = 10;
	self.VGAP = 20;

	self.xSize = 0;
	self.ySize = 0;

	var work = self.map.work;
	work.scrollLeft = Math.round((work.scrollWidth - work.offsetWidth) / 2);
	work.scrollTop = Math.round((work.scrollHeight - work.offsetHeight) / 2);

	self.map.cfg.nodeFontSizes = [ '22', '18', '12', '9' ];
	self.map.cfg.nodeStyle = 'jPartitionNode';

	////////////////////////////////////////////////////////////////////////////
	// D3 js
	// Zoomable Partition Layout
	////////////////////////////////////////////////////////////////////////////
	self.map.jDebug = false;

	this.map.cfg.edgeDefalutColor = '#ffffff';
	self.map.arcTweenNode = null;
	self.map.popoverContainer = $('<div class="jpopover-container" id="jsunburstlayout-popover-container"></div>').appendTo(document.body);

	self.marginTop = - 10;
	self.width = work.offsetWidth - 150;
	self.height = work.offsetHeight - 180;
	self.x = d3.scale.linear().range([ 0, self.width ]);
	self.y = d3.scale.linear().range([ 0, self.height ]);

	self.padding = 10;
	self.duration = 800;

	self.partition = d3.layout.partition()
		.value(function(d) {
			return 1;
		});
};

jPartitionLayout.prototype.type = 'jPartitionLayout';

jPartitionLayout.prototype.updateTreeHeightsAndRelativeYOfWholeMap = function() {
	this.layoutPartition(this.getRoot());
	this.getRoot().zoomExecute(0);
};

jPartitionLayout.prototype.updateTreeHeightsAndRelativeYOfAncestors = function( /*jNode*/ node) {
	this.layoutPartition(this.getRoot());
	jMap.arcTweenNode.zoomExecute(0);
};

jPartitionLayout.prototype.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors = function( /*jNode*/ node) {
	this.layoutPartition(this.getRoot());
}

jPartitionLayout.prototype.layout = function( /*boolean*/ holdSelected) {
	if (jMap.jDebug) console.log('layout');
};

jPartitionLayout.prototype.getRoot = function() {
	return this.map.rootNode;
};

jPartitionLayout.prototype.layoutPartition = function(node) {
	var layout = this;
	var centerLocation = jMap.layoutManager.getCenterLocation();
	var nodePartition = layout.partition.nodes(node.getPartitionTreeData());

	var colWidth = nodePartition[0].dy * (layout.width / nodePartition[0].dx);

	nodePartition.forEach(function(partition) {
		jMap.nodes[partition.id].depth = partition.depth;
		jMap.nodes[partition.id].dx = partition.dx;
		jMap.nodes[partition.id].dy = partition.dy;
		jMap.nodes[partition.id].x = partition.x;
		jMap.nodes[partition.id].y = partition.y;
		jMap.nodes[partition.id].value = partition.value;

		jMap.nodes[partition.id].pWidth = colWidth;
		jMap.nodes[partition.id].pHeight = partition.dx * layout.height;

		var cell = d3.select('g[data-node-id="' + partition.id + '"]').data([ partition ]);

		cell.attr('visibility', 'visible')
			.attr('data-node-leaf', !partition.children)
			.attr('pointer-events', 'all')
			.attr('transform', 'translate(' + [ centerLocation.x + layout.x(partition.y), centerLocation.y + layout.y(partition.x)  ] + ')');
			
		cell.select('rect')
			.attr('visibility', 'visible')
			.attr('pointer-events', 'all')
			.attr('width', colWidth)
			.attr('height', partition.dx * layout.height)
			.attr('fill-rule', 'evenodd');
		
		cell.select('text')
			.attr('visibility', 'visible')
			.attr('text-anchor', 'start');
		// jMap.nodes[partition.id].computedTextExecute()
	});
};

jPartitionLayout.prototype.getCenterLocation = function() {
	return {
		x : (RAPHAEL.getSize().width / 2) - (this.width / 2),
		y : (RAPHAEL.getSize().height / 2) - (this.height / 2) + this.marginTop
	};
};

jPartitionLayout.prototype.hideAllPopover = function() {
	jMap.popoverContainer.children('div[data-popover-type="' + jMap.cfg.nodeStyle + '"]').removeClass('active');
};