// 1. Dados Iniciais (Para o sistema não começar vazio na apresentação)
const dadosFicticios = [
    { id: 1, nome: "Carlos Henrique", media: 3.5, faltas: 25, turma: "1º A" },
    { id: 2, nome: "Ana Clara", media: 8.0, faltas: 5, turma: "1º B" },
    { id: 3, nome: "Beatriz Souza", media: 5.5, faltas: 16, turma: "1º A" },
    { id: 4, nome: "João Pedro", media: 9.5, faltas: 0, turma: "2º C" },
    { id: 5, nome: "Marcos Paulo", media: 4.0, faltas: 10, turma: "3º B" }
];

// Função para carregar dados do LocalStorage (Simula o SELECT * FROM alunos)
function obterAlunos() {
    // Verifica se já tem dados salvos
    const alunosSalvos = localStorage.getItem('ews_alunos');
    
    if (alunosSalvos) {
        return JSON.parse(alunosSalvos);
    } else {
        // Se for a primeira vez, salva os fictícios para não ficar vazio
        localStorage.setItem('ews_alunos', JSON.stringify(dadosFicticios));
        return dadosFicticios;
    }
}

// 2. Função "Motor de Regras" (Mantida igual - O Cérebro do sistema)
function calcularRisco(aluno) {
    if (aluno.faltas > 20 || aluno.media < 5.0) {
        return { nivel: 'Alto', classe: 'status-alto', acao: '🚨 Agendar reunião com os pais urgente.' };
    } else if (aluno.faltas > 15 || aluno.media < 6.0) {
        return { nivel: 'Médio', classe: 'status-medio', acao: '⚠️ Conversar com o aluno sobre desempenho.' };
    } else {
        return { nivel: 'Baixo', classe: 'status-baixo', acao: '✅ Elogiar o bom desempenho.' };
    }
}

// 3. Renderizar na Tela
function carregarDashboard() {
    const container = document.getElementById('grid-alunos');
    container.innerHTML = ''; // Limpa antes de renderizar

    // Busca os alunos atualizados do "Banco"
    const alunos = obterAlunos(); 

    // Ordenar por risco (Faltas)
    const alunosOrdenados = alunos.sort((a, b) => b.faltas - a.faltas);

    alunosOrdenados.forEach(aluno => {
        const risco = calcularRisco(aluno);

        const card = document.createElement('div');
        card.className = `card ${risco.classe}`;
        card.innerHTML = `
            <h3>${aluno.nome}</h3>
            <p>Turma: ${aluno.turma || 'Não inf.'}</p> <p>Média: <strong>${aluno.media}</strong> | Faltas: <strong>${aluno.faltas}%</strong></p>
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

// Botão de Reset (Útil para a apresentação se quiser limpar tudo)
function resetarDemo() {
    if(confirm("Deseja restaurar os dados originais?")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = carregarDashboard;