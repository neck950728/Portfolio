function create_window(type, isForCopying){
	var uuid = uuidv4();
	
	$("body").append("<div id='" + uuid + "' class='window'>" +
								"<div id='header'>" +
									"<div class='toolbar'>" +
										"<div class='buttons'>" +
											"<ul>" +
												"<li class='minimize'><img src='/Portfolio/resources/images/main/minimize.png'></li>" +
												"<li class='maximize'><img src='/Portfolio/resources/images/main/maximize.png'></li>" +
												"<li class='close'><img src='/Portfolio/resources/images/main/close.png'></li>" +
											"</ul>" +
										"</div>" +
									"</div>" +
									"<div class='navigationBar'>" +
										"<div class='buttons'>" +
											"<ul>" +
												"<li class='back'><img src='/Portfolio/resources/images/main/back.png'></li>" +
												"<li class='forward'><img src='/Portfolio/resources/images/main/forward.png'></li>" +
											"</ul>" +
										"</div>" +
									"</div>" +
								"</div>" +
								"<div id='body'>" +
								"</div>" +
							"</div>");
	
	if(type == "chrome"){
		$("#" + uuid).addClass("chrome");
		
		$("#" + uuid + " > #header > .toolbar").prepend("<div class='tab'>" +
																			"<div>" +
																				"<img src='/Portfolio/resources/images/main/chrome/chrome_tab.png'>" +
																				"<span>Google</span>" +
																			"</div>" +
																		"</div>");
		
		$("#" + uuid + " > #header > .navigationBar").append("<div class='addressBar'>" +
																					"<input type='text' placeholder='Google에서 검색하거나 URL을 입력하세요.'>" +
																				"</div>");
		
		$("#" + uuid + " > #body").append("<div class='searchBar'>" +
														   "<img src='/Portfolio/resources/images/main/chrome/google_logo.png'><br>" +
														   "<input type='text' placeholder='Google 검색 또는 URL 입력'>" +
													   "</div>");
	}else{
		if(type == "about"){
			$("#" + uuid).addClass("about");
		}
		
		$("#" + uuid + " > #header > .toolbar").prepend("<div class='logo'>" +
																			"<img src='/Portfolio/resources/images/main/" + type + "/" + type + ".ico'>" +
																			"<span>" + type.charAt(0).toUpperCase() + type.slice(1) + "</span>" +
																		"</div>");
		
		$("#" + uuid + " > #header > .navigationBar").append("<div class='bar'>" +
																					"<ul>" +
																						"<li><img src='/Portfolio/resources/images/main/" + type + "/" + type + ".ico'></li>" +
																						"<li><span>김민진</span></li>" +
																						"<li><span>" + type.charAt(0).toUpperCase() + type.slice(1) + "</span></li>" +
																					"</ul>" +
																				"</div>");
		
		$("#" + uuid + " > #body").append("<div class='shortcuts'>" +
														   "<h1>즐겨찾기</h1>" +
														   "<ul></ul>" +
													   "</div>" +
													   "<div class='content'>" +
													   "</div>");
		
		$("#" + uuid + " .navigationBar > .bar > ul > li:not(:last-child)").after("<i><img src='/Portfolio/resources/images/main/next.png'></i>");
		
		$.ajax({
			url:"/Portfolio/resources/json/main/shortcuts.json",
			
			success:function(json){
				$.each(json.list, function(index, item){
					$("#" + uuid + " > #body > .shortcuts > ul").append("<li id='" + item.name.toLowerCase() + "'>" +
																							  "<img src='" + item.icon + "'>" +
																							  "<span>" + item.name + "</span>" +
																						  "</li>");
				});
			}
		});
	}
	
	// $(".window").fadeIn(100);
	
	$(".window").css("z-index", 0);
	$("#" + uuid).css("z-index", 1);
	
	// detail : Google 'jQuery UI Draggable 옵션' 검색
	$("#" + uuid).draggable({
        handle:"#header > .toolbar",
        cancel:"#header > .toolbar > .buttons > ul",
        containment:"document",
        
		// containment 옵션 margin issue : https://stackoverflow.com/questions/39023002/jquery-draggable-div-centered-with-negative-margin-issue
        create:function(){
        	var position = $(this).offset();
        	$(this).css("margin", "0px").offset({
        		top:position.top,
        		left:position.left
        	});
        }
	});
	
	
	if(isForCopying == undefined){
		window_history[uuid] = new Array();
		window_history_index[uuid] = 0;
	}
	
	return uuid;
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);		
	});
}

// ================================================================================================================

