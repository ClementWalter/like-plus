// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
const facebookUrlRegex = /^https?:\/\/(?:[^./?#]+\.)?facebook\.com/;
let facebookTabIds = [];

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab){
	const title = tab.title;
	if(facebookUrlRegex.test(tab.url)){
	  facebookTabIds.push(tabId);
	  facebookTabIds = [...new Set(facebookTabIds)];
	  chrome.storage.sync.set({facebookTabIds}, function() {
      console.log('Facebook tab id set to ' + facebookTabIds);
      chrome.tabs.sendMessage(tab.id, {title});
    });
	}
});
