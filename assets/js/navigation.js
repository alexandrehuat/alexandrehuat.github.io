document.addEventListener("DOMContentLoaded", () => createNavList())

function createNavList(level = "h2") {
    const navList = document.getElementById("nav-list");
    document.querySelectorAll(level).forEach(function (item) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("buttons");
        a.href = "#" + item.id;
        const text = document.createTextNode(item.textContent);
        li.appendChild(text);
        a.appendChild(li);
        navList.appendChild(a);
    });
}