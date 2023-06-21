document.addEventListener("DOMContentLoaded", () => createNavList())

function createNavList(level = "h2") {
    const navList = document.getElementById("nav-list");
    document.querySelectorAll(level).forEach(function (item) {
        const a = document.createElement("a");
        a.classList.add("buttons");
        a.href = "#" + item.id;
        const text = document.createTextNode(item.innerHtml);
        a.appendChild(text);
        const li = document.createElement("li");
        li.appendChild(a);
        navList.appendChild(a);
    });
}