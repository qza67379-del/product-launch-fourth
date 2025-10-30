// 幻灯片管理
class SlideShow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.progressFill = document.querySelector('.progress-fill');
        this.currentPageEl = document.querySelector('.current-page');
        this.totalPagesEl = document.querySelector('.total-pages');
        this.navHint = document.querySelector('.nav-hint');
        
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.init();
    }
    
    init() {
        // 设置总页数
        this.totalPagesEl.textContent = this.totalSlides;
        
        // 绑定事件
        this.bindEvents();
        
        // 更新UI
        this.updateUI();
        
        // 3秒后隐藏导航提示
        setTimeout(() => {
            this.navHint.classList.add('hidden');
        }, 3000);
    }
    
    bindEvents() {
        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'Home') {
                this.goToSlide(0);
            } else if (e.key === 'End') {
                this.goToSlide(this.totalSlides - 1);
            }
        });
        
        // 按钮导航
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // 点击屏幕左右两侧导航
        document.addEventListener('click', (e) => {
            const clickX = e.clientX;
            const windowWidth = window.innerWidth;
            
            // 排除按钮点击
            if (e.target.closest('.nav-btn')) return;
            
            // 左侧1/4区域 - 上一页
            if (clickX < windowWidth / 4) {
                this.prevSlide();
            }
            // 右侧1/4区域 - 下一页
            else if (clickX > windowWidth * 3 / 4) {
                this.nextSlide();
            }
        });
        
        // 触摸滑动支持
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 向左滑动 - 下一页
                    this.nextSlide();
                } else {
                    // 向右滑动 - 上一页
                    this.prevSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        // 移除当前幻灯片的active类
        this.slides[this.currentSlide].classList.remove('active');
        
        // 添加prev类用于动画方向判断
        if (index < this.currentSlide) {
            this.slides[this.currentSlide].classList.add('prev');
        } else {
            this.slides[this.currentSlide].classList.remove('prev');
        }
        
        // 更新当前幻灯片索引
        this.currentSlide = index;
        
        // 添加新幻灯片的active类
        this.slides[this.currentSlide].classList.add('active');
        this.slides[this.currentSlide].classList.remove('prev');
        
        // 更新UI
        this.updateUI();
        
        // 添加页面切换动画
        this.animateSlideChange();
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    updateUI() {
        // 更新进度条
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // 更新页码
        this.currentPageEl.textContent = this.currentSlide + 1;
        
        // 更新按钮状态
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
    
    animateSlideChange() {
        // 为幻灯片内容添加进入动画
        const activeSlide = this.slides[this.currentSlide];
        const content = activeSlide.querySelector('.slide-content');
        
        // 移除并重新添加动画类以触发动画
        content.style.animation = 'none';
        setTimeout(() => {
            content.style.animation = '';
        }, 10);
    }
}


// 添加交互增强功能
function addInteractiveEnhancements() {
    // 为卡片添加悬停效果音效（可选）
    const cards = document.querySelectorAll('.goal-card, .feature-item, .opt-card, .demo-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // 为列表项添加渐入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.pain-points li, .feature-points li, .improvement-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
    
    // 添加全屏切换功能（按F键）
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 图片预览功能
let currentZoom = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

function openImageViewer(imageSrc) {
    const modal = document.getElementById('imageViewerModal');
    const img = document.getElementById('viewerImage');
    
    img.src = imageSrc;
    modal.classList.add('active');
    
    // 重置缩放和位置
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
    const modal = document.getElementById('imageViewerModal');
    modal.classList.remove('active');
    
    // 恢复背景滚动
    document.body.style.overflow = '';
}

function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.25, 5);
    updateImageTransform();
}

function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.25, 0.5);
    updateImageTransform();
}

function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
}

function updateImageTransform() {
    const img = document.getElementById('viewerImage');
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

// 图片拖动功能
document.addEventListener('DOMContentLoaded', () => {
    const slideShow = new SlideShow();
    addInteractiveEnhancements();
    
    const img = document.getElementById('viewerImage');
    
    // 鼠标拖动
    img.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            img.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            img.style.cursor = 'move';
        }
    });
    
    // 触摸拖动
    let touchStartX, touchStartY;
    
    img.addEventListener('touchstart', (e) => {
        if (currentZoom > 1 && e.touches.length === 1) {
            isDragging = true;
            touchStartX = e.touches[0].clientX - translateX;
            touchStartY = e.touches[0].clientY - translateY;
        }
    });
    
    img.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            e.preventDefault();
            translateX = e.touches[0].clientX - touchStartX;
            translateY = e.touches[0].clientY - touchStartY;
            updateImageTransform();
        }
    });
    
    img.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // 鼠标滚轮缩放
    const imageContent = document.querySelector('.image-viewer-content');
    imageContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    });
    
    // ESC键关闭预览
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('imageViewerModal');
            if (modal.classList.contains('active')) {
                closeImageViewer();
            }
        }
    });
});

// 添加一些实用的快捷键提示
console.log(`
%c🎯 工作流大升级 - 演讲报告 %c

快捷键：
  ← / → : 上一页 / 下一页
  空格键 : 下一页
  Home  : 第一页
  End   : 最后一页
  F     : 全屏切换
  ESC   : 关闭图片预览

图片预览：
  - 点击"查看详细图示"按钮打开图片
  - 使用控制按钮或鼠标滚轮缩放
  - 拖动图片查看不同区域
  - 点击关闭按钮或按ESC键退出
  
提示：
  - 点击屏幕左侧或右侧也可以翻页
  - 支持触摸滑动（移动设备）
  
`, 
'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;',
'color: #666; padding: 10px 0; font-size: 14px; line-height: 1.8;'
);
