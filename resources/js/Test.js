$(function(){
	var li_index = 0;
	var li_length = $(".typing-txt > ul > li").length;
	var typing_index = 0;
	var typing_text_ary = $(".typing-txt > ul > li").eq(li_index).text().split("");
	var flag = true;
	var del = -1;
	
	var typing_id = setInterval(typing, 150);
	
	function typing(){
		if(typing_index < typing_text_ary.length){ // 현재 문장 타이핑
			$(".typing_field").append(typing_text_ary[typing_index]);
			typing_index++;
		}else{ // 현재 문장 타이핑 완료
			if(li_index < li_length - 1){ // 타이핑할 문장이 더 존재하는 경우
				if(flag){
					flag = false;
					
					// 0.5초 후 다시 시작
					clearInterval(typing_id);
					setTimeout(function(){ typing_id = setInterval(typing, 150); }, 500);
				}else{
					if(-typing_text_ary.length <= del){ // 현재 문장 backspace
						$(".typing_field").html(typing_text_ary.slice(0, del));
						del--;
					}else{
						// 다음 문장을 타이핑하기 위한 세팅
						li_index++;
						typing_index = 0;
						typing_text_ary = $(".typing-txt > ul > li").eq(li_index).text();
						flag = true;
						del = -1;
					}
				}
			}else{
				clearInterval(typing_id);
			}
		} 
	}
});