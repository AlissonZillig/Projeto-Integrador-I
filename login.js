document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede a página de recarregar

    const usuario = document.getElementById('email').value.toLowerCase();
    const senha = document.getElementById('password').value;

    // Simulação simples de login (Hardcoded)
    // Isso é aceitável para um MVP de 1º semestre onde não há Banco de Dados
    if (usuario === 'coord') {
        // Redireciona para a tela do Dashboard (que vocês vão criar)
        alert('Bem-vindo, Coordenador! Carregando Dashboard de Risco...');
        window.location.href = 'dashboard.html'; 
    } else if (usuario === 'prof') {
        // Redireciona para a tela de Cadastro de Notas
        alert('Bem-vindo, Professor! Carregando Diário de Classe...');
        window.location.href = 'professor.html';
    } else {
        alert('Usuário não encontrado! Tente "prof" ou "coord".');
    }
});