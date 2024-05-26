var curFocusTarget;
$(function(){
	$("body").on("click", ".file", function(){
		if(curFocusTarget != undefined && curFocusTarget.get(0) != $(this).get(0)){
			curFocusTarget.removeClass("selected");
		}
		
		if(curFocusTarget == undefined || curFocusTarget.get(0) != $(this).get(0)){
			curFocusTarget = $(this);
			$(this).addClass("selected");
		}
	});
	
	$("html").click(function(e){
		if(curFocusTarget != undefined){
			if($(e.target).get(0) != curFocusTarget.get(0)){
				if($(e.target).closest(".file").get(0) != curFocusTarget.get(0)){
					curFocusTarget.removeClass("selected");
					curFocusTarget = undefined;
				}
			}
		}
	});
});

// ===============================================================================================================

$(function(){
	$("body").on("keyup", ".chrome input[type='text']", function(e){
		if(e.keyCode == 13){
			window.open("https://www.google.com/search?q=" + $(this).val());
		}
	});
});

// ===============================================================================================================

// function compose_directory(uuid, target, data, isDirectoryInFolder = true){ // Internet Explorer : Default Parameters(isDirectoryInFolder = true) 지원 X
function compose_directory(uuid, target, data, isDirectoryInFolder){
	isDirectoryInFolder = isDirectoryInFolder == undefined ? true : isDirectoryInFolder;
	
	$("#" + uuid + " > #header > .navigationBar > .buttons > ul > li.active").removeClass("active");
	
	if(isDirectoryInFolder){
		$("#" + uuid + " > #header > .navigationBar > .bar > ul").append("<i><img src='/Portfolio/resources/images/main/next.png'></i>" +
																							   "<li><span>" + target + "</span></li>");
	}
	
	$("#" + uuid + " > #body > .content").addClass("directory");
	$("#" + uuid + " > #body > .content.directory").empty();
	$("#" + uuid + " > #body > .content.directory").append("<ul class='header'>" +
																				   "<li class='name'>이름</li>" +
																				   "<li class='date'>날짜</li>" +
																				   "<li class='type'>유형</li>" +
																			   "</ul>" +
																			   "<ul class='body'></ul>");
	
	$.ajax({
		url:data,
		
		success:function(json){
			var date = dateFormat(new Date());
			
			$.each(json.list, function(index, file){
				var header = "<li id='" + file.id + "' class='file'>";
				var name = "<li class='name'>";
				if(file.type == "폴더"){ header = "<li id='" + file.id + "' class='file folder'>"; }
				if(file.name == "GGV"){ name = "<li class='name' style='color:red;'>" }
				
				$("#" + uuid + " > #body > .content.directory > .body").append(header +
																										  "<ul>" +
																										  	  name +
																										  	  	  "<img src='" + file.icon + "'>" +
																										  	  	  file.name +
																										  	  "</li>" +
																										  	  "<li class='date'>" + ((file.date) ? file.date : date) + "</li>" +
																										  	  "<li class='type'>" + file.type + "</li>" +
																										  "</ul>" +
																									  "</li>");
				
				if(file.link != undefined){
					$(".file#" + file.id).attr((isPC()) ? "ondblclick" : "onclick", "window.open('" + file.link + "')");
				}else if(file.type == "Details"){
					$(".file#" + file.id).attr((isPC()) ? "ondblclick" : "onclick", "showDetails('" + file.target + "')");
				}
			});
		}
	});
}

function dateFormat(date){
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	// var second = date.getSeconds();
	
	var meridiem = "오전";
	if(hour > 12){
		meridiem = "오후";
		hour -= 12;
	}
	
	month = month >= 10 ? month : '0' + month;
	day = day >= 10 ? day : '0' + day;
	hour = hour >= 10 ? hour : '0' + hour;
	minute = minute >= 10 ? minute : '0' + minute;
	// second = second >= 10 ? second : '0' + second;
	
	return date.getFullYear() + '-' + month + '-' + day + ' ' + meridiem + ' ' + hour + ':' + minute;
	// return date.getFullYear() + '-' + month + '-' + day + ' ' + meridiem + ' ' + hour + ':' + minute + ':' + second;
}

function showDetails(target){
	$.ajax({
		url:"/Portfolio/details/" + target + ".html",
		dataType:"html",
		success:function(html){
			let details = $(html).hide();
			$("body").append(details);
			details.fadeIn(250);
		}
	});
}

function detailsCommonScript(){
	$(".slider").slick({
		prevArrow:"<button type='button' class='slick-prev'>Previous</button>",
		nextArrow:"<button type='button' class='slick-next'>Next</button>",
		dots:true
	});
	
	$("video").attr("width", "100%");
	$("video").attr("controls", "controls");
	$("video").prop("muted", true);
	
	if($(window).height() > 768){
		$(".section").css("height", $(window).height() * 0.65 + "px");
	}else if($(window).height() > 480){
		$(".section").css("height", $(window).height() * 0.75 + "px");
	}else{
		$(".section").css("height", $(window).height() + "px");
	}
	
	$("#detailsViewer #close").click(function(){
		$("#detailsBackground").remove();
		$(".destroy").remove();
	});
}

// ===============================================================================================================

function getClickType(){
	return (isPC()) ? "dblclick" : "click";
}

function isPC(){
	var filter = "win16|win32|win64|mac|macintel";
	if(filter.indexOf(navigator.platform.toLowerCase()) > 0){
		return "true";
	}else{
		return "false";
	}
}
