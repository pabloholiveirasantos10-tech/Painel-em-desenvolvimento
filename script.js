// =========================================================
// script.js — fala com api.php e monta a tela dinamicamente.
// Nenhuma parte deste arquivo acessa o banco diretamente;
// tudo passa pelas requisições fetch abaixo.
// =========================================================

const listaContainer = document.getElementById('lista-container');
const tituloLista = document.getElementById('titulo-lista');
const formTarefa = document.getElementById('form-tarefa');
const botoesFiltro = document.querySelectorAll('#filtros button');

let filtroAtual = 'Todos';

async function carregarTarefas() {
    listaContainer.innerHTML = '<p class="vazio">Carregando...</p>';

    const resposta = await fetch(`api.php?acao=listar&responsavel=${encodeURIComponent(filtroAtual)}`);
    const dados = await resposta.json();

    if (!dados.ok) {
        listaContainer.innerHTML = '<p class="vazio">Erro ao carregar tarefas.</p>';
        return;
    }

    atualizarResumo(dados.tarefas);
    renderizarTabela(dados.tarefas);
}

function atualizarResumo(tarefas) {
    const total = tarefas.length;
    const aFazer = tarefas.filter(t => t.status === 'A Fazer').length;
    const andamento = tarefas.filter(t => t.status === 'Em Andamento').length;
    const concluido = tarefas.filter(t => t.status === 'Concluído').length;

    document.getElementById('total-tarefas').textContent = total;
    document.getElementById('total-a-fazer').textContent = aFazer;
    document.getElementById('total-andamento').textContent = andamento;
    document.getElementById('total-concluido').textContent = concluido;
}

function renderizarTabela(tarefas) {
    tituloLista.textContent = `Tarefas (${filtroAtual})`;

    if (tarefas.length === 0) {
        listaContainer.innerHTML = '<p class="vazio">Nenhuma tarefa por aqui ainda.</p>';
        return;
    }

    const linhas = tarefas.map(t => `
        <tr data-id="${t.id}">
            <td>
                <strong>${escapeHtml(t.titulo)}</strong>
                ${t.descricao ? `<p class="descricao-tabela">${escapeHtml(t.descricao)}</p>` : ''}
            </td>
            <td><span class="tag tag-${t.responsavel.toLowerCase()}">${t.responsavel}</span></td>
            <td>
                <select class="select-status">
                    <option value="A Fazer" ${t.status === 'A Fazer' ? 'selected' : ''}>A Fazer</option>
                    <option value="Em Andamento" ${t.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="Concluído" ${t.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                </select>
            </td>
            <td>${formatarData(t.criado_em)}</td>
            <td><button class="botao-excluir">Excluir</button></td>
        </tr>
    `).join('');

    listaContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Título</th><th>Responsável</th><th>Status</th><th>Criada em</th><th></th>
                </tr>
            </thead>
            <tbody>${linhas}</tbody>
        </table>
    `;

    listaContainer.querySelectorAll('.select-status').forEach(select => {
        select.addEventListener('change', async (e) => {
            const linha = e.target.closest('tr');
            const id = linha.dataset.id;

            await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `acao=atualizar_status&id=${id}&status=${encodeURIComponent(e.target.value)}`,
            });

            linha.style.transition = 'background-color 0.3s ease';
            linha.style.backgroundColor = 'rgba(201, 162, 39, 0.12)';
            carregarTarefas();
        });
    });

    listaContainer.querySelectorAll('.botao-excluir').forEach(botao => {
        botao.addEventListener('click', async (e) => {
            const linha = e.target.closest('tr');
            const id = linha.dataset.id;

            if (!confirm('Excluir esta tarefa?')) return;

            await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `acao=excluir&id=${id}`,
            });

            carregarTarefas();
        });
    });
}

formTarefa.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = new FormData(formTarefa);
    dados.append('acao', 'criar');

    const resposta = await fetch('api.php', {
        method: 'POST',
        body: dados,
    });
    const resultado = await resposta.json();

    if (resultado.ok) {
        formTarefa.reset();
        carregarTarefas();
    } else {
        alert(resultado.erro || 'Erro ao criar tarefa.');
    }
});

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');
        filtroAtual = botao.dataset.responsavel;
        carregarTarefas();
    });
});

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatarData(dataSql) {
    const data = new Date(dataSql.replace(' ', 'T'));
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

carregarTarefas();
