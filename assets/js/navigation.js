document.addEventListener("DOMContentLoaded", createNavList)

function createNavList() {
    const navList = document.getElementById("nav-list");
    document.querySelectorAll("h1").forEach(function (item) {
        const a = document.createElement("a");
        a.classList.add("buttons");
        a.href = "#" + item.id;
        const text = document.createTextNode(item.textContent);
        a.appendChild(text);
        const li = document.createElement("li");
        li.appendChild(a);
        navList.appendChild(li);
    });
}