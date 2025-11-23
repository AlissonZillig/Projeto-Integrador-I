//  API EXTERNA VIACEP
function buscarCep() {
    const cep = document.getElementById('cep').value.replace(/\D/g, ''); // Remove traços e pontos

    if (cep.length === 8) {
        // Feedback visual para o usuário
        document.getElementById('endereco').value = "Buscando...";
        
        // Requisição para a API do ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(resposta => resposta.json())
            .then(dados => {
                if (!dados.erro) {
                    // Preenche os campos automaticamente
                    document.getElementById('endereco').value = `${dados.logradouro}, ${dados.bairro}`;
                    document.getElementById('cidade').value = `${dados.localidade} - ${dados.uf}`;
                    
                    // Foca no próximo campo (UX)
                    document.getElementById('media').focus();
                } else {
                    alert("CEP não encontrado!");
                    document.getElementById('endereco').value = "";
                }
            })
            .catch(error => {
                console.error("Erro na API:", error);
                alert("Erro ao buscar CEP. Verifique sua conexão.");
            });
    }
}

//Armazenamento local dos dados do dashboard
document.getElementById('formAluno').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede a pagina recarregar sozinha

    // Captura dados no formulário
    const nome = document.getElementById('nome').value;
    const media = parseFloat(document.getElementById('media').value); 
    const faltas = parseInt(document.getElementById('faltas').value);
    
    // Captura a observação e deixa maiusculo
    const turma = document.getElementById('turma').value.toUpperCase(); 
    // ----------------------

    // Cria o objeto do novo aluno 
    const novoAluno = {
        id: Date.now(), // Gera um ID único baseado no tempo exato
        nome: nome,
        media: media,
        faltas: faltas,
        turma: turma, 
        obs: document.getElementById('obs').value
    };

    // Lógica de "INSERT INTO" (Salvar no Navegador)
    
    // Baixa a lista atual de alunos ( cria uma vazia se não tiver nada)
    let listaAlunos = JSON.parse(localStorage.getItem('ews_alunos')) || [];
    
    //add o novo aluno na lista
    listaAlunos.push(novoAluno);

    //Salva a lista atualizada de volta no "banco" do navegador
    localStorage.setItem('ews_alunos', JSON.stringify(listaAlunos));

    //Feedback 
    alert(`✅ Aluno ${nome} salvo na turma ${turma} com sucesso!\n\nO sistema recalculou o risco no Dashboard.`);
    
    // Limpa os campos para o próximo cadastro
    document.getElementById('formAluno').reset();
    document.getElementById('endereco').value = "";
    document.getElementById('cidade').value = "";
});