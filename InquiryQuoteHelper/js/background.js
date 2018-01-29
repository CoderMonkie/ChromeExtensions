/*
  copyright & author : mao.nianyou@fujisoft-china.com
  chrome extension for inquiry [http://47.92.82.127/Lord.aspx]
  2018/01/12
  http://47.92.82.127/System/SysFastLogin.aspx?target=http%3A//47.92.82.127/Lord.aspx
  http://47.92.82.127/Lord.aspx
  http://47.92.82.127/Crm/Ask/AskOrderDetail_Edit.aspx?KeyString=
  2018/01/28 First time release.
*/

chrome.extension.onMessage.addListener(function(request, _, sendResponse){
    if(request.action == 'saveSupplier'){
		localStorage.supplier = request.supplier;
		sendResponse(localStorage.supplier);
    }
	else if(request.action == 'getSupplier'){
		sendResponse(localStorage.supplier);
    }
});
