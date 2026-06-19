import { db } from './firebase-config.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { translations } from './translations.js';

const topicList = [
  // Original / Classic Topics (7)
  "Tanya Apa Saja 💬", "Roast Aku 🔥", "Kasih Feedback 📝", 
  "Ungkapkan Perasaan 💌", "Kritik & Saran 🎯", "Cerita Dong 👂", "Random 🎲",

  // Deep Talk (20)
  "Apa ketakutan terbesarmu? 👻", "Pernah merasa kesepian di keramaian? 🌌", "Apa arti sukses buatmu? 🚀",
  "Pelajaran hidup paling berharga? 📚", "Kalau bisa ulang waktu, mau ke kapan? ⏳", "Apa yang bikin kamu overthinking? 🤯",
  "Pernah dikhianati teman terdekat? 💔", "Hal yang paling disesali? 🥀", "Momen paling membahagiakan? ✨",
  "Kapan terakhir kali kamu menangis? 😢", "Sifat buruk yang pengen diubah? 🔄", "Pernah merasa salah jurusan/karir? 🛤️",
  "Apa mimpimu yang belum tercapai? 💭", "Satu rahasia yang gak ada yang tau? 🤫", "Lebih milih dicintai atau mencintai? ❤️",
  "Definisi sahabat sejati menurutmu? 🤝", "Pernah di fase terendah dalam hidup? 📉", "Siapa orang paling berpengaruh buatmu? 👑",
  "Hal yang paling kamu syukuri hari ini? 🙏", "Pernah merasa gak cukup baik? 🥀",

  // Spicy / Roasts (20)
  "Roast gaya pakaianku dong 🔥", "Apa first impression kalian tentang aku? 🫣", "Sifatku yang paling nyebelin? 🤬",
  "Jujur, pernah sebal sama aku gak? 😤", "Kalau aku artis, cocoknya jadi apa? 🎬", "Menurutmu aku tipe yang kayak gimana? 🤔",
  "Rating penampilanku dari 1-10? 💯", "Kalo aku karakter film, aku siapa? 🦸", "Kebiasaan anehku yang kamu tau? 👽",
  "Apa hal paling cringy yang pernah aku lakuin? 😬", "Berani jujur tentang keburukanku? 😈", "Kapan aku kelihatan paling jelek? 🧟",
  "Kalo kita berantem, siapa yang menang? 🥊", "Satu kata yang ngegambarin aku banget? 🗣️", "Hal paling sok tahu yang pernah aku bilang? 🤓",
  "Pernah ngomongin aku di belakang? 👀", "Kalo aku hewan, aku hewan apa? 🐒", "Gaya bicaraku ngeselin gak sih? 🙊",
  "Pernah ilfeel sama aku gara-gara apa? 🤢", "Apa yang bikin aku kelihatan culun? 🤓",

  // Romance / Crush (20)
  "Spill inisial crush kamu dong 💘", "Kapan terakhir kali jatuh cinta? 😍", "Tipe idaman kamu kayak gimana? ✨",
  "Pernah suka sama pacar teman? 🫣", "Pilih LDR atau beda agama? 🛤️", "Satu hal yang bikin gampang baper? 🥰",
  "Pernah digosting gak? 👻", "Cara move on paling ampuh menurutmu? 🏃", "Mantan terindah atau gebetan baru? 🌹",
  "Red flag di pasangan yang gak bisa ditolerir? 🚩", "Green flag idaman kamu? 🍏", "Pernah selingkuh atau diselingkuhin? 💔",
  "First date ideal kamu ke mana? 🎡", "Lebih suka di-chat duluan atau nge-chat duluan? 📱", "Kata-kata gombalan andalanmu? 😏",
  "Pernah friendzone-in orang? 🙅‍♂️", "Terjebak friendzone itu rasanya gimana? 🌧️", "Kapan rencana mau nikah? 💍",
  "Lebih pilih pasangan good looking atau good rekening? 💸", "Pendapatmu soal balikan sama mantan? 🔄",

  // School / Work (20)
  "Pelajaran/Mata kuliah paling dibenci? 📚", "Pernah ketahuan nyontek? 👀", "Guru/Dosen paling killer? 👨‍🏫",
  "Momen paling memalukan di sekolah/kampus? 🫣", "Pilih IPK tinggi atau organisasi banyak? 🎓", "Pernah bolos sekolah/kerja? 🏃",
  "Teman sebangku paling ngeselin? 😤", "Pernah naksir teman sekelas? 💘", "Gaji pertama buat beli apa? 💰",
  "Rekan kerja paling toxic? 🐍", "Pernah dimarahin bos? 🤬", "Lebih suka WFH atau WFO? 🏠",
  "Jurusan impian vs kenyataan? 📉", "Pernah tidur pas kelas/meeting? 😴", "Skripsi/Tugas akhir udah sampai mana? 📑",
  "Tips bagi waktu belajar dan main? ⏳", "Pernah ngerasa salah pilih tempat kerja? 🏢", "Geng paling populer di sekolahmu dulu? 👑",
  "Pernah jadi anak kesayangan guru? 🍎", "Mata pelajaran yang kamu paling jago? 🥇",

  // Random / Fun (20)
  "Kalau menang lotre 1 milyar buat apa? 💰", "Pilih bisa terbang atau baca pikiran? 🦸", "Kalo dunia kiamat besok, mau ngapain? 🌋",
  "Teori konspirasi yang kamu percaya? 👽", "Makanan yang paling dibenci? 🥦", "Film/Series favorit sepanjang masa? 🎬",
  "Lagu yang lagi sering di-repeat? 🎵", "Karakter anime favoritmu? 🌸", "Kalo terdampar di pulau terpencil, bawa apa 3 barang? 🏝️",
  "Momen paling awkward hidupmu? 😬", "Phobia aneh yang kamu punya? 🕷️", "Tebak zodiakku apa? ⭐",
  "Hal terbodoh yang pernah dibeli? 🛍️", "Kalau bisa jadi hewan sehari, mau jadi apa? 🐈", "Genre musik favoritmu? 🎸",
  "Punya keahlian tersembunyi apa? 🤹", "Apa kebiasaan anehmu sebelum tidur? 🛌", "Lebih pilih mandi air dingin atau panas? 🚿",
  "Tim bubur diaduk atau gak diaduk? 🥣", "Suka makan nanas di pizza gak? 🍕",

  // Feedback / Advice (20)
  "Minta saran lagu galau dong 🎧", "Rekomendasi tempat nongkrong asik? ☕", "Saran buat aku biar lebih produktif? 📈",
  "Kritik pedas buat aku dong 🌶️", "Menurutmu aku kurang apa? 🤔", "Saran skincare buat kulit berjerawat? 🧴",
  "Rekomendasi film Netflix yang seru? 🍿", "Kasih masukan buat gaya rambutku dong 💇", "Saran buku yang mengubah hidupmu? 📖",
  "Minta wejangan hidup dong tetua 👴", "Rekomendasi game PC/HP yang seru? 🎮", "Saran buat aku yang lagi overthinking? 🧠",
  "Menurutmu aku harus berubah jadi apa? 🦋", "Rekomendasi makanan enak di kotamu? 🍜", "Saran kado buat pacar? 🎁",
  "Tips hemat uang anak kos? 💸", "Menurutmu aku cocoknya kerja apa? 💼", "Kasih masukan buat konten media sosialku? 📱",
  "Tips biar pede ngomong di depan umum? 🎤", "Saran cara menghadapi orang toxic? 🛡️",

  // Would You Rather (20)
  "Pilih kaya tapi jelek atau miskin tapi cakep? 🎭", "Pilih hidup selamanya atau mati besok? 💀", "Pilih gak bisa internet 1 bulan atau gak mandi 1 bulan? 📵",
  "Pilih tau kapan meninggal atau cara meninggal? ⏳", "Pilih teman sedikt tapi solid atau banyak tapi fake? 🤝", "Pilih jadi superhero atau supervillain? 🦸‍♂️",
  "Pilih hilang ingatan atau gak bisa buat ingatan baru? 🧠", "Pilih makan enak tapi pedas gila atau hambar? 🌶️", "Pilih selalu telat 10 menit atau kepagian 20 menit? ⏰",
  "Pilih baca pikiran orang atau bisa teleportasi? 🚪", "Pilih ketemu alien atau ketemu hantu? 👻", "Pilih kaya raya tapi kesepian atau pas-pasan tapi bahagia? 💰",
  "Pilih terkenal tapi dibenci atau orang biasa tapi disayang? 🌟", "Pilih kembali ke masa lalu atau lihat masa depan? 🕰️", "Pilih buta warna atau kehilangan indra perasa? 👅",
  "Pilih selalu kepanasan atau selalu kedinginan? ❄️", "Pilih bisa ngomong sama hewan atau ngomong semua bahasa manusia? 🐾", "Pilih jadi jenius tapi ansos atau bodoh tapi super populer? 🤓",
  "Pilih kejebak di hutan atau di tengah laut? 🌊", "Pilih handphone selalu baterai 10% atau internet selalu lemot? 🐢",

  // Confessions (20)
  "Confess rahasia terbesar kamu di sini 🤫", "Pernah ngambil barang orang diem-diem? 🕵️", "Dosa terbesar yang pernah kamu lakuin? 😈",
  "Pernah bohongin orang tua soal apa? 🤥", "Siapa orang yang diam-diam kamu benci? 😡", "Pernah nge-stalk mantan sampai akar? 🔍",
  "Hal paling memalukan yang gak ada yang tau? 🫣", "Pernah nangis di kamar mandi gara-gara apa? 🚿", "Kebohongan terbesar yang pernah kamu bilang ke aku? 🤥",
  "Pernah pura-pura sakit buat bolos? 🤒", "Hal paling berani yang pernah dilakuin? 🦁", "Pernah punya pikiran jahat ke orang lain? 🧠",
  "Apa hal ilegal yang pernah kamu lakukan? 🚨", "Pernah selingkuh dari sahabat sendiri? 🎭", "Siapa cinta pertamamu? 💖",
  "Pernah pakai akun fake buat hate comment? 👤", "Hal paling bodoh yang dilakuin demi cinta? 💘", "Pernah nyesel kenal sama seseorang? Siapa? 🥀",
  "Apa kebohongan yang kamu tulis di CV? 📄", "Pernah naksir guru atau dosen? 👨‍🏫",

  // Future / Dreams (20)
  "Dimana kamu lihat dirimu 5 tahun lagi? 🔭", "Negara impian yang pengen dikunjungi? ✈️", "Pekerjaan impian dari kecil? 👩‍🚀",
  "Apa goal terbesarmu tahun ini? 🎯", "Mau punya anak berapa nanti? 👶", "Rumah impian kamu kayak gimana? 🏡",
  "Kalau udah kaya raya, mau ngapain? 💸", "Hal yang pengen dicapai sebelum umur 30? 🏆", "Mobil impianmu apa? 🏎️",
  "Pernah mimpi pengen jadi artis? 🌟", "Cita-cita yang tertunda? ⏳", "Masa pensiun pengennya di mana? 🌴",
  "Mau dikenang sebagai orang yang kayak gimana? 🗿", "Impian teraneh yang pernah kamu bayangin? 🦄", "Pernah bikin bucket list? Apa isinya? 📝",
  "Kalo besok kiamat, apa impian yang belum kesampaian? ☄️", "Harapan terbesar buat dirimu sendiri? ✨", "Skill baru yang pengen banget dipelajari? 🎸",
  "Pengen punya bisnis sendiri di bidang apa? 💼", "Kalau bisa mengubah dunia, apa yang diubah? 🌍",

  // Nostalgia / Past (20)
  "Kangen masa kecil bagian mananya? 🧸", "Mainan favorit pas masih kecil? 🚂", "Kartun minggu pagi favoritmu? 📺",
  "Jajanan SD yang paling dikangenin? 🍡", "Pernah dimarahin ortu gara-gara apa pas kecil? 🤬", "Cinta monyet pas SD/SMP? 🐒",
  "Kenangan paling indah di SMA? 🏫", "Tempat nongkrong favorit zaman dulu? 🏪", "Lagu kenangan zaman galau pertama kali? 🎧",
  "Pernah nulis diary? Apa isinya? 📓", "Gaya rambut paling memalukan zaman alay? 💇‍♂️", "Sosmed pertama yang kamu mainin? 📱",
  "Pernah ikut tren alay apa aja? ✌️", "Kenangan terindah sama mantan? 💔", "Teman masa kecil yang udah lost contact? 📞",
  "Barang peninggalan mantan yang masih disimpan? 🎁", "Game warnet favorit zaman dulu? 🎮", "Pernah alay di Facebook/Twitter? 🐦",
  "Kejadian paling lucu pas zaman sekolah? 😂", "Kangen kumpul sama siapa yang sekarang udah susah? 👥"
];

