let moodValue = 50;
let specialLiker = '';

function sendMood(event) {
  moodValue = event.target.value
  console.log('moodValue', moodValue)
  console.log('sendMood');
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    const activeTab = tabs[0];
    moodValue = document.querySelector('input[name="mood"]').value;
    chrome.storage.sync.set({moodValue}, function() {
      console.log('MoodValue set to ' + moodValue);
    });
    chrome.tabs.sendMessage(activeTab.id, {text: 'mood', moodValue});
  });
}

function storeSpecialLiker(event, value) {
  specialLiker = event.target.value;
  chrome.storage.sync.set({specialLiker}, function() {
    console.log('Special Liker set to ' + specialLiker)
  });
}

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.sync.get(['mood'], function(result) {
    moodValue = result.moodValue || moodValue;
    document.querySelector('input[name="mood"]').value = moodValue;
    document.querySelector('input[name="mood"]').onchange = sendMood;
    document.querySelector('input[name="special-liker"]').onchange = storeSpecialLiker;
  });
});
