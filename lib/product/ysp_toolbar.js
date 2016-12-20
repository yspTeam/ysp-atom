'use babel';

export default class YSPToolBar {


    constructor(serializedState) {
              var tags = document.getElementsByTagName('atom-panel-container')
              for (var i in tags) {
                        if (tags[i].className == 'top') {
                                  tags[i].innerHTML += getRunBtn();
                                  break;
                        }
              }
   }

}

function getToolbarHTML() {
          var runBtn = getRunBtn();
          return "<div style='width:100%;height:60px;background:#fff'>" +
          runBtn
          +"</div>";
}

function getRunBtn() {
          return "<a class='"+btnCssStr()+"' href='javascript:;' onclick='runBtnClick()'>\
          <img src='res/run.png' />\
          </a>"
}

function btnCssStr(){
          return 'width:100px;height:50px'
}

//method
function runBtnClick(){

}
