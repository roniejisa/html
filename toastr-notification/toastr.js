"use strict";
var Toastr = (function () {
    const buttonToastr = document.querySelectorAll("[toastr-type]");
    let _timeShow = 1500;
    let _timeCountdown = 2000;
    let _timeHide = 1000;
    let _timeDuplicate = 800;
    let _timeRemoveDuplicate = 1000;
    let _autoHide = true;
    let _checkDuplicate = true;

    function config(options = {}) {
        _timeShow = timeShow in options ? options.timeShow : _timeShow;
        _timeCountdown = timeCountDown in options ? options.timeCountDown : _timeCountdown;
        _timeHide = timeHide in options ? options.checkDuplicate : _timeHide;
        _checkDuplicate = checkDuplicate in options ? options.checkDuplicate : _checkDuplicate;
        _autoHide = checkDuplicate in options ? options.checkDuplicate : false;
    }

    buttonToastr.forEach((button) => {
        button.onclick = () => {
            const message = button.getAttribute("toastr-message");
            const type = button.getAttribute("toastr-type");
            showToastr(type, message);
        };
    });

    async function showToastr(type, message) {
        const toastr = createToastr(type, message);
        await pushToastr(toastr);
        await removeToastr();
    }

    function createToastr(type, message) {
        const toastr = document.createElement("div");
        toastr.className = `toastr__item ${type}`;
        switch (type) {
            case "success":
                toastr.innerHTML = `<div class="content">
                <i class="fa-solid fa-circle-check"></i>
                    <span class="messsage">${message}</span>
                </div>`;
                break;
            case "warning":
                toastr.innerHTML = `<div class="content">
                <i class="fa-solid fa-circle-check"></i>
                    <span class="messsage">${message}</span>
                </div>`;
                break;
            case "error":
                toastr.innerHTML = `<div class="content">
                <i class="fa-solid fa-circle-check"></i>
                    <span class="messsage">${message}</span>
                </div>`;
                break;
        }
        if (_autoHide) {
            toastr.insertAdjacentHTML("beforeend", `<div class="line"></div>`);
            toastr.querySelector(".line").style.animation = `countdown ${_timeShow}ms ${_timeCountdown}ms ease-in-out forwards`;
        }
        toastr.style.animation = `showToastr ${_timeShow}ms forwards`;
        return toastr;
    }

    function pushToastr(child) {
        var toastr = document.querySelector(".toastr");
        if (!toastr) {
            toastr = document.createElement("div");
            toastr.className = "toastr";
            document.body.append(toastr);
        }
        if (_checkDuplicate) {
            var toastrItemOld = toastr.querySelectorAll(".toastr__item");
            toastrItemOld.forEach((toastrItemOld) => {
                toastrItemOld.style.animation = `hideToastr ${_timeDuplicate}ms forwards`;
                setTimeout(() => {
                    toastrItemOld.remove();
                }, _timeRemoveDuplicate);
            });
        }
        toastr.appendChild(child);
        if (_autoHide) {
            setTimeout(() => {
                child.style.animation = `hideToastr ${_timeHide}ms forwards`;
                setTimeout(() => {
                    child.remove();
                }, _timeHide);
            }, _timeShow + _timeCountdown);
        }
    }

    function removeToastr() {
        const toastrs = document.querySelectorAll(".toastr__item");
        toastrs.forEach((toastr) => {
            toastr.onclick = () => {
                toastr.style.animation = `hideToastr ${_timeHide}ms forwards`;
                setTimeout(() => {
                    toastr.remove();
                }, _timeRemove + _timeHide);
            };
        });
    }

    return {
        success: function (message) {
            showToastr("success", message);
        },
        error: function (message) {
            showToastr("error", message);
        },
        warning: function (message) {
            showToastr("warning", message);
        },
        init: function (options) {
            config(options);
        },
    };
})();
