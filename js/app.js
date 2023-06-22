(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    new Swiper(".slider-one", {
        navigation: {
            nextEl: ".arrow-next",
            prevEl: ".arrow-prev"
        },
        slidesPerView: 2.5,
        speed: 800,
        breakpoints: {
            320: {
                slidesPerView: 1,
                loop: true
            },
            769: {
                slidesPerView: 1.2,
                loop: true
            },
            1e3: {
                slidesPerView: 1.5,
                loop: true
            },
            1200: {
                slidesPerView: 2.1
            },
            1400: {
                slidesPerView: 2.5
            },
            1650: {
                slidesPerView: 3.1
            },
            2e3: {
                slidesPerView: 3.5
            }
        }
    });
    new Swiper(".slider-one2", {
        navigation: {
            nextEl: ".arrow-next2"
        },
        slidesPerView: 2.5,
        speed: 800,
        breakpoints: {
            769.98: {
                slidesPerView: 1.5,
                loop: true
            },
            960: {
                slidesPerView: 1.8,
                loop: true
            },
            1e3: {
                slidesPerView: 2.3
            },
            1400: {
                slidesPerView: 2.8
            },
            1650: {
                slidesPerView: 2.8
            },
            1700: {
                slidesPerView: 3.3
            },
            2e3: {
                slidesPerView: 3.5
            }
        }
    });
    new Swiper(".slider-tree", {
        slidesPerView: 3.5,
        speed: 800,
        breakpoints: {
            769.98: {
                slidesPerView: 1.5
            },
            960: {
                slidesPerView: 1.6
            },
            1e3: {
                slidesPerView: 2.4
            },
            1200: {
                slidesPerView: 2.5
            },
            1400: {
                slidesPerView: 3.3
            },
            1650: {
                slidesPerView: 3.5
            },
            2e3: {
                slidesPerView: 3.5
            }
        },
        spaceBetween: 43
    });
    const buttons = document.querySelectorAll(".arrow-prev, .arrow-next");
    let prevButton = null;
    buttons.forEach((button => {
        button.addEventListener("click", (function() {
            if (prevButton !== null && prevButton !== this) prevButton.classList.remove("clicked");
            this.classList.add("clicked");
            prevButton = this;
        }));
    }));
    const buttons2 = document.querySelectorAll(".arrow-next2");
    let prevButton2 = null;
    buttons2.forEach((buttons2 => {
        buttons2.addEventListener("click", (function() {
            if (prevButton2 !== null && prevButton2 !== this) prevButton2.classList.remove("clicked");
            this.classList.add("clicked");
            prevButton2 = this;
        }));
    }));
    var totalTime = 15504;
    var hourssElement = document.getElementById("hours1");
    var minutessElement = document.getElementById("minutes1");
    var secondssElement = document.getElementById("seconds1");
    function updateTimer1() {
        var hourss = Math.floor(totalTime / 3600);
        var minutess = Math.floor(totalTime % 3600 / 60);
        var secondss = totalTime % 60;
        hourss = hourss.toString().padStart(2, "0");
        minutess = minutess.toString().padStart(2, "0");
        secondss = secondss.toString().padStart(2, "0");
        hourssElement.textContent = hourss;
        minutessElement.textContent = minutess;
        secondssElement.textContent = secondss;
        totalTime--;
        if (totalTime < 0) clearInterval(timerInterval);
    }
    var timerInterval = setInterval(updateTimer1, 1e3);
    var hoursElement = document.getElementById("hours_02");
    var minutesElement = document.getElementById("minutes_02");
    var secondsElement = document.getElementById("seconds_02");
    function updateTimer2() {
        var hours = Math.floor(totalTime / 3600);
        var minutes = Math.floor(totalTime % 3600 / 60);
        var seconds = totalTime % 60;
        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");
        seconds = seconds.toString().padStart(2, "0");
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;
        totalTime--;
        if (totalTime < 0) clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer2, 1e3);
    var hours3Element = document.getElementById("hours_03");
    var minutes3Element = document.getElementById("minutes_03");
    var seconds3Element = document.getElementById("seconds_03");
    function updateTimer3() {
        var hours3 = Math.floor(totalTime / 3600);
        var minutes3 = Math.floor(totalTime % 3600 / 60);
        var seconds3 = totalTime % 60;
        hours3 = hours3.toString().padStart(2, "0");
        minutes3 = minutes3.toString().padStart(2, "0");
        seconds3 = seconds3.toString().padStart(2, "0");
        hours3Element.textContent = hours3;
        minutes3Element.textContent = minutes3;
        seconds3Element.textContent = seconds3;
        totalTime--;
        if (totalTime < 0) clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer3, 1e3);
    document.getElementById("hours4");
    document.getElementById("minutes4");
    document.getElementById("seconds4");
    timerInterval = setInterval(updateTimer1m, 1e3);
    totalTime = 15504;
    var hourssmElement = document.getElementById("hours1m");
    var minutessmElement = document.getElementById("minutes1m");
    var secondssmElement = document.getElementById("seconds1m");
    function updateTimer1m() {
        var hourssm = Math.floor(totalTime / 3600);
        var minutessm = Math.floor(totalTime % 3600 / 60);
        var secondssm = totalTime % 60;
        hourssm = hourssm.toString().padStart(2, "0");
        minutessm = minutessm.toString().padStart(2, "0");
        secondssm = secondssm.toString().padStart(2, "0");
        hourssmElement.textContent = hourssm;
        minutessmElement.textContent = minutessm;
        secondssmElement.textContent = secondssm;
        totalTime--;
        if (totalTime < 0) clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer1m, 1e3);
    timerInterval = setInterval(updateTimer2m, 1e3);
    totalTime = 15504;
    var hourssm2Element = document.getElementById("hours_02m");
    var minutessm2Element = document.getElementById("minutes_02m");
    var secondssm2Element = document.getElementById("seconds_02m");
    function updateTimer2m() {
        var hourssm2 = Math.floor(totalTime / 3600);
        var minutessm2 = Math.floor(totalTime % 3600 / 60);
        var secondssm2 = totalTime % 60;
        hourssm2 = hourssm2.toString().padStart(2, "0");
        minutessm2 = minutessm2.toString().padStart(2, "0");
        secondssm2 = secondssm2.toString().padStart(2, "0");
        hourssm2Element.textContent = hourssm2;
        minutessm2Element.textContent = minutessm2;
        secondssm2Element.textContent = secondssm2;
        totalTime--;
        if (totalTime < 0) clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer2m, 1e3);
    timerInterval = setInterval(updateTimer3m, 1e3);
    totalTime = 15504;
    var hourssm3Element = document.getElementById("hours_03m");
    var minutessm3Element = document.getElementById("minutes_03m");
    var secondssm3Element = document.getElementById("seconds_03m");
    function updateTimer3m() {
        var hourssm3 = Math.floor(totalTime / 3600);
        var minutessm3 = Math.floor(totalTime % 3600 / 60);
        var secondssm3 = totalTime % 60;
        hourssm3 = hourssm3.toString().padStart(2, "0");
        minutessm3 = minutessm3.toString().padStart(2, "0");
        secondssm3 = secondssm3.toString().padStart(2, "0");
        hourssm3Element.textContent = hourssm3;
        minutessm3Element.textContent = minutessm3;
        secondssm3Element.textContent = secondssm3;
        totalTime--;
        if (totalTime < 0) clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer3m, 1e3);
    var heartButton = document.getElementById("heartButton");
    var countElement = document.getElementById("count");
    var count = 93;
    var isActive2 = false;
    heartButton.addEventListener("click", (function() {
        if (!isActive2) {
            count++;
            countElement.textContent = count;
            heartButton.classList.add("active");
            isActive2 = true;
        } else {
            count--;
            countElement.textContent = count;
            heartButton.classList.remove("active");
            isActive2 = false;
        }
    }));
    var hearttButton = document.getElementById("heartButton-02");
    var counttElement = document.getElementById("count-02");
    var countt = 94;
    var isActive3 = false;
    hearttButton.addEventListener("click", (function() {
        if (!isActive3) {
            countt++;
            counttElement.textContent = countt;
            hearttButton.classList.add("active");
            isActive3 = true;
        } else {
            countt--;
            counttElement.textContent = countt;
            hearttButton.classList.remove("active");
            isActive3 = false;
        }
    }));
    var heart3Button = document.getElementById("heartButton-03");
    var count3Element = document.getElementById("count-03");
    var count3 = 95;
    var isActive4 = false;
    heart3Button.addEventListener("click", (function() {
        if (!isActive4) {
            count3++;
            count3Element.textContent = count3;
            heart3Button.classList.add("active");
            isActive4 = true;
        } else {
            count3--;
            count3Element.textContent = count3;
            heart3Button.classList.remove("active");
            isActive4 = false;
        }
    }));
    var heart5Button = document.getElementById("heartButton-04");
    var count5Element = document.getElementById("count-04");
    var count5 = 999;
    var isActive5 = false;
    heart5Button.addEventListener("click", (function() {
        if (!isActive5) {
            count5++;
            count5Element.textContent = count5;
            heart5Button.classList.add("active");
            isActive5 = true;
        } else {
            count5--;
            count5Element.textContent = count5;
            heart5Button.classList.remove("active");
            isActive5 = false;
        }
    }));
    var heart6Button = document.getElementById("heartButton-m");
    var count6Element = document.getElementById("count-m");
    var count6 = 93;
    var isActive6 = false;
    heart6Button.addEventListener("click", (function() {
        if (!isActive6) {
            count6++;
            count6Element.textContent = count6;
            heart6Button.classList.add("active");
            isActive6 = true;
        } else {
            count6--;
            count6Element.textContent = count6;
            heart6Button.classList.remove("active");
            isActive6 = false;
        }
    }));
    var heart7Button = document.getElementById("heartButton-m2");
    var count7Element = document.getElementById("count-m2");
    var count7 = 94;
    var isActive7 = false;
    heart7Button.addEventListener("click", (function() {
        if (!isActive7) {
            count7++;
            count7Element.textContent = count7;
            heart7Button.classList.add("active");
            isActive7 = true;
        } else {
            count7--;
            count7Element.textContent = count7;
            heart7Button.classList.remove("active");
            isActive7 = false;
        }
    }));
    var heart8Button = document.getElementById("heartButton-03m");
    var count8Element = document.getElementById("count-03m");
    var count8 = 95;
    var isActive8 = false;
    heart8Button.addEventListener("click", (function() {
        if (!isActive8) {
            count8++;
            count8Element.textContent = count8;
            heart8Button.classList.add("active");
            isActive8 = true;
        } else {
            count8--;
            count8Element.textContent = count8;
            heart8Button.classList.remove("active");
            isActive8 = false;
        }
    }));
    var heartttButtonn = document.getElementById("heartttButtonn");
    var checkElement = document.getElementById("check");
    var check = 92;
    var isActive = false;
    heartttButtonn.addEventListener("click", (function() {
        if (!isActive) {
            check++;
            checkElement.textContent = check;
            heartttButtonn.classList.add("active");
            isActive = true;
        } else {
            check--;
            checkElement.textContent = check;
            heartttButtonn.classList.remove("active");
            isActive = false;
        }
    }));
    var heartttButtonn2 = document.getElementById("heartttButtonn2");
    var check2Element = document.getElementById("check2");
    var check2 = 90;
    var isActive20 = false;
    heartttButtonn2.addEventListener("click", (function() {
        if (!isActive20) {
            check2++;
            check2Element.textContent = check2;
            heartttButtonn2.classList.add("active");
            isActive20 = true;
        } else {
            check2--;
            check2Element.textContent = check2;
            heartttButtonn2.classList.remove("active");
            isActive20 = false;
        }
    }));
    var heartttButtonn3 = document.getElementById("heartttButtonn3");
    var check3Element = document.getElementById("check3");
    var check3 = 88;
    var isActive21 = false;
    heartttButtonn3.addEventListener("click", (function() {
        if (!isActive21) {
            check3++;
            check3Element.textContent = check3;
            heartttButtonn3.classList.add("active");
            isActive21 = true;
        } else {
            check3--;
            check3Element.textContent = check3;
            heartttButtonn3.classList.remove("active");
            isActive21 = false;
        }
    }));
    var heartttButtonn4 = document.getElementById("heartttButtonn4");
    var check4Element = document.getElementById("check4");
    var check4 = 100;
    var isActive22 = false;
    heartttButtonn4.addEventListener("click", (function() {
        if (!isActive22) {
            check4++;
            check4Element.textContent = check4;
            heartttButtonn4.classList.add("active");
            isActive22 = true;
        } else {
            check4--;
            check4Element.textContent = check4;
            heartttButtonn4.classList.remove("active");
            isActive22 = false;
        }
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const form = document.getElementById("form");
        form.addEventListener("submit", formSend);
        async function formSend(e) {
            e.preventDefault();
            let error = formValidate(form);
            let formData = new FormData(form);
            if (error === 0) {
                form.classList.add("_sending");
                let response = await fetch("sendmail.php", {
                    method: "POST",
                    body: formData
                });
                if (response.ok) {
                    let result = await response.json();
                    alert(result.message);
                    formPreview.innerHTML = "";
                    form.reset();
                    form.classList.remove("_sending");
                } else {
                    alert("Error");
                    form.classList.remove("_sending");
                }
            } else alert("Fill in the required field");
        }
        function formValidate(form) {
            let error = 0;
            let formReq = document.querySelectorAll("._req");
            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                formRemoveError(input);
                if (input.classList.contains("_email")) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                    formAddError(input);
                    error++;
                } else if (input.value === "") {
                    formAddError(input);
                    error++;
                }
            }
            return error;
        }
        function formAddError(input) {
            input.parentElement.classList.add("_error");
            input.classList.add("_error");
        }
        function formRemoveError(input) {
            input.parentElement.classList.remove("_error");
            input.classList.remove("_error");
        }
        function emailTest(input) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
        }
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
})();