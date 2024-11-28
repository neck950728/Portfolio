$(function(){
	$.ajaxSetup({
		async:false
	});
	
	$.ajax({
		url:"/Portfolio/resources/json/main/desktop.json",
		
		success:function(json){
			$.each(json.list, function(index, file){
				$("#desktop > ul").append("<li id='" + file.name.toLowerCase() + "' class='file'>" +
														"<img src='" + file.icon + "'><br>" +
														"<span>" + file.name + "</span>" +
													"</li>");
			});
		}
	});
	
	$("#desktop").fadeIn();
});

$(function(){
	$("body").on(getClickType(), "#desktop .file", function(e, isForCopying){
		var type = $(this).attr("id");
		
		var uuid = create_window(type, isForCopying);
		$(this).data("uuid", uuid);
		$("#" + uuid + " > #body > .content").attr("id", type);
		
		if(type == "about"){
			$("#" + uuid + " > #body > .content").append("<h1>김민진에 대한 기본 정보 보기</h1>" +
																		  "<div>" +
																		  	  "<p>안녕하세요.</p>" +
																		  	  "<p>신입 백엔드 개발자 김민진입니다.</p>" +
																		  	  "<p>하나를 배우더라도 제대로 배우고자 노력하는 것이 제 강점입니다.</p>" +
																		  	  "<p>기초를 탄탄히 하여 변화에 빠르게 적응할 수 있는 개발자가 되기 위해 노력하겠습니다.</p>" +
																		  "</div>" +
																		  "<ul>" +
																		  	  "<li class='profile'>" +
																		  	  	  "<p class='boundary'><span>Profile</span></p>" +
																		  	  	  "<div>" +
																		  	  	  	  "<h1>김민진</h1>" +
																		  	  	  	  "<p>Back-End 개발자(신입)</p>" +
																		  	  	  	  "<p>1995.07.28</p>" +
																		  	  	  	  "<p>인천광역시 부평구</p>" +
																		  	  	  	  "<p class='blog'><a href='https://blog.naver.com/dngu_icdi' target='_blank'>blog.naver.com/dngu_icdi</a></p>" +
																			  	  	  "<div class='blogDescription'>" +
																		  	  	  	  	  "<p>공유 목적이 아닌, 개인 기록용 블로그입니다.</p>" +
																		  	  	  	  	  "<p>이해가 잘 안 갔던 내용과 추가로 궁금했던 부분,</p>" +
																		  	  	  	  	  "<p>그리고 개발 과정에서 겪었던 문제와 그 해결 방법 등을 기록해 두었습니다.</p>" +
																		  	  	  	  "</div>" +
																		  	  	  "</div>" +
																		  	  	  "<img src='/Portfolio/resources/images/main/about/me.jpg'>" +
																		  	  "</li>" +
																		  	  /*
																			  	  "<li class='experience'>" +
																			  	  	  "<p class='boundary'><span>Programming Experience</span></p>" +
																			  	  	  "<ul></ul>" +
																			  	  "</li>" +
																				  "<li class='certificate'>" +
																			  	  	  "<p class='boundary'><span>Certificate</span></p>" +
																			  	  	  "<ul></ul>" +
																			  	  "</li>" +
																		  	  */
																		  	  "<li class='skills'>" +
																		  	  	  "<p class='boundary'><span>Skills</span></p>" +
																		  	  	  "<p class='details'><span onclick=\"window.open('/Portfolio/resources/pdf/skills_details.pdf')\">자세히 보기</span></p>" +
																		  	  	  "<p class='inProgress'>현재는 React와 JPA를 꾸준히 학습하고 있습니다.</p>" +
																		  	  	  "<ul></ul>" +
																		  	  "</li>" +
																		  "</ul>");
			
			$.ajax({
				url:"/Portfolio/resources/json/main/about.json",
				async:false,
				success:function(json){
					/*
						$.each(json.experience, function(index, experience){
							$("#" + uuid + " > #body > .content .experience > ul").append("<li>" +
																													"<h2>- " + experience.period + "</h2>" +
																													"<i> : </i>" +
																													"<span>" + experience.process + "</span>" +
																												"</li>");
						});
						
						$.each(json.certificate, function(index, certificate){
							$("#" + uuid + " > #body > .content .certificate > ul").append("<li>" +
																													"<h2>- " + certificate.name + "(" + certificate.acquisition_date + ")" + "</h2>" +
																													"<i> : </i>" +
																													"<span>" + certificate.institution + "</span>" +
																												"</li>");
						});
					*/
					
					$.each(json.skills, function(key, value){
						$.each(value, function(i, val){
							var class_ = key;
							if(i == 0){
								if(key == "server_side"){
									$("#" + uuid + " > #body > .content .skills > ul").append("<li class='contour'></li>");
								}
								
								class_ += " first";
							}else if(i == value.length - 1){
								class_ += " last";
							}
							
							$("#" + uuid + " > #body > .content .skills > ul").append("<li class='" + class_ + "'><img src='" + val.icon + "'></li>");
						});
					});
				}
			});
		}else if(type == "project"){
			compose_directory(uuid, "Project", "/Portfolio/resources/json/main/project.json", false);
		}else if(type == "contact"){
			compose_directory(uuid, "Contact", "/Portfolio/resources/json/main/contact.json", false);
		}
		
		var window_height = parseInt($("#" + uuid).css("height"));
		var header_height = 77;
		$("#" + uuid + " > #body").css("height", window_height - header_height + "px");
	});
});
