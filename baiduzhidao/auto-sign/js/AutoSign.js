/*
  copyright & author : maonianyou@gmail.com
  chrome extension for auto sign [zhidao.baidu.com]
  2018/01/12
*/
//if have the [userbar-login] button,
//need to login first.
if($('#userbar-login').length > 0){
	$('#userbar-login').append("<span id='span_login'></span>");
    $("#span_login").click();
	//passport-login-pop-dialog
	//TODO:id/pd to login
}
else if($(".go-sign-in").length <= 0){
	//console.log("not have a entry to sign");
}else if($(".go-sign-in").text() == '已签到'){
	//console.log("have signed");
}else{
	//if already login and not sign:click the [go-sign-in]
	$(".go-sign-in").text("GoSignIn");
	$(".go-sign-in").append("<span></span>");
	$(".go-sign-in span").click();
	//console.log("GoSignIn clicked");
	
	//open the [sign] dialog
	
	while($("#sign-in-btn").length <= 0){
		//console.log("wait for sign-dialog show");
	}
	
	if($(".sign-in-btn .done").length > 0){
		//console.log('done');
		closeDialog();
	}
	else{
		//console.log('not done');
		$("#sign-in-btn").append("<span id='span_sign'></span>");
		$("#span_sign").click();
        //console.log('not done-->now done');
	    setTimeout("closeDialog()", 1500);
	}
}

function closeDialog(){
	//console.log("closeDialog");
	$('.ui-dialog-titlebar-close').click();
}