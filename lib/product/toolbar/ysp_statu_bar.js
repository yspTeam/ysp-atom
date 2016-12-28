'use babel';

export default class YSPStatuBar {

    constructor(serializedState) {
        setTimeout(function(){
                  initStatu();
        }, 5000);
    }
    showProgress(show, text, progress) {
        setProgress(show, text, progress);
    }
}

function initStatu() {
    var tags = document.getElementsByTagName('atom-panel-container')
    for (var i in tags) {
        if (tags[i].className == 'footer') {
            var all_div = tags[i].getElementsByTagName('div');
            for (var j in all_div) {
                if (all_div[j].className == 'status-bar-left') {
                    all_div[j].innerHTML += getProgressHTML();

                    return;
                }
            }
        }
    }
}

function getProgressHTML() {
    return "<div class='block'>\
    <progress id='progress' class='inline-block' max='1' value='0'></progress>\
    </div>";//<span id='progress_title' class='inline-block'></span>\
}

function setProgress(show, text, progress) {
    if (show) {
        // document.getElementById("progress_title").style.display = 'block';
        document.getElementById("progress").style.display = 'block';
        // document.getElementById("progress_title").innerHTML = text;
        document.getElementById("progress").value = progress;
    } else {
        // document.getElementById("progress_title").style.display = 'none';
        document.getElementById("progress").style.display = 'none';
    }
}

exports.setProgress = setProgress;