const palettes = [
  { primary: "#3b82f6", dark: "#2563eb", bg: "#eff6ff" },
  { primary: "#ef4444", dark: "#dc2626", bg: "#fef2f2" },
  { primary: "#10b981", dark: "#059669", bg: "#ecfdf5" },
  { primary: "#f43f5e", dark: "#e11d48", bg: "#fff1f2" },
  { primary: "#8b5cf6", dark: "#7c3aed", bg: "#f5f3ff" },
  { primary: "#f59e0b", dark: "#d97706", bg: "#fffbeb" },
  { primary: "#14b8a6", dark: "#0d9488", bg: "#f0fdfa" },
  { primary: "#ec4899", dark: "#db2777", bg: "#fdf2f8" },
  { primary: "#6366f1", dark: "#4f46e5", bg: "#eef2ff" },
  { primary: "#eab308", dark: "#ca8a04", bg: "#fefce8" }
];

const topicConfig = {};

topicList.forEach((topic, index) => {
  const palette = palettes[index % palettes.length];
  topicConfig[topic] = {
    ...palette,
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  };
});

document.addEventListener('DOMContentLoaded', () => {
  
  // --- GLOBAL PREVENTIONS & THEME ---
  document.addEventListener('contextmenu', e => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
  });
  document.addEventListener('copy', e => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
  });
  document.addEventListener('cut', e => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
  });

  const themeBtns = document.querySelectorAll('.theme-btn');
  const applyTheme = (themeValue) => {
    if (themeValue === 'dark') {
      document.body.dataset.theme = 'dark';
    } else if (themeValue === 'light') {
      document.body.dataset.theme = 'light';
    } else if (themeValue === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.dataset.theme = 'dark';
      } else {
        document.body.dataset.theme = 'light';
      }
    } else if (themeValue === 'auto') {
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) {
        document.body.dataset.theme = 'dark';
      } else {
        document.body.dataset.theme = 'light';
      }
    }
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('ngl_theme') || 'system';
    applyTheme(savedTheme);
    if (themeBtns.length > 0) {
      themeBtns.forEach(btn => {
        if (btn.dataset.themeVal === savedTheme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  };

  initTheme();

  // --- I18N LOGIC ---
  let currentLang = localStorage.getItem('ngl_lang') || 'id';
  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en']?.[key] || key;
  };

  const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = t(key);
    });
  };

  const initI18n = () => {
    applyTranslations();
    const langBtns = document.querySelectorAll('.lang-btn');
    if (langBtns.length > 0) {
      langBtns.forEach(btn => {
        if (btn.dataset.langVal === currentLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
        btn.addEventListener('click', () => {
          if (currentLang !== btn.dataset.langVal) {
            localStorage.setItem('ngl_lang', btn.dataset.langVal);
            window.location.reload();
          }
        });
      });
    }
  };

  initI18n();
  if (themeBtns.length > 0) {
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const themeVal = btn.dataset.themeVal;
        localStorage.setItem('ngl_theme', themeVal);
        applyTheme(themeVal);
      });
    });
  }

  // --- INDEX PAGE LOGIC ---
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username-input');
  const topicSection = document.getElementById('topic-section');
  const linkSection = document.getElementById('link-section');
  const generatedLink = document.getElementById('generated-link');
  const copyBtn = document.getElementById('copy-btn');
  const viewInboxBtn = document.getElementById('view-inbox-btn');
  const qrCodeImg = document.getElementById('qr-code-img');
  const waShareBtn = document.getElementById('wa-share-btn');
  const topicCards = document.querySelectorAll('.topic-card');
  const skipTopicBtn = document.getElementById('skip-topic-btn');
  const changeTopicBtn = document.getElementById('change-topic-btn');

  if (loginForm) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === '1') {
      localStorage.removeItem('ngl_username');
      localStorage.removeItem('ngl_topic');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if user is already logged in
    const savedUser = localStorage.getItem('ngl_username');
    if (savedUser) {
      const savedTopic = localStorage.getItem('ngl_topic');
      if (savedTopic) {
        showLinkSection(savedUser);
      } else {
        showTopicSection();
      }
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let baseUsername = usernameInput.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (baseUsername) {
        // Add a random 4-digit number to make it unique
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const uniqueUsername = `${baseUsername}-${randomSuffix}`;
        localStorage.setItem('ngl_username', uniqueUsername);
        showTopicSection();
      }
    });

    function showTopicSection() {
      loginForm.classList.add('hide');
      if (topicSection) {
        topicSection.classList.remove('hide');
        renderTopics();
      }
    }

    function renderTopics() {
      const grid = document.getElementById('dynamic-topic-grid');
      if (!grid) return;
      if (grid.children.length > 0) return; // Already rendered
      
      Object.keys(topicConfig).forEach(topic => {
        const btn = document.createElement('button');
        btn.className = 'topic-card';
        btn.dataset.topic = topic;
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'topic-icon';
        const emojiMatch = topic.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/);
        iconDiv.textContent = emojiMatch ? emojiMatch[0] : '💬';
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'topic-label';
        labelDiv.textContent = topic.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, '').trim();
        
        btn.appendChild(iconDiv);
        btn.appendChild(labelDiv);
        
        btn.addEventListener('click', async () => {
          document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
          btn.classList.add('selected');

          localStorage.setItem('ngl_topic', topic);
          const username = localStorage.getItem('ngl_username');
          
          setDoc(doc(db, "users", username), { activeTopic: topic }, { merge: true }).catch(e => {
            console.error("Error saving topic to DB", e);
          });

          clearUserInbox(username);

          setTimeout(() => {
            showLinkSection(username);
          }, 400);
        });
        
        grid.appendChild(btn);
      });
    }

    // Skip topic
    if (skipTopicBtn) {
      skipTopicBtn.addEventListener('click', () => {
        localStorage.setItem('ngl_topic', 'none');
        const username = localStorage.getItem('ngl_username');
        
        setDoc(doc(db, "users", username), { activeTopic: 'none' }, { merge: true }).catch(e => {
          console.error("Error saving skip topic to DB", e);
        });

        // Clear inbox when topic changes
        clearUserInbox(username);

        showLinkSection(username);
      });
    }

    if (changeTopicBtn) {
      changeTopicBtn.addEventListener('click', () => {
        linkSection.classList.add('hide');
        topicSection.classList.remove('hide');
      });
    }

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(generatedLink.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = t('link.copied');
        setTimeout(() => copyBtn.textContent = originalText, 2000);
      });
    });

    function showLinkSection(username) {
      if (topicSection) topicSection.classList.add('hide');
      loginForm.classList.add('hide');
      linkSection.classList.remove('hide');
      // Create the link (using current origin), append topic if set
      const topic = localStorage.getItem('ngl_topic');
      const topicParam = (topic && topic !== 'none') ? `&t=${encodeURIComponent(topic)}` : '';
      
      // Deteksi otomatis folder aktif (untuk GitHub Pages / subfolder)
      let currentPath = window.location.pathname;
      if (currentPath.endsWith('.html')) {
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      } else if (!currentPath.endsWith('/')) {
        currentPath += '/';
      }
      
      const link = `${window.location.origin}${currentPath}send.html?u=${username}${topicParam}`;
      
      const linkDisplay = document.getElementById('generated-link');
      const qrCodeImg = document.getElementById('qr-code-img');
      linkDisplay.textContent = link;
      viewInboxBtn.href = 'inbox.html';

      // Set QR Code
      qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;

      // Build WhatsApp text with topic if available
      const topicLine = (topic && topic !== 'none') ? `\n${t('js.wa_topic')} ${topic}\n` : '\n\n';
      const waText = `${t('js.wa_text')}${topicLine}${t('js.wa_link')}\n${link}`;
      waShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    }

    async function clearUserInbox(username) {
      if (!username) return;
      try {
        const q = query(collection(db, "messages"), where("to", "==", username));
        const snapshot = await getDocs(q);
        snapshot.forEach((docSnap) => {
          deleteDoc(docSnap.ref).catch(e => console.warn("Failed to delete message", e));
        });
      } catch (e) {
        console.warn("Could not clear inbox (check rules or config)", e.message);
      }
    }
  }

  // --- SEND PAGE LOGIC ---
  const sendForm = document.getElementById('send-form');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const sendBtnText = document.getElementById('send-btn-text');
  const loader = document.querySelector('.loader');
  const targetUsernameDisplay = document.getElementById('target-username');
  
  // Unique Features
  const diceBtn = document.getElementById('dice-btn');
  const moodBtns = document.querySelectorAll('.mood-btn');
  let selectedMood = '';

  const randomPrompts = [
    "Apa hal paling memalukan yang pernah kamu lakukan?",
    "Siapa crush rahasiamu saat ini?",
    "Kalau kamu bisa memutar waktu, apa yang ingin kamu ubah?",
    "Jujur, apa first impression kamu ke aku?",
    "Pernah bohong soal apa baru-baru ini?",
    "Apa ketakutan terbesarmu yang jarang orang tahu?",
    "Ceritain momen paling bahagia di hidupmu dong!",
    "Sebutkan 3 hal yang kamu sukai dari dirimu sendiri!"
  ];

  if (sendForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUser = urlParams.get('u');
    const topicParam = urlParams.get('t');
    const topicBadgeWrap = document.getElementById('topic-badge-wrap');
    const ownerInboxBtnWrap = document.getElementById('owner-inbox-btn-wrap');

    if (!targetUser) {
      targetUsernameDisplay.textContent = 'Unknown User';
      sendBtn.disabled = true;
      messageInput.disabled = true;
      messageInput.placeholder = t('send.invalid_link');
    } else {
      targetUsernameDisplay.textContent = targetUser;
      
      // If the viewer is the owner of the link, show the "Lihat Inbox Saya" button
      const viewerUser = localStorage.getItem('ngl_username');
      if (viewerUser && viewerUser === targetUser && ownerInboxBtnWrap) {
        ownerInboxBtnWrap.classList.remove('hide');
      }
      
      // Async validation of topic
      validateTopic(targetUser, topicParam);
    }

    async function validateTopic(username, currentTopicParam) {
      // 1. Show topic badge and apply theme IMMEDIATELY for responsive UI
      if (currentTopicParam && topicBadgeWrap) {
        topicBadgeWrap.innerHTML = `<div class="topic-badge">${currentTopicParam}</div>`;
        messageInput.placeholder = t('send.placeholder');
        
        const theme = topicConfig[currentTopicParam];
        if (theme) {
          document.documentElement.style.setProperty('--primary', theme.primary);
          document.documentElement.style.setProperty('--primary-dark', theme.dark);
          document.documentElement.style.setProperty('--bg-color', theme.bg);
          
          const audio = new Audio(theme.music);
          audio.loop = true;
          
          const playMusic = () => {
            audio.play().catch(() => console.log("Autoplay blocked or audio failed"));
            document.removeEventListener('click', playMusic);
            document.removeEventListener('keydown', playMusic);
          };
          document.addEventListener('click', playMusic);
          document.addEventListener('keydown', playMusic);
        }
      }

      // 2. Validate against Firestore asynchronously
      try {
        const userDocRef = doc(db, "users", username);
        // Timeout wrapper so it doesn't hang forever if config is dummy
        const userDocSnap = await Promise.race([
          getDoc(userDocRef),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
        ]);
        
        let activeTopic = 'none';
        if (userDocSnap.exists()) {
          activeTopic = userDocSnap.data().activeTopic || 'none';
        }
        
        const currentUrlTopic = currentTopicParam || 'none';

        if (currentUrlTopic !== activeTopic) {
          // INVALID LINK (Topic changed)
          if (topicBadgeWrap) {
            topicBadgeWrap.innerHTML = `<div class="topic-badge" style="background:#fee2e2; color:#dc2626; box-shadow:none;">${t('js.topic_ended')}</div>`;
          }
          sendBtn.disabled = true;
          messageInput.disabled = true;
          messageInput.placeholder = t('js.topic_invalid');
        }
      } catch (e) {
        console.warn("Topic validation skipped or timed out (check Firebase config).", e.message);
      }
    }

    // Mood selector logic
    moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('selected')) {
          btn.classList.remove('selected');
          selectedMood = '';
        } else {
          moodBtns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedMood = btn.dataset.mood;
        }
      });
    });

    // Dice roll logic
    if (diceBtn) {
      diceBtn.addEventListener('click', () => {
        const randomItem = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
        messageInput.value = randomItem;
      });
    }

    sendForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = messageInput.value.trim();
      if (!message || !targetUser) return;

      // UI Loading state
      sendBtn.disabled = true;
      sendBtnText.textContent = 'Sending...';
      loader.classList.add('active');

      try {
        await addDoc(collection(db, "messages"), {
          to: targetUser,
          text: message,
          mood: selectedMood,
          timestamp: serverTimestamp()
        });
        
        // Success state
        sendForm.innerHTML = `
          <h3>${t('send.success_title')}</h3>
          <p>${t('send.success_desc')} ${targetUser}.</p>
          <a href="index.html?new=1" class="btn btn-secondary" style="margin-top: 20px;">${t('nav.create_link')}</a>
        `;
      } catch (error) {
        console.error("Error sending message: ", error);
        alert("Failed to send message. Check console or Firebase config.");
        sendBtn.disabled = false;
        sendBtnText.textContent = 'Send anonymously';
        loader.classList.remove('active');
      }
    });
  }

  // --- INBOX PAGE LOGIC ---
  const messageList = document.getElementById('message-list');
  const inboxUsernameDisplay = document.getElementById('inbox-username');
  
  // Share Modal Elements
  const shareModal = document.getElementById('share-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const canvasPreviewContainer = document.getElementById('canvas-preview-container');
  const downloadImgBtn = document.getElementById('download-img-btn');
  const exportTemplate = document.getElementById('export-template');
  const exportMood = document.getElementById('export-mood');
  const exportText = document.getElementById('export-text');
  const exportTime = document.getElementById('export-time');
  const exportUsername = document.getElementById('export-username');

  if (shareModal) {
    closeModalBtn.addEventListener('click', () => {
      shareModal.classList.add('hide');
    });
  }

  if (messageList) {
    const savedUser = localStorage.getItem('ngl_username');
    if (!savedUser) {
      window.location.href = 'index.html'; // Redirect to login
      return;
    }

    inboxUsernameDisplay.textContent = `@${savedUser}`;

    const q = query(
      collection(db, "messages"), 
      where("to", "==", savedUser)
    );

    // Listen for real-time updates
    onSnapshot(q, (snapshot) => {
      messageList.innerHTML = ''; // Clear current
      
      if (snapshot.empty) {
        messageList.innerHTML = `
          <div class="empty-state">
            <p>${t('inbox.empty')}</p>
          </div>
        `;
        return;
      }

      // Sort locally to avoid Firestore composite index requirement
      const docs = [];
      snapshot.forEach(doc => docs.push(doc.data()));
      docs.sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
        const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
        return timeB - timeA;
      });

      docs.forEach((data, index) => {
        const date = data.timestamp ? data.timestamp.toDate().toLocaleString() : 'Just now';
        const moodHtml = data.mood ? `<div class="message-mood">${data.mood}</div>` : '';
        
        const card = document.createElement('div');
        card.className = 'message-card';
        card.innerHTML = `
          ${moodHtml}
          <div class="message-text">${escapeHTML(data.text)}</div>
          <div class="message-time">${date}</div>
          <button class="share-msg-btn" data-index="${index}">${t('inbox.share_ig')}</button>
        `;
        messageList.appendChild(card);
      });

      // Attach share logic
      document.querySelectorAll('.share-msg-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const idx = e.target.dataset.index;
          const msg = docs[idx];
          
          // Populate hidden template
          exportText.textContent = msg.text;
          exportMood.textContent = msg.mood || '';
          exportTime.textContent = msg.timestamp ? msg.timestamp.toDate().toLocaleString() : 'Just now';
          exportUsername.textContent = `@${savedUser}`;
          
          // Show briefly offscreen to render
          exportTemplate.classList.remove('hide');
          
          try {
            // Generate canvas
            const canvas = await html2canvas(exportTemplate.querySelector('.export-bg'), {
              scale: 1, // Keep scale reasonable
              useCORS: true,
              backgroundColor: null
            });
            
            // Hide template again
            exportTemplate.classList.add('hide');
            
            canvas.toBlob(async (blob) => {
              if (!blob) {
                alert(t('js.alert_fail'));
                return;
              }

              const file = new File([blob], `whispr-${Date.now()}.png`, { type: 'image/png' });
              const shareData = {
                files: [file]
              };

              // Coba gunakan Native Share API (Bisa langsung ke IG Story di HP)
              if (navigator.canShare && navigator.canShare(shareData)) {
                try {
                  await navigator.share(shareData);
                  console.log("Berhasil dibagikan!");
                } catch (err) {
                  console.log("Share dibatalkan atau gagal", err);
                }
              } else {
                // Fallback: Jika dibuka di Laptop/Browser lama, tampilkan Modal Download
                canvasPreviewContainer.innerHTML = '';
                canvasPreviewContainer.appendChild(canvas);
                shareModal.classList.remove('hide');
                
                downloadImgBtn.onclick = () => {
                  const link = document.createElement('a');
                  link.download = `whispr-${savedUser}-${Date.now()}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                };
              }
            }, 'image/png');

          } catch (err) {
            console.error("Error generating image:", err);
            exportTemplate.classList.add('hide');
            alert(t('js.alert_fail'));
          }
        });
      });
    }, (error) => {
      console.error("Error fetching messages: ", error);
      messageList.innerHTML = `
        <div class="empty-state">
          <p>${t('js.error_load')}</p>
        </div>
      `;
    });
  }

  // Utility to prevent XSS
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
