// ========== IMAGE MANAGEMENT ==========
let imageList = [];
let currentPage = 1;
let dragStart = { x: 0, y: 0 };
let isDragging = false;

// Load images from images folder (or from uploaded files)
async function loadDefaultImages() {
    // Tạo danh sách ảnh mặc định từ folder images/
    const imageCount = 10; // Số ảnh mặc định
    imageList = [];
    
    for (let i = 1; i <= imageCount; i++) {
        imageList.push(`images/${i}.jpg`);
    }
    
    updateImageDisplay();
    updatePageInfo();
}

// ========== IMAGE DISPLAY ==========
function updateImageDisplay() {
    const img1 = document.getElementById('image-1');
    const img2 = document.getElementById('image-2');
    
    const leftIndex = (currentPage - 1) * 2;
    const rightIndex = (currentPage - 1) * 2 + 1;
    
    // Cập nhật ảnh bên trái
    if (leftIndex < imageList.length) {
        img1.src = imageList[leftIndex];
        img1.alt = `Ảnh ${leftIndex + 1}`;
    } else {
        img1.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22600%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EKhông có ảnh%3C/text%3E%3C/svg%3E';
    }
    
    // Cập nhật ảnh bên phải
    if (rightIndex < imageList.length) {
        img2.src = imageList[rightIndex];
        img2.alt = `Ảnh ${rightIndex + 1}`;
    } else {
        img2.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22600%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EKuối%3C/text%3E%3C/svg%3E';
    }
    
    // Cập nhật tên ảnh
    const imageName = document.getElementById('image-name');
    if (leftIndex < imageList.length) {
        imageName.textContent = `📷 ${imageList[leftIndex].split('/').pop()}`;
    } else {
        imageName.textContent = 'Hết ảnh';
    }
    
    // Thêm animation
    animatePageFlip();
}

function updatePageInfo() {
    const totalPages = Math.ceil(imageList.length / 2);
    document.getElementById('page-info').textContent = `${currentPage} / ${totalPages}`;
    document.getElementById('photo-count').textContent = `Tổng cộng: ${imageList.length} ảnh`;
}

// ========== NAVIGATION ==========
function nextPage() {
    const totalPages = Math.ceil(imageList.length / 2);
    if (currentPage < totalPages) {
        currentPage++;
        updateImageDisplay();
        updatePageInfo();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateImageDisplay();
        updatePageInfo();
    }
}

// ========== DRAG & SWIPE HANDLING ==========
const container = document.querySelector('.pageflip-container');

container.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    container.style.cursor = 'grabbing';
});

container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Chỉ xử lý kéo ngang (ngang hơn 30px)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
    }
});

container.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const deltaX = e.clientX - dragStart.x;
    const threshold = 50; // Threshold để kích hoạt lật trang
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            // Kéo sang phải = trang trước
            prevPage();
        } else {
            // Kéo sang trái = trang sau
            nextPage();
        }
    }
    
    container.style.cursor = 'grab';
});

container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.style.cursor = 'grab';
});

// ========== TOUCH SUPPORT (Mobile) ==========
container.addEventListener('touchstart', (e) => {
    dragStart.x = e.touches[0].clientX;
    dragStart.y = e.touches[0].clientY;
});

container.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - dragStart.x;
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            prevPage();
        } else {
            nextPage();
        }
    }
});

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevPage();
    } else if (e.key === 'ArrowRight') {
        nextPage();
    }
});

// ========== BUTTON CONTROLS ==========
document.getElementById('btn-prev').addEventListener('click', prevPage);
document.getElementById('btn-next').addEventListener('click', nextPage);

// Fullscreen toggle
document.getElementById('btn-fullscreen').addEventListener('click', () => {
    const container = document.querySelector('.pageflip-container');
    container.classList.toggle('fullscreen');
    
    if (container.classList.contains('fullscreen')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// ========== FILE UPLOAD ==========
document.getElementById('btn-upload').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    imageList = files.map(file => URL.createObjectURL(file));
    currentPage = 1;
    updateImageDisplay();
    updatePageInfo();
});

// ========== PAGE FLIP ANIMATION ==========
function animatePageFlip() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.animation = 'none';
        // Trigger reflow để restart animation
        void page.offsetWidth;
        page.style.animation = 'pageFlipIn 0.6s ease-out';
    });
}

// Thêm CSS animation vào style tag
const style = document.createElement('style');
style.textContent = `
    @keyframes pageFlipIn {
        0% {
            opacity: 0;
            transform: rotateY(90deg);
        }
        100% {
            opacity: 1;
            transform: rotateY(0deg);
        }
    }
`;
document.head.appendChild(style);

// ========== INITIALIZATION ==========
window.addEventListener('DOMContentLoaded', () => {
    loadDefaultImages();
});