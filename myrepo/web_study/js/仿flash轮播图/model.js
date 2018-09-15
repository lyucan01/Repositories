function getStyle(obj, name) {
    if(obj.currentStyle)
    {
        return obj.currentStyle[name];
    }
    else
    {
        return getComputedStyle(obj, null)[name];
    }
}

function startMove(obj, attr, iTarget) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var cur = 0;
        if (attr == 'opacity') {
            cur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
        }
        else {
            cur = parseInt(getStyle(obj, attr));
        }

        var speed = (iTarget - cur) / 6;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

        if (cur == iTarget) {
            clearInterval(obj.timer)
        }
        else {
            if (attr == 'opacity') {
                obj.style[attr] = (cur + speed) / 100;
            }
            else {
                obj.style[attr] = cur + speed + 'px';
            }

        }
    }, 30)
}

function getByClass(obj, name) {
    var aEle = obj.getElementsByTagName('*');
    var aResult = [];

    for (var i = 0; i < aEle.length, i++){
        if (aEle[i].className == name){
            aResult.push(aEle[i])
        }
        return  aResult;
    }
}
