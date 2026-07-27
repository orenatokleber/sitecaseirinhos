import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // 1. Initial Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@caseirinhos.com' },
    update: {},
    create: {
      email: 'admin@caseirinhos.com',
      passwordHash: passwordHash,
      roles: {
        create: {
          role: 'admin'
        }
      },
      profile: {
        create: {
          displayName: 'Administrador'
        }
      }
    }
  });
  console.log('Seeded Admin User:', adminUser.email);

  // 2. Site Settings
  await prisma.siteSetting.upsert({
    where: { key: 'contact' },
    update: {},
    create: {
      key: 'contact',
      value: {
        phone: '5500000000000',
        email: 'contato@caseirinhos.com',
        address: 'Sua cidade - Estado',
        instagram: 'https://instagram.com/caseirinhos',
        whatsapp: '5500000000000'
      }
    }
  });

  await prisma.siteSetting.upsert({
    where: { key: 'hours' },
    update: {},
    create: {
      key: 'hours',
      value: {
        weekdays: 'Ter a Sáb: 11h – 18h',
        delivery: 'Delivery a partir das 13h'
      }
    }
  });
  console.log('Seeded Site Settings');

  // 3. Site Sections
  const sections = [
    { sectionKey: 'hero', title: 'Mais do que doces, criamos memórias.', subtitle: 'Confeitaria artesanal com amor em cada detalhe', content: null, ctaText: 'Ver Cardápio', ctaLink: '/cardapio' },
    { sectionKey: 'about_preview', title: 'Uma História de Amor pela Confeitaria', subtitle: null, content: 'A Caseirinhos nasceu do desejo de transformar momentos simples em memórias doces e inesquecíveis. Com ingredientes selecionados e receitas desenvolvidas com carinho, cada criação é única — assim como cada cliente que nos escolhe para fazer parte dos seus momentos especiais.', ctaText: 'Conheça nossa história', ctaLink: '/nossa-historia' },
    { sectionKey: 'cta', title: 'Pronto para adoçar seu dia?', subtitle: null, content: 'Entre em contato e faça sua encomenda. Transformamos seus momentos em memórias doces.', ctaText: 'Fazer Pedido pelo WhatsApp', ctaLink: null },
    { sectionKey: 'cardapio_hero', title: 'Cardápio de Encomendas', subtitle: 'Escolha o tamanho do seu bolo, depois o sabor perfeito para a sua celebração.', content: null, metadata: { script: 'Nossas delícias' } },
    { sectionKey: 'cardapio_sizes', title: 'Bolos Decorados', subtitle: 'com 3 camadas de recheio', content: '*Todos os bolos têm cerca de 10cm de altura · os pesos podem ter pequenas variações · todos são decorados com buttercream (creme caseiro de manteiga saborizado com baunilha).', metadata: { script: 'Passo 1' } },
    { sectionKey: 'cardapio_addons', title: 'Bolos Coração', subtitle: 'Adicional ao valor do bolo', content: null, metadata: { script: 'Especial' } },
    { sectionKey: 'cardapio_rectangular', title: 'Bolos Retangulares', subtitle: null, content: null, metadata: { script: 'Especial' } },
    { sectionKey: 'cardapio_decorations', title: 'Decorações', subtitle: 'Os valores das decorações são variáveis e podem ser consultados pelo site ou no nosso WhatsApp!', content: null, metadata: { script: 'Galeria' } },
    { sectionKey: 'cardapio_order', title: 'Solicite seu orçamento', subtitle: null, content: null, metadata: { script: 'Orçamento' } }
  ];

  for (const sec of sections) {
    await prisma.siteSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: {},
      create: sec
    });
  }
  console.log('Seeded Site Sections');

  // 4. Products
  const products = [
    { name: 'Bolo de Chocolate', description: 'Massa fofinha com recheio cremoso de chocolate belga', category: 'caseiros', isFeatured: true, sortOrder: 1 },
    { name: 'Bolo de Morango', description: 'Camadas de bolo branco com morangos frescos e chantilly', category: 'caseiros', isFeatured: true, sortOrder: 2 },
    { name: 'Fatia Prestígio', description: 'Chocolate com coco, perfeita para qualquer hora', category: 'fatias', isFeatured: false, sortOrder: 1 },
    { name: 'Fatia Red Velvet', description: 'Massa vermelha aveludada com cream cheese', category: 'fatias', isFeatured: false, sortOrder: 2 },
    { name: 'Bolo de Pote Brigadeiro', description: 'Camadas irresistíveis de bolo, brigadeiro e granulado', category: 'pote', isFeatured: false, sortOrder: 1 },
    { name: 'Bolo de Pote Ninho', description: 'Creme de leite ninho com pedaços de bolo', category: 'pote', isFeatured: false, sortOrder: 2 },
    { name: 'Brigadeiro Gourmet', description: 'Brigadeiro artesanal em diversos sabores', category: 'doces', isFeatured: true, sortOrder: 1 },
    { name: 'Beijinho', description: 'Tradicional doce de coco', category: 'doces', isFeatured: false, sortOrder: 2 },
    { name: 'Sobremesa de Morango', description: 'Creme, morangos e calda especial', category: 'sobremesas', isFeatured: false, sortOrder: 1 }
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod
    });
  }
  console.log('Seeded Products');

  // 5. Testimonials
  const testimonials = [
    { name: 'Maria Clara', content: 'Os bolos da Caseirinhos são os melhores que já provei! Cada pedido é uma experiência única.', stars: 5, sortOrder: 1 },
    { name: 'João Pedro', content: 'Encomendei o bolo de casamento e superou todas as expectativas. Lindo e delicioso!', stars: 5, sortOrder: 2 },
    { name: 'Ana Beatriz', content: 'Os doces finos para o chá de bebê ficaram perfeitos. Todos elogiaram!', stars: 5, sortOrder: 3 }
  ];

  for (const test of testimonials) {
    await prisma.testimonial.create({
      data: test
    });
  }
  console.log('Seeded Testimonials');

  // 6. Cake Sizes
  const sizes = [
    { code: 'P', name: 'P', ringSize: 'aro 13', slices: 10, weightKg: 1.2, sortOrder: 1 },
    { code: 'M', name: 'M', ringSize: 'aro 16', slices: 20, weightKg: 2.2, sortOrder: 2 },
    { code: 'G', name: 'G', ringSize: 'aro 20', slices: 30, weightKg: 3.2, sortOrder: 3 },
    { code: 'XG', name: 'XG', ringSize: 'aro 25', slices: 40, weightKg: 4.2, sortOrder: 4 }
  ];

  const dbSizes: Record<string, any> = {};
  for (const size of sizes) {
    dbSizes[size.code] = await prisma.cakeSize.upsert({
      where: { code: size.code },
      update: {},
      create: size
    });
  }
  console.log('Seeded Cake Sizes');

  // 7. Cake Categories
  const categories = [
    { slug: 'classe-1', name: 'Classe 1', description: 'Bolos clássicos', type: 'standard', sortOrder: 1 },
    { slug: 'classe-2', name: 'Classe 2', description: 'Bolos premium', type: 'standard', sortOrder: 2 },
    { slug: 'coracao', name: 'Bolos Coração', description: 'Adicional para formato coração', type: 'addon', sortOrder: 3 }
  ];

  const dbCategories: Record<string, any> = {};
  for (const cat of categories) {
    dbCategories[cat.slug] = await prisma.cakeCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
  console.log('Seeded Cake Categories');

  // 8. Cake Category Prices
  const categoryPrices = [
    { categorySlug: 'classe-1', sizeCode: 'P', price: 140 },
    { categorySlug: 'classe-1', sizeCode: 'M', price: 210 },
    { categorySlug: 'classe-1', sizeCode: 'G', price: 310 },
    { categorySlug: 'classe-1', sizeCode: 'XG', price: 410 },
    { categorySlug: 'classe-2', sizeCode: 'P', price: 160 },
    { categorySlug: 'classe-2', sizeCode: 'M', price: 245 },
    { categorySlug: 'classe-2', sizeCode: 'G', price: 360 },
    { categorySlug: 'classe-2', sizeCode: 'XG', price: 475 },
    { categorySlug: 'coracao', sizeCode: 'P', price: 30 },
    { categorySlug: 'coracao', sizeCode: 'M', price: 40 },
    { categorySlug: 'coracao', sizeCode: 'G', price: 70 }
  ];

  for (const priceItem of categoryPrices) {
    const cat = dbCategories[priceItem.categorySlug];
    const size = dbSizes[priceItem.sizeCode];
    if (cat && size) {
      await prisma.cakeCategoryPrice.upsert({
        where: {
          categoryId_sizeId: {
            categoryId: cat.id,
            sizeId: size.id
          }
        },
        update: {},
        create: {
          categoryId: cat.id,
          sizeId: size.id,
          price: priceItem.price
        }
      });
    }
  }
  console.log('Seeded Cake Category Prices');

  // 9. Cake Flavors
  const class1Flavors = [
    { name: 'Brigadeiro Amargo', description: 'Massa chocolate, três camadas de brigadeiro amargo', sortOrder: 1 },
    { name: 'Brigadeiro ao Leite', description: 'Massa chocolate, três camadas de brigadeiro ao leite', sortOrder: 2 },
    { name: 'Dois Amores', description: 'Massa chocolate, uma camada de brigadeiro amargo e duas de brigadeiro ao leite', sortOrder: 3 },
    { name: 'Prestígio', description: 'Massa chocolate, uma camada de brigadeiro e duas de cocada', sortOrder: 4 },
    { name: 'Doce de Leite', description: 'Massa chocolate, três camadas de brigadeiro amargo e duas de doce de leite (leite condensado cozido)', sortOrder: 5 },
    { name: 'Chocopink', description: 'Massa chocolate, uma camada de brigadeiro amargo e duas de doce de brigadeiro rosa de morango', sortOrder: 6 },
    { name: 'Ninho', description: 'Massa bauni, três camadas de brigadeiro de ninho', sortOrder: 7 },
    { name: 'Cocada com Doce de Leite', description: 'Massa bauni, três camadas de cocada com doce de leite', sortOrder: 8 },
    { name: 'Ninho com Doce de Leite', description: 'Massa bauni, três camadas de ninho com doce de leite', sortOrder: 9 },
    { name: 'Cenoura', description: 'Massa cenoura, três camadas de brigadeiro ao leite', sortOrder: 10 }
  ];

  const class2Flavors = [
    { name: 'Ninho com Nutella', description: 'Massa chocolate, três camadas de ninho com nutella', sortOrder: 1 },
    { name: 'Maracujá com Chocolate', description: 'Massa chocolate, três camadas de brigadeiro amargo e maracujá', sortOrder: 2 },
    { name: 'Brigadeiro com Caramelo Salgado e Amendoim', description: 'Massa chocolate, três camadas de brigadeiro amargo com caramelo salgado e amendoim', sortOrder: 3 },
    { name: 'Brigadeiro ao Leite com Morango (geleia caseira)', description: 'Massa chocolate, três camadas de brigadeiro ao leite com geleia caseira de morango', sortOrder: 4 },
    { name: 'Abacaxi com Ninho e Cocada', description: 'Massa bauni, duas camadas de ninho com abacaxi e uma de cocada', sortOrder: 5 },
    { name: 'Maracujá com Ninho', description: 'Massa bauni, três camadas com brigadeiro de ninho e maracujá', sortOrder: 6 },
    { name: 'Ninho com Morango (geleia caseira)', description: 'Massa bauni, três camadas de ninho com geleia caseira de morango', sortOrder: 7 },
    { name: 'Ninho com Frutas Vermelhas (geleia caseira)', description: 'Massa bauni, três camadas de ninho com geleia caseira de frutas', sortOrder: 8 },
    { name: 'Pistache', description: 'Massa bauni, três camadas de ninho com pasta de pistache e pistaches', sortOrder: 9 },
    { name: 'Nozes com Doce de Leite', description: 'Massa bauni, três camadas de brigadeiro de nozes e doce de leite', sortOrder: 10 },
    { name: 'Avelã Branca com Ninho', description: 'Massa bauni, três camadas de brigadeiro de ninho com pasta de avelã branca', sortOrder: 11 }
  ];

  const cat1 = dbCategories['classe-1'];
  if (cat1) {
    for (const f of class1Flavors) {
      await prisma.cakeFlavor.create({
        data: {
          categoryId: cat1.id,
          name: f.name,
          description: f.description,
          sortOrder: f.sortOrder
        }
      });
    }
  }

  const cat2 = dbCategories['classe-2'];
  if (cat2) {
    for (const f of class2Flavors) {
      await prisma.cakeFlavor.create({
        data: {
          categoryId: cat2.id,
          name: f.name,
          description: f.description,
          sortOrder: f.sortOrder
        }
      });
    }
  }
  console.log('Seeded Cake Flavors');

  // 10. Rectangular Cakes
  const rectangular = [
    { name: 'Retrô - Retangular', dimensions: '22 x 17cm', slices: 26, weightKg: 3.0, class1Price: 300, class2Price: 350, note: 'O bolo retrô pode ser decorado bem retrô :)', sortOrder: 1 },
    { name: 'Retangular - Corte', dimensions: '30 x 22cm', slices: 50, weightKg: 5.5, class1Price: 440, class2Price: 500, note: 'O bolo da conta é espatulado branco :)', sortOrder: 2 }
  ];

  for (const rect of rectangular) {
    await prisma.cakeRectangular.create({
      data: rect
    });
  }
  console.log('Seeded Rectangular Cakes');

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
