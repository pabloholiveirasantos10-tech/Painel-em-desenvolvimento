const menus = document.querySelectorAll(".menu");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("page-title");
const toast = document.getElementById("toast");

menus.forEach(menu => {

    menu.addEventListener("click", () => {

        const pageName = menu.dataset.page;

        menus.forEach(item => {
            item.classList.remove("active");
        });

        menu.classList.add("active");

        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        document.getElementById(pageName).classList.add("active-page");

        const titles = {
            dashboard: "Dashboard",
            usuarios: "Usuários",
            configuracoes: "Configurações"
        };

        pageTitle.textContent = titles[pageName];
    });

});


function showToast(message) {

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


document.getElementById("newActivity").addEventListener("click", () => {

    const table = document.getElementById("activityTable");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>Pablo</td>
        <td>Nova atividade criada</td>
        <td>Agora</td>
        <td>
            <span class="status success">
                Concluído
            </span>
        </td>
    `;

    table.prepend(row);

    showToast("Nova atividade adicionada!");
});


document.getElementById("addUser").addEventListener("click", () => {

    showToast("Função de adicionar usuário acionada!");

});


document.getElementById("logout").addEventListener("click", () => {

    showToast("Logout realizado!");

});


document.getElementById("darkMode").addEventListener("change", (event) => {

    if (event.target.checked) {

        document.body.style.background = "#0f172a";
        document.body.style.color = "#f8fafc";

        showToast("Modo escuro ativado!");

    } else {

        document.body.style.background = "#f4f6f9";
        document.body.style.color = "#1f2937";

        showToast("Modo escuro desativado!");

    }

});