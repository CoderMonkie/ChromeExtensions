/*
  @author : maonianyou@gmail.com
  @description : chrome extension for auto sign [zhidao.baidu.com]
  @date:2018/01/12 auto sign baiduzhidao.
		2019/03/28 add wenku daily-sign.remove jq.
*/
setTimeout(() => {
	//if have the [userbar-login] button,
	//need to login first.
	var login = document.querySelector("#userbar-login") || document.querySelector("#login");
	if (login) {
		login.click();
		//passport-login-pop-dialog will show
		//TODO:id/pd to login
	} else if (document.querySelector(".go-sign-in")) { //https://zhidao.baidu.com
		if (document.querySelector(".go-sign-in").textContent == '已签到') {
			console.log(" 'baidu.zhidao' sign task: have signed");
		} else {
			document.querySelector(".go-sign-in").click();
			sing_zhidao();
		}
	} else if (document.querySelector('li[class=header-meta-attendance]>a')) { //	https://zhidao.baidu.com/ihome/homepage/recommendquestion
		if (document.querySelector('li[class=header-meta-attendance]>a').textContent == "去签到") {
			document.querySelector('li[class=header-meta-attendance]>a').click();
			sing_zhidao();
		}
	} else if (document.querySelector(".js-signin-btn")) { //https://wenku.baidu.com/task/browse/daily
		//console.log("do daily-sign-task of 'wenku.baidu.com/task/browse/daily'")
		var btnsign = document.querySelector(".js-signin-btn");
		setTimeout(() => btnsign.click(), 500);
	}
}, 1000);

//open the [sign] dialog and do sign
function sing_zhidao(){
	while (!document.querySelector("#sign-in-btn")) {
		//console.log("wait for sign-dialog show");
	}

	if (document.querySelector(".sign-in-btn .done")) {
		//console.log('done->close');
		closeDialog();
	} else {
		//console.log('not done');
		document.querySelector("#sign-in-btn").click();
		//console.log('not done-->now done');
		setTimeout("closeDialog()", 1000);
	}
}

function closeDialog() {
	//console.log("close sign-task dialog");
	document.querySelector('.ui-dialog-titlebar-close').click();
}