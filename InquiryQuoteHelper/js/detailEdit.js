/*
  copyright & author : mao.nianyou@fujisoft-china.com
  chrome extension for InquiryQuote [http://47.92.82.127/Lord.aspx]
  2018/01/12
  http://47.92.82.127/System/SysFastLogin.aspx?target=http%3A//47.92.82.127/Lord.aspx
  http://47.92.82.127/Lord.aspx
  http://47.92.82.127/Crm/Ask/AskOrderDetail_Edit.aspx?KeyString=
  2018/01/28 First time release.
  2018/01/29 BugFix:when there is no-hisotry record, or no-hit, the auto-work stopped.
             ->add default data to change the status of the task
*/

console.log('AskOrderDetail_Edit:DomLoaded');

var arrSupplier=[];

// Get the Supplier data from storage
chrome.extension.sendMessage({'action': 'getSupplier', 'data': {}},function(data){

    if(data!=undefined && data!=null && data!=''){
	    arrSupplier = data.split(',');
    }
	console.log('SupplierNum List to process:[' + arrSupplier + '] Total Count:' + arrSupplier.length);
    
    // Start working from here
    setTimeout("domReady()", 500);
});

function domReady(){
    var mask = $('#ctl00_ctl00_Body_Center_LookUpPanel_IFrame').contents().find('.ext-el-mask');
    var loading = $('#ctl00_ctl00_Body_Center_LookUpPanel_IFrame').contents().find(".x-mask-loading");
	if($(mask).length>0 || $(loading).length>0){
		//wait for loading 'Quote history'
		console.log('LookUp-show : loading');
		setTimeout('domReady()', 500);
		return;
	}
    $('#ctl00_ctl00_Body_Center_btnAddLookUp .icon-bulletadd').click();
    
	if(arrSupplier.length==0){
        //if No-History-Record: just add an empty new row to change the status of the task
        setTimeout(function(){ searchSupplier(3); }, 1500);
        return;
    }
    setTimeout('showSearchDialog()', 1500);
}

function showSearchDialog(){
    if($('iframe').length < 3){
        console.log('AddLookUp-Dialog:loading');
        setTimeout('showSearchDialog()', 1000);
        return;
    }
    if($('iframe').contents().find('#x-form-el-ctl00_ctl00_Body_Center_SupplierNum .x-form-search-trigger').length <1){
        setTimeout('showSearchDialog()', 500);
        return;
    }
    
    $("iframe").contents().find('#x-form-el-ctl00_ctl00_Body_Center_SupplierNum .x-form-search-trigger').click();

    setTimeout(function(){searchSupplier(0);}, 1000);
    return;
}

function searchSupplier(i){

    var subFrame = $('iframe').contents().find("iframe").last();
    
    switch(i){
        case 0:    // wait for search-dialog loading
            if($(subFrame).contents().find('#Supplier').length<1){
                setTimeout(function(){searchSupplier(0);}, 1000);
                return;
            }
            $(subFrame).contents().find('#Supplier').prop('value', arrSupplier[0]);
            setTimeout(function(){searchSupplier(1);}, 100);
            return;
        
        case 1:    // Search by keycode:供应商编号
            $(subFrame).contents().find('.icon-reload').click();
            setTimeout(function(){searchSupplier(2);}, 1000);
            return;
        
        case 2:    // get selected and confirm
            if($(subFrame).contents().find('.x-mask-loading').length>0){
                setTimeout(function(){searchSupplier(2);}, 500);
                return;
            }
            
            injectJS();
            
            setTimeout(function(){
                searchSupplier(3);
            }, 1000);
            
            return;
        case 3:
            var btnNewDetailRow = $("iframe").contents().find('#ctl00_ctl00_Body_Center_ToolbarButton1 .icon-newred');
            if($(btnNewDetailRow).length < 1){
                console.log('wait for NewDetailRow button');
                setTimeout(function(){searchSupplier(3);}, 500);
                return;
            }
            console.log('新增行');
            $(btnNewDetailRow).click();
            
            console.log('添加');
            $("iframe").contents().find('#btnConfirm').click();
            
            setTimeout(function(){
                goNextSupplierNum();
            }, 1200);
            
            return;
    }
    
}

// To operate the Ext.Grid, need [Injection]
function injectJS(){
    
    const theJquery = document.createElement('script');
    theJquery.src = '//cdn.bootcss.com/jquery/3.2.1/jquery.js';
    $('iframe').contents().find('iframe').last().contents().find('head')[0].appendChild(theJquery);
    
    theJquery.onload = function(){
        
        var injectScript = document.createElement('script');
        injectScript.innerHTML=
            "$('.x-grid3-row-first').on('click',function(){" + 
            "    HomeGridPanel.getSelectionModel().selectFirstRow();" +
            "    $('.icon-tick').click();" +
            "});";
        $('iframe').contents().find('iframe').last().contents().find('head')[0].appendChild(injectScript);
        
        $('iframe').contents().find('iframe').last().contents().find('.x-grid3-row-first').click();
    }
}

// Go next
function goNextSupplierNum()
{
    // remove the current SupplierNum
    arrSupplier.shift();

    // Save the left [SupplierNum]s to storage
	chrome.extension.sendMessage({'action': 'saveSupplier', 'supplier': arrSupplier.toString()},function(data){
        console.log('goNextSupplierNum : ' + data);
        if(arrSupplier.length > 0){
            // Reload to process next SupplierNum
            window.location.reload();
        }else{
            // Open main window to start next task
            console.log((new Date()) + "=> SupplierHistoryAddComplete");
            window.open('http://47.92.82.127/Lord.aspx');
        }
    });
}
