// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    // === 1. Funcionalidade do Menu Hambúrguer ===
    const menuIcon = document.querySelector('.menu svg');
    const menuList = document.querySelector('.menu ul');

    if (menuIcon && menuList) {
        menuIcon.addEventListener('click', () => {
            // Alterna a classe 'show' para exibir/esconder o menu
            menuList.classList.toggle('show');
        });

        // Opcional: Esconder o menu se o usuário clicar em qualquer outro lugar
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = menuList.contains(event.target);
            const isClickOnIcon = menuIcon.contains(event.target);

            if (!isClickInsideMenu && !isClickOnIcon && menuList.classList.contains('show')) {
                menuList.classList.remove('show');
            }
        });
    }


    // === 2. Funcionalidade REAL de Troca de Foto de Perfil ===

    const editarFotoBtn = document.getElementById('editarFoto');
    const perfilContainer = document.getElementById('perfilContainer');
    const fotoInput = document.getElementById('fotoInput');
    const perfilSVG = document.getElementById('perfilSVG'); 
    const removerFotoBtn = document.getElementById('removerFoto'); 
    const perfilImg = document.querySelector('#perfil');

    if (editarFotoBtn) {
        
        // Função que simula o clique no campo de arquivo escondido
        const openFileInput = () => {
            fotoInput.click(); // Abre o diálogo de seleção de arquivo
        };

        // Conecta o clique do botão e do contêiner da foto à função de abrir o input
        editarFotoBtn.addEventListener('click', openFileInput);


        // Função que lida com a seleção da imagem
        fotoInput.addEventListener('change', function(event) {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    // Cria ou atualiza a tag <img>
                    
                    // Atribui o URL temporário do arquivo à tag <img>
                    perfilImg.src = e.target.result;
                };

                // Inicia a leitura do arquivo
                reader.readAsDataURL(event.target.files[0]);
            }
        });
    }

    // Funcionalidade de Remoção (Se for ativada no CSS/HTML)
    if (removerFotoBtn) {
        removerFotoBtn.addEventListener('click', () => {
            const confirmacao = confirm('Tem certeza que deseja remover sua foto de perfil?');
            if (confirmacao) {
                perfilImg.src = 'https://static.vecteezy.com/ti/vetor-gratis/p1/2387693-icone-do-perfil-do-usuario-vetor.jpg';
                alert('Foto de perfil removida!');
            }
        });
    }


    // === 3. Funcionalidade dos Botões do Formulário (Simulação) ===
    const concluidoBtn = document.querySelector('#Concluido');
    const cancelaBtn = document.querySelector('#cancela');

    if (concluidoBtn) {
        concluidoBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            alert('Ação: Dados do perfil salvos com sucesso!');
        });
    }

    if (cancelaBtn) {
        cancelaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Ação: Edições canceladas!');
        });
    }
});