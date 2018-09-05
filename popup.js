let moodValue = 50;

function sendMood() {
  console.log('sendMood');
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    const activeTab = tabs[0];
    moodValue = document.querySelector('input[name="mood"]').value;
    chrome.tabs.sendMessage(activeTab.id, {text: 'mood', moodValue});
  });
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector('input[name="mood"]').value = moodValue;
  document.querySelector('input[name="mood"]').onchange = sendMood;
});
