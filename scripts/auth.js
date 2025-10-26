import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from './modules/firebase.js';
import {
    validateEmail,
    validatePassword,
    showNotification,
    debounce,
} from "./utils/helpers.js";

class AuthPage {
    constructor() {
        this.currentTab = "login";
        this.init();
    }

    init() {
        this.setupTabSwitching();
        this.setupFormSubmissions();
        this.setupPasswordToggles();
        this.setupPasswordStrength();
        this.setupGoogleAuth();
        this.checkAuthState();
        this.setupAnimations();
        this.setupAuthStateListener();
    }

    setupAuthStateListener() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                this.updateUIForLoggedInUser(user);
            } else {
                // User is signed out
                this.updateUIForLoggedOutUser();
            }
        });
    }

    updateUIForLoggedInUser(user) {
        // Update navigation
        const userAvatar = document.getElementById('user-avatar');
        const authBtn = document.getElementById('auth-btn');
        
        if (userAvatar && authBtn) {
            userAvatar.style.display = 'block';
            authBtn.style.display = 'none';
            
            // Update user avatar if available
            if (user.photoURL) {
                document.querySelector('.user-avatar img').src = user.photoURL;
            }
        }

        // If we're on auth page, redirect to home
        if (window.location.pathname.includes('auth.html')) {
            showNotification('أنت مسجل الدخول بالفعل!', false);
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        }
    }

    updateUIForLoggedOutUser() {
        const userAvatar = document.getElementById('user-avatar');
        const authBtn = document.getElementById('auth-btn');
        
        if (userAvatar && authBtn) {
            userAvatar.style.display = 'none';
            authBtn.style.display = 'flex';
        }
    }

    setupTabSwitching() {
        const tabBtns = document.querySelectorAll(".tab-btn");
        const switchLinks = document.querySelectorAll(".switch-link");

        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const targetTab = btn.dataset.tab;
                this.switchTab(targetTab);
            });
        });

        switchLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetTab = link.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        // تحديث الأزرار
        document.querySelectorAll(".tab-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.tab === tabName);
        });

        // تحديث النماذج
        document.querySelectorAll(".auth-form").forEach((form) => {
            form.classList.toggle("active", form.id === `${tabName}-form`);
        });

        this.currentTab = tabName;
        this.clearFormErrors();

        // إعادة تعيين النماذج عند التبديل
        if (tabName === "login") {
            document.getElementById("login-form").reset();
        } else {
            document.getElementById("register-form").reset();
            this.updatePasswordStrength("");
        }
    }

    setupFormSubmissions() {
        const loginForm = document.getElementById("login-form");
        const registerForm = document.getElementById("register-form");

        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    async handleLogin() {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();
        const rememberMe = document.getElementById("remember-me").checked;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        const submitBtn = document.querySelector("#login-form .btn-primary");
        this.setButtonLoading(submitBtn, true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            }

            showNotification("تم تسجيل الدخول بنجاح!", false);

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1500);
        } catch (error) {
            console.error("Login error:", error);
            this.handleAuthError(error);
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleRegister() {
        const name = document.getElementById("register-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();
        const confirmPassword = document
            .getElementById("register-confirm-password")
            .value.trim();
        const acceptTerms = document.getElementById("accept-terms").checked;

        if (
            !this.validateRegisterForm(
                name,
                email,
                password,
                confirmPassword,
                acceptTerms
            )
        ) {
            return;
        }

        const submitBtn = document.querySelector("#register-form .btn-primary");
        this.setButtonLoading(submitBtn, true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with name
            await updateProfile(user, {
                displayName: name
            });

            showNotification("تم إنشاء الحساب بنجاح!", false);

            setTimeout(() => {
                this.switchTab("login");
                showNotification("يمكنك الآن تسجيل الدخول بحسابك الجديد.");
            }, 1000);
        } catch (error) {
            console.error("Registration error:", error);
            this.handleAuthError(error);
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    handleAuthError(error) {
        let errorMessage = "حدث خطأ أثناء المصادقة. يرجى المحاولة مرة أخرى.";

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "البريد الإلكتروني مستخدم بالفعل.";
                break;
            case 'auth/invalid-email':
                errorMessage = "البريد الإلكتروني غير صحيح.";
                break;
            case 'auth/weak-password':
                errorMessage = "كلمة المرور ضعيفة. يجب أن تحتوي على 6 أحرف على الأقل.";
                break;
            case 'auth/user-not-found':
                errorMessage = "لا يوجد حساب مرتبط بهذا البريد الإلكتروني.";
                break;
            case 'auth/wrong-password':
                errorMessage = "كلمة المرور غير صحيحة.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "تم إجراء محاولات تسجيل دخول كثيرة. يرجى المحاولة لاحقاً.";
                break;
        }

        showNotification(errorMessage, true);
    }

    validateLoginForm(email, password) {
        this.clearFormErrors();

        let isValid = true;

        if (!email) {
            this.showFieldError("login-email", "البريد الإلكتروني مطلوب");
            isValid = false;
        } else if (!validateEmail(email)) {
            this.showFieldError("login-email", "البريد الإلكتروني غير صحيح");
            isValid = false;
        }

        if (!password) {
            this.showFieldError("login-password", "كلمة المرور مطلوبة");
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(name, email, password, confirmPassword, acceptTerms) {
        this.clearFormErrors();

        let isValid = true;

        if (!name) {
            this.showFieldError("register-name", "الاسم الكامل مطلوب");
            isValid = false;
        } else if (name.length < 2) {
            this.showFieldError("register-name", "الاسم يجب أن يكون على الأقل حرفين");
            isValid = false;
        }

        if (!email) {
            this.showFieldError("register-email", "البريد الإلكتروني مطلوب");
            isValid = false;
        } else if (!validateEmail(email)) {
            this.showFieldError("register-email", "البريد الإلكتروني غير صحيح");
            isValid = false;
        }

        if (!password) {
            this.showFieldError("register-password", "كلمة المرور مطلوبة");
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError("register-password", "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل");
            isValid = false;
        }

        if (!confirmPassword) {
            this.showFieldError(
                "register-confirm-password",
                "تأكيد كلمة المرور مطلوب"
            );
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showFieldError(
                "register-confirm-password",
                "كلمات المرور غير متطابقة"
            );
            isValid = false;
        }

        if (!acceptTerms) {
            this.showFieldError("accept-terms", "يجب الموافقة على الشروط والأحكام");
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest(".form-group");

        formGroup.classList.add("error");

        const existingError = formGroup.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }

        const errorElement = document.createElement("span");
        errorElement.className = "error-message";
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }

    clearFormErrors() {
        document.querySelectorAll(".form-group").forEach((group) => {
            group.classList.remove("error", "success");
            const errorMessage = group.querySelector(".error-message");
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }

    setupPasswordToggles() {
        document.querySelectorAll(".password-toggle").forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const targetId = toggle.dataset.target;
                const passwordField = document.getElementById(targetId);
                const icon = toggle.querySelector("i");

                if (passwordField.type === "password") {
                    passwordField.type = "text";
                    icon.className = "fa-solid fa-eye-slash";
                } else {
                    passwordField.type = "password";
                    icon.className = "fa-solid fa-eye";
                }
            });
        });
    }

    setupPasswordStrength() {
        const passwordField = document.getElementById("register-password");
        if (!passwordField) return;

        const debouncedUpdate = debounce((password) => {
            this.updatePasswordStrength(password);
        }, 300);

        passwordField.addEventListener("input", (e) => {
            debouncedUpdate(e.target.value);
        });
    }

    updatePasswordStrength(password) {
        const strengthFill = document.querySelector(".strength-fill");
        const strengthText = document.querySelector(".strength-text");

        if (!strengthFill || !strengthText) return;

        let strength = 0;
        let text = "قوة كلمة المرور";
        let className = "";

        if (password.length >= 6) strength += 1;
        if (/[A-Za-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        switch (strength) {
            case 0:
                className = "";
                text = "قوة كلمة المرور";
                break;
            case 1:
                className = "weak";
                text = "ضعيفة";
                break;
            case 2:
                className = "medium";
                text = "متوسطة";
                break;
            case 3:
            case 4:
                className = "strong";
                text = "قوية";
                break;
        }

        strengthFill.className = `strength-fill ${className}`;
        strengthText.textContent = text;
    }

    setupGoogleAuth() {
        // يمكن إضافة Google Authentication لاحقاً
        document.getElementById("google-login-btn").style.display = "none";
        document.getElementById("google-register-btn").style.display = "none";
    }

    setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.classList.add("btn-loading");
            const icon = button.querySelector("i");
            if (icon) icon.style.opacity = "0";
        } else {
            button.disabled = false;
            button.classList.remove("btn-loading");
            const icon = button.querySelector("i");
            if (icon) icon.style.opacity = "1";
        }
    }

    checkAuthState() {
        if (auth.currentUser) {
            showNotification("أنت مسجل الدخول بالفعل!", false);
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 2000);
        }

        const rememberMe = localStorage.getItem("rememberMe");
        if (rememberMe === "true") {
            document.getElementById("remember-me").checked = true;
        }
    }

    setupAnimations() {
        document.querySelectorAll(".form-group input").forEach((input) => {
            input.addEventListener("focus", function () {
                this.parentElement.classList.add("focused");
            });

            input.addEventListener("blur", function () {
                this.parentElement.classList.remove("focused");
            });
        });
    }
}

// تهيئة صفحة المصادقة عند التحميل
document.addEventListener("DOMContentLoaded", () => {
    new AuthPage();
});

window.AuthPage = AuthPage;