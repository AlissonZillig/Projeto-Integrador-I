// Dados Iniciais ficticios
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

// Função de Risco 
function calcularRisco(aluno) {
    if (aluno.faltas > 20 || aluno.media < 5.0) {
        return { nivel: 'Alto', classe: 'status-alto', acao: '🚨 Agendar reunião com os pais urgente.' };
    } else if (aluno.faltas > 15 || aluno.media < 6.0) {
        return { nivel: 'Médio', classe: 'status-medio', acao: '⚠️ Conversar com o aluno sobre desempenho.' };
    } else {
        return { nivel: 'Baixo', classe: 'status-baixo', acao: '✅ Elogiar o bom desempenho.' };
    }
}

// Função carregar as opções do Filtro 
function carregarFiltroTurmas() {
    const alunos = obterAlunos();
    const select = document.getElementById('filtroTurma');
    
    // Cria um conjunto (Set) para pegar apenas turmas únicas 
    const turmasUnicas = [...new Set(alunos.map(aluno => aluno.turma))].sort();

    // Limpa opções antigas 
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

//Renderizar na Tela 
function carregarDashboard() {
    const container = document.getElementById('grid-alunos');
    container.innerHTML = ''; 

    let alunos = obterAlunos(); 

    //LÓGICA DE FILTRO 
    const filtro = document.getElementById('filtroTurma').value;
    
    if (filtro !== 'todas') {
        // Se não for "todas", filtra apenas os alunos daquela turma
        alunos = alunos.filter(aluno => aluno.turma === filtro);
    }

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
card.onclick = () => abrirModal(aluno.nome, risco.acao, aluno.obs);
        container.appendChild(card);
    });

    atualizarGrafico(alunosOrdenados);

}


// Funções do Modal 
function abrirModal(nome, acao, observacao) {
    document.getElementById('modalTitulo').innerText = `Aluno: ${nome}`;
    let texto = acao;
    document.getElementById('modalTexto').innerText = texto;
    if (observacao && observacao !== "") {
        document.getElementById('modalObsTexto').innerText = observacao;
    } else {
        document.getElementById('modalObsTexto').innerText = "Nenhuma observação disciplinar registrada.";
    }

    document.getElementById('modalIntervencao').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalIntervencao').classList.add('hidden');
}
window.onload = function() {
    carregarFiltroTurmas(); // Preenche o select
    carregarDashboard();    // Carrega os cards
};

// Grafico:
let graficoRisco = null;

function atualizarGrafico(listaFiltrada) {
    let total = listaFiltrada.length;
    let emRisco = 0;

    listaFiltrada.forEach(a => {
        const r = calcularRisco(a);
        if (r.nivel === "Alto" || r.nivel === "Médio") {
            emRisco++;
        }
    });

    const ctx = document.getElementById('graficoRisco').getContext('2d');

    if (graficoRisco) graficoRisco.destroy();
// Grafico de pizza
    graficoRisco = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Em risco (alto/médio)', 'Fora de risco (baixo)'],
            datasets: [{
                data: [emRisco, total - emRisco],
                backgroundColor: [
                    '#e74c3c', 
                    '#2ecc71'  
                ],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}