$(function(){
	$("body").on("click", " > .window", function(){
		var uuid = $(this).attr("id");
		
		$(".window").css("z-index", 0);
		$("#" + uuid).css("z-index", 1);
	});
	
	$("body").on("click", " > .window .toolbar > .buttons li", function(){
		var uuid = $(this).parents(".window").attr("id");
		var type = $(this).attr("class");
		
		if(type == "maximize"){
			var position = $("#" + uuid).offset();
			$("#" + uuid).attr("existing_top", position.top);
			$("#" + uuid).attr("existing_left", position.left);
			
			$("#" + uuid).attr("existing_width", $("#" + uuid).css("width"));
			$("#" + uuid).attr("existing_height", $("#" + uuid).css("height"));
			
			$("#" + uuid).css({
				"width":"100%", "height":"100%",
				"top":"0px", "bottom":"0px", "left":"0px", "right":"0px"
			});
			
			$(this).remove();
			$("#" + uuid + " .toolbar > .buttons > ul > li:eq(0)").after("<li class='restore'><img src='/Portfolio/resources/images/main/restore.png'></li>");
		}else if(type == "restore"){
			$("#" + uuid).css({
				"width":$("#" + uuid).attr("existing_width"),
				"height":$("#" + uuid).attr("existing_height")
			}).offset({
				top:$("#" + uuid).attr("existing_top"),
				left:$("#" + uuid).attr("existing_left")
			});
			
			$("#" + uuid).removeAttr("existing_top");
			$("#" + uuid).removeAttr("existing_left");
			
			$("#" + uuid).removeAttr("existing_width");
			$("#" + uuid).removeAttr("existing_height");
			
			$(this).remove();
			$("#" + uuid + " .toolbar > .buttons > ul > li:eq(0)").after("<li class='maximize'><img src='/Portfolio/resources/images/main/maximize.png'></li>");
		}else if(type == "close"){
			var uuid = $(this).parents(".window").attr("id");
			
			delete window_history[uuid];
			delete window_history_index[uuid];
			
			$("#" + uuid).fadeOut(100, function(){
				$(this).remove();
			});
		}
		
		var window_height = parseInt($("#" + uuid).css("height"));
		var header_height = 77;
		$("#" + uuid + " > #body").css("height", window_height - header_height + "px");
	});
});

// ================================================================================================================

var window_history = new Object();
var window_history_index = new Object();
$(function(){
	$("body").on("click", ".navigationBar > .buttons li.active", function(){
		var window = $(this).parents(".window");
		var uuid = window.attr("id");
		var cur_window_history = window_history[uuid];
		
		window.find(".file.selected").removeClass("selected");
		cur_window_history[window_history_index[uuid]] = window.html();
		window.empty();
		
		if($(this).attr("class").indexOf("back") != -1){
			window.append(cur_window_history[--window_history_index[uuid]]);
			
			window.find(".navigationBar > .buttons .forward").addClass("active");
			if(window_history_index[uuid] > 0){ window.find(".navigationBar > .buttons .back").addClass("active"); }
		}else{
			window.append(cur_window_history[++window_history_index[uuid]]);
			
			window.find(".navigationBar > .buttons .back").addClass("active");
			if(window_history_index[uuid] < cur_window_history.length - 1){ window.find(".navigationBar > .buttons .forward").addClass("active"); }
		}
	});
	
	
	if(getClickType() == "dblclick"){
		$("body").on("click", ".shortcuts li", function(){
			$(this).trigger("dblclick");
		});
	}
	
	$("body").on(getClickType(), ".shortcuts li, .directory .file.folder", function(){
		var window = $(this).parents(".window");
		var target = window.find("#header > .navigationBar > .bar li:last-child").text();
		
		if(target.toLowerCase() != $(this).attr("id")){
			var uuid = window.attr("id");
			var cur_window_history = window_history[uuid];
			
			window.find(".file.selected").removeClass("selected");
			cur_window_history[window_history_index[uuid]++] = window.html();
			cur_window_history.splice(window_history_index[uuid]);
			
			if($(this).hasClass("file folder")){
				var target = $(this).find(".name").text();
				var id = $(this).attr("id");
				
				compose_directory(uuid, target, "/Portfolio/resources/json/main/project/" + id + ".json");
			}else{
				var copy_target_window_uuid = $("#desktop .file#" + $(this).attr("id")).trigger(getClickType(), [true]).data("uuid");
				var copy_target_window = $("#" + copy_target_window_uuid);
				copy_target_window.find(".toolbar > .buttons").empty().append(window.find(".toolbar > .buttons").html());
				
				window.empty().append(copy_target_window.html());
				copy_target_window.remove();
			}
			
			window.find(".navigationBar > .buttons .back").addClass("active");
		}
	});
});