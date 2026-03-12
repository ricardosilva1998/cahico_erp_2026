import { getAllProducts } from './products'

const collectionNames: Record<string, Record<string, string>> = {
  en: {
    alfama: 'Alfama',
    chiado: 'Chiado',
    santos: 'Santos',
    canastras: 'Canastras',
    belem: 'Belém',
    sintra: 'Sintra',
    cascais: 'Cascais',
    mouraria: 'Mouraria',
  },
  pt: {
    alfama: 'Alfama',
    chiado: 'Chiado',
    santos: 'Santos',
    canastras: 'Canastras',
    belem: 'Belém',
    sintra: 'Sintra',
    cascais: 'Cascais',
    mouraria: 'Mouraria',
  },
}

const categoryNouns: Record<string, Record<string, string>> = {
  en: {
    rings: 'Ring',
    necklaces: 'Necklace',
    earrings: 'Earrings',
    bracelets: 'Bracelet',
    anklets: 'Anklet',
    brooches: 'Brooch',
    pendants: 'Pendant',
    cufflinks: 'Cufflinks',
  },
  pt: {
    rings: 'Anel',
    necklaces: 'Colar',
    earrings: 'Brincos',
    bracelets: 'Pulseira',
    anklets: 'Tornozeleira',
    brooches: 'Broche',
    pendants: 'Pendente',
    cufflinks: 'Botões de Punho',
  },
}

const styleAdjectives: Record<string, string[]> = {
  en: ['Classic', 'Heritage', 'Artisan', 'Signature', 'Deluxe', 'Royal', 'Refined', 'Noble'],
  pt: ['Clássico', 'Herança', 'Artesanal', 'Assinatura', 'Deluxe', 'Real', 'Refinado', 'Nobre'],
}

interface Templates {
  description: string[]
  inspiration: string[]
  materialsStory: string[]
  crafting: string[]
}

