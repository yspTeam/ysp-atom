'use babel';

export default class YSPSocketClientView {

    constructor(serializedState) {

    }

    hid() {
        if (document.getElementById("ysp_socket_client_parent_view") != null) {
            document.getElementById("ysp_socket_client_parent_view").remove();
        }
    }

    show(nameArr) {
        if (document.getElementById("ysp_socket_client_parent_view") != null) {
            document.getElementById("ysp_socket_client_parent_view").remove();
        }
        var body = document.body;
        var html = "<div id='ysp_socket_client_view'><ul id='all_client_names'>";
        for (var i in nameArr) {
            html += "<li><a href='#'>" + nameArr[i] + "</a></li>";
        }
        html += "</ul></div>";

        var div = document.createElement("div");
        div.setAttribute('id', 'ysp_socket_client_parent_view');
        div.innerHTML = html;
        document.body.appendChild(div);

        var d = document.getElementById('ysp_socket_client_parent_view');
        d.onclick = function(ev) {

            var x = ev.clientX;
            var y = ev.clientY;
            var p = document.getElementById('ysp_socket_client_view');
            if (p == null) {
                return;
            }
            if (x > p.getBoundingClientRect().left && x < (p.getBoundingClientRect().left + p.getBoundingClientRect().width) &&
                y > p.getBoundingClientRect().top && y < (p.getBoundingClientRect().top + p.getBoundingClientRect().height)) {} else {
                if (document.getElementById("ysp_socket_client_parent_view") != null) {
                    document.getElementById("ysp_socket_client_parent_view").remove();
                }
            }
        }

    }
}
