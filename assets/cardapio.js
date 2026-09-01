// ==========================================
// CASEIRINHOS - MOTOR E DADOS DO CARDÁPIO
// ==========================================

const DEFAULT_CARDAPIO = {
    header: {
        script: "Cardápio Artesanal",
        title: "Nossas Delícias Sob Medida",
        subtitle: "Bolos caseiros, doces finos e sobremesas feitas à mão com muito carinho para transformar seus momentos em memórias inesquecíveis."
    },
    round_cakes: {
        title: "Bolos Redondos",
        script: "Altos & Fofinhos",
        description: "Nossos bolos redondos contam com 3 camadas de massa amanteigada e 2 camadas generosas de recheio cremoso.",
        massas: [
            { name: "Massa Branca (Baunilha)", addon: 0 },
            { name: "Massa de Chocolate 50%", addon: 0 },
            { name: "Red Velvet Aveludada", addon: 5 }
        ],
        sizes: [
            { code: "PP", ring_size: "aro 13", slices: 10, weight_kg: 1.2, price_tradicional: 85, price_especial: 110 },
            { code: "P", ring_size: "aro 15", slices: 15, weight_kg: 1.6, price_tradicional: 130, price_especial: 165 },
            { code: "M", ring_size: "aro 17", slices: 20, weight_kg: 2.1, price_tradicional: 180, price_especial: 220 },
            { code: "G", ring_size: "aro 20", slices: 30, weight_kg: 3.1, price_tradicional: 240, price_especial: 285 },
            { code: "XG", ring_size: "aro 25", slices: 40, weight_kg: 4.1, price_tradicional: 300, price_especial: 350 }
        ],
        flavors_tradicionais: [
            { name: "Chocolatudo", desc: "Massa de chocolate com brigadeiro de chocolate 50% cremoso." },
            { name: "Dois Amores", desc: "Massa branca com camadas intercaladas de ninho e cremoso de chocolate." },
            { name: "Choconinho", desc: "Massa de chocolate com recheio cremoso de ninho." },
            { name: "Cocada Cremosa", desc: "Massa de chocolate com recheio cremoso de coco fresco." },
            { name: "Mousse de Maracujá", desc: "Massa branca com recheio leve e aerado de maracujá." }
        ],
        flavors_especiais: [
            { name: "Prestígio Gourmet", desc: "Massa de chocolate com 2 camadas de coco cremoso e 1 de mousse meio amargo." },
            { name: "Abacaxi com Coco", desc: "Massa branca com coco cremoso e compota artesanal de abacaxi." },
            { name: "Ninho com Morangos Frescos", desc: "Massa branca com recheio cremoso de ninho com morangos selecionados." },
            { name: "Chocolate com Morango", desc: "Massa de chocolate com brigadeiro 50% e morangos frescos." },
            { name: "Ninho com Nutella Pura", desc: "Massa branca com ninho cremoso e generosa camada de Nutella." },
            { name: "Doce de Leite com Ameixa", desc: "Massa branca com doce de leite artesanal e compota de ameixa." },
            { name: "Laka com Frutas Vermelhas", desc: "Massa branca com recheio Laka e geleia artesanal de frutas vermelhas." }
        ]
    },
    rectangular_cakes: {
        title: "Bolos Retangulares (Bolos de Corte)",
        script: "Para Grandes Festas",
        description: "A melhor opção para render muitas fatias em aniversários, casamentos e confraternizações.",
        sizes: [
            { code: "P", dim: "20×15cm", slices: "20 a 25", price_tradicional: 170, price_especial: 190 },
            { code: "M", dim: "25×17cm", slices: "30 a 35", price_tradicional: 255, price_especial: 285 },
            { code: "G", dim: "30×22cm", slices: "40 a 45", price_tradicional: 340, price_especial: 380 },
            { code: "GG", dim: "36×26cm", slices: "60 a 65", price_tradicional: 510, price_especial: 570 }
        ]
    },
    sweets: {
        title: "Docinhos para Festas",
        script: "Elegância & Sabor",
        description: "Docinhos enrolados um a um com ingredientes nobres.",
        tradicionais: {
            packages: [
                { qtd: "12 un (1 tipo)", price: 30 },
                { qtd: "25 un (2 tipos)", price: 50 },
                { qtd: "50 un (2 tipos)", price: 60 },
                { qtd: "100 un (até 4 tipos)", price: 100 }
            ],
            flavors: ["Brigadeiro Tradicional 50%", "Beijinho de Coco", "Amendoim Torrado", "Cajuzinho", "Bicho de Pé (Morango)", "Ninho Cremoso"]
        },
        gourmet: {
            packages: [
                { qtd: "12 un (1 tipo)", price: 36 },
                { qtd: "25 un (2 tipos)", price: 75 },
                { qtd: "50 un (2 tipos)", price: 100 },
                { qtd: "100 un (até 4 tipos)", price: 200 }
            ],
            flavors: ["Ninho com Nutella", "Mousse de Maracujá", "Surpresa de Uva", "Sensação", "Olho de Sogra", "Chocolate Meio Amargo", "Chocolate Branco Nobre", "Oreo"]
        }
    },
    decorations: [
        { name: "Brigadeiros no topo", price: 2.00, unit: "unidade" },
        { name: "Drip Cake (Calda escorrendo)", price: 8.00, unit: "total" },
        { name: "Topo Simples Personalizado", price: 25.00, unit: "total" },
        { name: "Topo em Camadas 3D", price: 35.00, unit: "total" },
        { name: "Flores Naturais Selecionadas", price: 40.00, unit: "a partir de" },
        { name: "Flores Artificiais Decorativas", price: 30.00, unit: "total" },
        { name: "Flor de Morango Fresco", price: 20.00, unit: "total" },
        { name: "Bolo em Formato de Coração", price: 50.00, unit: "adicional" },
        { name: "Andar Verdadeiro Estruturado", price: 60.00, unit: "adicional" }
    ]
};

const CardapioManager = {
    STORAGE_KEY: 'caseirinhos_cardapio_data',

    getData: function() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Erro ao ler cardápio:", e);
            }
        }
        return JSON.parse(JSON.stringify(DEFAULT_CARDAPIO));
    },

    saveData: function(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        this.syncWithBackend(data);
    },

    syncWithBackend: function(data) {
        try {
            fetch('api/cardapio.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(() => {});
        } catch(e) {}
    },

    resetToDefaults: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        return JSON.parse(JSON.stringify(DEFAULT_CARDAPIO));
    }
};

window.CardapioManager = CardapioManager;