const templates: Record<string, Record<string, Templates>> = {
  en: {
    rings: {
      description: [
        'A {adj} {mat} ring from the {col} collection, blending Portuguese craftsmanship with contemporary design.',
        'This exquisite {mat} ring from our {col} line captures the essence of Lisbon\'s timeless elegance.',
        'A beautifully crafted {mat} ring inspired by the character and charm of {col}.',
      ],
      inspiration: [
        'Drawing from the spirit of {col}, this ring embodies the rich artistic heritage of Portuguese jewellery-making, where tradition meets modern sensibility.',
        'Inspired by the architectural beauty of {col}, this piece reflects the interplay of light and form found in Lisbon\'s most treasured landmarks.',
        'The {col} collection channels centuries of Portuguese goldsmithing tradition into a ring that feels both historic and thoroughly modern.',
      ],
      materialsStory: [
        'Crafted from {mat}, carefully selected for exceptional quality. Each stone is hand-inspected and set by our master artisans in Lisbon.',
        'Made with premium {mat}, this piece showcases the finest materials sourced through our trusted network of ethical suppliers.',
        'Featuring {mat} of exceptional grade, chosen for their brilliance and durability to create a lasting heirloom.',
      ],
      crafting: [
        'Hand-forged in our Lisbon atelier using traditional Portuguese goldsmithing techniques passed down through generations.',
        'Each piece is individually crafted, shaped, and polished by hand — a process that takes our artisans several days to complete.',
        'Created using a combination of lost-wax casting and hand-finishing, ensuring each ring is unique in its subtle details.',
      ],
    },
    necklaces: {
      description: [
        'A {adj} {mat} necklace from the {col} collection, designed to be a statement of quiet luxury.',
        'This elegant {mat} necklace from our {col} line drapes beautifully, catching light with every movement.',
        'A refined {mat} necklace inspired by the graceful character of {col}.',
      ],
      inspiration: [
        'Inspired by the flowing waters of the Tagus viewed from {col}, this necklace captures the river\'s gentle rhythm in precious metal.',
        'The {col} necklace draws from the neighbourhood\'s rich tapestry of culture, translating its warmth into wearable art.',
        'From the sunlit terraces of {col}, this piece captures the golden light that bathes Lisbon\'s most beloved quarters.',
      ],
      materialsStory: [
        'Fashioned from {mat}, each element is hand-selected to ensure exceptional lustre and longevity.',
        'Crafted in {mat} with meticulous attention to detail — from chain links to clasp, every component meets our exacting standards.',
        'Made with {mat} of superior grade, this necklace combines beauty with the durability expected of fine Portuguese jewellery.',
      ],
      crafting: [
        'Each chain link is individually soldered and polished to a flawless finish. The pendant setting is precision-crafted to showcase the stone\'s natural beauty.',
        'Our artisans spend hours hand-finishing each necklace, ensuring the chain flows with a supple, liquid drape.',
        'Created through a meticulous process of drawing, cutting, and soldering individual links — traditional techniques that ensure lasting quality.',
      ],
    },
    earrings: {
      description: [
        '{adj} {mat} earrings from the {col} collection, designed to frame the face with understated brilliance.',
        'These beautiful {mat} earrings from our {col} line add a touch of Portuguese elegance to any ensemble.',
        'Delicately crafted {mat} earrings inspired by the artistic spirit of {col}.',
      ],
      inspiration: [
        'These earrings draw inspiration from the tile patterns of {col}, translating geometric beauty into precious metalwork.',
        'Inspired by the vibrant culture of {col}, these earrings capture the neighbourhood\'s artistic energy in miniature form.',
        'From the azulejo traditions of {col}, these earrings distil centuries of Portuguese decorative art into a wearable masterpiece.',
      ],
      materialsStory: [
        'Set in {mat}, each stone is hand-cut and individually matched to ensure perfect symmetry between the pair.',
        'Crafted from {mat}, these earrings showcase materials chosen for their colour depth and clarity.',
        'Made with {mat}, selected by our gemologist for exceptional quality and visual harmony.',
      ],
      crafting: [
        'Each earring is hand-formed and carefully balanced to ensure comfortable, symmetrical wear throughout the day.',
        'Our artisan shapes the metal framework by hand, creating delicate settings that cradle each stone with precision.',
        'Crafted using traditional Portuguese techniques, each pair undergoes multiple stages of shaping, setting, and polishing.',
      ],
    },
    bracelets: {
      description: [
        'A {adj} {mat} bracelet from the {col} collection, embodying Portuguese warmth and sophistication.',
        'This elegant {mat} bracelet from our {col} line sits beautifully on the wrist with a comfortable, secure fit.',
        'A striking {mat} bracelet inspired by the character of {col}.',
      ],
      inspiration: [
        'The warmth of {col}\'s sunlit streets is captured in this bracelet, a piece that celebrates the neighbourhood\'s enduring charm.',
        'Drawing from the architectural curves of {col}, this bracelet mirrors the flowing lines of Lisbon\'s most elegant facades.',
        'Inspired by the golden hour light that bathes {col}, this bracelet carries the warmth of a Portuguese sunset on your wrist.',
      ],
      materialsStory: [
        'Crafted in {mat}, this bracelet features a hand-applied finish that catches light softly and wears beautifully over time.',
        'Made from {mat} of exceptional quality, each component is inspected to meet our rigorous standards.',
        'Featuring {mat}, this piece combines premium materials with traditional craftsmanship for a timeless result.',
      ],
      crafting: [
        'Cast using the lost-wax method and meticulously finished by hand. Each link is individually polished to create a seamless flow.',
        'Hand-crafted in our Lisbon workshop, this bracelet undergoes over twenty finishing steps before leaving the artisan\'s bench.',
        'Created through traditional metalworking techniques, ensuring a bracelet that is both beautiful and built to last generations.',
      ],
    },
    anklets: {
      description: [
        'A {adj} {mat} anklet from the {col} collection, designed for effortless everyday elegance.',
        'This delicate {mat} anklet from our {col} line adds a subtle touch of Portuguese craftsmanship.',
        'A graceful {mat} anklet inspired by the relaxed charm of {col}.',
      ],
      inspiration: [
        'Inspired by the coastal breezes and laid-back charm of {col}, this anklet embodies carefree Portuguese style.',
        'Drawing from the relaxed elegance of {col}, this piece captures the feeling of sun-warmed cobblestones and ocean air.',
        'The {col} anklet channels the effortless beauty of Lisbon\'s riverside, where tradition meets a modern, relaxed lifestyle.',
      ],
      materialsStory: [
        'Fashioned from {mat}, designed to withstand daily wear while maintaining its beautiful lustre.',
        'Crafted in {mat} with a secure clasp system, this anklet combines delicacy with durability.',
        'Made with {mat}, chosen for its beauty and resistance to everyday wear.',
      ],
      crafting: [
        'Each link is hand-finished and the clasp is tested for smooth, secure operation — perfect for all-day wear.',
        'Crafted with attention to weight and drape, this anklet sits naturally on the ankle without twisting or catching.',
        'Our artisans create each piece with a focus on comfort and longevity, using time-tested Portuguese metalworking methods.',
      ],
    },
    brooches: {
      description: [
        'A {adj} {mat} brooch from the {col} collection, a statement piece that elevates any outfit.',
        'This intricate {mat} brooch from our {col} line showcases exceptional Portuguese metalwork and design.',
        'A beautifully detailed {mat} brooch inspired by the decorative traditions of {col}.',
      ],
      inspiration: [
        'Drawing from the ornamental traditions of {col}, this brooch transforms centuries of decorative art into a wearable treasure.',
        'Inspired by the floral motifs found throughout {col}\'s historic architecture, this brooch is a miniature work of art.',
        'The {col} brooch channels the neighbourhood\'s rich visual culture into an accessory that tells a story.',
      ],
      materialsStory: [
        'Crafted in {mat}, this brooch features meticulous detailing that showcases each material to its fullest potential.',
        'Made with {mat}, carefully assembled to create depth and dimension in the design.',
        'Featuring {mat}, each element is set by hand to create a piece of remarkable intricacy.',
      ],
      crafting: [
        'Each brooch is individually assembled from multiple hand-crafted components, requiring hours of detailed work by our artisans.',
        'Created using a combination of casting, hand-engraving, and stone-setting techniques refined over decades.',
        'Our master artisan dedicates an entire day to each brooch, ensuring every detail meets our exacting standards.',
      ],
    },
    pendants: {
      description: [
        'A {adj} {mat} pendant from the {col} collection, designed to be worn close to the heart.',
        'This captivating {mat} pendant from our {col} line carries the essence of Portuguese artistry.',
        'A meaningful {mat} pendant inspired by the soulful character of {col}.',
      ],
      inspiration: [
        'Inspired by the intimate beauty of {col}, this pendant carries the neighbourhood\'s warmth wherever you go.',
        'Drawing from the symbolic traditions of {col}, this pendant is designed to hold personal meaning for its wearer.',
        'The {col} pendant captures the essence of Lisbon\'s most cherished neighbourhood in a single, precious form.',
      ],
      materialsStory: [
        'Crafted in {mat}, this pendant features stones chosen for their natural beauty and symbolic significance.',
        'Made with {mat}, each component is hand-selected to create a harmonious and visually stunning piece.',
        'Featuring {mat} of exceptional quality, this pendant is designed to become a cherished personal talisman.',
      ],
      crafting: [
        'Each pendant is individually crafted using traditional lost-wax casting, then hand-finished to reveal the design\'s full beauty.',
        'Our artisans spend hours refining each pendant, ensuring the setting maximises the stone\'s natural light return.',
        'Created through a meticulous multi-stage process that combines modern precision with time-honoured Portuguese craftsmanship.',
      ],
    },
    cufflinks: {
      description: [
        '{adj} {mat} cufflinks from the {col} collection, the perfect finishing touch for formal attire.',
        'These distinguished {mat} cufflinks from our {col} line combine Portuguese heritage with modern sophistication.',
        'Elegant {mat} cufflinks inspired by the refined character of {col}.',
      ],
      inspiration: [
        'Drawing from the sartorial elegance of {col}\'s historic establishments, these cufflinks add a touch of Lisbon\'s refined spirit to formal dress.',
        'Inspired by the gentlemanly traditions of {col}, these cufflinks are a nod to the timeless art of dressing well.',
        'The {col} cufflinks channel the neighbourhood\'s cultural sophistication into a subtle yet powerful accessory.',
      ],
      materialsStory: [
        'Crafted in {mat}, these cufflinks feature materials chosen for their visual impact and tactile quality.',
        'Made with {mat}, each pair is designed to feel substantial in the hand while sitting elegantly at the cuff.',
        'Featuring {mat}, these cufflinks combine premium materials with a design that speaks of quiet confidence.',
      ],
      crafting: [
        'Each pair is individually crafted and the toggle mechanism is precision-engineered for smooth, reliable operation.',
        'Our artisan shapes, sets, and polishes each cufflink by hand, ensuring a flawless finish on every surface.',
        'Created using traditional metalworking techniques, each pair undergoes rigorous quality checks before leaving our atelier.',
      ],
    },
  },
  pt: {
    rings: {
      description: [
        'Um anel {adj} em {mat} da coleção {col}, unindo o artesanato português ao design contemporâneo.',
        'Este requintado anel em {mat} da nossa linha {col} captura a essência da elegância intemporal de Lisboa.',
        'Um anel belamente elaborado em {mat}, inspirado no carácter e charme de {col}.',
      ],
      inspiration: [
        'Inspirado no espírito de {col}, este anel incorpora a rica herança artística da joalharia portuguesa, onde a tradição encontra a sensibilidade moderna.',
        'Inspirado na beleza arquitetónica de {col}, esta peça reflete o jogo de luz e forma dos monumentos mais apreciados de Lisboa.',
        'A coleção {col} canaliza séculos de tradição portuguesa de ourivesaria num anel que é simultaneamente histórico e profundamente moderno.',
      ],
      materialsStory: [
        'Fabricado em {mat}, cuidadosamente selecionado pela qualidade excecional. Cada pedra é inspecionada à mão e engastada pelos nossos mestres artesãos em Lisboa.',
        'Feito com {mat} premium, esta peça apresenta os melhores materiais provenientes da nossa rede de fornecedores éticos.',
        'Apresentando {mat} de grau excecional, escolhidos pelo seu brilho e durabilidade para criar uma herança duradoura.',
      ],
      crafting: [
        'Forjado à mão no nosso atelier em Lisboa usando técnicas tradicionais de ourivesaria portuguesa transmitidas ao longo de gerações.',
        'Cada peça é individualmente elaborada, moldada e polida à mão — um processo que leva vários dias aos nossos artesãos.',
        'Criado usando uma combinação de fundição por cera perdida e acabamento manual, garantindo que cada anel é único nos seus detalhes subtis.',
      ],
    },
    necklaces: {
      description: [
        'Um colar {adj} em {mat} da coleção {col}, concebido como uma declaração de luxo discreto.',
        'Este elegante colar em {mat} da nossa linha {col} cai graciosamente, captando a luz com cada movimento.',
        'Um colar refinado em {mat} inspirado no carácter gracioso de {col}.',
      ],
      inspiration: [
        'Inspirado nas águas fluentes do Tejo vistas de {col}, este colar captura o ritmo suave do rio em metal precioso.',
        'O colar {col} inspira-se na rica tapeçaria cultural do bairro, traduzindo o seu calor em arte vestível.',
        'Dos terraços soalheiros de {col}, esta peça captura a luz dourada que banha os bairros mais amados de Lisboa.',
      ],
      materialsStory: [
        'Fabricado em {mat}, cada elemento é selecionado à mão para garantir lustre e longevidade excecionais.',
        'Elaborado em {mat} com atenção meticulosa ao detalhe — dos elos da corrente ao fecho, cada componente cumpre os nossos padrões exigentes.',
        'Feito com {mat} de grau superior, este colar combina beleza com a durabilidade esperada da joalharia fina portuguesa.',
      ],
      crafting: [
        'Cada elo da corrente é individualmente soldado e polido até um acabamento impecável. O engaste do pendente é fabricado com precisão para realçar a beleza natural da pedra.',
        'Os nossos artesãos passam horas a dar o acabamento manual a cada colar, garantindo que a corrente flui com um caimento suave e líquido.',
        'Criado através de um processo meticuloso de estirar, cortar e soldar elos individuais — técnicas tradicionais que garantem qualidade duradoura.',
      ],
    },
    earrings: {
      description: [
        'Brincos {adj} em {mat} da coleção {col}, concebidos para emoldurar o rosto com brilho discreto.',
        'Estes belos brincos em {mat} da nossa linha {col} acrescentam um toque de elegância portuguesa a qualquer conjunto.',
        'Brincos delicadamente elaborados em {mat}, inspirados no espírito artístico de {col}.',
      ],
      inspiration: [
        'Estes brincos inspiram-se nos padrões de azulejos de {col}, traduzindo a beleza geométrica em trabalho de metal precioso.',
        'Inspirados pela cultura vibrante de {col}, estes brincos capturam a energia artística do bairro em forma miniatura.',
        'Das tradições de azulejo de {col}, estes brincos destilam séculos de arte decorativa portuguesa numa obra-prima vestível.',
      ],
      materialsStory: [
        'Engastados em {mat}, cada pedra é cortada à mão e individualmente combinada para garantir simetria perfeita entre o par.',
        'Fabricados em {mat}, estes brincos apresentam materiais escolhidos pela sua profundidade de cor e clareza.',
        'Feitos com {mat}, selecionados pelo nosso gemólogo pela qualidade excecional e harmonia visual.',
      ],
      crafting: [
        'Cada brinco é formado à mão e cuidadosamente equilibrado para garantir uso confortável e simétrico durante todo o dia.',
        'O nosso artesão molda a armação de metal à mão, criando engastes delicados que abraçam cada pedra com precisão.',
        'Elaborados usando técnicas portuguesas tradicionais, cada par passa por múltiplas fases de moldagem, engaste e polimento.',
      ],
    },
    bracelets: {
      description: [
        'Uma pulseira {adj} em {mat} da coleção {col}, que incorpora o calor e a sofisticação portuguesa.',
        'Esta elegante pulseira em {mat} da nossa linha {col} assenta graciosamente no pulso com um ajuste confortável e seguro.',
        'Uma impressionante pulseira em {mat} inspirada no carácter de {col}.',
      ],
      inspiration: [
        'O calor das ruas soalheiras de {col} é capturado nesta pulseira, uma peça que celebra o charme duradouro do bairro.',
        'Inspirada nas curvas arquitetónicas de {col}, esta pulseira espelha as linhas fluentes das fachadas mais elegantes de Lisboa.',
        'Inspirada pela luz dourada que banha {col}, esta pulseira carrega o calor de um pôr do sol português no seu pulso.',
      ],
      materialsStory: [
        'Fabricada em {mat}, esta pulseira apresenta um acabamento aplicado à mão que capta a luz suavemente e ganha beleza com o uso.',
        'Feita em {mat} de qualidade excecional, cada componente é inspecionado para cumprir os nossos rigorosos padrões.',
        'Apresentando {mat}, esta peça combina materiais premium com artesanato tradicional para um resultado intemporal.',
      ],
      crafting: [
        'Fundida pelo método de cera perdida e meticulosamente acabada à mão. Cada elo é individualmente polido para criar um fluxo contínuo.',
        'Elaborada à mão na nossa oficina em Lisboa, esta pulseira passa por mais de vinte etapas de acabamento antes de sair da bancada do artesão.',
        'Criada através de técnicas tradicionais de metalurgia, garantindo uma pulseira que é bela e construída para durar gerações.',
      ],
    },
    anklets: {
      description: [
        'Uma tornozeleira {adj} em {mat} da coleção {col}, concebida para uma elegância quotidiana sem esforço.',
        'Esta delicada tornozeleira em {mat} da nossa linha {col} acrescenta um toque subtil de artesanato português.',
        'Uma graciosa tornozeleira em {mat} inspirada no charme descontraído de {col}.',
      ],
      inspiration: [
        'Inspirada pelas brisas costeiras e pelo charme descontraído de {col}, esta tornozeleira incorpora o estilo português despretensioso.',
        'Inspirada na elegância relaxada de {col}, esta peça captura a sensação de calçada aquecida pelo sol e brisa marítima.',
        'A tornozeleira {col} canaliza a beleza despretensiosa da zona ribeirinha de Lisboa, onde a tradição encontra um estilo de vida moderno e relaxado.',
      ],
      materialsStory: [
        'Fabricada em {mat}, concebida para resistir ao uso diário mantendo o seu belo lustre.',
        'Elaborada em {mat} com um sistema de fecho seguro, esta tornozeleira combina delicadeza com durabilidade.',
        'Feita com {mat}, escolhido pela sua beleza e resistência ao uso quotidiano.',
      ],
      crafting: [
        'Cada elo é acabado à mão e o fecho é testado para uma operação suave e segura — perfeito para uso durante todo o dia.',
        'Elaborada com atenção ao peso e caimento, esta tornozeleira assenta naturalmente no tornozelo sem torcer ou prender.',
        'Os nossos artesãos criam cada peça com foco no conforto e longevidade, usando métodos portugueses de metalurgia testados pelo tempo.',
      ],
    },
    brooches: {
      description: [
        'Um broche {adj} em {mat} da coleção {col}, uma peça de destaque que eleva qualquer outfit.',
        'Este intrincado broche em {mat} da nossa linha {col} apresenta um trabalho de metal e design português excecional.',
        'Um broche belamente detalhado em {mat} inspirado nas tradições decorativas de {col}.',
      ],
      inspiration: [
        'Inspirado nas tradições ornamentais de {col}, este broche transforma séculos de arte decorativa num tesouro vestível.',
        'Inspirado nos motivos florais encontrados pela arquitetura histórica de {col}, este broche é uma miniatura obra de arte.',
        'O broche {col} canaliza a rica cultura visual do bairro num acessório que conta uma história.',
      ],
      materialsStory: [
        'Fabricado em {mat}, este broche apresenta detalhes meticulosos que realçam cada material ao seu máximo potencial.',
        'Feito com {mat}, cuidadosamente montado para criar profundidade e dimensão no design.',
        'Apresentando {mat}, cada elemento é engastado à mão para criar uma peça de notável intricação.',
      ],
      crafting: [
        'Cada broche é individualmente montado a partir de múltiplos componentes elaborados à mão, requerendo horas de trabalho detalhado pelos nossos artesãos.',
        'Criado usando uma combinação de fundição, gravação manual e técnicas de engaste aperfeiçoadas ao longo de décadas.',
        'O nosso mestre artesão dedica um dia inteiro a cada broche, garantindo que cada detalhe cumpre os nossos padrões exigentes.',
      ],
    },
    pendants: {
      description: [
        'Um pendente {adj} em {mat} da coleção {col}, concebido para ser usado junto ao coração.',
        'Este cativante pendente em {mat} da nossa linha {col} carrega a essência da arte portuguesa.',
        'Um pendente significativo em {mat} inspirado no carácter cheio de alma de {col}.',
      ],
      inspiration: [
        'Inspirado na beleza íntima de {col}, este pendente carrega o calor do bairro para onde quer que vá.',
        'Inspirado nas tradições simbólicas de {col}, este pendente é concebido para ter significado pessoal para quem o usa.',
        'O pendente {col} captura a essência do bairro mais querido de Lisboa numa única forma preciosa.',
      ],
      materialsStory: [
        'Fabricado em {mat}, este pendente apresenta pedras escolhidas pela sua beleza natural e significado simbólico.',
        'Feito com {mat}, cada componente é selecionado à mão para criar uma peça harmoniosa e visualmente deslumbrante.',
        'Apresentando {mat} de qualidade excecional, este pendente é concebido para se tornar um talismã pessoal querido.',
      ],
      crafting: [
        'Cada pendente é individualmente elaborado usando fundição tradicional por cera perdida, depois acabado à mão para revelar toda a beleza do design.',
        'Os nossos artesãos passam horas a refinar cada pendente, garantindo que o engaste maximiza o retorno de luz natural da pedra.',
        'Criado através de um meticuloso processo multi-etapas que combina precisão moderna com artesanato português consagrado pelo tempo.',
      ],
    },
    cufflinks: {
      description: [
        'Botões de punho {adj} em {mat} da coleção {col}, o toque final perfeito para traje formal.',
        'Estes distintos botões de punho em {mat} da nossa linha {col} combinam herança portuguesa com sofisticação moderna.',
        'Elegantes botões de punho em {mat} inspirados no carácter refinado de {col}.',
      ],
      inspiration: [
        'Inspirados na elegância sartorial dos estabelecimentos históricos de {col}, estes botões de punho acrescentam um toque do espírito refinado de Lisboa ao traje formal.',
        'Inspirados nas tradições cavalheirescas de {col}, estes botões de punho são uma homenagem à arte intemporal de vestir bem.',
        'Os botões de punho {col} canalizam a sofisticação cultural do bairro num acessório subtil mas poderoso.',
      ],
      materialsStory: [
        'Fabricados em {mat}, estes botões de punho apresentam materiais escolhidos pelo seu impacto visual e qualidade tátil.',
        'Feitos com {mat}, cada par é concebido para ter presença na mão enquanto assenta elegantemente no punho.',
        'Apresentando {mat}, estes botões de punho combinam materiais premium com um design que transmite confiança discreta.',
      ],
      crafting: [
        'Cada par é individualmente elaborado e o mecanismo de toggle é fabricado com precisão para uma operação suave e fiável.',
        'O nosso artesão molda, engasta e pole cada botão de punho à mão, garantindo um acabamento impecável em cada superfície.',
        'Criados usando técnicas tradicionais de metalurgia, cada par passa por rigorosos controlos de qualidade antes de sair do nosso atelier.',
      ],
    },
  },
}

