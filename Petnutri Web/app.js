import {initializeApp} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Suas credenciais reais do NutriPet
const firebaseConfig = {
    apiKey: "AIzaSyCTGpOJAACmQLJ80eBWxwfQBo2-D6Pl9Rk",
    authDomain: "nutripet-a0da3.firebaseapp.com",
    projectId: "nutripet-a0da3",
    storageBucket: "nutripet-a0da3.firebasestorage.app",
    messagingSenderId: "111137385948",
    appId: "1:111137385948:web:4d2f5447a62cfd4f15f319",
    measurementId: "G-XBJT4J2M0F"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const BANCO_ALIMENTOS = {
    abobora: {
        nome: "🎃 Abóbora Cozida",
        unidade: "colher(es) de sopa",
        pesoUnidade: 25,
        kcal: 26,
        prot: 1.0,
        carb: 6.5,
        fat: 0.1,
        ca: 0.021,
        p: 0.021
    },
    abobrinha: {
        nome: "🥒 Abobrinha Cozida",
        unidade: "rodela(s)",
        pesoUnidade: 12,
        kcal: 17,
        prot: 1.2,
        carb: 3.1,
        fat: 0.3,
        ca: 0.016,
        p: 0.038
    },
    banana: {
        nome: "🍌 Banana Prata",
        unidade: "unidade(s) média(s)",
        pesoUnidade: 100,
        kcal: 98,
        prot: 1.3,
        carb: 26.0,
        fat: 0.3,
        ca: 0.008,
        p: 0.02
    },
    batata_doce: {
        nome: "🍠 Batata-Doce Cozida",
        unidade: "rodela(s) média(s)",
        pesoUnidade: 30,
        kcal: 86,
        prot: 1.6,
        carb: 20.0,
        fat: 0.1,
        ca: 0.030,
        p: 0.047
    },
    beringela: {
        nome: "🍆 Berinjela Cozida",
        unidade: "cubo(s) médio(s)",
        pesoUnidade: 15,
        kcal: 25,
        prot: 0.8,
        carb: 6.0,
        fat: 0.2,
        ca: 0.009,
        p: 0.024
    },
    biscoito: {
        nome: "🍪 Biscoito Maizena",
        kcal: 443,
        prot: 8.1,
        carb: 75.0,
        fat: 12.0,
        ca: 0.022,
        p: 0.110,
        pesoUnidade: 5,
        toxico: false,
        industrial: true
    },
    biscoito_agua: {
        nome: "🍪 Biscoito Água e Sal",
        unidade: "unidade(s)",
        pesoUnidade: 8,
        kcal: 433,
        prot: 9.0,
        carb: 68.0,
        fat: 13.0,
        ca: 0.02,
        p: 0.12
    },
    brocolis: {
        nome: "🥦 Brócolis Cozido",
        unidade: "ramo(s) pequeno(s)",
        pesoUnidade: 20,
        kcal: 35,
        prot: 2.8,
        carb: 7.0,
        fat: 0.4,
        ca: 0.047,
        p: 0.066
    },
    caqui: {
        nome: "🍅 Caqui",
        unidade: "gomo(s)",
        pesoUnidade: 25,
        kcal: 70,
        prot: 0.6,
        carb: 19.0,
        fat: 0.2,
        ca: 0.008,
        p: 0.026
    },
    cara: {
        nome: "🥔 Cará Cozido",
        unidade: "cubo(s) médio(s)",
        pesoUnidade: 20,
        kcal: 118,
        prot: 1.5,
        carb: 28.0,
        fat: 0.2,
        ca: 0.017,
        p: 0.055
    },
    carne_moida: {
        nome: "🥩 Carne: Patinho",
        unidade: "colher(es) de sopa",
        pesoUnidade: 25,
        kcal: 219,
        prot: 35.9,
        carb: 0.0,
        fat: 7.3,
        ca: 0.005,
        p: 0.21
    },
    carne_suina: {
        nome: "🥩 Carne de Porco (Lombo)",
        kcal: 145,
        prot: 22.0,
        carb: 0.0,
        fat: 6.2,
        ca: 0.008,
        p: 0.240,
        pesoUnidade: 50,
        toxico: false,
        industrial: false
    },
    cenoura_rodela: {
        nome: "🥕 Cenoura Cozida",
        unidade: "rodela(s)",
        pesoUnidade: 10,
        kcal: 32,
        prot: 0.8,
        carb: 7.7,
        fat: 0.2,
        ca: 0.03,
        p: 0.02
    },
    chuchu_cubo: {
        nome: "🥗 Chuchu Cozido",
        unidade: "cubo(s) médio(s)",
        pesoUnidade: 15,
        kcal: 19,
        prot: 0.4,
        carb: 4.5,
        fat: 0.1,
        ca: 0.012,
        p: 0.018
    },
    coracao: {
        nome: "🫀 Coração de Frango",
        kcal: 153,
        prot: 16.0,
        carb: 0.0,
        fat: 10.0,
        ca: 0.012,
        p: 0.180,
        pesoUnidade: 10,
        toxico: false,
        industrial: false
    },
    couve_flor: {
        nome: "🥦 Couve-Flor Cozida",
        unidade: "ramo(s) pequeno(s)",
        pesoUnidade: 20,
        kcal: 25,
        prot: 1.9,
        carb: 5.0,
        fat: 0.3,
        ca: 0.022,
        p: 0.044
    },
    ervilha: {
        nome: "🟢 Ervilha Cozida",
        unidade: "colher(es) de sopa",
        pesoUnidade: 15,
        kcal: 81,
        prot: 5.4,
        carb: 14.5,
        fat: 0.4,
        ca: 0.025,
        p: 0.108
    },
    espinafre: {
        nome: "🌿 Espinafre Cozido",
        unidade: "colher(es) de sopa",
        pesoUnidade: 20,
        kcal: 23,
        prot: 3.0,
        carb: 3.6,
        fat: 0.4,
        ca: 0.099,
        p: 0.049
    },
    figado: {
        nome: "🥩 Fígado Bovino",
        kcal: 135,
        prot: 20.0,
        carb: 3.9,
        fat: 4.5,
        ca: 0.005,
        p: 0.360,
        pesoUnidade: 40,
        toxico: false,
        industrial: false
    },
    frango: {
        nome: "🍗 Peito de Frango",
        unidade: "pedaço(s) médio(s)",
        pesoUnidade: 50,
        kcal: 159,
        prot: 32,
        carb: 0.0,
        fat: 2.5,
        ca: 0.01,
        p: 0.22
    },
    inhame: {
        nome: "🥔 Inhame Cozido",
        unidade: "cubo(s) médio(s)",
        pesoUnidade: 20,
        kcal: 118,
        prot: 1.5,
        carb: 27.9,
        fat: 0.2,
        ca: 0.017,
        p: 0.055
    },
    kiwi: {
        nome: "🥝 Kiwi",
        unidade: "rodela(s)",
        pesoUnidade: 15,
        kcal: 61,
        prot: 1.1,
        carb: 15.0,
        fat: 0.5,
        ca: 0.034,
        p: 0.034
    },
    maca: {
        nome: "🍎 Maçã (Sem Semente)",
        unidade: "unidade(s) média(s)",
        pesoUnidade: 150,
        kcal: 52,
        prot: 0.3,
        carb: 14.0,
        fat: 0.2,
        ca: 0.006,
        p: 0.01
    },
    maca_fatia: {
        nome: "🍎 Maçã (Fatia/Pedaço)",
        unidade: "fatia(s)",
        pesoUnidade: 20,
        kcal: 52,
        prot: 0.3,
        carb: 14.0,
        fat: 0.2,
        ca: 0.006,
        p: 0.01
    },
    mamao: {
        nome: "🥭 Mamão (Cubo)",
        unidade: "pedaço(s) em cubo",
        pesoUnidade: 30,
        kcal: 43,
        prot: 0.5,
        carb: 11.0,
        fat: 0.3,
        ca: 0.020,
        p: 0.010
    },
    mandioca: {
        nome: "🪵 Mandioca Cozida",
        unidade: "cubo(s) médio(s)",
        pesoUnidade: 25,
        kcal: 160,
        prot: 1.3,
        carb: 38.0,
        fat: 0.3,
        ca: 0.016,
        p: 0.027
    },
    manga_cubo: {
        nome: "🥭 Manga (Cubo)",
        unidade: "cubo(s) médio(s)",
        pesoUnidade: 20,
        kcal: 60,
        prot: 0.8,
        carb: 15.0,
        fat: 0.4,
        ca: 0.011,
        p: 0.014
    },
    melao: {
        nome: "🍈 Melão (Cubo)",
        unidade: "pedaço(s) em cubo",
        pesoUnidade: 30,
        kcal: 34,
        prot: 0.8,
        carb: 8.0,
        fat: 0.2,
        ca: 0.009,
        p: 0.015
    },
    melancia: {
        nome: "🍉 Melancia (Cubo)",
        unidade: "pedaço(s) em cubo",
        pesoUnidade: 30,
        kcal: 30,
        prot: 0.6,
        carb: 7.5,
        fat: 0.2,
        ca: 0.007,
        p: 0.011
    },
    morango: {
        nome: "🍓 Morango",
        unidade: "unidade(s) média(s)",
        pesoUnidade: 15,
        kcal: 32,
        prot: 0.7,
        carb: 7.7,
        fat: 0.3,
        ca: 0.016,
        p: 0.024
    },
    mortadela: {
        nome: "🥪 Mortadela",
        kcal: 269,
        prot: 12.0,
        carb: 3.2,
        fat: 23.0,
        ca: 0.008,
        p: 0.130,
        pesoUnidade: 15,
        toxico: false,
        industrial: true
    },
    ovo_cozido: {
        nome: "🥚 Ovo Cozido Inteiro",
        unidade: "unidade(s)",
        pesoUnidade: 50,
        kcal: 155,
        prot: 13.0,
        carb: 1.1,
        fat: 11.0,
        ca: 0.05,
        p: 0.18
    },
    pao_forma: {
        nome: "🍞 Pão de Forma",
        unidade: "fatia(s)",
        pesoUnidade: 25,
        kcal: 252,
        prot: 8.0,
        carb: 48.0,
        fat: 2.4,
        ca: 0.02,
        p: 0.08
    },
    pao_frances: {
        nome: "🍞 Pão Francês",
        unidade: "unidade(s)",
        pesoUnidade: 50,
        kcal: 300,
        prot: 8.0,
        carb: 58.0,
        fat: 3.0,
        ca: 0.02,
        p: 0.10
    },
    pepino: {
        nome: "🥒 Pepino (Rodela)",
        unidade: "rodela(s)",
        pesoUnidade: 10,
        kcal: 15,
        prot: 0.7,
        carb: 3.6,
        fat: 0.1,
        ca: 0.016,
        p: 0.024
    },
    pera: {
        nome: "🍐 Pera",
        unidade: "unidade(s) média(s)",
        pesoUnidade: 130,
        kcal: 57,
        prot: 0.4,
        carb: 15.0,
        fat: 0.1,
        ca: 0.009,
        p: 0.012
    },
    pessego: {
        nome: "🍑 Pêssego (Sem Caroço)",
        unidade: "unidade(s) média(s)",
        pesoUnidade: 100,
        kcal: 39,
        prot: 0.9,
        carb: 10.0,
        fat: 0.3,
        ca: 0.006,
        p: 0.02
    },
    presunto: {
        nome: "🥓 Presunto Cozido",
        kcal: 145,
        prot: 16.5,
        carb: 1.0,
        fat: 8.3,
        ca: 0.009,
        p: 0.200,
        pesoUnidade: 15,
        toxico: false,
        industrial: true
    },
    quiabo: {
        nome: "🥒 Quiabo Cozido",
        unidade: "unidade(s)",
        pesoUnidade: 12,
        kcal: 33,
        prot: 1.9,
        carb: 7.5,
        fat: 0.2,
        ca: 0.082,
        p: 0.061
    },
    racao: {
        nome: "Ração Premium Base",
        kcal: 370,
        ca: 1.2,
        p: 0.9
    },
    repolho: {
        nome: "🥬 Repolho Cozido",
        unidade: "colher(es) de sopa",
        pesoUnidade: 15,
        kcal: 23,
        prot: 1.3,
        carb: 5.5,
        fat: 0.1,
        ca: 0.040,
        p: 0.026
    },
    salsicha: {
        nome: "🌭 Salsicha",
        kcal: 300,
        prot: 12.0,
        carb: 2.5,
        fat: 26.0,
        ca: 0.010,
        p: 0.150,
        pesoUnidade: 50,
        toxico: false,
        industrial: true
    },
    vagem: {
        nome: "🥢 Vagem Cozida",
        unidade: "unidade(s)",
        pesoUnidade: 5,
        kcal: 31,
        prot: 1.8,
        carb: 7.0,
        fat: 0.2,
        ca: 0.037,
        p: 0.038
    }
};
const RACOES_FABRICA = {
    racao_base: {nome: "🥣 Ração Premium Padrão Base", kcal: 370, ca: 1.2, p: 0.9, precoKg: 18.50},
    hotdog: {nome: "🟢 Ração HotDog Frango e Carne", kcal: 340, ca: 1.0, p: 0.8, precoKg: 11.20}, // Preço aproximado de mercado
    quatree: {nome: "🟡 Ração Quatree Carne Adultos", kcal: 355, ca: 1.4, p: 1.0, precoKg: 13.90}
};

let caes = [];
let racoesCustomizadas = [];
let idPetAtivo = null;
let idRacaoAtiva = "racao_base";
let usuarioAtual = null;
let modoCadastro = false;


window.abrirModalRacao = abrirModalRacao;
window.salvarNovaRacao = salvarNovaRacao;
window.alterarRacaoAtiva = alterarRacaoAtiva;
window.processarAuth = processarAuth;
window.alternarModoAuth = alternarModoAuth;
window.fazerLogout = fazerLogout;
window.selecionarPet = selecionarPet;
window.abrirModalCao = abrirModalCao;
window.salvarNovoPet = salvarNovoPet;
window.adicionarAlimento = adicionarAlimento;
window.removerItem = removerItem;
window.calcularOtimizacao = calcularOtimizacao;
window.atualizarInterfaceMedida = atualizarInterfaceMedida;
window.fecharBannerProibidos = fecharBannerProibidos;
window.abrirEdicaoPet = abrirEdicaoPet;
window.removerPetAtivo = removerPetAtivo;


onAuthStateChanged(auth, async (user) => {
    if (user) {
        usuarioAtual = user;
        document.getElementById('lblUsuarioLogado').innerText = user.email;
        document.getElementById('secaoAuth').classList.add('d-none');
        document.getElementById('navbarApp').classList.remove('d-none');
        document.getElementById('corpoApp').classList.remove('d-none');
        carregarSelectAlimentos();
        await puxarDadosNuvem();


        new bootstrap.Modal(document.getElementById('modalAlimentosProibidos')).show();

    } else {
        usuarioAtual = null;
        document.getElementById('secaoAuth').classList.remove('d-none');
        document.getElementById('navbarApp').classList.add('d-none');
        document.getElementById('corpoApp').classList.add('d-none');
    }
});

function abrirModalCao() {
    modoCadastro = true;
    document.getElementById('formNovoPet')?.reset();
    const btnSalvar = document.querySelector('#formNovoPet button[type="submit"]');
    if (btnSalvar) btnSalvar.innerHTML = '<i class="bi bi-check-lg me-1"></i> Salvar e Ativar Pet';
    new bootstrap.Modal(document.getElementById('modalNovoCao')).show();
}

function fecharBannerProibidos() {
    const modalElement = document.getElementById('modalAlimentosProibidos');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}

function alternarModoAuth() {
    modoCadastro = !modoCadastro;
    document.getElementById('authTitulo').innerText = modoCadastro ? "Criar Nova Conta" : "Entrar no PetNutri";
    document.getElementById('btnAuth').innerText = modoCadastro ? "Cadastrar" : "Entrar";
    document.getElementById('btnAlternarAuth').innerText = modoCadastro ? "Já tem conta? Faça Login" : "Não tem conta? Cadastre-se";
}

function fazerLogout() {
    signOut(auth);
}

function carregarSelectAlimentos() {
    const select = document.getElementById('selectAlimento');
    select.innerHTML = '';
    for (let chave in BANCO_ALIMENTOS) {
        if (chave !== 'racao') {
            let opt = document.createElement('option');
            opt.value = chave;
            opt.innerHTML = BANCO_ALIMENTOS[chave].nome;
            select.appendChild(opt);
        }
    }
    atualizarInterfaceMedida();
}

function atualizarInterfaceMedida() {
    const select = document.getElementById('selectAlimento');
    if (!select.value) return;
    const alimento = BANCO_ALIMENTOS[select.value];
    const modo = document.querySelector('input[name="tipoMedida"]:checked').value;

    document.getElementById('labelUnidade').innerText = modo === "unidade" ? alimento.unidade : "gramas (g)";
    document.getElementById('ajudaPesoEstimado').innerText = modo === "unidade" ? `* 1 porção equivale a ~${alimento.pesoUnidade}g.` : "* Peso real cru em frações de 100g.";
}

function renderizarAbasCaes() {
    const container = document.getElementById('listaCaes');
    container.innerHTML = '';
    caes.forEach(pet => {
        const badge = document.createElement('span');
        badge.className = `badge bg-light text-dark border p-2 fs-6 pet-badge ${pet.id === idPetAtivo ? 'active' : ''}`;
        badge.innerHTML = `<i class="bi bi-dog-front me-1"></i> ${pet.nome}`;
        badge.onclick = () => selecionarPet(pet.id);
        container.appendChild(badge);
    });
}

function selecionarPet(id) {
    idPetAtivo = id;
    renderizarAbasCaes();
    const pet = caes.find(p => p.id === id);
    if (!pet) return;

    document.getElementById('lblNome').innerText = pet.nome;
    document.getElementById('lblPeso').innerText = pet.peso;
    document.getElementById('lblFator').innerText = pet.fator;

    // INJETA A FOTO: Usa o Base64 salvo ou monta uma imagem com a inicial se estiver vazio
    document.getElementById('lblFoto').src = pet.foto || `https://placehold.co/100x100?text=${encodeURIComponent(pet.nome)}`;

    pet.metaNEM = Math.round(pet.fator * Math.pow(pet.peso, 0.75));
    document.getElementById('metaCalorias').innerText = pet.metaNEM;

    recalcularTotais();
}

function limparInterfacePet() {
    idPetAtivo = null;
    document.getElementById('lblNome').innerText = "--";
    document.getElementById('lblPeso').innerText = "--";
    document.getElementById('lblFator').innerText = "--";
    document.getElementById('metaCalorias').innerText = "0";
    document.getElementById('lblFoto').src = "https://placehold.co/100x100?text=Pet";
}

function converterParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(arquivo);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                // Cria um canvas invisível para redimensionar a imagem
                const canvas = document.createElement('canvas');

                // Define o tamanho máximo da foto de perfil (300x300 pixels já é alta resolução para o círculo)
                const MAX_WIDTH = 300;
                const MAX_HEIGHT = 300;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Desenha a imagem no canvas aplicando o novo tamanho
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Converte para Base64 aplicando uma compressão de 70% na qualidade (0.7)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

function recalcularTotais() {
    const tbody = document.getElementById('corpoTabelaDiario');
    tbody.innerHTML = '';

    if (!idPetAtivo) {
        document.getElementById('avisoVazio').classList.remove('d-none');
        renderizarPainelMetricas({kcal: 0, prot: 0, carb: 0, fat: 0, ca: 0, p: 0}, 100);
        return;
    }

    const pet = caes.find(p => p.id === idPetAtivo);
    const hoje = new Date().toISOString().split('T')[0];

    let totais = {kcal: 0, prot: 0, carb: 0, fat: 0, ca: 0, p: 0};

    // ─── RESOLUÇÃO 3: FILTRO DINÂMICO POR DATA DIÁRIA ───
    // Se não há dados ou se o vetor específico de hoje está vazio, exibe tela limpa
    if (!pet.diario || !pet.diario[hoje] || pet.diario[hoje].length === 0) {
        document.getElementById('avisoVazio').classList.remove('d-none');
    } else {
        document.getElementById('avisoVazio').classList.add('d-none');

        // Varre apenas os alimentos consumidos na data de hoje
        pet.diario[hoje].forEach((item, index) => {
            const info = BANCO_ALIMENTOS[item.chave];
            let gramas = item.modoMedida === "unidade" ? item.quantidadeInformada * info.pesoUnidade : item.quantidadeInformada;
            const mult = gramas / 100;
            const itemKcal = Math.round(info.kcal * mult);

            totais.kcal += itemKcal;
            totais.prot += info.prot * mult;
            totais.carb += info.carb * mult;
            totais.fat += info.fat * mult;
            totais.ca += info.ca * mult;
            totais.p += info.p * mult;

            tbody.innerHTML += `
                <tr>
                    <td><span class="fw-semibold text-dark">${info.nome}</span></td>
                    <td class="text-center"><span class="badge bg-light text-dark border">${item.quantidadeInformada} ${item.modoMedida === "unidade" ? 'un' : 'g'}</span></td>
                    <td class="text-center text-muted small">${Math.round(gramas)}g</td>
                    <td class="text-end text-success fw-bold">+${itemKcal} kcal</td>
                    <td class="text-center"><button class="btn btn-sm btn-light border text-danger" onclick="removerItem(${index})"><i class="bi bi-trash"></i></button></td>
                </tr>`;
        });
    }

    pet.totais = totais;
    renderizarPainelMetricas(totais, pet.metaNEM);
}

function renderizarPainelMetricas(totais, meta) {
    // CORREÇÃO: Define o objeto pet no escopo desta função
    const pet = caes.find(p => p.id === idPetAtivo);

    let pct = (totais.kcal / meta) * 100 || 0;
    if (pct > 100) pct = 100;

    const barra = document.getElementById('barraProgresso');
    barra.style.width = `${pct}%`;
    barra.innerText = `${Math.round(pct)}%`;
    barra.className = pct >= 100 ? "progress-bar bg-danger text-white" : "progress-bar bg-success text-white";

    document.getElementById('txtConsumido').innerText = `Consumido: ${totais.kcal} kcal`;
    document.getElementById('txtRestante').innerText = `Restante: ${Math.max(0, meta - totais.kcal)} kcal`;
    document.getElementById('resProt').innerText = totais.prot.toFixed(1);
    document.getElementById('resCarb').innerText = totais.carb.toFixed(1);
    document.getElementById('resFat').innerText = totais.fat.toFixed(1);

    // ─── ATUALIZA O SLIDE 2 DO CARROSSEL (MACRONUTRIENTES) ───
    document.getElementById('txtMacroProt').innerText = `${totais.prot.toFixed(1)}g`;
    document.getElementById('txtMacroCarb').innerText = `${totais.carb.toFixed(1)}g`;
    document.getElementById('txtMacroFat').innerText = `${totais.fat.toFixed(1)}g`;

    let limiteMaxExtras = meta * 0.10;
    document.getElementById('barraMacroProt').style.width = `${Math.min(100, (totais.prot * 4 / limiteMaxExtras) * 100)}%`;
    document.getElementById('barraMacroCarb').style.width = `${Math.min(100, (totais.carb * 4 / limiteMaxExtras) * 100)}%`;
    document.getElementById('barraMacroFat').style.width = `${Math.min(100, (totais.fat * 9 / limiteMaxExtras) * 100)}%`;

    // ─── ATUALIZA O SLIDE 3 DO CARROSSEL (CUSTOS) ───
    const racaoConfig = obterRacaoAtivaObjeto();
    const rest = meta - totais.kcal;
    const precoPorGrama = (racaoConfig.precoKg || 15.00) / 1000;

    document.getElementById('custoPorKg').innerText = `R$ ${(racaoConfig.precoKg || 15.00).toFixed(2)}`;
    if (rest > 0) {
        let racaoGramos = rest / (racaoConfig.kcal / 100);
        let custoFinal = racaoGramos * precoPorGrama;
        document.getElementById('custoRefeicao').innerText = `R$ ${custoFinal.toFixed(2)}`;
    } else {
        document.getElementById('custoRefeicao').innerText = `R$ 0,00`;
    }

    // ─── CORREÇÃO COMPLEMENTAR DO HISTÓRICO ───
    if (pet && pet.ultimaRecomendacao) {
        document.getElementById('historicoVazio').classList.add('d-none');
        document.getElementById('historicoConteudo').classList.remove('d-none');
        document.getElementById('histRacao').innerText = `${pet.ultimaRecomendacao.racao}g`;
        if (pet.ultimaRecomendacao.calcio > 0) {
            document.getElementById('histAreaCalcio').classList.remove('d-none');
            document.getElementById('histCalcio').innerText = `${pet.ultimaRecomendacao.calcio}g`;
        } else {
            document.getElementById('histAreaCalcio').classList.add('d-none');
        }
    } else {
        document.getElementById('historicoVazio').classList.remove('d-none');
        document.getElementById('historicoConteudo').classList.add('d-none');
    }
}

function calcularOtimizacao() {
    if (!idPetAtivo) return;
    const pet = caes.find(p => p.id === idPetAtivo);
    const kcalRestante = pet.metaNEM - pet.totais.kcal;

    if (kcalRestante <= 0) {
        exibirAlertaBootstrap(`A meta calórica do <strong>${pet.nome}</strong> já foi atingida hoje!`, "info");
        return;
    }

    // CORREÇÃO CRÍTICA: Puxa o objeto real da ração selecionada no select (Ex: HotDog, Quatree, etc.)
    const racaoConfig = obterRacaoAtivaObjeto();

    // Calcula a quantidade de gramas da ração selecionada baseada na caloria dela
    let x1_racaoGramos = (kcalRestante / racaoConfig.kcal) * 100;

    // Calcula os minerais injetados com base nas propriedades reais da ração escolhida
    let calcioInjetadoRacao = (x1_racaoGramos / 100) * racaoConfig.ca;
    let fosforoInjetadoRacao = (x1_racaoGramos / 100) * racaoConfig.p;

    let calcioProvisorio = pet.totais.ca + calcioInjetadoRacao;
    let fosforoProvisorio = pet.totais.p + fosforoInjetadoRacao;
    let x2_suplementoGramos = 0;
    let razaoAlvo = 1.25;

    // Se a proporção de minerais com a ração escolhida ficar abaixo de 1.25, calcula o suplemento
    if (fosforoProvisorio > 0 && (calcioProvisorio / fosforoProvisorio) < razaoAlvo) {
        let calcioNecessarioExtra = (razaoAlvo * fosforoProvisorio) - calcioProvisorio;
        x2_suplementoGramos = calcioNecessarioExtra / 0.40;
    }

    if (x2_suplementoGramos < 0) x2_suplementoGramos = 0;

    // Atualiza os textos do modal com foco no usuário final
    document.getElementById('modalTextoIntro').innerHTML = `
        Para completar as calorias do dia de <strong>${pet.nome}</strong> com segurança nutricional, adicione no prato:
    `;

    // Atualiza dinamicamente o nome da ração que o usuário escolheu na tela anterior
    document.getElementById('modalNomeRacaoAtiva').innerText = racaoConfig.nome;
    document.getElementById('modalResultadoRacao').innerText = Math.round(x1_racaoGramos);
    document.getElementById('modalResultadoCalcio').innerText = x2_suplementoGramos.toFixed(1);

    // Gerencia a exibição da recomendação de cálcio (só mostra se for maior que zero)
    const areaSup = document.getElementById('areaAlertaSuplemento');
    if (x2_suplementoGramos > 0.05) {
        areaSup.classList.remove('d-none');
    } else {
        areaSup.classList.add('d-none');
    }

    // Salva a recomendação e sincroniza com o Firebase
    pet.ultimaRecomendacao = {
        racao: Math.round(x1_racaoGramos),
        calcio: parseFloat(x2_suplementoGramos.toFixed(1)),
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    salvarDadosNuvem();
    recalcularTotais();

    // Dispara o modal na tela
    new bootstrap.Modal(document.getElementById('modalResultado')).show();
}

function exibirAlertaBootstrap(msg, tipo = "danger") {
    const c = document.getElementById("containerAlertas");
    if (!c) return;
    const id = "err_" + Date.now();
    c.innerHTML = `<div id="${id}" class="alert alert-${tipo} alert-dismissible fade show shadow-sm"><i class="bi bi-info-circle-fill me-2"></i> ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => {
        const e = document.getElementById(id);
        if (e) bootstrap.Alert.getOrCreateInstance(e).close();
    }, 4000);


}

function atualizarSelectRacoes() {
    const select = document.getElementById("selectRacaoAtiva");
    select.innerHTML = "";

    // 1. Injeta as de fábrica (Padrão, HotDog, Quatree)
    for (let chave in RACOES_FABRICA) {
        let opt = document.createElement("option");
        opt.value = chave;
        opt.innerText = RACOES_FABRICA[chave].nome;
        if (chave === idRacaoAtiva) opt.selected = true;
        select.appendChild(opt);
    }

    // 2. Injeta as customizadas que vieram do banco
    racoesCustomizadas.forEach(racao => {
        let opt = document.createElement("option");
        opt.value = racao.id;
        opt.innerText = `✨ ${racao.nome} (${racao.kcal} kcal)`;
        if (racao.id === idRacaoAtiva) opt.selected = true;
        select.appendChild(opt);
    });
}

function abrirModalRacao() {
    document.getElementById("formNovaRacao").reset();
    new bootstrap.Modal(document.getElementById("modalNovaRacao")).show();
}

function abrirEdicaoPet() {
    if (!idPetAtivo) return;
    const pet = caes.find(p => p.id === idPetAtivo);

    // Preenche o modal de cadastro com os dados atuais do pet para o usuário alterar
    document.getElementById('novoNome').value = pet.nome;
    document.getElementById('novoPeso').value = pet.peso;

    // Descobre as condições com base no fator salvo
    document.getElementById('checkCastrado').checked = (pet.fator === 95 || pet.fator === 115);
    document.getElementById('checkMuitoAtivo').checked = (pet.fator === 130 || pet.fator === 115);

    // Ativa uma flag temporária para a função 'salvarNovoPet' saber que é uma alteração e não um novo cão
    modoCadastro = false;

    // Muda temporariamente o título do botão do modal
    const btnSalvar = document.querySelector('#formNovoPet button[type="submit"]');
    if (btnSalvar) btnSalvar.innerHTML = '<i class="bi bi-pencil"></i> Atualizar Dados do Pet';

    new bootstrap.Modal(document.getElementById('modalNovoCao')).show();
}

function obterRacaoAtivaObjeto() {
    if (RACOES_FABRICA[idRacaoAtiva]) {
        return RACOES_FABRICA[idRacaoAtiva];
    }
    return racoesCustomizadas.find(r => r.id === idRacaoAtiva) || RACOES_FABRICA["racao_base"];
}

async function salvarNovaRacao(event) {
    event.preventDefault();
    const nome = document.getElementById("racaoNome").value;
    const kcal = parseFloat(document.getElementById("racaoKcal").value);
    const ca = parseFloat(document.getElementById("racaoCa").value);
    const p = parseFloat(document.getElementById("racaoP").value);
    const precoKg = parseFloat(document.getElementById("racaoPreco")?.value) || 15.00;
    const novaRacao = {
        id: "custom_" + Date.now(),
        nome: nome,
        kcal: kcal,
        ca: ca,
        p: p
    };

    racoesCustomizadas.push(novaRacao);
    idRacaoAtiva = novaRacao.id; // Ativa automaticamente a nova ração

    bootstrap.Modal.getInstance(document.getElementById("modalNovaRacao")).hide();

    atualizarSelectRacoes();
    await salvarDadosNuvem();
    recalcularTotais(); // Força o recalculo gráfico caso tenha itens
    exibirAlertaBootstrap(`Ração <strong>${nome}</strong> cadastrada com sucesso!`, "success");
}

async function alterarRacaoAtiva() {
    idRacaoAtiva = document.getElementById("selectRacaoAtiva").value;
    await salvarDadosNuvem();
    recalcularTotais(); // Re-renderiza o painel aplicando os novos índices energéticos
}

async function adicionarAlimento(event) {
    event.preventDefault();
    if (!idPetAtivo) {
        exibirAlertaBootstrap("Cadastre e selecione um cão primeiro.", "danger");
        return;
    }

    const pet = caes.find(p => p.id === idPetAtivo);
    const chave = document.getElementById('selectAlimento').value;
    const qtd = parseFloat(document.getElementById('qtdAlimento').value);
    const modo = document.querySelector('input[name="tipoMedida"]:checked').value;

    // Captura os dados do petisco para validar o impacto calórico antes de inserir
    const infoAlimento = BANCO_ALIMENTOS[chave];
    let gramasItem = modo === "unidade" ? qtd * infoAlimento.pesoUnidade : qtd;
    const itemKcal = Math.round(infoAlimento.kcal * (gramasItem / 100));

    // Calcula a meta diária (NEM) do pet atual
    const metaPet = Math.round(pet.fator * Math.pow(pet.peso, 0.75));

    // Obtém a data de hoje formatada (Ex: "2026-05-31") para indexar no banco
    const hoje = new Date().toISOString().split('T')[0];

    // Se o pet ainda não tiver histórico de diários nesse formato de objeto, inicializa
    if (!pet.diario || Array.isArray(pet.diario)) {
        pet.diario = {};
    }
    if (!pet.diario[hoje]) {
        pet.diario[hoje] = [];
    }

    // ─── RESOLUÇÃO 1: TRAVA LOGICA DE EXCESSO CALÓRICO ───
    // Calcula quanto o cão já consumiu APENAS no dia de hoje
    let consumidoHoje = pet.diario[hoje].reduce((acc, item) => {
        const info = BANCO_ALIMENTOS[item.chave];
        let g = item.modoMedida === "unidade" ? item.quantidadeInformada * info.pesoUnidade : item.quantidadeInformada;
        return acc + Math.round(info.kcal * (g / 100));
    }, 0);

    // Se o novo alimento estourar o limite diário, barra a inserção para proteger o Solver de PO
    if (consumidoHoje + itemKcal >= metaPet) {
        exibirAlertaBootstrap(
            `<strong>Inserção Bloqueada!</strong> Esse petisco adiciona +${itemKcal} kcal. ` +
            `O total passaria de ${consumidoHoje + itemKcal} kcal, estourando a meta limite de ${metaPet} kcal do seu cão.`,
            "danger"
        );
        return;
    }

    // Se passou na validação, empurra o item para o vetor do dia correto
    pet.diario[hoje].push({chave: chave, quantidadeInformada: qtd, modoMedida: modo});

    await salvarDadosNuvem();
    recalcularTotais();

    // Reseta o input de quantidade para 1 por conveniência
    document.getElementById('qtdAlimento').value = 1;
}

async function removerItem(index) {
    const pet = caes.find(p => p.id === idPetAtivo);
    const hoje = new Date().toISOString().split('T')[0];

    if (pet.diario && pet.diario[hoje]) {
        pet.diario[hoje].splice(index, 1);
        await salvarDadosNuvem();
        recalcularTotais();
    }
}

async function removerPetAtivo() {
    if (!idPetAtivo) return;
    const pet = caes.find(p => p.id === idPetAtivo);

    // Confirmação nativa para evitar cliques acidentais
    if (confirm(`Tem certeza absoluta que deseja excluir o perfil de ${pet.nome} e todo o diário dele?`)) {
        // Remove o pet do array filtrando pelo ID
        caes = caes.filter(p => p.id !== idPetAtivo);

        exibirAlertaBootstrap(`Perfil de <strong>${pet.nome}</strong> removido com sucesso.`, "warning");

        // Se ainda sobrarem cães, seleciona o primeiro da lista. Se não, limpa tudo.
        if (caes.length > 0) {
            selecionarPet(caes[0].id);
        } else {
            limparInterfacePet();
        }

        await salvarDadosNuvem();
        renderizarAbasCaes();
    }
}

async function salvarNovoPet(event) {
    event.preventDefault();
    if (!usuarioAtual) return;

    // Capturando os elementos com segurança
    const elNome = document.getElementById('novoNome');
    const elPeso = document.getElementById('novoPeso');
    const elCastrado = document.getElementById('checkCastrado');
    const elMuitoAtivo = document.getElementById('checkMuitoAtivo');
    const inputFoto = document.getElementById('novoFoto');

    if (!elNome || !elPeso) {
        exibirAlertaBootstrap("Erro interno: Campos principais não encontrados no HTML.", "danger");
        return;
    }

    const nome = elNome.value;
    const peso = parseFloat(elPeso.value);
    const éCastrado = elCastrado ? elCastrado.checked : false;
    const éMuitoAtivo = elMuitoAtivo ? elMuitoAtivo.checked : false;

    // Captura o arquivo de imagem enviado
    const arquivoFoto = inputFoto && inputFoto.files ? inputFoto.files[0] : null;

    // Lógica do Fator Dinâmico
    let FatorCalculado = 110;
    if (éCastrado) FatorCalculado -= 15;
    if (éMuitoAtivo) FatorCalculado += 20;

    // Geração do ID incremental (usado apenas se for um novo cadastro)
    const novoId = caes.length > 0 ? Math.max(...caes.map(p => p.id)) + 1 : 1;

    // Imagem Padrão caso o usuário não envie nenhuma
    let urlFotoFinal = "https://placehold.co/100x100?text=" + encodeURIComponent(nome);

    // ─── LÓGICA ATUALIZADA: SEM TRAVA DE TAMANHO ───
    if (arquivoFoto) {
        try {
            exibirAlertaBootstrap("Processando e compactando imagem...", "info");
            // O compressor vai receber o arquivo de 3MB e transformar em menos de 100KB
            urlFotoFinal = await converterParaBase64(arquivoFoto);
        } catch (erroConversao) {
            console.error("Erro ao converter imagem:", erroConversao);
            exibirAlertaBootstrap("Não foi possível processar a foto. Salvando com imagem padrão.", "warning");
        }
    }

    let idParaAtivar = novoId;

    // Checagem de Modo: Edição vs Cadastro
    if (modoCadastro === false) {
        const petExistente = caes.find(p => p.id === idPetAtivo);
        if (petExistente) {
            petExistente.nome = nome;
            petExistente.peso = peso;
            petExistente.fator = FatorCalculado;
            // Só substitui se uma nova foto foi processada
            if (arquivoFoto) petExistente.foto = urlFotoFinal;
            idParaAtivar = idPetAtivo;
        }
    } else {
        caes.push({
            id: novoId,
            nome: nome,
            peso: peso,
            fator: FatorCalculado,
            foto: urlFotoFinal,
            diario: {}
        });
        idParaAtivar = novoId;
    }

    // Restaura o estado do modal
    modoCadastro = true;
    const btnSalvar = document.querySelector('#formNovoPet button[type="submit"]');
    if (btnSalvar) btnSalvar.innerHTML = '<i class="bi bi-check-lg me-1"></i> Salvar e Ativar Pet';

    const modalElemento = document.getElementById('modalNovoCao');
    if (modalElemento) {
        bootstrap.Modal.getInstance(modalElemento)?.hide();
    }

    document.getElementById('formNovoPet')?.reset();

    // Sincroniza com a nuvem e atualiza o seu card com a foto à direita
    await salvarDadosNuvem();
    selecionarPet(idParaAtivar);

    exibirAlertaBootstrap(`Pet <strong>${nome}</strong> atualizado com sucesso!`, "success");
}

async function salvarDadosNuvem() {
    if (!usuarioAtual) return;
    try {
        const docRef = doc(db, "users", usuarioAtual.uid);
        // Salva a lista de cães e também as rações criadas pelo tutor
        await setDoc(docRef, {caes: caes, racoesCustomizadas: racoesCustomizadas, idRacaoAtiva: idRacaoAtiva});
    } catch (e) {
        exibirAlertaBootstrap("Erro ao salvar dados na nuvem.", "danger");
    }
}

async function puxarDadosNuvem() {
    const docSnap = await getDoc(doc(db, "users", usuarioAtual.uid));
    if (docSnap.exists() && docSnap.data()) {
        const dados = docSnap.data();
        caes = dados.caes || [];
        racoesCustomizadas = dados.racoesCustomizadas || [];
        idRacaoAtiva = dados.idRacaoAtiva || "racao_base";

        atualizarSelectRacoes();

        if (caes.length > 0) selecionarPet(caes[0].id);
        else limparInterfacePet();
    } else {
        caes = [];
        racoesCustomizadas = [];
        idRacaoAtiva = "racao_base";
        atualizarSelectRacoes();
        limparInterfacePet();
    }
    renderizarAbasCaes();
}

async function processarAuth(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const senha = document.getElementById('authSenha').value;
    const containerAlertas = document.getElementById('containerAlertasAuth');
    containerAlertas.innerHTML = '';

    try {
        if (modoCadastro) {
            await createUserWithEmailAndPassword(auth, email, senha);
        } else {
            await signInWithEmailAndPassword(auth, email, senha);
        }
    } catch (error) {
        let msgErro = "Erro na autenticação.";
        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") msgErro = "E-mail ou senha inválidos.";
        containerAlertas.innerHTML = `<div class="alert alert-danger p-2 small"><i class="bi bi-x-circle me-1"></i> ${msgErro}</div>`;
    }
}

function atualizarInterfaceAoSelecionarAlimento() {
    const chave = document.getElementById('selectAlimento').value;
    const alimento = BANCO_ALIMENTOS[chave];

    if (!alimento) return;

    // 1. GATILHO DE ALERTA: ALIMENTOS SEVERAMENTE TÓXICOS (BLOQUEIA TOTAL)
    if (alimento.toxico) {
        exibirAlertaBootstrap(
            `<strong>PERIGO CRÍTICO!</strong> O alimento <strong>${alimento.nome}</strong> é altamente TÓXICO para cães e pode causar falência orgânica. Ele foi bloqueado no sistema.`,
            "danger"
        );
        document.getElementById('qtdAlimento').disabled = true;
        document.getElementById('btnAdicionarAlimento').disabled = true;
        return;
    }

    // 2. NOVO GATILHO DE ALERTA: ALIMENTOS INDUSTRIAIS / ULTRAPROCESSADOS
    if (alimento.industrial) {
        exibirAlertaBootstrap(
            `<strong>Atenção Nutricional!</strong> O alimento <strong>${alimento.nome}</strong> é um ultraprocessado industrial. Contém conservantes, corantes e excesso de sódio prejudiciais à saúde do pet a longo prazo. Evite o uso frequente.`,
            "warning" // Dispara a tarja amarela do Bootstrap automaticamente
        );
        // Não bloqueia os botões pois o tutor ainda pode querer computar no diário
        document.getElementById('qtdAlimento').disabled = false;
        document.getElementById('btnAdicionarAlimento').disabled = false;
    } else {
        // Alimento saudável liberado: garante o estado normal dos controles
        document.getElementById('qtdAlimento').disabled = false;
        document.getElementById('btnAdicionarAlimento').disabled = false;
    }

    // Lógica para atualizar os textos de unidade/gramas com base na escolha
    const txtMedida = document.getElementById('txtExemploMedida');
    if (txtMedida) {
        txtMedida.innerText = `1 unidade equivale a aprox. ${alimento.pesoUnidade}g`;
    }
}

document.getElementById('selectAlimento').addEventListener('change', atualizarInterfaceAoSelecionarAlimento);