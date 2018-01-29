/*
  copyright & author : mao.nianyou@fujisoft-china.com
  chrome extension for InquiryQuote [http://47.92.82.127/Lord.aspx]
  2018/01/12
  http://47.92.82.127/System/SysFastLogin.aspx?target=http%3A//47.92.82.127/Lord.aspx
  http://47.92.82.127/Lord.aspx
  2018/01/28 First time release.
  2018/01/29 BugFix:when there is no-hisotry record, or no-hit, the auto-work stopped.
             ->add default data to change the status of the task
*/

console.log('MAuto-Helper start-work');

var detailNumber;
var casNo;
var arrSupplierNum = [];
setTimeout('showMyTask()', 1000);

//showMyTask();

// Open tab of Tasks
function showMyTask(){
    $('#left div').each(function(idx){
    	console.log(idx);
    	if($($(this)[0]).text()=="我的找货任务"){
    		console.log($($(this)[0]).text());
    		$($(this)[0]).click();
    		setTimeout('saveTaskInfo()', 1500);
    		return false;
    	}
    	else{
    		return true;
    	}
    });
}

// Save first task info
function saveTaskInfo(){

    if($('#202010_IFrame').length<1){
		console.log('task-show : waiting');
		setTimeout('saveTaskInfo()', 600);
        return;
    }
    if($('#202010_IFrame').contents().find('.ext-el-mask').length > 0 ||
        $('#202010_IFrame').contents().find('.x-mask-loading').length>0){
        //wait for loading 'my tasks'
		console.log('task-show : waiting');
		setTimeout('saveTaskInfo()', 1000);
        return;
    }
    if($('#202010_IFrame').contents().find('.x-grid3-header').length < 0)
    {
		console.log('task-show : waiting');
		setTimeout('saveTaskInfo()', 600);
        return;
    }
    if($('#202010_IFrame').contents().find('.x-grid3-body').length < 0)
    {
		console.log('task-show : waiting');
		setTimeout('saveTaskInfo()', 600);
        return;
    }

	var row1 = ($('#202010_IFrame').contents().find(".x-grid3-row-first"));
	
	if($(row1).length<1){
		console.log('task-show : no new task');
		alert('Auto-Work Finished!');
		return;
	}
	
	//明细编号
	detailNumber = $($(row1).find(".x-grid3-col-DetailNum span")).text();
	console.log('detailNumber:'+ detailNumber);
	//CasNo
	casNo = $($(row1).find(".x-grid3-col-CASNumber span")).text();
	console.log('casNo:'+ casNo);
	
	//Open the window of HistoryInfo
    showQuoteHistory()
}

function showQuoteHistory(){
	$('#left div').each(function(idx){
		console.log(idx);
		if($($(this)[0]).text()=="找货记录"){
			console.log($($(this)[0]).text());
			$($(this)[0]).click();
			setTimeout(function(){searchHistoryInfo(0)}, 500);
    		return false;
    	}
    	else{
    		return true;
    	}
	});
}

function searchHistoryInfo(n){
	
	switch(n){
        case 0:
	        if($('#201041_IFrame').length < 1 || $('#201041_IFrame').contents().find('.x-grid3-body').length<1){
                //wait for loading 'Quote history'
	            console.log('history-show : waiting');
                setTimeout(function(){searchHistoryInfo(0)}, 500);
                return;
            }
            searchHistoryInfo(1);
            return;

        case 1:
            var mask = $('#201041_IFrame').contents().find('.ext-el-mask');
            var loading = $('#201041_IFrame').contents().find('.x-mask-loading');
            if($(mask).length > 0 || $(loading).length>0){
                console.log('HisSearchResult:loading');
                setTimeout(function(){ searchHistoryInfo(1) }, 500);
                return;
            }
            searchHistoryInfo(2);
            return;
        
        case 2:
            // history-data loaded: have record or not
            var rows = $('#201041_IFrame').contents().find(".x-grid3-body .x-grid3-row");
            if($(rows).length<1){
                console.log('history-show : no-record');
                saveToStorage();
                return;
            }

            var searchBox = ($('#201041_IFrame').contents().find("#ctl00_ctl00_Body_ProInfo"))[0];
            $(searchBox).val(casNo);
            console.log('Do search:CasNo:' + casNo);
            $('#201041_IFrame').contents().find(".icon-reload").click();
	        
            setTimeout('saveHistoryInfo()', 500);
            return;
    }
}

// save SupplierNum in history-info to storage
function saveHistoryInfo(){
	
    var mask = $('#201041_IFrame').contents().find('.ext-el-mask');
	var loading = $('#201041_IFrame').contents().find(".x-mask-loading");
	if($(mask).length>0 || $(loading).length>0){
		//wait for loading search result
		console.log('search result : loading');
		setTimeout('saveHistoryInfo()', 500);
		return;
	}
	var rows = $('#201041_IFrame').contents().find(".x-grid3-body .x-grid3-row");
	console.log('search result count : ' + rows.length);
    if(rows == undefined || rows==null || rows.length<1){
        saveToStorage();
        return;
    }
	$(rows).each(function(idx){
	    var total = $(this).find('.x-grid3-col-Total');
		if(parseInt($(total).text())>0){
		    console.log($(total).text());
            var supplierNum = $(this).find('.x-grid3-col-SupplierNum').text();
            if($.inArray(supplierNum, arrSupplierNum)<0){
                arrSupplierNum.push(supplierNum);
            }
		}
	});
    console.log(arrSupplierNum);
    
    checkNextPageOfHisInfo();
    
	return;
}

function checkNextPageOfHisInfo()
{
    var pagingTip = $('#201041_IFrame').contents().find('#ctl00_ctl00_Body_PagingControl1_pagingTip .x-label-value');
    console.log(pagingTip.text());
    console.log(pagingTip.text().split(','));
    console.log(pagingTip.text().split(',').length);
    if(pagingTip.text().split(',').length>1){
        setTimeout(function(){
            checkNextPageOfHisInfo();
        },600);
        return;
    }
    
    var arrTip = pagingTip.text().split('/');
    var pageNo = arrTip[0].replace(/[^0-9]/g,"");
    var pageTotal = arrTip[1].replace(/[^0-9]/g,"");
    console.log('pageNo:' +  pageNo + '\r\n' + '[pageTotal]:' + pageTotal);
    
    if(pageNo!=pageTotal){
        var btnNextPage = $('#201041_IFrame').contents().find('#ctl00_ctl00_Body_PagingControl1_btnNext .icon-forwardgreen');
        $(btnNextPage).click();
        setTimeout(function(){
            saveHistoryInfo();
        },1000);
        return;
    }
    
    saveToStorage();
    
    return;
}

function saveToStorage(){
	chrome.extension.sendMessage({'action': 'saveSupplier', 'supplier': arrSupplierNum.toString()},function(data){
        console.log('Supplier saved : ' + data);
        
      	//open detail window
	    var detailUrl = 'http://47.92.82.127/Crm/Ask/AskOrderDetail_Edit.aspx?KeyString=%7B%22DetailNum%22%3A%22'+ detailNumber + '%22%7D';
        console.log(detailUrl);
	    window.open(detailUrl);
    });
}