// Featured product IDs that already have hand-written translations
const featuredIds = new Set([
  'alfama-ring',
  'alfama-necklace',
  'alfama-bracelet',
  'alfama-earrings',
  'chiado-ring',
  'chiado-necklace',
])

export function generateProductMessages(locale: string): Record<string, Record<string, string>> {
  const effectiveLocale = locale === 'pt' ? 'pt' : 'en'
  const colNames = collectionNames[effectiveLocale] ?? collectionNames['en']!
  const catNouns = categoryNouns[effectiveLocale] ?? categoryNouns['en']!
  const adjectives = styleAdjectives[effectiveLocale] ?? styleAdjectives['en']!
  const tpls = templates[effectiveLocale] ?? templates['en']!

  const result: Record<string, Record<string, string>> = {}
  const products = getAllProducts()

  for (const p of products) {
    if (featuredIds.has(p.id)) continue

    const col = colNames[p.collection] ?? p.collection
    const noun = catNouns[p.category] ?? p.category
    const catTpls = tpls[p.category]
    if (!catTpls) continue

    // Deterministic index from product id
    let hash = 0
    for (let i = 0; i < p.id.length; i++) {
      hash = ((hash << 5) - hash + p.id.charCodeAt(i)) | 0
    }
    const idx = Math.abs(hash)

    const adj = adjectives[idx % adjectives.length]!
    const mat = p.materials.join(' & ')

    const interpolate = (s: string) =>
      s.replace(/\{col\}/g, col).replace(/\{adj\}/g, adj).replace(/\{mat\}/g, mat)

    result[p.id] = {
      name: `${col} ${adj} ${noun}`,
      description: interpolate(catTpls.description[idx % catTpls.description.length]!),
      inspiration: interpolate(catTpls.inspiration[idx % catTpls.inspiration.length]!),
      materialsStory: interpolate(catTpls.materialsStory[idx % catTpls.materialsStory.length]!),
      crafting: interpolate(catTpls.crafting[idx % catTpls.crafting.length]!),
    }
  }

  return result
}
