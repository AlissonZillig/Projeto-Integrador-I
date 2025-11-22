// 1. Dados Iniciais (Mantido)
const dadosFicticios = [
    { id: 1, nome: "Carlos Henrique", media: 3.5, faltas: 25, turma: "1º A" },
    { id: 2, nome: "Ana Clara", media: 8.0, faltas: 5, turma: "1º B" },
    { id: 3, nome: "Beatriz Souza", media: 5.5, faltas: 16, turma: "1º A" },
    { id: 4, nome: "João Pedro", media: 9.5, faltas: 0, turma: "2º C" },
    { id: 5, nome: "Marcos Paulo", media: 4.0, faltas: 10, turma: "3º B" }
];

function obterAlunos() {
    const alunosSalvos = localStorage.getItem('ews_alunos');
    if (alunosSalvos) {
        return JSON.parse(alunosSalvos);
    } else {
        localStorage.setItem('ews_alunos', JSON.stringify(dadosFicticios));
        return dadosFicticios;
    }
}

// 2. Função de Risco (Mantida)
function calcularRisco(aluno) {
    if (aluno.faltas > 20 || aluno.media < 5.0) {
        return { nivel: 'Alto', classe: 'status-alto', acao: '🚨 Agendar reunião com os pais urgente.' };
    } else if (aluno.faltas > 15 || aluno.media < 6.0) {
        return { nivel: 'Médio', classe: 'status-medio', acao: '⚠️ Conversar com o aluno sobre desempenho.' };
    } else {
        return { nivel: 'Baixo', classe: 'status-baixo', acao: '✅ Elogiar o bom desempenho.' };
    }
}

// --- NOVO: Função para carregar as opções do Filtro ---
function carregarFiltroTurmas() {
    const alunos = obterAlunos();
    const select = document.getElementById('filtroTurma');
    
    // Cria um conjunto (Set) para pegar apenas turmas únicas (sem repetir)
    const turmasUnicas = [...new Set(alunos.map(aluno => aluno.turma))].sort();

    // Limpa opções antigas (mantendo apenas "Todas")
    select.innerHTML = '<option value="todas">Todas as Turmas</option>';

    turmasUnicas.forEach(turma => {
        if(turma) { // Só adiciona se a turma não for vazia
            const option = document.createElement('option');
            option.value = turma;
            option.innerText = turma;
            select.appendChild(option);
        }
    });
}

// 3. Renderizar na Tela (ATUALIZADA COM FILTRO)
function carregarDashboard() {
    const container = document.getElementById('grid-alunos');
    container.innerHTML = ''; 

    let alunos = obterAlunos(); 

    // --- LÓGICA DE FILTRO AQUI ---
    const filtro = document.getElementById('filtroTurma').value;
    
    if (filtro !== 'todas') {
        // Se não for "todas", filtra apenas os alunos daquela turma
        alunos = alunos.filter(aluno => aluno.turma === filtro);
    }
    // ------------------------------

    const alunosOrdenados = alunos.sort((a, b) => b.faltas - a.faltas);

    if (alunosOrdenados.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#777;">Nenhum aluno encontrado nesta turma.</p>';
        return;
    }

    alunosOrdenados.forEach(aluno => {
        const risco = calcularRisco(aluno);
        const card = document.createElement('div');
        card.className = `card ${risco.classe}`;
        card.innerHTML = `
            <h3>${aluno.nome}</h3>
            <p>Turma: <strong>${aluno.turma || 'Não inf.'}</strong></p> 
            <p>Média: <strong>${aluno.media}</strong> | Faltas: <strong>${aluno.faltas}%</strong></p>
            <span class="tag-risco">${risco.nivel} Risco</span>
        `;
        card.onclick = () => abrirModal(aluno.nome, risco.acao);
        container.appendChild(card);
    });
}

// Funções do Modal (Mantidas)
function abrirModal(nome, acao) {
    document.getElementById('modalTitulo').innerText = `Aluno: ${nome}`;
    document.getElementById('modalTexto').innerText = acao;
    document.getElementById('modalIntervencao').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalIntervencao').classList.add('hidden');
}

// Ao carregar a página:
window.onload = function() {
    carregarFiltroTurmas(); // 1º Preenche o select
    carregarDashboard();    // 2º Carrega os cards
};