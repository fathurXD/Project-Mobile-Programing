const courseData = {
  Writing: {
    icon: '✍️',
    color: '#E8F4FD',
    accentColor: '#2196F3',
    description: 'Pelajari cara menulis dalam bahasa Inggris dengan baik dan benar.',
    exerciseType: 'multiple_choice',
    chapters: [
      {
        id: 'w1',
        title: 'Basic Sentences',
        description: 'Belajar membuat kalimat dasar dalam bahasa Inggris.',
        duration: '10 menit',
        isLocked: false,
        content: {
          introduction: 'Kalimat dasar dalam bahasa Inggris terdiri dari Subject + Verb + Object.',
          sections: [
            {
              title: 'Struktur Kalimat',
              body: 'Setiap kalimat bahasa Inggris minimal harus memiliki Subject (S) dan Verb (V).\n\nContoh:\n• I eat. (S + V)\n• She reads a book. (S + V + O)\n• They play football. (S + V + O)',
            },
            {
              title: 'Contoh Kalimat Sederhana',
              body: '• I am a student.\n• She is a teacher.\n• We love English.\n• He plays guitar every day.',
            },
          ],
        },
        exercises: [
          {
            id: 'w1e1',
            question: 'Which sentence has the correct structure?',
            options: ['Eat I rice.', 'I eat rice.', 'Rice eat I.', 'Eat rice I.'],
            correctAnswer: 'I eat rice.',
            explanation: 'Struktur yang benar adalah Subject + Verb + Object: "I (S) eat (V) rice (O)".',
          },
          {
            id: 'w1e2',
            question: 'Complete: "She ___ a doctor."',
            options: ['am', 'are', 'is', 'be'],
            correctAnswer: 'is',
            explanation: 'She adalah third person singular, sehingga menggunakan "is".',
          },
          {
            id: 'w1e3',
            question: 'Which is a complete sentence?',
            options: ['Running fast.', 'The dog.', 'She runs fast.', 'Very happy.'],
            correctAnswer: 'She runs fast.',
            explanation: '"She runs fast" memiliki Subject (She) dan Verb (runs) yang lengkap.',
          },
        ],
      },
      {
        id: 'w2',
        title: 'Descriptive Writing',
        description: 'Cara mendeskripsikan orang, tempat, dan benda.',
        duration: '15 menit',
        isLocked: false,
        content: {
          introduction: 'Descriptive writing menggambarkan sesuatu secara detail menggunakan adjective.',
          sections: [
            {
              title: 'Menggunakan Adjective',
              body: 'Adjective diletakkan sebelum noun atau setelah verb "to be".\n\nContoh:\n• A beautiful flower.\n• The sky is blue.\n• She has long hair.',
            },
            {
              title: 'Tips Menulis Deskripsi',
              body: '• Gunakan kata sifat yang spesifik\n• Deskripsikan dari umum ke khusus\n• Gunakan indera (sight, sound, smell, taste, touch)',
            },
          ],
        },
        exercises: [
          {
            id: 'w2e1',
            question: 'Which uses adjective correctly?',
            options: ['The flower beautiful.', 'Beautiful the flower.', 'The beautiful flower blooms.', 'Blooms flower beautiful.'],
            correctAnswer: 'The beautiful flower blooms.',
            explanation: 'Adjective "beautiful" diletakkan sebelum noun "flower".',
          },
          {
            id: 'w2e2',
            question: '"The weather is ___ today."',
            options: ['run', 'sunny', 'quickly', 'eating'],
            correctAnswer: 'sunny',
            explanation: '"Sunny" adalah adjective yang tepat untuk cuaca.',
          },
        ],
      },
      {
        id: 'w3',
        title: 'Paragraph Writing',
        description: 'Menyusun paragraf yang baik dan terstruktur.',
        duration: '20 menit',
        isLocked: true,
        content: { introduction: '', sections: [] },
        exercises: [],
      },
    ],
  },

  Listening: {
    icon: '🎧',
    color: '#FFF3E0',
    accentColor: '#FF9800',
    description: 'Dengarkan kalimat dan latih kemampuan listening kamu.',
    exerciseType: 'listening',
    chapters: [
      {
        id: 'l1',
        title: 'Everyday Conversations',
        description: 'Dengarkan percakapan sehari-hari dalam bahasa Inggris.',
        duration: '10 menit',
        isLocked: false,
        content: {
          introduction: 'Percakapan sehari-hari menggunakan ekspresi dan kosakata yang umum dipakai.',
          sections: [
            {
              title: 'Greetings & Introductions',
              body: 'Ekspresi umum dalam percakapan:\n\n• "How are you?" → "I\'m fine, thank you."\n• "Nice to meet you." → "Nice to meet you too."\n• "What do you do?" → "I am a student."',
            },
            {
              title: 'Asking for Information',
              body: '• "Where is the library?" → "It\'s on the second floor."\n• "What time is it?" → "It\'s 3 o\'clock."\n• "Can you repeat that?" → "Of course!"',
            },
          ],
        },
        exercises: [
          {
            id: 'l1e1',
            audioText: 'How are you today?',
            hint: '3 kata — sapaan umum',
            correctAnswer: 'How are you today?',
            explanation: 'Kalimat sapaan: "How are you today?" artinya "Apa kabar hari ini?"',
          },
          {
            id: 'l1e2',
            audioText: 'Nice to meet you.',
            hint: '4 kata — ekspresi perkenalan',
            correctAnswer: 'Nice to meet you.',
            explanation: '"Nice to meet you" digunakan saat pertama kali bertemu seseorang.',
          },
          {
            id: 'l1e3',
            audioText: 'Can you repeat that please?',
            hint: '5 kata — meminta pengulangan',
            correctAnswer: 'Can you repeat that please?',
            explanation: '"Can you repeat that?" digunakan ketika kita tidak mendengar dengan jelas.',
          },
        ],
      },
      {
        id: 'l2',
        title: 'Numbers & Time',
        description: 'Dengarkan dan tuliskan angka serta waktu.',
        duration: '12 menit',
        isLocked: false,
        content: {
          introduction: 'Angka dan waktu sering muncul dalam percakapan sehari-hari.',
          sections: [
            {
              title: 'Menyebut Waktu',
              body: '• 3:00 → "It\'s three o\'clock"\n• 3:15 → "It\'s quarter past three"\n• 3:30 → "It\'s half past three"\n• 3:45 → "It\'s quarter to four"',
            },
          ],
        },
        exercises: [
          {
            id: 'l2e1',
            audioText: 'It is half past three.',
            hint: '5 kata — menyebut waktu',
            correctAnswer: 'It is half past three.',
            explanation: '"Half past three" = pukul 3:30.',
          },
          {
            id: 'l2e2',
            audioText: 'The meeting starts at nine o clock.',
            hint: '7 kata — waktu meeting',
            correctAnswer: 'The meeting starts at nine o clock.',
            explanation: '"Nine o\'clock" = pukul 9:00.',
          },
        ],
      },
      {
        id: 'l3',
        title: 'Short Dialogues',
        description: 'Dengarkan dialog pendek dan tuliskan kalimatnya.',
        duration: '15 menit',
        isLocked: true,
        content: { introduction: '', sections: [] },
        exercises: [],
      },
    ],
  },

  Reading: {
  icon: '📖',
  color: '#F3E5F5',
  accentColor: '#9C27B0',
  description: 'Tingkatkan pemahaman membaca teks bahasa Inggris.',
  exerciseType: 'reading',
  chapters: [
    {
      id: 'r1',
      title: 'Short Stories',
      description: 'Membaca dan memahami cerita pendek sederhana.',
      duration: '12 menit',
      isLocked: false,
      content: {
        introduction: 'Membaca cerita pendek membantu memperluas kosakata dan pemahaman.',
        sections: [
          {
            title: 'The Lost Cat',
            body: 'Tom has a cat named Whiskers. One day, Whiskers ran out of the house. Tom looked everywhere — in the garden, under the bed, and behind the sofa. Finally, he found Whiskers sleeping in a basket in the kitchen.\n\n"You scared me!" said Tom. Whiskers just purred and went back to sleep.',
          },
          {
            title: 'Kosakata Baru',
            body: '• Lost = Hilang\n• Ran out = Berlari keluar\n• Everywhere = Di mana-mana\n• Finally = Akhirnya\n• Scared = Khawatir\n• Purred = Mendengkur',
          },
        ],
      },
      readingText: 'Tom has a cat named Whiskers. One day, Whiskers ran out of the house. Tom looked everywhere — in the garden, under the bed, and behind the sofa. Finally, he found Whiskers sleeping in a basket in the kitchen. "You scared me!" said Tom. Whiskers just purred and went back to sleep.',
      exercises: [
        {
          id: 'r1e1',
          type: 'multiple_choice',
          question: 'Where did Tom find Whiskers?',
          options: ['In the garden', 'Under the bed', 'In a basket in the kitchen', 'Behind the sofa'],
          correctAnswer: 'In a basket in the kitchen',
          explanation: 'Dari teks: "he found Whiskers sleeping in a basket in the kitchen".',
        },
        {
          id: 'r1e2',
          type: 'multiple_choice',
          question: 'What did Whiskers do after Tom found him?',
          options: ['Ran away again', 'Ate some food', 'Purred and went back to sleep', 'Jumped out the window'],
          correctAnswer: 'Purred and went back to sleep',
          explanation: 'Dari teks: "Whiskers just purred and went back to sleep".',
        },
        {
          id: 'r1e3',
          type: 'fill_blank',
          instruction: 'Lengkapi kalimat berdasarkan teks di atas:',
          sentence: 'Tom has a cat named ___.',
          correctAnswer: 'Whiskers',
          hint: 'Nama kucing Tom (1 kata)',
          explanation: 'Dari kalimat pertama: "Tom has a cat named Whiskers".',
        },
        {
          id: 'r1e4',
          type: 'fill_blank',
          instruction: 'Lengkapi kalimat berdasarkan teks di atas:',
          sentence: 'Tom looked ___ for his cat.',
          correctAnswer: 'everywhere',
          hint: 'Artinya "di mana-mana" (1 kata)',
          explanation: '"Everywhere" berarti Tom mencari di semua tempat.',
        },
      ],
    },
    {
      id: 'r2',
      title: 'News Articles',
      description: 'Membaca dan memahami artikel berita sederhana.',
      duration: '15 menit',
      isLocked: false,
      content: {
        introduction: 'Artikel berita menggunakan bahasa formal dan kosakata yang beragam.',
        sections: [
          {
            title: 'Struktur Artikel Berita',
            body: '1. Headline (Judul) — menarik perhatian\n2. Lead (Pembuka) — siapa, apa, kapan, di mana\n3. Body (Isi) — detail informasi\n4. Conclusion (Penutup) — rangkuman',
          },
        ],
      },
      readingText: 'A new public library opened in the city of Bandung last Monday. The library has three floors and contains more than 50,000 books. It also has a digital reading room with free internet access. The mayor said, "We hope this library will encourage more people to read." The library is open every day from 8 AM to 9 PM and is free for all visitors.',
      exercises: [
        {
          id: 'r2e1',
          type: 'multiple_choice',
          question: 'Where did the new library open?',
          options: ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta'],
          correctAnswer: 'Bandung',
          explanation: 'Dari teks: "A new public library opened in the city of Bandung".',
        },
        {
          id: 'r2e2',
          type: 'multiple_choice',
          question: 'How many books does the library contain?',
          options: ['More than 5,000', 'More than 50,000', 'More than 500,000', 'Exactly 50,000'],
          correctAnswer: 'More than 50,000',
          explanation: 'Dari teks: "contains more than 50,000 books".',
        },
        {
          id: 'r2e3',
          type: 'fill_blank',
          instruction: 'Lengkapi kalimat berdasarkan teks di atas:',
          sentence: 'The library is open every day from 8 AM to ___ PM.',
          correctAnswer: '9',
          hint: 'Jam tutup perpustakaan (angka)',
          explanation: 'Dari teks: "open every day from 8 AM to 9 PM".',
        },
        {
          id: 'r2e4',
          type: 'fill_blank',
          instruction: 'Lengkapi kalimat berdasarkan teks di atas:',
          sentence: 'The library has a ___ reading room with free internet.',
          correctAnswer: 'digital',
          hint: 'Kata sifat untuk ruang baca modern (1 kata)',
          explanation: 'Dari teks: "a digital reading room with free internet access".',
        },
      ],
    },
    {
      id: 'r3',
      title: 'Academic Texts',
      description: 'Memahami teks akademik tingkat dasar.',
      duration: '20 menit',
      isLocked: true,
      content: { introduction: '', sections: [] },
      readingText: '',
      exercises: [],
    },
  ],
},
};

export default courseData;