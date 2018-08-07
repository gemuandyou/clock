(function () {

    var clock = {
        settings: {
            lineWidth: 10, // 时钟圆的线条粗度
            lineColor: 'black', // 时钟圆的线条颜色
            type: 1, // 时钟指针类型
            showDigital: true // 是否显示数字时间
        },

        draw: (element, options) => {
            var settings = clock.settings;

            for (var prop in options) {
                if (settings.hasOwnProperty(prop)) {
                    settings[prop] = options[prop];
                }
            }

            if (element && element instanceof HTMLCanvasElement) {
            } else {
                console.error('对不起啊，这个需要指定Canvas DOM元素的')
                return;
            }

            var clockEle = element;
            var ctx = clockEle.getContext('2d');

            var width = clockEle.getAttribute('width');
            var height = clockEle.getAttribute('height');
            var circleSize = width > height ? height / 2 : width / 2;

            function timeRollOn() {
                ctx.clearRect(0, 0, width, height);

                drawCircle();
                drawScale();

                var now = new Date();
                hour = now.getHours();
                minute = now.getMinutes();
                second = now.getSeconds();
                millSecond = now.getMilliseconds();

                switch (settings.type) {
                    case 1:
                        getHands1(ctx, hour, minute, second, millSecond);
                        break;
                    case 2:
                        getHands2(ctx, hour, minute, second, millSecond);
                        break;
                    default:
                        getHands1(ctx, hour, minute, second, millSecond);
                        break;
                }

                // 显示数字时间
                if (settings.showDigital) {
                    ctx.save();
                    ctx.translate(circleSize, circleSize);
                    ctx.beginPath();
                    ctx.font = fontSize + 'px Microsoft Yahei';
                    ctx.strokeStyle = '#090';
                    ctx.strokeText((hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + 
                                   (second < 10 ? '0' + second : second), -fontSize * 2, -circleSize * 0.5);
                    ctx.closePath();
                    ctx.restore();
                }
            }

            /**
             * 画圆
             */
            function drawCircle() {
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = settings.lineWidth;
                ctx.strokeStyle = settings.lineColor;
                ctx.arc(circleSize, circleSize, circleSize - settings.lineWidth, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }

            /**
             * 画刻度
             */
            function drawScale() {
                for (var i = 0; i < 60; i++) {
                    ctx.save();
                    ctx.translate(circleSize, circleSize); // 重置画布上的坐标原点为圆的中心
                    ctx.beginPath();
                    ctx.rotate(i * 6 * Math.PI / 180); // 旋转 i*6 个弧度，公式为：degrees*Math.PI/180

                    if (i % 5 === 0) {
                        ctx.fillStyle = 'red';
                        ctx.arc(0, -1 * (circleSize - 3 / 2 * settings.lineWidth - circleSize / 35 * 2), circleSize / 35, 0, 2 * Math.PI);
                        ctx.fill();
                    } else {
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = '#000';
                        ctx.moveTo(0, -1 * (circleSize - 3 / 2 * settings.lineWidth) + circleSize / 10);
                        ctx.lineTo(0, -1 * (circleSize - 3 / 2 * settings.lineWidth) + circleSize / 25);
                        ctx.stroke();
                    }

                    ctx.closePath();
                    ctx.restore();
                }

                // 画刻度数值
                for (var i = 1; i <= 12; i++) {
                    ctx.save();
                    ctx.translate(circleSize, circleSize + circleSize / 50); // 重置画布上的坐标原点为圆的中心
                    ctx.beginPath();

                    // 计算刻度相对于圆心所在坐标
                    var val = (circleSize - 3 / 2 * settings.lineWidth - circleSize / 35 * 5) / Math.sin(Math.PI / 2);
                    var x = val * Math.sin(i * 30 * Math.PI / 180);
                    var y = val * Math.sin((90 - i * 30) * Math.PI / 180);

                    var fontSize = circleSize / 12.5 > 10 ? circleSize / 12.5 : 11;
                    var gradient = ctx.createRadialGradient(0, 0 - circleSize / 50, val - fontSize, 0, 0 - circleSize / 50, val);
                    gradient.addColorStop('0', 'magenta');
                    gradient.addColorStop('0.5', 'blue');
                    gradient.addColorStop('1.0', 'darkviolet');
                    // 设置文字渐变
                    ctx.fillStyle = gradient;
                    ctx.font = fontSize + 'px Georgia';

                    ctx.fillText(i, x - (i > 9 ? fontSize / 2 : fontSize / 4), -y);

                    ctx.closePath();
                    ctx.restore();
                }
            }

            /**
             * 画第一种类型的时钟指针
             * @param {CanvasRenderingContext2D} ctx 
             * @param {Number} hour 
             * @param {Number} minute 
             * @param {Number} second 
             * @param {Number} millSecond 
             */
            function getHands1(ctx, hour, minute, second, millSecond) {
                //时针
                ctx.save();
                ctx.translate(circleSize, circleSize);
                ctx.beginPath();
                var hourAngle = hour % 12 * 30 + minute / 60 * 30;
                ctx.rotate(hourAngle * Math.PI / 180);
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'darkviolet';
                ctx.globalAlpha = 1;
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -circleSize + 3 / 2 * settings.lineWidth + circleSize / 35 * 16);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                // 分针
                ctx.save();
                ctx.translate(circleSize, circleSize);
                ctx.beginPath();
                var minuteAngle = minute / 60 * 360;
                ctx.rotate(minuteAngle * Math.PI / 180);
                ctx.lineWidth = 8;
                ctx.strokeStyle = 'blue';
                ctx.globalAlpha = 0.35;
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -circleSize + 3 / 2 * settings.lineWidth + circleSize / 35 * 10);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                // 秒针
                ctx.save();
                ctx.translate(circleSize, circleSize);
                ctx.beginPath();
                var secondAngle = second / 60 * 360;
                ctx.rotate(secondAngle * Math.PI / 180);
                ctx.lineWidth = 4;
                ctx.strokeStyle = 'magenta';
                ctx.globalAlpha = 0.5;
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -circleSize + 3 / 2 * settings.lineWidth + circleSize / 35 * 4);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                // 圆心处画个小红点儿
                ctx.save();
                ctx.translate(circleSize, circleSize);
                ctx.beginPath();
                ctx.fillStyle = 'red';
                ctx.arc(0, 0, circleSize / 20, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }

            /**
             * 画第二种类型的时钟指针
             * @param {CanvasRenderingContext2D} ctx 
             * @param {Number} hour 
             * @param {Number} minute 
             * @param {Number} second 
             * @param {Number} millSecond 
             */
            function getHands2(ctx, hour, minute, second, millSecond) {
                // 秒针
                ctx.save();
                ctx.translate(circleSize, circleSize);
                ctx.beginPath();
                ctx.rotate(-Math.PI / 2);
                ctx.lineWidth = 8;
                ctx.strokeStyle = '#AAA';
                if (millSecond) {
                    var millSecondAngle = (second * 1000 + millSecond) / 60000 * 360;
                    ctx.arc(0, 0, circleSize - 76, (millSecondAngle - 6) / 180 * Math.PI, millSecondAngle / 180 * Math.PI);
                } else {
                    var secondAngle = second / 60 * 360;
                    ctx.arc(0, 0, circleSize - 76, (secondAngle - 6) / 180 * Math.PI < 0 ? 0 : (secondAngle - 6) / 180 * Math.PI, secondAngle / 180 * Math.PI);
                }
                ctx.stroke();
                ctx.closePath();
                ctx.restore();

                // 分针
                ctx.save();
                ctx.translate(circleSize, circleSize);
                ctx.beginPath();
                ctx.rotate(-Math.PI / 2);
                ctx.lineWidth = 8;
                ctx.strokeStyle = '#888';
                var minuteAngle = minute / 60 * 360 + second / 60 * 6;
                ctx.arc(0, 0, circleSize - 90, 0, minuteAngle / 180 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
                
                //时针
                ctx.save();
                ctx.translate(circleSize, circleSize);
                ctx.beginPath();
                ctx.rotate(-Math.PI / 2);
                ctx.moveTo(0, 0);
                var hourAngle = hour % 12 * 30 + minute / 60 * 30;
                ctx.arc(0, 0, circleSize - 100, 0, hourAngle / 180 * Math.PI);
                ctx.lineTo(0, 0);
                ctx.fillStyle = 'gray';
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }

            timeRollOn();
            setInterval(timeRollOn, 10);
        }
    }

    window.Clock = clock;

}());