// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
const facebookUrlRegex = /^https?:\/\/(?:[^./?#]+\.)?facebook\.com/;

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab){
	const title = tab.title;
	if(facebookUrlRegex.test(tab.url)){
    chrome.tabs.sendMessage(
      tab.id,
      {
        text: 'facebook',
        title,
      },
      () => {},
    );
	}
});
