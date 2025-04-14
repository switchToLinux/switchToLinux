// main js functions


function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

var goToTopLink = document.getElementById("top-link");
var topButtons = document.getElementsByClassName("top-link");
for (var i = 0; i < topButtons.length; i++) {
    topButtons[i].addEventListener("click", scrollToTop);
}
const themes = ['light', 'dark', 'cloud'];
var lastScrollTop = 0; // 用于存储上一次滚动位置
var goToTopBtn = document.getElementById('top-button');
function toggleScrollTopButton() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    // 判断滚动方向
    if (scrollTop > lastScrollTop || scrollTop == 0) {
        // 向下滚动，隐藏按钮
        goToTopBtn.style.opacity = '0';
        goToTopBtn.style.visibility = "hidden";
        goToTopLink.style.visibility = "hidden";
        goToTopLink.style.opacity = "0";
    } else {
        // 向上滚动，显示按钮
        goToTopBtn.style.opacity = '1';
        goToTopBtn.style.visibility = "visible";
        goToTopLink.style.opacity = "1";
        goToTopLink.style.visibility = "visible";
    }

    lastScrollTop = scrollTop;
};

window.onscroll = function () {
    toggleScrollTopButton();
};


/* Giscus.app theme toogle function */
function changeGiscusTheme() {
    const theme = document.body.classList.contains('dark') ? 'noborder_dark' : (document.body.classList.contains('light') ? 'light_tritanopia' : 'cobalt');
    function sendMessage(message) {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (! iframe) return; 
        iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }
    sendMessage({
        setConfig: {
            theme: theme,
        },
    });
};

/* Blog theme toogle function */
function switchTheme() {
    var oldTheme = localStorage.getItem("pref-theme");
    var themes = ['light', 'dark', 'cloud'];

    var oldThemeIndex = themes.indexOf(oldTheme);
    var newThemeIndex = (oldThemeIndex + 1) % themes.length;

    var newTheme = themes[newThemeIndex];

    document.body.setAttribute("class", newTheme);
    localStorage.setItem("pref-theme", newTheme);
    changeGiscusTheme();
}

function setTheme(theme) {
    var newTheme = themes.includes(theme) ? theme : 'cloud';
    document.body.setAttribute("class", newTheme);
    localStorage.setItem("pref-theme", newTheme);
    changeGiscusTheme();
}

function toggleTheme() {
    document.getElementById("theme-toggle").click();
}

function toggleFullscreen() {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
        // If the document is not currently in fullscreen, request fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    } else {
        // If the document is currently in fullscreen, exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}
function handleShortcut(event) {
    // 按了Alt键同时按如下键
    if (event.altKey) {
        switch (event.key) {
            case 'a':
                location.href = "/search/";
                break;
            case 'c':
                var sidebar_toc = document.getElementById("sidebar-toc");
                sidebar_toc.classList.toggle('show');
                break;
            case 'g':
                scrollToTop();
                break;
            case 'q':
                location.href = "/";
                break;
            case 'r':
                location.reload();
                break;
            case 'w':
                toggleFullscreen();
                break;
            case 'x':
                var sidebar_pages = document.getElementById("sidebar-pages");
                sidebar_pages.classList.toggle('show');
                break;
            case 'z':
                toggleTheme();
                break;
            default:
                // Handle other keys if needed
                break;
        }
    }
}

// Add event listener to the document for keydown events
document.addEventListener("keydown", handleShortcut);
document.getElementById("theme-toggle").addEventListener("click", () => {
    switchTheme();
});

fetch('https://v1.hitokoto.cn?c=a&c=b&c=d&c=i&c=j&c=k&max_length=24')
    .then(response => response.json())
    .then(data => {
        const hitokoto = document.querySelector('#hitokoto_text')
        hitokoto.innerText = data.hitokoto + "《" + data.from + "》"
    })
    .catch(console.error)

document.querySelectorAll('pre > code').forEach((codeblock) => {
    const container = codeblock.parentNode.parentNode;

    const copybutton = document.createElement('button');
    copybutton.classList.add('copy-code');
    copybutton.innerHTML = "copy";

    function copyingDone() {
        copybutton.innerHTML = "copied!";
        setTimeout(() => {
            copybutton.innerHTML = "copy";
        }, 2000);
    }

    copybutton.addEventListener('click', (cb) => {
        if ('clipboard' in navigator) {
            navigator.clipboard.writeText(codeblock.textContent);
            copyingDone();
            return;
        }

        const range = document.createRange();
        range.selectNodeContents(codeblock);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            document.execCommand('copy');
            copyingDone();
        } catch (e) { };
        selection.removeRange(range);
    });

    if (container.classList.contains("highlight")) {
        container.appendChild(copybutton);
    } else if (container.parentNode.firstChild == container) {
        // td containing LineNos
    } else if (codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "TABLE") {
        // table containing LineNos and code
        codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(copybutton);
    } else {
        // code blocks not having highlight as parent class
        codeblock.parentNode.appendChild(copybutton);
    }
});

// 检查浏览器是否支持 localStorage
if (typeof (Storage) !== "undefined") {
    // 从 localStorage 中获取主题偏好设置
    var currentTheme = localStorage.getItem("pref-theme");
    setTheme(currentTheme); // 初始化默认的主题
}
