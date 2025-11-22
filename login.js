// ===========================================================
// LÓGICA DE ALTERAÇÃO DE SENHA
// ===========================================================
document.getElementById('btnMudarSenha').addEventListener('click', function() {
    // 1. Pergunta qual usuário deseja alterar
    const usuarioAlvo = prompt("Para qual usuário você quer mudar a senha? (Digite: prof ou coord)");

    if (usuarioAlvo === 'prof' || usuarioAlvo === 'coord') {
        // 2. Pergunta a nova senha
        const novaSenha = prompt(`Digite a nova senha para o ${usuarioAlvo}:`);
        
        if (novaSenha && novaSenha.length > 0) {
            // 3. Salva no "Banco de Dados" do navegador
            // Cria uma chave única: ex: 'senha_prof' ou 'senha_coord'
            localStorage.setItem(`senha_${usuarioAlvo}`, novaSenha);
            
            alert(`✅ Sucesso! A nova senha do ${usuarioAlvo} foi salva.`);
        } else {
            alert("❌ Operação cancelada: Senha vazia.");
        }
    } else {
        alert("❌ Usuário inválido! Digite apenas 'prof' ou 'coord'.");
    }
});

// ===========================================================
// LÓGICA DE LOGIN (ATUALIZADA PARA LER A NOVA SENHA)
// ===========================================================
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const usuario = document.getElementById('email').value.toLowerCase().trim();
    const senha = document.getElementById('password').value; 

    // --- AQUI ESTÁ O TRUQUE ---
    // O sistema tenta ler a senha do LocalStorage. 
    // Se não existir (||), ele usa a senha padrão '123'.
    
    const SENHA_COORD_ATUAL = localStorage.getItem('senha_coord') || '132';
    const SENHA_PROF_ATUAL = localStorage.getItem('senha_prof') || '123';
    
    console.log(`Tentando logar como: ${usuario}`);

    // 1. Validação do COORDENADOR
    if (usuario === 'coord' && senha === SENHA_COORD_ATUAL) {
        localStorage.setItem('estaLogado', 'sim'); 
        alert('Bem-vindo, Coordenador!');
        window.location.href = 'dashboard.html'; 
    } 
    // 2. Validação do PROFESSOR
    else if (usuario === 'prof' && senha === SENHA_PROF_ATUAL) {
        localStorage.setItem('estaLogado', 'sim');
        alert('Bem-vindo, Professor!');
        window.location.href = 'professor.html';
    } 
    // 3. Senha Incorreta
    else {
        alert('Acesso negado! Verifique usuário e senha.');
    }
});