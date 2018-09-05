let moodValue = 50;

function sendMood() {
  console.log('sendMood');
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    const activeTab = tabs[0];
    moodValue = document.querySelector('input[name="mood"]').value;
    chrome.storage.sync.set({mood: moodValue}, function() {
      console.log('MoodValue is set to ' + moodValue);
    });
    chrome.tabs.sendMessage(activeTab.id, {text: 'mood', moodValue});
  });
}

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.sync.get(['mood'], function(result) {
    moodValue = result.mood || moodValue;
    document.querySelector('input[name="mood"]').value = moodValue;
    document.querySelector('input[name="mood"]').onchange = sendMood;
  });
});
