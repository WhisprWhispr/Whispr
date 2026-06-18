import { db } from './firebase-config.js';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const topicConfig = {
  "Tanya Apa Saja 💬": { primary: "#3b82f6", dark: "#2563eb", bg: "#eff6ff", music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  "Roast Aku 🔥": { primary: "#ef4444", dark: "#dc2626", bg: "#fef2f2", music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  "Kasih Feedback 📝": { primary: "#10b981", dark: "#059669", bg: "#ecfdf5", music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  "Ungkapkan Perasaan 💌": { primary: "#f43f5e", dark: "#e11d48", bg: "#fff1f2", music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  "Kritik & Saran 🎯": { primary: "#8b5cf6", dark: "#7c3aed", bg: "#f5f3ff", music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  "Cerita Dong 👂": { primary: "#f59e0b", dark: "#d97706", bg: "#fffbeb", music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  "Random 🎲": { primary: "#14b8a6", dark: "#0d9488", bg: "#f0fdfa", music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
};

document.addEventListener('DOMContentLoaded', () => {
  
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
      if (topicSection) topicSection.classList.remove('hide');
    }

    // Topic card click
    topicCards.forEach(card => {
      card.addEventListener('click', async () => {
        // Highlight selected
        topicCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Save topic & proceed after a brief delay
        const topic = card.dataset.topic;
        localStorage.setItem('ngl_topic', topic);
        const username = localStorage.getItem('ngl_username');
        
        // Fire and forget to avoid hanging if Firebase config is invalid
        setDoc(doc(db, "users", username), { activeTopic: topic }, { merge: true }).catch(e => {
          console.error("Error saving topic to DB", e);
        });

        // Clear inbox when topic changes
        clearUserInbox(username);

        setTimeout(() => {
          showLinkSection(username);
        }, 400);
      });
    });

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
        copyBtn.textContent = 'Copied!';
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
      const topicLine = (topic && topic !== 'none') ? `\nTopik: ${topic}\n` : '\n\n';
      const waText = `Halo! Saya sangat menghargai feedback, kritik, atau pesan jujur dari Anda secara anonim.${topicLine}Silakan sampaikan pesan rahasia Anda melalui link Whispr saya di sini:\n${link}`;
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

    if (!targetUser) {
      targetUsernameDisplay.textContent = 'Unknown User';
      sendBtn.disabled = true;
      messageInput.disabled = true;
      messageInput.placeholder = 'Invalid link.';
    } else {
      targetUsernameDisplay.textContent = targetUser;
      
      // Async validation of topic
      validateTopic(targetUser, topicParam);
    }

    async function validateTopic(username, currentTopicParam) {
      // 1. Show topic badge and apply theme IMMEDIATELY for responsive UI
      if (currentTopicParam && topicBadgeWrap) {
        topicBadgeWrap.innerHTML = `<div class="topic-badge">${currentTopicParam}</div>`;
        messageInput.placeholder = `Tulis pesan tentang "${currentTopicParam}" secara anonim...`;
        
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
            topicBadgeWrap.innerHTML = `<div class="topic-badge" style="background:#fee2e2; color:#dc2626; box-shadow:none;">Sesi Berakhir 🔒</div>`;
          }
          sendBtn.disabled = true;
          messageInput.disabled = true;
          messageInput.placeholder = "Maaf, link ini sudah tidak valid. Pengguna telah mengganti topik diskusinya.";
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
          <h3>Sent! 🤫</h3>
          <p>Your anonymous message has been sent to ${targetUser}.</p>
          <a href="index.html" class="btn btn-secondary" style="margin-top: 20px;">Get your own link</a>
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
            <p>No messages yet. Share your link to get some!</p>
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
          <button class="share-msg-btn" data-index="${index}">Bagikan ke IG Story 📸</button>
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
                alert("Gagal memproses gambar.");
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
            alert("Gagal membuat gambar.");
          }
        });
      });
    }, (error) => {
      console.error("Error fetching messages: ", error);
      messageList.innerHTML = `
        <div class="empty-state">
          <p>Error loading messages. Did you configure Firestore?</p>
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
